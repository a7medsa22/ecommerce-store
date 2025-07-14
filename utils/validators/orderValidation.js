const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatormiddleware');

exports.createOrderValidator = [
  check('cartId')
    .notEmpty()
    .withMessage('Cart ID is required')
    .isMongoId()
    .withMessage('Invalid cart ID format'),
  check('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'paypal'])
    .withMessage('Invalid payment method'),
  check('address')
    .optional()
    .isString()
    .withMessage('Address must be a string'),
  check('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string'),
  validatorMiddleware,
];
