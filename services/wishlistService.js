const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const Product = require("../models/productModels");
const ApiError = require("../utils/apiError");

// @desc Add porduct to wishlist
// @route POST /api/v1/users/wishlist
// @access Private/protect(Just user)
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.body.product } },
    { new: true }
  ).populate("wishlist");
    res.status(200).json({
        status: "success",
      message: "product add success to your wishlist",

 })
});

// @desc Remove product from wishlist
// @route DELETE /api/v1/users/wishlist/:productId
// @access Private/protect(Just user)
exports.removeFromWishlist = asyncHandler(async (req,res,next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.productId } },
    { new: true }
  ).populate("wishlist");
  res.status(204).json({
        status: "success",
    message: "product delete from your wishlist",
 })
});

// @desc get All product from wishlist
// @route Get /api/v1/users/wishlist
// @access Private/protect(Just user)
exports.getWishlist = asyncHandler(async (req,res,next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  if (!user) {
    next(new ApiError("User not found", 404));
  }
  res.status(200).json({
    Result: user.wishlist.length
    ,data:user.wishlist})
});
