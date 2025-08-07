const cloudinary = require('../config/cloudinary');
  const sharp = require('sharp');
  const asyncHandler = require('express-async-handler');
  const ApiError = require('./apiError');
//Uploads an image buffer to Cloudinary.
const uploadBufferToCloudinary = (buffer, folder = 'uploads', options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, ...options },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

//Deletes an image from Cloudinary by public_id.
const destroyFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

//Updates an image on Cloudinary (re-upload with same public_id).
const updateCloudinaryImage = (buffer, publicId, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, overwrite: true, ...options },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

//Fetches details of a resource from Cloudinary by public_id.
const fetchCloudinaryResource = (publicId) => {
  return cloudinary.api.resource(publicId);
};

// Generic image upload middleware for different services
const uploadImageToCloudinary = (folder, fieldName = 'image', size = 600) => {


  return asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    try {
      // Resize image
      const resizedImage = await sharp(req.file.buffer)
        .resize(size, size)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toBuffer();

      // Upload to Cloudinary
      const cloudinaryResult = await uploadBufferToCloudinary(resizedImage, folder);
      req.body[fieldName] = cloudinaryResult.secure_url;
      
      next();
    } catch (error) {
      return next(new ApiError(`Error uploading image to Cloudinary`, 500));
    }
  });
};

// Specialized function for product images (cover + gallery)
const uploadProductImages = () => {
  return asyncHandler(async (req, res, next) => {
    if (!req.files) {
      return next(new ApiError("No files uploaded", 400));
    }
    
    try {
      // Handle cover image
      if (req.files.imageCover) {
        const resizedImageCover = await sharp(req.files.imageCover[0].buffer)
          .resize(2000, 1200)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        const cloudinaryResult = await uploadBufferToCloudinary(resizedImageCover, 'products');
        req.body.imageCover = cloudinaryResult.secure_url;
      }
      
      // Handle gallery images
      if (req.files.images) {
        req.body.images = await Promise.all(
          req.files.images.map(async (img) => {
            const resizedImage = await sharp(img.buffer)
              .resize(800, 800)
              .toFormat("jpeg")
              .jpeg({ quality: 90 })
              .toBuffer();

            const cloudinaryResult = await uploadBufferToCloudinary(resizedImage, 'products');
            return cloudinaryResult.secure_url;
          })
        );
      }
      
      next();
    } catch (error) {
      return next(new ApiError("Error uploading images to Cloudinary", 500));
    }
  });
};

module.exports = {
  uploadBufferToCloudinary,
  destroyFromCloudinary,
  updateCloudinaryImage,
  fetchCloudinaryResource,
  uploadImageToCloudinary,
  uploadProductImages,
};