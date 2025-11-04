const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const { uploadImageToCloudinary } = require("../utils/cloudinaryUploader");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactors");
const Categorymoudle = require("../models/categoryModels");


// Export middleware
exports.updateCategoryimage = uploadSingleImage("image");

// Use generic image upload middleware
exports.resizeImage = uploadImageToCloudinary('categories', 'image', 600);

//@desc Git list of categories
//@desc GET /api/v1/categories
//@desc public
exports.getCategories = getAll(Categorymoudle, "category",true);
//@desc Git category
//@desc GET /api/v1/categories/:id
//@desc public
exports.getCategory = getOne(Categorymoudle);

//@desc create category
//@desc POST /api/v1/categories
//@desc private
exports.createCategory = createOne(Categorymoudle,"category",true);

//@desc update category
//@desc PUT /api/v1/categories
//@desc private
exports.updateCategory = updateOne(Categorymoudle,"category",true);

//@desc Delete category
//@desc DELETE /api/v1/categories
//@desc private
exports.deleteCategory = deleteOne(Categorymoudle,"category",true);
