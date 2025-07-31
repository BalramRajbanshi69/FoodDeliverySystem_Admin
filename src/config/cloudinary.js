import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

// Initialize Cloudinary instance
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  },
  url: {
    secure: true, // Use HTTPS URLs
  },
});

// Common transformation presets
export const transformations = {
  // Profile picture: 200x200, auto crop with face detection
  profilePicture: (image) => 
    image.resize(auto().width(200).height(200)).gravity(autoGravity()),
  
  // Thumbnail: 150x150, auto crop
  thumbnail: (image) => 
    image.resize(auto().width(150).height(150)),
  
  // Banner: 1200x400, auto crop
  banner: (image) => 
    image.resize(auto().width(1200).height(400)),
  
  // Gallery image: max width 800px, maintain aspect ratio
  gallery: (image) => 
    image.resize(auto().width(800)),
  
  // High quality: max width 1920px, maintain aspect ratio
  highQuality: (image) => 
    image.resize(auto().width(1920)).quality('auto:best'),
};

// Cloudinary configuration object for uploads
export const uploadConfig = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || 'your-api-key',
};

// Helper function to validate configuration
export const validateCloudinaryConfig = () => {
  const requiredVars = [
    'REACT_APP_CLOUDINARY_CLOUD_NAME',
    'REACT_APP_CLOUDINARY_UPLOAD_PRESET',
    'REACT_APP_CLOUDINARY_API_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing Cloudinary environment variables:', missing);
    return false;
  }
  
  return true;
};