const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactors");
const Coupon = require("../models/couponModels");

//@desc Get list of coupons
//@desc GET /api/v1/coupons
//@desc private/Admin-Manager
exports.getCoupons = getAll(Coupon, "coupon");

//@desc Get coupon
//@desc GET /api/v1/coupons/:id
//@desc private/Admin-Manager
exports.getCoupon = getOne(Coupon);

//@desc Create coupon
//@desc POST /api/v1/coupons
//@desc private/Admin-Manager
exports.createCoupon = createOne(Coupon);

//@desc Update coupon
//@desc PUT /api/v1/coupons/:id
//@desc private/Admin-Manager
exports.updateCoupon = updateOne(Coupon);

//@desc Delete coupon
//@desc DELETE /api/v1/coupons/:id
//@desc private/Admin-Manager
exports.deleteCoupon = deleteOne(Coupon);
