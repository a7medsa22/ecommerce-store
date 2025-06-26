const asyncHandler = require("express-async-handler");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactors");
const Review = require("../models/reviewModels");
const ApiError = require("../utils/apiError");

 
 // Nested Route
 //  GET api/v1/category/:productId/reviews
 exports.createfilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject
  next();
}
//Nested Route
// POST (Create) api/v1//:productId/reviews
exports.setProductIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  req.body.user = req.user._id; 
  next();
}
//@desc Git list of reviews
//@desc GET /api/v1/reviews
//@desc public
exports.getReviews = getAll(Review, "review");
//@desc Git review
//@desc GET /api/v1/reviews/:id
//@desc public
exports.getReview = getOne(Review);

//@desc create review
//@desc POST /api/v1/reviews
//@desc private/protected/user
exports.createReview = createOne(Review);

//@desc update review
//@desc PUT /api/v1/reviews
//@desc private/protected/user
exports.updateReview = updateOne(Review);

//@desc Delete review
//@desc DELETE /api/v1/reviews
//@desc private/protected/user/admin/manager
exports.deleteReview = deleteOne(Review);
