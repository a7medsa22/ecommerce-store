const subCategoryModel = require('../models/subCategoryModels');
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactors");

//Nested Route
// POST (Create) api/v1/category/:categoryId/subcategory
exports.setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
}
 
 // Nested Route
 //  GET api/v1/category/:categoryId/subcategory
 exports.createfilterObject = (req, res, next) => {
     let filterObject = {};
     if (req.params.categoryId) filterObject = { category: req.params.categoryId };
     req.filterObj = filterObject
     next();
 }
 //@desc Get list of subCategories
//desc GET api/v1/subcategories
// public
exports.getSubCategories = getAll(subCategoryModel);

//@desc Get subCategories
//@desc GET /api/v1/subcategories/:id
//@desc public
exports.getSubCategory = getOne(subCategoryModel);
//@desc create subCategories
//@desc POST /api/v1/subcategories
//@desc private
exports.createSubCategory = createOne(subCategoryModel);

//@desc update subCategories
//@desc PUT /api/v1/subcategories
//@desc private
exports.updateSubCategory = updateOne(subCategoryModel)

//@desc Delete subCategories
//@desc DELETE /api/v1/subcategories
//@desc private
exports.deleteSubCategory = deleteOne(subCategoryModel)
