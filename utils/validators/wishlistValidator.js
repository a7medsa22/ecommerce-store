const {body, param } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatormiddleware");

exports.addToWishlistValidator = [
  body("product")
    .isMongoId()
    .withMessage("V:)Invalid Product Id Format"),
  validatorMiddleware,
];

exports.removeFromWishlistValidator = [
  param("productId")
    .isMongoId()
    .withMessage("V:)Invalid Product Id Format"),
  validatorMiddleware,
];
