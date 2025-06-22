require("dotenv").config();
const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");
const User = require("../models/userModels");

// @desc signUp Users
// @route POST /api/v1/auth/signup
// @access public
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});
// @desc login Users
// @route POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ApiError("Please provide email and password", 400));
  }

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ApiError("Invalid email or password", 401));
  }

  // Check if user account is active
  if (!user.active) {
    return next(
      new ApiError("Your account is deactivated. Please contact support.", 401)
    );
  }

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("You are not logged in, please login first", 401));
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await User.findById(decode.userId);
  if (!currentUser) {
    return next(new ApiError("User not found", 404));
  }
  if (!currentUser.active) {
    return next(new ApiError("please go active Account ,and try again"));
  }
  if (currentUser.passwordChangedAt) {
    const Timestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (Timestamp > decode.iat) {
      return next(
        new ApiError("User recently changed has password, please login again"),
        401
      );
    }
  }
  req.user = currentUser;
  next();
});

exports.allowTo = (...role) =>
  asyncHandler(async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new ApiError("your not allow acsess in this route", 403));
    }

    next();
  });
// @desc forgetpassword and resetCode
// @route POST /api/v1/auth/forgetpassword
// @access private(User)
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`not correct email${req.body.email}, please try again`, 401)
    );
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("Generated Reset Code:", resetCode);

  const hashResetCode = crypto
    .createHmac("sha256", process.env.RESET_CODE_SECRET)
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  const message = `Hi ${user.name},\n
We received a request to reset your password. Use the following code to complete your password reset:\n
${resetCode}\n\nImportant: This code will expire in 10 minutes.\n 
If you didn't request this password reset, please ignore this email or contact our support team if you have any concerns.
\nBest regards,
\nThe Sotohy-Amazon App Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 minutes)",
      message,
    });

    res
      .status(200)
      .json({ status: "success", message: "Reset code sent via email." });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(
      new ApiError("Failed to send reset code. Try again later.", 500)
    );
  }
});
// @desc verifyResetPassword
// @route POST /api/v1/auth/verifyResetPassword
// @access private(User)
exports.verifyResetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.resetCode) {
    return next(new ApiError("Reset code is required", 400));
  }
  const hashResetCode = crypto
    .createHmac("sha256", process.env.RESET_CODE_SECRET)
    .update(req.body.resetCode)
    .digest("hex");

  // Find user and explicitly select the passwordResetCode field
  const user = await User.findOne({ passwordResetCode: hashResetCode }).select(
    "+passwordResetCode"
  );
  if (!user) {
    return next(new ApiError("Reset code is invalid", 401));
  }

  if (user.passwordResetExpires < Date.now()) {
    return next(new ApiError("Reset code has expired", 401));
  }

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
    message: "Reset code verified successfully",
  });
});
// @desc change password
// @route POST /api/v1/auth/resetPassword
// @access private(User)
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`not correct email${req.body.email}, please try again`, 401)
    );
  }

  if (!user.passwordResetVerified) {
    return next(
      new ApiError(
        `Password reset not verified. Please verify your reset code first.`,
        400
      )
    );
  }

  // Hash the new password before saving
  user.password = await bcrypt.hash(req.body.newPassword, 12);
  user.passwordChangedAt = Date.now();

  // Clear reset-related fields
  user.passwordResetCode = undefined;
  user.passwordResetVerified = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = createToken(user._id);
  res.status(200).json({
    status: "Success",
    message: "Password reset successfully",
    token,
  });
});
