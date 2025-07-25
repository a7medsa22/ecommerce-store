const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatormiddleware");
const { default: slugify } = require("slugify");
const User = require("../../models/userModels");

exports.signUpValidator = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("V:)- It's Too Short")
    .isLength({ max: 30 })
    .withMessage("V:)- It's Too Long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("V:)- Required email")
    .isEmail()
    .withMessage("V:)- Ivalid email User")
    .custom((val) => {
      return User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject("V:)- E-mail already exist");
        }
      });
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("V:)- Required PasswordConfirm"),

  check("password")
    .notEmpty()
    .withMessage("V:)- Required Password")
    .isLength({ min: 6 })
    .withMessage("V:)- Too Short Password")
    .custom(async (password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password Confirmation Incorrect");
      }
    }),

  validatorMiddleware,
];
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("V:)- Required email")
    .isEmail()
    .withMessage("V:)- Ivalid email User"),
  check("password")
    .notEmpty()
    .withMessage("V:)- Required Password")
    .isLength({ min: 6 })
    .withMessage("V:)- Too Short Password")
    ,

  validatorMiddleware,
];

exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("V:)- Required email")
    .isEmail()
    .withMessage("V:)- Invalid email format"),
  check("newPassword")
    .notEmpty()
    .withMessage("V:)- Required new password")
    .isLength({ min: 6 })
    .withMessage("V:)- New password must be at least 6 characters long"),
  check("newPasswordConfirm")
    .notEmpty()
    .withMessage("V:)- Required password confirmation")
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),
  validatorMiddleware,
];

