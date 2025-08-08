const cloudinary = require('../config/cloudinary');
  const sharp = require('sharp');
  const asyncHandler = require('express-async-handler');
  const ApiError = require('./apiError');
//Uploads an image buffer To Cloudinary.
const uploadBufferToCloudinary = (buffer, folder = 'uploads', options = {}) => {
  return new Promise((resolve, reject) => {
    console.log(`Uploading buffer to Cloudinary folder: ${folder}`);
    console.log(`Buffer size: ${buffer.length} bytes`);
    
    const stream = cloudinary.uploader.upload_stream(
      { folder, ...options },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          console.log('Cloudinary upload successful:', result.secure_url);
          resolve(result);
        } else {
          console.error('Cloudinary upload failed: No result and no error');
          reject(new Error('Upload failed: No result and no error'));
        }
      }
    );
    
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      reject(error);
    });
    
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
      console.log(`Processing ${fieldName} image...`);
      console.log(`Original file size: ${req.file.buffer.length} bytes`);
      
      // Resize image
      const resizedImage = await sharp(req.file.buffer)
        .resize(size, size)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toBuffer();

      console.log(`Image resized to ${size}x${size}, uploading to Cloudinary...`);

      // Upload to Cloudinary
      const cloudinaryResult = await uploadBufferToCloudinary(resizedImage, folder);
      req.body[fieldName] = cloudinaryResult.secure_url;
      
      console.log(`${fieldName} image uploaded successfully`);
      next();
    } catch (error) {
      console.error(`Error uploading ${fieldName} image to Cloudinary:`, error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
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
        console.log('Processing cover image...');
        const resizedImageCover = await sharp(req.files.imageCover[0].buffer)
          .resize(2000, 1200)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        console.log('Cover image resized, uploading to Cloudinary...');
        const cloudinaryResult = await uploadBufferToCloudinary(resizedImageCover, 'products');
        req.body.imageCover = cloudinaryResult.secure_url;
        console.log('Cover image uploaded successfully');
      }
      
      // Handle gallery images
      if (req.files.images) {
        console.log(`Processing ${req.files.images.length} gallery images...`);
        req.body.images = await Promise.all(
          req.files.images.map(async (img, index) => {
            console.log(`Processing gallery image ${index + 1}...`);
            const resizedImage = await sharp(img.buffer)
              .resize(800, 800)
              .toFormat("jpeg")
              .jpeg({ quality: 90 })
              .toBuffer();

            console.log(`Gallery image ${index + 1} resized, uploading to Cloudinary...`);
            const cloudinaryResult = await uploadBufferToCloudinary(resizedImage, 'products');
            console.log(`Gallery image ${index + 1} uploaded successfully`);
            return cloudinaryResult.secure_url;
          })
        );
        console.log('All gallery images processed successfully');
      }
      
      next();
    } catch (error) {
      console.error('Error in uploadProductImages:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
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