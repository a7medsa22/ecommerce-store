const express = require('express');
const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidtor,
    deleteBrandvalidator,
} = require("../utils/validators/brandValidator");

const {
    getBrands,
    getBrand,
    createbrand,
    updatebrand,
    deletebrand,
    updateBrandimage,
    resizeBrandImage,
} = require("../services/brandService");
const authprotect = require('../services/authService');

const router = express.Router();
router
  .route("/")
  .get(getBrands)
  .post(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    updateBrandimage, 
    resizeBrandImage, 
    createBrandValidator, 
    createbrand
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    updateBrandimage, 
    resizeBrandImage, 
    updateBrandValidtor, 
    updatebrand
  )
  .delete(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    deleteBrandvalidator, 
    deletebrand
  );

module.exports = router;
