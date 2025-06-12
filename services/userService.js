const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactors");
const UserModel = require("../models/userModels");
const ApiError = require("../utils/apiError");

// Upload single Image
exports.updateUserimage = uploadSingleImage("profileImage");

exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No file uploaded", 400));
  }
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImage = filename;
  }
  next();
});

//@desc Git list of users
//@desc GET /api/v1/users
//@desc private
exports.getUsers = getAll(UserModel, "user");

//@desc Git User
//@desc GET /api/v1/users/:id
//@desc private
exports.getUser = getOne(UserModel);

//@desc create User
//@desc POST /api/v1/users
//@desc private
exports.createUser = createOne(UserModel);

//@desc update User
//@desc PUT /api/v1/users
//@desc private
exports.updateUser = updateOne(UserModel);

//@desc Update User Password
//@desc PUT /api/v1/users/:id/password
//@desc private
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Find user by ID
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return next(new ApiError("No user found with that ID", 404));
  }

  const PasswordCorrect = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );
  if (!PasswordCorrect) {
    return next(new ApiError("Current password is incorrect", 401));
  }

  user.password = await bcrypt.hash(req.body.password, 12);
  user.passwordChangedAt = Date.now();

  await user.save();

  res.status(200).json({
    message: 'Password updated successfully',
    data: {
      _id: user._id,
      passwordChangedAt: user.passwordChangedAt
    }
  });
});

//@desc Delete User
//@desc DELETE /api/v1/users
//@desc private
exports.deleteUser = deleteOne(UserModel);

// @desc Deactivate User Account
// @route PUT /api/v1/users/:id/deactivate
// @access Private
exports.deactivateUser = asyncHandler(async (req, res, next) => {
  req.body = { active: false };
  return updateOne(UserModel)(req, res, next);
});

// @desc Activate User Account
// @route PUT /api/v1/users/:id/activate
// @access Private
exports.activateUser = asyncHandler(async (req, res, next) => {
  req.body = { active: true };
  return updateOne(UserModel)(req, res, next);
});
