const express = require("express");

const { signup, login,forgetPassword } = require("../services/authService");
const {
  signUpValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.post("/signup", signUpValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgetpassword", forgetPassword);

module.exports = router;
