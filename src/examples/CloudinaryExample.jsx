import React, { useState } from 'react';
import CloudinaryUpload from '../components/common/CloudinaryUpload';
import { getOptimizedImageUrl, getAvailablePresets } from '../utils/cloudinaryUtils';

const CloudinaryExample = () => {
  const [singleUploadResult, setSingleUploadResult] = useState(null);
  const [multipleUploadResults, setMultipleUploadResults] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('thumbnail');

  const presets = getAvailablePresets();

  const handleSingleUpload = (result) => {
    console.log('Single upload result:', result);
    setSingleUploadResult(result);
  };

  const handleMultipleUpload = (results) => {
    console.log('Multiple upload results:', results);
    setMultipleUploadResults(results);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Cloudinary Upload Examples
        </h1>
        <p className="text-gray-600">
          Examples showing different ways to use the Cloudinary upload component
        </p>
      </div>

      {/* Single File Upload */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Single File Upload</h2>
        <CloudinaryUpload
          onUploadComplete={handleSingleUpload}
          onUploadError={handleUploadError}
          folder="examples/single"
          tags={['example', 'single']}
          transformationPreset="profilePicture"
          validationConstraints={{
            maxSize: 5 * 1024 * 1024, // 5MB
            maxWidth: 2000,
            maxHeight: 2000,
          }}
        />
        
        {singleUploadResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Upload Result:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img
                  src={getOptimizedImageUrl(singleUploadResult.publicId, 'thumbnail')}
                  alt="Uploaded"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Public ID:</strong> {singleUploadResult.publicId}</p>
                <p><strong>Format:</strong> {singleUploadResult.format}</p>
                <p><strong>Size:</strong> {Math.round(singleUploadResult.bytes / 1024)} KB</p>
                <p><strong>Dimensions:</strong> {singleUploadResult.width} x {singleUploadResult.height}</p>
                <p><strong>URL:</strong> 
                  <a 
                    href={singleUploadResult.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline ml-1"
                  >
                    View Original
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Multiple File Upload */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Multiple File Upload</h2>
        <CloudinaryUpload
          multiple
          maxFiles={10}
          onUploadComplete={handleMultipleUpload}
          onUploadError={handleUploadError}
          folder="examples/multiple"
          tags={['example', 'multiple']}
          transformationPreset="gallery"
          validationConstraints={{
            maxSize: 10 * 1024 * 1024, // 10MB per file
          }}
        />

        {multipleUploadResults.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">
              Upload Results ({multipleUploadResults.length} files):
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {multipleUploadResults.map((result, index) => (
                <div key={index} className="text-center">
                  <img
                    src={getOptimizedImageUrl(result.publicId, 'thumbnail')}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs text-gray-600 truncate">
                    {result.publicId.split('/').pop()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transformation Presets Demo */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Transformation Presets</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Preset:
          </label>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {presets.map(preset => (
              <option key={preset.key} value={preset.key}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <CloudinaryUpload
          onUploadComplete={(result) => {
            console.log('Preset upload result:', result);
          }}
          onUploadError={handleUploadError}
          folder={`examples/presets/${selectedPreset}`}
          tags={['example', 'preset', selectedPreset]}
          transformationPreset={selectedPreset}
          className="mb-4"
        />

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">About Presets:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>Profile Picture:</strong> 200x200px with face detection</li>
            <li><strong>Thumbnail:</strong> 150x150px auto crop</li>
            <li><strong>Banner:</strong> 1200x400px auto crop</li>
            <li><strong>Gallery:</strong> Max width 800px, maintain aspect ratio</li>
            <li><strong>High Quality:</strong> Max width 1920px, best quality</li>
          </ul>
        </div>
      </div>

      {/* Advanced Configuration */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Advanced Configuration</h2>
        <CloudinaryUpload
          onUploadComplete={(result) => {
            console.log('Advanced upload result:', result);
          }}
          onUploadError={handleUploadError}
          folder="examples/advanced"
          tags={['example', 'advanced', 'custom']}
          validationConstraints={{
            maxSize: 15 * 1024 * 1024, // 15MB
            allowedTypes: ['image/jpeg', 'image/png'],
            maxWidth: 4000,
            maxHeight: 4000,
          }}
          acceptedFileTypes={['image/jpeg', 'image/png']}
          showPreview={true}
          className="border-2 border-purple-200"
        />

        <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Configuration:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Max file size: 15MB</li>
            <li>• Allowed types: JPEG, PNG only</li>
            <li>• Max dimensions: 4000x4000px</li>
            <li>• Custom folder: examples/advanced</li>
            <li>• Custom tags: example, advanced, custom</li>
          </ul>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
        <div className="prose prose-sm max-w-none">
          <ol className="space-y-2">
            <li>
              <strong>1. Create Cloudinary Account:</strong>
              <p>Sign up at <a href="https://cloudinary.com" className="text-blue-500 hover:underline">cloudinary.com</a></p>
            </li>
            <li>
              <strong>2. Get Your Credentials:</strong>
              <p>Copy your Cloud Name, API Key from the Dashboard</p>
            </li>
            <li>
              <strong>3. Create Upload Preset:</strong>
              <p>Go to Settings → Upload → Upload presets → Add upload preset (unsigned)</p>
            </li>
            <li>
              <strong>4. Set Environment Variables:</strong>
              <p>Copy <code>.env.example</code> to <code>.env</code> and fill in your values</p>
            </li>
            <li>
              <strong>5. Start Using:</strong>
              <p>Import and use the <code>CloudinaryUpload</code> component in your React app</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryExample;