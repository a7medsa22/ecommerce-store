const express = require("express");

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

router.post("/signup", signUpValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgetpassword", forgetPassword);
router.post("/verifyResetPassword", verifyResetPassword);
router.put("/resetPassword", resetPasswordValidator, resetPassword);

module.exports = router;
