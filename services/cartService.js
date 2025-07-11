const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModels");
const Product = require("../models/productModels");
const ApiError = require("../utils/apiError");
const couponModel = require("../models/couponModels");

const calcTotalCartPrice = (index) => {
  let totalPrice = 0;
  index.cartItems.forEach(
    (item) => (totalPrice += item.quantity * item.price)
  );
  index.totalCartPrice = totalPrice;
  index.totalPriceAfterDiscount = undefined;
};
//@desc Add product in Cart
//@desc POST /api/v1/carts
//@desc private/user
exports.addProductToCart = asyncHandler(async (req, res,next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(`No product found with id: ${productId}`, 404));
  }
  const cartuser = await Cart.findOne({ user: req.user._id });
  if (!cartuser) {
    Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          quantity: 1,
          price: product.price,
        },
      ],
    }).catch((error) => {
      res.status(500).json({ error: error.message });
    });
  } else {
    const productIndex = cartuser.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      // Product already exists in the cart, update quantity
      cartuser.cartItems[productIndex].quantity += 1;
    } else {
      // Product does not exist in the cart, add new item
      cartuser.cartItems.push({
        product: productId,
        color,
        quantity: 1,
        price: product.price,
      });
    }
  }
  calcTotalCartPrice(cartuser);
  await cartuser.save();

  res.status(200).json({
    status: "succes",
    message: "product add to cart successfully☺",
  });
});
//@desc get products from Cart
//@desc GET /api/v1/carts
//@desc private/user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cartUser = await Cart.findOne({ user: req.user._id });
  if (!cartUser) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  res
    .status(200)
    .json({ numResult: cartUser.cartItems.length, data: cartUser });
});
//@desc remove products from Cart
//@desc Delete OR PUT /api/v1/carts
//@desc private/user
exports.deleteLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cartUser = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  if (!cartUser) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  calcTotalCartPrice(cartUser);
  await cartUser.save();
  res
    .status(200)
    .json({ numResult: cartUser.cartItems.length, data: cartUser });
});
//@desc remove products from Cart
//@desc Delete OR PUT /api/v1/carts
//@desc private/user
exports.cleareCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(200).send();
});
//@desc update products from Cart
//@desc PUT /api/v1/carts
//@desc private/user
exports.updateLoggedUserCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const cartUser = await Cart.findOne({ user: req.user._id });
  if (!cartUser) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  const productIndex = cartUser.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );
  if (productIndex > -1) {
    // Product already exists in the cart, update quantity
    cartUser.cartItems[productIndex].quantity = quantity;
  } else {
    return next(new ApiError("Product not found in the cart", 404));
  }
  calcTotalCartPrice(cartUser);
  await cartUser.save();
  res.status(200).json({
    status: "success",
    message: "Cart updated successfully",
    data: cartUser,
  });
}
);
//@desc apply coupon on cart
//@desc PUT /api/v1/carts/applycoupon
//@desc private/user
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon is invalid or expired", 404));
  }
  const cartUser = await Cart.findOne({ user: req.user._id });
  if (!cartUser) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  const PriceBeforDis = cartUser.totalCartPrice;
  const totalPrice =  PriceBeforDis -(PriceBeforDis * coupon.discount) / 100;
  cartUser.totalPriceAfterDiscount = totalPrice;

  await cartUser.save();
  res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    data: cartUser,
  });
}
);
