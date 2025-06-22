const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatormiddleware");
const { default: slugify } = require("slugify");
const User = require("../../models/userModels");
const bcrypt = require("bcryptjs");

exports.createUserValidator = [
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

  check("phone")
    .optional()
    .notEmpty()
    .withMessage("V:)- Required Phone")
    .isMobilePhone(["ar-EG", "ar-IQ", "ar-AE"])
    .withMessage("V:)- Invalid Phone"),

  check("password")
    .notEmpty()
    .withMessage("V:)- Required Password")
    .isLength({ min: 6 })
    .withMessage("V:)- Too Short Password") .custom(async(password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password Confirmation Incorrect")
      }
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("V:)- Required PasswordConfirm"),
   

  check("role").optional(),

  check("profileImage").optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("V:)- Idvalid User Id Format"),
  validatorMiddleware,
];
exports.updateUserValidtor = [
  check("id").isMongoId().withMessage("V:)- Idvalid User Id Format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.updatePasswordUserValidtor = [
  check("id").isMongoId().withMessage("V:)- Idvalid User Id Format"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("V:)- Required PasswordConfirm"),

  check("currentPassword")
    .notEmpty()
    .withMessage("V:)- Required Current Password"),

  body("password")
    .notEmpty()
    .withMessage("V:)- Required Password")
    .isLength({ min: 6 })
    .withMessage("V:)- Too Short Password")
    .custom(async (val, { req }) => {

      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("No user found for this ID");
      }

      const CurrentPasswordCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!CurrentPasswordCorrect) {
        throw new Error("Current password is incorrect");
      }

      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirmation does not match new password");
      }

      return true;
    }),

  validatorMiddleware,
];
exports.deleteUservalidator = [
  check("id").isMongoId().withMessage("V:)- Idvalid User Id Format"),
  validatorMiddleware,
];

exports.updateLoggedPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("V:)- Current password is required"),
  check("password")
    .notEmpty()
    .withMessage("V:)- New password is required")
    .isLength({ min: 6 })
    .withMessage("V:)- New password must be at least 6 characters long"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("V:)- Password confirmation is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateLoggedInfoValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("V:)- Name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("V:)- Name must be less than 30 characters long"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-IQ", "ar-AE"])
    .withMessage("V:)- Invalid phone number format"),
  validatorMiddleware,
];
