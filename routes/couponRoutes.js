const express = require('express');
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require("../services/couponService");
const {
    getCouponValidator,
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator,
} = require("../utils/validators/couponValidator");
const authprotect = require('../services/authService');

const router = express.Router();

router.use(authprotect.protect, authprotect.allowTo('admin', 'manager'));

router
  .route("/")
  .get(getCoupons)
  .post(
    
    createCoupon
  );

router
  .route("/:id")
  .get(
   getCouponValidator,
    getCoupon
  )
  .put(
   updateCouponValidator,
    updateCoupon
  )
  .delete(
   deleteCouponValidator,
    deleteCoupon
  );

module.exports = router;
