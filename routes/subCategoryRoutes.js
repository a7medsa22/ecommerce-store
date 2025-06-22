const express = require('express');
const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createfilterObject,
} = require("../services/subCategoryService");
const {
    deleteSubCategoryvalidator,
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidtor,
} = require("../utils/validators/SubCategroyValidator");
const authprotect = require('../services/authService');

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createfilterObject, getSubCategories)
  .post(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    setCategoryIdToBody, 
    createSubCategoryValidator, 
    createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    updateSubCategoryValidtor, 
    updateSubCategory
  )
  .delete(
    authprotect.protect,
    authprotect.allowTo('admin', "manager"),
    deleteSubCategoryvalidator, 
    deleteSubCategory
  );
    
module.exports = router;    