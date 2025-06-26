const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatormiddleware");
const { default: slugify } = require("slugify");
const Review = require('../../models/reviewModels'); // adjust path as needed


exports.getReviewValidator = [
  check("id").isMongoId().withMessage("V:)Idvalid Review Id Format"),
  validatorMiddleware,
];
exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("V:)Rating must be between 1 and 5"),
  check("comment").optional(),
  check("product")
    .isMongoId()
    .withMessage("V:)Product Id is required")
    .custom(async (val, { req }) => {
      const productExists = await Review.findOne({
        product: val,
        user: req.user._id,
      });
      if (productExists) {
        throw new Error("V:)You have already reviewed this product");
      }
    }),
  validatorMiddleware,
];
exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("V:)Idvalid Review Id Format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new Error("V:)Review not found");
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("V:)You are not authorized to update this review");
      }
    }),
  check("rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("V:) Rating must be between 1 and 5"),
  check("comment").optional(),
  validatorMiddleware,
];
exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("V:)Idvalid Review Id Format")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await Review.findById(val);
        if (!review) {
          throw new Error("V:)Review not found");
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error("V:)You are not authorized to update this review");
        }
      }
      return true;
    }),
  validatorMiddleware,
];




