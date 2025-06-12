const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductimages,
    resizeImageCover
} = require("../services/productService");
const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require("../utils/validators/productValidator");
const authprotect = require('../services/authService');

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    updateProductimages, 
    resizeImageCover, 
    createProductValidator, 
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    updateProductimages, 
    resizeImageCover, 
    updateProductValidator, 
    updateProduct
  )
  .delete(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    deleteProductValidator, 
    deleteProduct
  );

module.exports = router;     

