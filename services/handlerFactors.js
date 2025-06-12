const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeature");

// handler getAll() -> imageURL and imageCover mauale
function attachComputedFields(docs, modelName) {
  return docs.map((doc) => {
    if (modelName === "brand") {
      if (doc.image) {
        doc.imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
      }
    } else if (modelName === "category") {
      if (doc.image) {
        doc.imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
      }
    } else if (modelName === "user") {
      if (doc.profileImage) {
        doc.imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
      }
    } else if (modelName === "product") {
      if (doc.imageCover) {
        doc.imageCoverUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
      }
      if (doc.images && Array.isArray(doc.images)) {
        doc.imagesUrl = doc.images.map(
          (img) => `${process.env.BASE_URL}/products/${img}`
        );
      }
    }
    return doc;
  });
}

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(
        new ApiError(`No document found with id: ${id}`, 404)
      );
    }
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!document) {
      return next(new ApiError(`No document found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
  });
  
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(new ApiError(`No document found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName='') =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentCount = await Model.countDocuments();
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .pagination(documentCount)
      .sort()
      .search(modelName)
      .fields();

    // Execute Query
    const { mongooseQuery, paginationResulte } = features;
    const docs = await mongooseQuery;

    // ✅ Force inclusion of virtuals by converting to JSON
    const data = attachComputedFields(docs, modelName);
    
    res
      .status(200)
      .json({ result: data.length, paginationResulte, data: data });
  });
