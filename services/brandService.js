const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
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

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No file uploaded", 400)); 
  }
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;

  next();
});

//@desc Git list of brands
//@desc GET /api/v1/brands
//@desc public
exports.getBrands = getAll(brandmoudle, "brand");
//@desc Git brand
//@desc GET /api/v1/brands/:id
//@desc public
exports.getBrand = getOne(brandmoudle);

//@desc create brand
//@desc POST /api/v1/brands
//@desc private
exports.createbrand = createOne(brandmoudle);

//@desc update brand
//@desc PUT /api/v1/brands
//@desc private
exports.updatebrand = updateOne(brandmoudle);

//@desc Delete brand
//@desc DELETE /api/v1/brands
//@desc private
exports.deletebrand = deleteOne(brandmoudle);
