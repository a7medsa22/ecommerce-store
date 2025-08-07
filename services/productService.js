const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const ApiError = require("../utils/apiError");
const { uploadArrayImages } = require("../middleware/uploadImageMiddleware");
const { uploadProductImages } = require("../utils/cloudinaryUploader");
const {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll,
} = require("./handlerFactors");
const ProductModel = require("../models/productModels");


exports.updateProductimages = uploadArrayImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// Use specialized product image upload middleware
exports.resizeImageCover = uploadProductImages();

//@desc Git list of products
//@desc GET /api/v1/products
//@access public
exports.getProducts = getAll(ProductModel, "product");
//@desc Git product
//@route GET /api/v1/products/:id
//@access public
exports.getProduct = getOne(ProductModel,'reviews');

//@desc create Product
//@route POST /api/v1/products
//@access private
exports.createProduct = createOne(ProductModel);
//@desc Update Product
//@route PUT /api/v1/products/:id
//@access private
exports.updateProduct = updateOne(ProductModel);

//@desc Delete Product
//@route DELETE /api/v1/products/:id
//@access private
exports.deleteProduct = deleteOne(ProductModel);
