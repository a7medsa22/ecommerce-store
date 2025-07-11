const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatormiddleware");
const Coupon = require("../../models/couponModels");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("Coupon name is too short")
    .isLength({ max: 30 })
    .withMessage("Coupon name is too long").trim().toUpperCase().custom(async (value) => {
      const coupon = await Coupon.findOne({ name: value });
      if (coupon) {
        return Promise.reject(new Error("Coupon name must be unique"));
      }
      return Promise.resolve();
    }),
  check("discount")
    .isFloat({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),
  check("expire")
    .notEmpty()
    .withMessage("Expiration date is required")
    .isISO8601().custom((value) => {
      const expireDate = new Date(value);
      const today = new Date();
      if (expireDate < today) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    })
    .withMessage("Expiration date must be a valid date"),
  body("active")
    .optional()
    .isBoolean()
    .withMessage("Active must be a boolean value"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Coupon name is too short")
    .isLength({ max: 30 })
    .withMessage("Coupon name is too long"),
  body("discount")
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),
  body("expire")
    .optional()
    .isISO8601()
    .withMessage("Expiration date must be a valid date"),
  body("active")
    .optional()
    .isBoolean()
    .withMessage("Active must be a boolean value"),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  validatorMiddleware,
];
