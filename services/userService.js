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
const createToken = require("../utils/createToken");
const userModel = require("../models/userModels");

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

//@desc Get list of users
//@desc GET /api/v1/users
//@desc private(Admin)
exports.getUsers = getAll(UserModel, "user");

//@desc Get User
//@desc GET /api/v1/users/:id
//@desc private(Admin)
exports.getUser = getOne(UserModel);

//@desc create User
//@desc POST /api/v1/users
//@desc private(Admin)
exports.createUser = createOne(UserModel);

//@desc update User
//@desc PUT /api/v1/users
//@desc private(Admin)
exports.updateUser =  asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(req.params.id,
    {
    name: req.body.name,
      phone: req.body.phone,
      role: req.body.role,
    active:req.body.active
    
    }, {
      new: true,
    });
    if (!document) {
      return next(new ApiError(`No document found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
  });

//@desc Update User Password
//@desc PUT /api/v1/users/:id/password
//@desc private(Admin)
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Find user by ID
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return next(new ApiError("No user found with that ID", 404));
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
//@desc private(Admin)
exports.deleteUser = deleteOne(UserModel);

// @desc Deactivate User Account
// @route PUT /api/v1/users/:id/deactivate
// @access Private(Admin)
exports.deactivateUser = asyncHandler(async (req, res, next) => {
  req.body = { active: false };
  return updateOne(UserModel)(req, res, next);
});

// @desc Activate User Account
// @route PUT /api/v1/users/:id/activate
// @access Private(Admin)
exports.activateUser = asyncHandler(async (req, res, next) => {
  req.body = { active: true };
  return updateOne(UserModel)(req, res, next);
});
// @desc  Get getinfo user 
// @route GET /api/v1/users/getMe
// @access Private/protect(Just user)
exports.getloggeduser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();

});
// @desc Update logged user password
// @route PUT /api/v1/users/updateMyPassword
// @access Private/protect(Just user)
exports.updateLoggedPassword = asyncHandler(async (req, res, next) => {
  // Find user and explicitly select password field
  const user = await UserModel.findById(req.user._id).select('+password');
  if (!user) {
    return next(new ApiError("No user found with that ID", 404));
  }

  // Check if current password is correct
  const isPasswordCorrect = await bcrypt.compare(req.body.currentPassword, user.password);
  if (!isPasswordCorrect) {
    return next(new ApiError("Current password is incorrect", 401));
  }
  

  // Hash the new password
  user.password = req.body.password
  user.passwordChangedAt = Date.now();

  await user.save();

  // Create new token
  const token = createToken(user._id);

  res.status(200).json({ 
    status: "Success",
    message: "Password updated successfully",
    token 
  });
});
// @desc Update logged user info
// @route PUT /api/v1/users/updateMe
// @access Private/protect(Just user)
exports.updateLoggedInfo = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id, // Use logged user's ID, not params
    {
      name: req.body.name,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  
  if (!user) {
    return next(new ApiError("No user found", 404));
  }
  
  res.status(200).json({ 
    status: "Success",
    data: user 
  });
});


