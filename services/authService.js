const User = require("../models/userModels");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({ data: user, token });
});
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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
    return new ApiError("Invalid token", 401);
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decode.userId);
  if (!currentUser) {
    return next(new ApiError("User not found", 404));
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

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`not correct email${req.body.email}, please try again`, 401)
    );
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashResetCode = crypto
    .createHmac("sha256", process.env.RESET_CODE_SECRET)
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  const massage = `<h2> Hi ${user.name}</h2>,\n \nEnter this code to complete the reset.\n\n${resetCode}\n
  \nIf you didn't request this pin, we recommend you change your LinkedIn password.\n
  \nThanks for helping us keep your account secure.\n
  \nThe Sotohy-Amazon App Team\n`;

  sendEmail({
    email: user.email,
    subject: "your password reset code (valid for 10 min)",
    massage,
  });
  res.status(200).json({ status: "success", massage: "Reset code send Email" });
});
