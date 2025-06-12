const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatormiddleware");
const { default: slugify } = require("slugify");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Idvalid SubCategory Id Format"),
  validatorMiddleware,
];
exports.createSubCategoryValidator = [
  check("name")
    .isLength({ min: 2 })
    .withMessage("It's Too Short")
    .isLength({ max: 30 })
    .withMessage("It's Too Long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must be belong to Category")
    .isMongoId()
    .withMessage("Idvalid Category Id Format"),
  validatorMiddleware,
];
exports.updateSubCategoryValidtor = [
  check("id").isMongoId().withMessage("Idvalid SubCategory Id Format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.deleteSubCategoryvalidator = [
  check("id").isMongoId().withMessage("Idvalid SubCategory Id Format"),
  validatorMiddleware,
];
