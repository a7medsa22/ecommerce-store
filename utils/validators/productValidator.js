const validatorMiddleware = require("../../middleware/validatormiddleware");
const { check, body } = require("express-validator");
const Category = require("../../models/categoryModels");
const SubCategory = require("../../models/subCategoryModels");
const { default: slugify } = require("slugify");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Require Title")
    .isLength({ min: 3 })
    .withMessage("V:)- Too Short product Tilte")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("Required desc")
    .isLength({ min: 50 })
    .withMessage("V:)- Too Short product Desc")
    .isLength({ max: 2000 })
    .withMessage("V:)- Too Long product Desc"),
  check("quantity")
    .notEmpty()
    .withMessage("Required Quantity")
    .isNumeric()
    .withMessage("V:)- Must be Numeric"),
  check("sold").isNumeric().withMessage("V:)- Must be Numeric"),
  check("price")
    .notEmpty()
    .withMessage("Required Price")
    .isNumeric()
    .withMessage("V:)- Must be Numeric")
    .toFloat()
    .isLength({ max: 7 })
    .withMessage("V:)- Too hight Product Price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("V:)- Must be Numeric")
    .toFloat()
    .isLength({ max: 7 })
    .withMessage("V:)- Too hight ProductAfterDesc Price")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("PriceAfterDiscount Must Be Lower than Price");
      }
      return value;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors should be Array String"),
  check("category")
    .notEmpty()
    .withMessage("Required Add Category")
    .isMongoId()
    .withMessage("V:)- Invalid Id Formate")
    .custom(async (categoryId) => {
      const value = await Category.findById(categoryId);
      if (!value) {
        throw new Error(`Invalid CategoryId ${categoryId}`);
      }
    }),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("V:)- Invalid SubCategory Id Formate")
    .custom((subcategoriesID) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesID } }).then(
        (data) => {
          if (data.length < 1 || data.length != subcategoriesID.length) {
            return Promise.reject(
              new Error(`V:)- Invalid SubCategoriesId ${subcategoriesID}`)
            );
          }
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then((result) => {
        const ArrOfSubCtegoriesId = [];
        result.forEach((item) => {
          ArrOfSubCtegoriesId.push(item._id.toString());
        });
        // check of SubCategories ids in db include subcategories in req.body return (true or false)
        const checker = (target, arr) => target.every((v) => arr.includes(v));
        if (!checker(val, ArrOfSubCtegoriesId)) {
          return Promise.reject(
            new Error(`V:)- SubCategoriesId Not belong Category`)
          );
        }
      })
    ),
  check("brand").optional().isMongoId().withMessage("V:)- Invalid Id Formate"),
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("V:)- Must be Numeric")
    .isLength({ min: 1 })
    .withMessage("V:)- Rating must be abrove or equal 1.0 ")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("V:)- Must be Numeric"),

  validatorMiddleware,
];
exports.getProductValidator = [
  check("id").isMongoId().withMessage("V:)- Invalid Product Id Format"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("V:)- Invalid Product Id Format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("V:)- Invalid Product Id Format"),
  validatorMiddleware,
];
