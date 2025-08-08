const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeature");

// handler getAll() -> imageURL and imageCover mauale
function attachComputedFields(docs, modelName) {
  return docs.map((doc) => {
    // Virtual fields are now handled by the models themselves
    // No need to manually add image URLs here
    return doc;
  });
}
exports.getAll = (Model, modelName = "") =>
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

exports.getOne = (Model, paginationOption) =>
  asyncHandler(async (req, res, next) => {
    // build the query
    let query = Model.findById(req.params.id);
    if (paginationOption) {
      query = query.populate(paginationOption);
    }
    // Execute
    const document = await query;
    if (!document) {
      return next(
        new ApiError(`No document found with id: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document found with id: ${req.params.id}`, 404)
      );
    }
    document.save();
    res.status(200).json({ data: document });
  });
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document found with id: ${id}`, 404));
    }
    document.remove();
    res.status(204).send();
  });
