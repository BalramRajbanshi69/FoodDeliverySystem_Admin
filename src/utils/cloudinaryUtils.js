import { cloudinary, uploadConfig, transformations } from '../config/cloudinary';
import { cldnryImg } from '@cloudinary/url-gen';
import toast from 'react-hot-toast';

/**
 * Upload a single file to Cloudinary
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with URL and public_id
 */
export const uploadToCloudinary = async (file, options = {}) => {
  const {
    folder = 'uploads',
    transformation = null,
    resourceType = 'auto',
    tags = [],
    onProgress = null,
  } = options;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadConfig.uploadPreset);
    formData.append('cloud_name', uploadConfig.cloudName);
    formData.append('folder', folder);
    formData.append('resource_type', resourceType);
    
    if (tags.length > 0) {
      formData.append('tags', tags.join(','));
    }
    
    if (transformation) {
      formData.append('transformation', transformation);
    }

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      // Handle progress if callback provided
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
            format: response.format,
            width: response.width,
            height: response.height,
            bytes: response.bytes,
            createdAt: response.created_at,
          });
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${uploadConfig.cloudName}/${resourceType}/upload`);
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {FileList|Array} files - Array of files to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadMultipleToCloudinary = async (files, options = {}) => {
  const fileArray = Array.from(files);
  const uploadPromises = fileArray.map(file => uploadToCloudinary(file, options));
  
  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

/**
 * Generate optimized image URL from public_id
 * @param {string} publicId - Cloudinary public_id
 * @param {string} preset - Transformation preset name
 * @param {Object} customTransforms - Custom transformations
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, preset = null, customTransforms = {}) => {
  if (!publicId) return '';
  
  try {
    const image = cldnryImg(publicId, { cloudName: uploadConfig.cloudName });
    
    // Apply preset transformation if specified
    if (preset && transformations[preset]) {
      transformations[preset](image);
    }
    
    // Apply custom transformations
    Object.keys(customTransforms).forEach(key => {
      if (typeof image[key] === 'function') {
        image[key](customTransforms[key]);
      }
    });
    
    return image.toURL();
  } catch (error) {
    console.error('Error generating optimized URL:', error);
    return '';
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${uploadConfig.cloudName}/image/destroy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_id: publicId,
        api_key: uploadConfig.apiKey,
        timestamp: Math.round(new Date().getTime() / 1000),
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} constraints - Validation constraints
 * @returns {Object} Validation result
 */
export const validateFile = (file, constraints = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxWidth = null,
    maxHeight = null,
  } = constraints;

  const errors = [];

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // For images, check dimensions if specified
  if (file.type.startsWith('image/') && (maxWidth || maxHeight)) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (maxWidth && img.width > maxWidth) {
          errors.push(`Image width must be less than ${maxWidth}px`);
        }
        if (maxHeight && img.height > maxHeight) {
          errors.push(`Image height must be less than ${maxHeight}px`);
        }
        resolve({
          isValid: errors.length === 0,
          errors,
          file,
          dimensions: { width: img.width, height: img.height },
        });
      };
      img.onerror = () => {
        errors.push('Invalid image file');
        resolve({
          isValid: false,
          errors,
          file,
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    file,
  };
};

/**
 * Handle upload with toast notifications
 * @param {File|FileList} files - File(s) to upload
 * @param {Object} options - Upload options
 * @returns {Promise} Upload result
 */
export const uploadWithToast = async (files, options = {}) => {
  const isMultiple = files instanceof FileList || Array.isArray(files);
  const loadingToast = toast.loading(
    isMultiple ? 'Uploading files...' : 'Uploading file...'
  );

  try {
    const result = isMultiple 
      ? await uploadMultipleToCloudinary(files, options)
      : await uploadToCloudinary(files, options);
    
    toast.success(
      isMultiple 
        ? `${result.length} files uploaded successfully!` 
        : 'File uploaded successfully!',
      { id: loadingToast }
    );
    
    return result;
  } catch (error) {
    toast.error(`Upload failed: ${error.message}`, { id: loadingToast });
    throw error;
  }
};

/**
 * Get all available transformation presets
 * @returns {Array} List of available presets
 */
export const getAvailablePresets = () => {
  return Object.keys(transformations).map(key => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
  }));
};

/**
 * Generate responsive image srcSet
 * @param {string} publicId - Cloudinary public_id
 * @param {Array} widths - Array of widths for responsive images
 * @returns {string} srcSet string
 */
export const generateResponsiveSrcSet = (publicId, widths = [320, 640, 768, 1024, 1280, 1920]) => {
  if (!publicId) return '';
  
  const srcSet = widths.map(width => {
    const image = cldnryImg(publicId, { cloudName: uploadConfig.cloudName });
    image.resize(auto().width(width));
    return `${image.toURL()} ${width}w`;
  }).join(', ');
  
  return srcSet;
};