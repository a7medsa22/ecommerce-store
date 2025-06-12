const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const ApiError = require("../utils/apiError");
const { uploadArrayImages } = require("../middleware/uploadImageMiddleware");
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

exports.resizeImageCover = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  if (!req.files) {
    return next(new ApiError("No files uploaded", 400));
  }
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }
  if (req.files.images) {
    req.body.images = await Promise.all(
    req.files.images.map(async (img, idx) => {
      const imagesFileName = `product-${uuidv4()}-${Date.now()}-${idx + 1}.jpeg`;

      await sharp(img.buffer)
        .resize(800, 800)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${imagesFileName}`);

      return imagesFileName
    })
        );
        }
            
  next();
});

//@desc Git list of products
//@desc GET /api/v1/products
//@access public
exports.getProducts = getAll(ProductModel, "product");
//@desc Git product
//@route GET /api/v1/products/:id
//@access public
exports.getProduct = getOne(ProductModel);

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
