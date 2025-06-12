const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatormiddleware");
const { default: slugify } = require("slugify");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Idvalid Brand Id Format"),
  validatorMiddleware,
];
exports.createBrandValidator = [
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
exports.updateBrandValidtor = [
  check("id").isMongoId().withMessage("Idvalid Brand Id Format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteBrandvalidator = [
  check("id").isMongoId().withMessage("Idvalid Brand Id Format"),
  validatorMiddleware,
];
