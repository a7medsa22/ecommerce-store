const express = require('express');
const { createOrderCash } = require('../services/orderService');
const { createOrderValidator } = require('../utils/validators/orderValidation');
const authprotect = require('../services/authService');

const router = express.Router();
router.use( authprotect.protect ,authprotect.allowTo('user'))
router.post(
  '/',
  createOrderValidator,
  createOrderCash
);

module.exports = router;
