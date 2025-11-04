const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const { uploadImageToCloudinary } = require("../utils/cloudinaryUploader");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactors");
const brandmoudle = require("../models/brandModels");
const ApiError = require("../utils/apiError");

// Upload single Image
exports.updateBrandimage = uploadSingleImage("image");

// Use generic image upload middleware
exports.resizeBrandImage = uploadImageToCloudinary('brands', 'image', 600);

//@desc Git list of brands
//@desc GET /api/v1/brands
//@desc public
exports.getBrands = getAll(brandmoudle, "brand", true);
//@desc Git brand
//@desc GET /api/v1/brands/:id
//@desc public
exports.getBrand = getOne(brandmoudle);

//@desc create brand
//@desc POST /api/v1/brands
//@desc private
exports.createbrand = createOne(brandmoudle,"brand",true);

//@desc update brand
//@desc PUT /api/v1/brands
//@desc private
exports.updatebrand = updateOne(brandmoudle,"brand",true);

//@desc Delete brand
//@desc DELETE /api/v1/brands
//@desc private
exports.deletebrand = deleteOne(brandmoudle,"brand",true);
