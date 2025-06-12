const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerImage = () => {
  // ✅ Directly export middleware (no need to call it later)
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Image allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};
exports.uploadSingleImage = (imageName) => multerImage().single(imageName);

exports.uploadArrayImages = (fieldsName) => multerImage().fields(fieldsName);
