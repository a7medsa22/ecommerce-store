const express = require('express');
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidtor,
    deleteCategoryvalidator,
} = require("../utils/validators/categroyValidator");

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryimage,
    resizeImage
} = require("../services/categoryService");
const authprotect = require('../services/authService');

const router = express.Router();

// Mount subcategories routes
const subCategoryRoute = require('./subCategoryRoutes');
router.use('/:categoryId/subcategories', subCategoryRoute);

// Category routes
router
  .route("/")
  .get(getCategories)
  .post(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    updateCategoryimage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    updateCategoryimage,
    resizeImage,
    updateCategoryValidtor,
    updateCategory)
  .delete(authprotect.protect,
    authprotect.allowTo('admin'),deleteCategoryvalidator, deleteCategory);

module.exports = router;