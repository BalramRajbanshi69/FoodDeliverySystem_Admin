import React, { useState, useRef, useCallback } from 'react';
import { MdCloudUpload, MdDelete, MdError } from 'react-icons/md';
import { FiImage } from 'react-icons/fi';
import { 
  uploadToCloudinary, 
  uploadMultipleToCloudinary, 
  validateFile,
  getOptimizedImageUrl 
} from '../../utils/cloudinaryUtils';
import toast from 'react-hot-toast';

const CloudinaryUpload = ({
  onUploadComplete,
  onUploadError,
  multiple = false,
  maxFiles = 5,
  folder = 'uploads',
  tags = [],
  transformationPreset = null,
  validationConstraints = {},
  className = '',
  disabled = false,
  showPreview = true,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, [disabled]);

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFileSelection(files);
  }, []);

  const handleFileSelection = async (files) => {
    if (!files || files.length === 0) return;

    setErrors([]);
    const selectedFiles = multiple ? files.slice(0, maxFiles) : [files[0]];
    
    // Validate files
    const validationPromises = selectedFiles.map(file => validateFile(file, {
      allowedTypes: acceptedFileTypes,
      ...validationConstraints
    }));
    
    try {
      const validationResults = await Promise.all(validationPromises);
      const invalidFiles = validationResults.filter(result => !result.isValid);
      
      if (invalidFiles.length > 0) {
        const allErrors = invalidFiles.flatMap(result => result.errors);
        setErrors(allErrors);
        toast.error(`Validation failed: ${allErrors[0]}`);
        return;
      }

      // Upload files
      await uploadFiles(selectedFiles);
    } catch (error) {
      console.error('File validation error:', error);
      setErrors(['File validation failed']);
    }
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadOptions = {
        folder,
        tags,
        transformation: transformationPreset,
        onProgress: (progress) => setUploadProgress(progress),
      };

      let results;
      if (multiple) {
        results = await uploadMultipleToCloudinary(files, uploadOptions);
      } else {
        results = await uploadToCloudinary(files[0], uploadOptions);
        results = [results]; // Normalize to array
      }

      setUploadedFiles(prev => [...prev, ...results]);
      onUploadComplete?.(multiple ? results : results[0]);
      
      toast.success(`Successfully uploaded ${results.length} file(s)`);
    } catch (error) {
      console.error('Upload error:', error);
      setErrors([error.message]);
      onUploadError?.(error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeUploadedFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`cloudinary-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto w-8 h-8 text-blue-500">
              <MdCloudUpload size={32} />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Uploading...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{Math.round(uploadProgress)}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <MdCloudUpload size={48} />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragOver ? 'Drop files here' : 'Upload your images'}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop {multiple ? `up to ${maxFiles} files` : 'a file'} or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Accepted formats: {acceptedFileTypes.map(type => type.split('/')[1]).join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <MdError className="text-red-500 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Upload Errors:</h4>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Preview Uploaded Files */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {file.format && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.format.toLowerCase()) ? (
                    <img
                      src={getOptimizedImageUrl(file.publicId, 'thumbnail')}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUploadedFile(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MdDelete size={16} />
                </button>
                <div className="mt-2 text-xs text-gray-600">
                  <p className="truncate">{file.publicId.split('/').pop()}</p>
                  <p className="text-gray-400">{formatFileSize(file.bytes)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;