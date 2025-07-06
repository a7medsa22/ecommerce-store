const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const ApiError = require("../utils/apiError");

// @desc Add address to user
// @route POST /api/v1/users/addresses
// @access Private/protect(Just user)
exports.addAddress = asyncHandler(async (req, res, next) => {
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { addresses: req.body } },
    { new: true }
  );
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    addresses: user.addresses,
  });
});

// @desc Remove address from user
// @route DELETE /api/v1/users/addresses/:addressId
// @access Private/protect(Just user)
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
      { $pull: { addresses: { _id: req.params.addressId } } },
      { new: true }
  );
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Address removed successfully",
  });
});

// @desc Get all addresses for user
// @route GET /api/v1/users/addresses
// @access Private/protect(Just user)
exports.getAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({
    result: user.addresses.length,
    data: user.addresses,
  });
});
