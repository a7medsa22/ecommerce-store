const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModels");
const Product = require("../models/productModels");
const ApiError = require("../utils/apiError");

const calcTotalCartPrice = (index) => {
  let totalPrice = 0;
  index.cartItems.forEach(
    (item) => (totalPrice += item.quantity * items.price)
  );
  index.totalCartPrice = totalPrice;
};
//@desc Add product in Cart
//@desc POST /api/v1/carts
//@desc private/user
exports.addProductToCart = asyncHandler(async (req, res) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  const cartuser = await Cart.findOne({ user: req.user._id });
  if (!cartuser) {
    Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    const productIndex = Cart.cartItems.findIndex(
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
  const cartUser = Cart.findOne({ user: req.user._id });
  if (cartUser) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  res
    .status(200)
    .json({ numResult: cartUser.cartItems.length, data: cartuser });
});
//@desc remove products from Cart
//@desc Delete OR PUT /api/v1/carts
//@desc private/user
exports.deleteLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cartUser = await Cart.findOneByIdAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  if (cartUser) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  calcTotalCartPrice(Cart);
  res
    .status(200)
    .json({ numResult: cartUser.cartItems.length, data: cartuser });
});
//@desc remove products from Cart
//@desc Delete OR PUT /api/v1/carts
//@desc private/user
exports.cleareCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(200).send();
});
