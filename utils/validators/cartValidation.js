const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatormiddleware');

exports.addProductToCartValidator = [
  check('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid ID format'),
  check('color')
    .optional()
    .isString()
    .withMessage('Color must be a string'),
  validatorMiddleware,
];

exports.updateCartItemQuantityValidator = [
  check('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0'),
  validatorMiddleware,
];

exports.applyCouponValidator = [
  check('coupon')
    .notEmpty()
    .withMessage('Coupon code is required')
    .isString()
    .withMessage('Invalid coupon format'),
    
  validatorMiddleware,
];