const express = require("express");

const {
    getReviews,
    getReview,
    createReview,
    updateReview,
  deleteReview,
  createfilterObject,
  setProductIdToBody,
} = require("../services/reviewService ");
const {
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const authprotect = require("../services/authService");

const router = express.Router({ mergeParams: true });



router
  .route("/")
  .get(createfilterObject,getReviews)
  .post(
    authprotect.protect,
    authprotect.allowTo("user"),
    setProductIdToBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(getReviewValidator,getReview)
  .put(
    authprotect.protect,
    authprotect.allowTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authprotect.protect,
    authprotect.allowTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;