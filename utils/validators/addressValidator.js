const { body, param } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatormiddleware");

exports.addAddressValidator = [
  body("alias")
    .notEmpty()
    .withMessage("V:)Alias is required"),
  body("details")
    .notEmpty()
    .withMessage("V:)Details are required"),
  body("phone")
    .notEmpty()
    .withMessage("V:)Phone is required")
    .isMobilePhone(["ar-EG", "ar-IQ", "ar-AE", "en-US", "en-GB"])
    .withMessage("V:)Invalid phone number format"),
  body("city")
    .notEmpty()
    .withMessage("V:)City is required"),
  body("postalCode")
    .notEmpty()
    .withMessage("V:)Postal code is required")
    .isPostalCode('any')
    .withMessage("V:)must be postalCode")
    .isLength({ min: 3, max: 12 })
    .withMessage("V:)Postal code must be between 3 and 12 characters"),
  validatorMiddleware,
];

exports.removeAddressValidator = [
  param("addressId")
    .isMongoId()
    .withMessage("V:)Invalid Address Id Format"),
  validatorMiddleware,
]; 