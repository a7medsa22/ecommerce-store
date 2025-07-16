const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Order = require("../models/OrderModels");
const Cart = require("../models/cartModels");
const User = require("../models/userModels");
const Product = require("../models/productModels");
const { filter } = require("compression");


exports.createOrderCash = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("addresses");
    if (!user) {
        return next(new ApiError('User not found', 404));
    }
    if (!user.addresses || user.addresses.length === 0) {
        return next(new ApiError('User has no addresses', 400));
    }

    const { cartId } = req.body;
    // Validate cartId exists in request body
    if (!req.body.cartId) {
        return next(new ApiError('Cart ID is required', 400));
    }

    const cart = await Cart.findOne({ _id: cartId, user: req.user._id });
    if (!cart) {
        return next(new ApiError(`There is no cart for this id: ${cartId} for this user`, 404));
    }
    let cartPrice = cart.totalCartPrice;
    if (cart.totalPriceAfterDiscount) {
        cartPrice = cart.totalPriceAfterDiscount;
    }

    const totalOrderPrice = cartPrice + (cart.taxPrice || 0) + (cart.shippingPrice || 0);
    const addresses = user.addresses[0];

    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalOrderPrice,
        paymentMethod: "cash",
        address: addresses.details,
        phone:addresses.phone,
    });
  if (!order) {
    return next (new ApiError('Error in creating order', 400));
  }
  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update:{$inc:{quantity:-item.quantity , sold : +item.quantity}},
       }
     }))

  await Product.bulkWrite(bulkOption, {});

    // Clear cart after creating order
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json({message: 'Order created successfully', data: order });
});
exports.updateIsDeliverOrder= asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError(`No order found with id: ${req.params.id}`, 404));
  }
  if (order.isDelivered) {
    return next(new ApiError('Order is already delivered', 400));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  
  res.status(200).json({ message: 'Order marked as delivered successfully', data: order });
});
exports.updateIsPaidOrder= asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError(`No order found with id: ${req.params.id}`, 404));
  }
  if (order.isPaid) {
    return next(new ApiError('Order is already paid', 400));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();
  
  res.status(200).json({ message: 'Order marked as paid successfully', data: order });
});