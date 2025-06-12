const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatormiddleware");
const { default: slugify } = require("slugify");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Idvalid Category Id Format"),
  validatorMiddleware,
];
exports.createCategoryValidator = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("It's Too Short")
    .isLength({ max: 30 })
    .withMessage("It's Too Long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.updateCategoryValidtor = [
  check("id").isMongoId().withMessage("Idvalid Category Id Format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteCategoryvalidator = [
  check("id").isMongoId().withMessage("Idvalid Category Id Format"),
  validatorMiddleware,
];
