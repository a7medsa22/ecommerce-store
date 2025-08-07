const multer = require("multer");
const ApiError = require("../utils/apiError");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { uploadBufferToCloudinary } = require("../utils/cloudinaryUploader");

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

// Upload to Cloudinary
exports.uploadToCloudinary = async (buffer, folder = 'uploads') => {
  try {
    const result = await uploadBufferToCloudinary(buffer, folder);
    return result;
  } catch (error) {
    throw new ApiError('Failed to upload image to Cloudinary', 500);
  }
};