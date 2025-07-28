const express = require("express");
const {rateLimit} = require('express-rate-limit')

const {
  signup,
  login,
  forgetPassword,
  verifyResetPassword,
  resetPassword,
} = require("../services/authService");
const {
  signUpValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");
const router = express.Router();

let authlimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 4,
  message: "Too many attempts, please try again later",
  standardHeaders: true,
  legacyHeaders:false,
});

router.post("/signup", authlimit, signUpValidator, signup);
router.post("/login", authlimit, loginValidator, login);
router.post("/forgetpassword", authlimit, forgetPassword);
router.post("/verifyResetPassword", authlimit, verifyResetPassword);
router.put("/resetPassword", authlimit, resetPasswordValidator, resetPassword);

module.exports = router;
