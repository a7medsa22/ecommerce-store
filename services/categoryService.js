const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
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

  
exports.resizeImage = asyncHandler(async (req, res, next) => {
  
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    req.body.image = filename;
  }
  next();
});

//@desc Git list of categories
//@desc GET /api/v1/categories
//@desc public
exports.getCategories = getAll(Categorymoudle, "category");
//@desc Git category
//@desc GET /api/v1/categories/:id
//@desc public
exports.getCategory = getOne(Categorymoudle);

//@desc create category
//@desc POST /api/v1/categories
//@desc private
exports.createCategory = createOne(Categorymoudle);

//@desc update category
//@desc PUT /api/v1/categories
//@desc private
exports.updateCategory = updateOne(Categorymoudle);

//@desc Delete category
//@desc DELETE /api/v1/categories
//@desc private
exports.deleteCategory = deleteOne(Categorymoudle);
