# Cloudinary Setup Guide for Production Image Storage

## Problem
In production, uploaded images stored in local `uploads` folder get deleted when the server restarts because most hosting platforms use ephemeral file systems.

## Solution: Cloudinary Cloud Storage

### Step 1: Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to your Dashboard to get your credentials

### Step 2: Get Cloudinary Credentials
From your Cloudinary Dashboard, copy:
- **Cloud Name**: Your cloud name (e.g., `dxxxxxx`)
- **API Key**: Your API key (e.g., `123456789012345`)
- **API Secret**: Your API secret (keep this secret!)

### Step 3: Install Required Packages
In your backend directory, install the required packages:

```bash
npm install cloudinary multer-storage-cloudinary
```

### Step 4: Set Environment Variables
Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Step 5: Update Your Code

#### Replace your `multerConfig.js` with `cloudinaryConfig.js`:
- Delete the old `multerConfig.js` file
- Create the new `cloudinaryConfig.js` file (already provided)

#### Update your routes:
- In `productRoute.js`, change the import from `multerConfig` to `cloudinaryConfig`
- Replace `upload.single("productImage")` usage with the new Cloudinary upload

#### Update your controller:
- Replace your `productController.js` with the updated version (already provided)
- Remove all file system operations (fs.unlink, path operations)
- Images now get stored as Cloudinary URLs

### Step 6: Remove Static File Serving (Optional)
Since images are now served from Cloudinary, you can remove this line from your main server file:
```javascript
// Remove this line:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
```

### Step 7: Benefits of This Solution

✅ **Persistent Storage**: Images stay available even after server restarts
✅ **Automatic Optimization**: Cloudinary optimizes images for faster loading
✅ **Responsive Images**: Automatically serves different sizes for different devices
✅ **CDN**: Images are served from a global CDN for faster loading
✅ **Free Tier**: 25GB storage and 25GB bandwidth per month for free

### Step 8: Image Transformation Features (Optional)
Cloudinary automatically optimizes your images. You can customize transformations in `cloudinaryConfig.js`:

```javascript
transformation: [
    { width: 800, height: 600, crop: 'limit' }, // Resize images
    { quality: 'auto' }, // Auto optimize quality
    { format: 'auto' } // Auto choose best format (WebP, etc.)
]
```

### Step 9: Testing
1. Start your server
2. Try uploading a product image
3. Check your Cloudinary dashboard - you should see the image in the `products` folder
4. The image URL should now be a Cloudinary URL (e.g., `https://res.cloudinary.com/your-cloud-name/...`)

### Step 10: Deployment
When deploying to production:
1. Make sure your environment variables are set on your hosting platform
2. Images will now persist across deployments and server restarts

## Troubleshooting

### Error: "Invalid API credentials"
- Double-check your CLOUDINARY environment variables
- Make sure there are no extra spaces in your .env file

### Error: "Upload failed"
- Check if the file format is supported (jpg, jpeg, png)
- Verify the file size is under the limit (5MB in current config)

### Images not displaying
- Check if the Cloudinary URL is being stored correctly in your database
- Verify your CORS settings include Cloudinary domains

## Migration from Local Storage
If you have existing products with local images, you'll need to:
1. Upload existing images to Cloudinary manually or via script
2. Update the database records with new Cloudinary URLs
3. Remove old files from the uploads folder

This solution ensures your images will persist in production and provides better performance through Cloudinary's CDN.