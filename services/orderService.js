const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Order = require('../models/orderModels');
const Cart = require("../models/cartModels");
const User = require("../models/userModels");
const Product = require("../models/productModels");
const { getAll, getOne } = require("./handlerFactors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//filter function to create filter object for orders
exports.createfilewObject = (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
};

//@desc Create order with cash on delivery
//@desc POST /api/v1/orders/cash
//@desc private/User
exports.createOrderCash = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("addresses");
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  if (!user.addresses || user.addresses.length === 0) {
    return next(new ApiError("User has no addresses", 400));
  }

  const { cartId } = req.body;
  // Validate cartId exists in request body
  if (!req.body.cartId) {
    return next(new ApiError("Cart ID is required", 400));
  }

  const cart = await Cart.findOne({ _id: cartId, user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this id: ${cartId} for this user`, 404)
    );
  }
  let cartPrice = cart.totalCartPrice;
  if (cart.totalPriceAfterDiscount) {
    cartPrice = cart.totalPriceAfterDiscount;
  }

  const totalOrderPrice =
    cartPrice + (cart.taxPrice || 0) + (cart.shippingPrice || 0);
  const addresses = user.addresses[0];

  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    taxPrice: cart.taxPrice,
    shippingPrice: cart.shippingPrice,
    totalOrderPrice,
    paymentMethod: "cash",
    address: addresses.details,
    phone: addresses.phone,
  });
  if (!order) {
    return next(new ApiError("Error in creating order", 400));
  }
  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkOption, {});

  // Clear cart after creating order
  await Cart.findByIdAndDelete(cartId);

  res.status(201).json({ message: "Order created successfully", data: order });
});
//@desc Get all orders
//@desc GET /api/v1/orders
//@desc private/Admin-Manager-User
exports.getAllOrder = getAll(Order);

//@desc Get one order
//@desc GET /api/v1/orders/:id
//@desc private/Admin-Manager-User
exports.getOneOrder = getOne(Order);

//@desc Get all orders
//@desc GET /api/v1/orders
//@desc private/Admin-Manager
exports.updateIsDeliverOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError(`No order found with id: ${req.params.id}`, 404));
  }
  if (order.isDelivered) {
    return next(new ApiError("Order is already delivered", 400));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();

  res
    .status(200)
    .json({ message: "Order marked as delivered successfully", data: order });
});

//@desc Update order to paid
//@desc PUT /api/v1/orders/:id/pay
//@desc private/Admin-Manager
exports.updateIsPaidOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError(`No order found with id: ${req.params.id}`, 404));
  }
  if (order.isPaid) {
    return next(new ApiError("Order is already paid", 400));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();

  res
    .status(200)
    .json({ message: "Order marked as paid successfully", data: order });
});

//@des checkout session from stripe and send it as response
//@desc GET /api/v1/orders/checkout-session/cartId
//@desc private/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`No cart found with id: ${req.params.cartId}`, 404)
    );
  }
  let cartPrice = cart.totalCartPrice;
  if (cart.totalPriceAfterDiscount) {
    cartPrice = cart.totalPriceAfterDiscount;
  }
  const totalOrderPrice =
    cartPrice + (cart.taxPrice || 0) + (cart.shippingPrice || 0);
  // create a checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },  
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/carts`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event ;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
  console.log('created order here.....');
  }
});

