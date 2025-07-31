const Order = require("../../../model/orderModel");
const Product = require("../../../model/productModel");
const User = require("../../../model/userModel");
const { cloudinary } = require("../../../cloudinaryConfig");

exports.createProduct = async (req, res) => {
    try {
        const userId = req.user?.id;
        const file = req.file;
        
        let imageUrl;
        if (!file) {
            imageUrl = "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
        } else {
            // File is automatically uploaded to Cloudinary by multer-storage-cloudinary
            imageUrl = file.path; // Cloudinary URL
        }

        const {
            productName,
            productDescription,
            productPrice,
            productStockQuantity,
            productStatus,
        } = req.body;

        if (!productName || !productDescription || !productPrice || !productStockQuantity || !productStatus) {
            return res.status(400).json({
                message: "Please provide productName,productDescription,productPrice,productStockQuantity,productStatus",
            });
        }

        const productData = await Product.create({
            productName,
            productDescription,
            productPrice,
            productStockQuantity,
            productStatus,
            productImage: [imageUrl],
            user: userId
        });

        res.status(200).json({
            message: "Product added successfully",
            data: productData,
        });
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, productDescription, productPrice, productStatus, productStockQuantity } = req.body;

        if (!productName || !productDescription || !productPrice || !productStatus || !productStockQuantity || !id) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const oldData = await Product.findById(id);
        if (!oldData) {
            return res.status(404).json({
                message: "No data found with that id"
            });
        }

        // Security check: Only the product creator can edit it.
        if (oldData.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "You are not authorized to edit this product" });
        }

        let newImageUrl;
        if (req.file && req.file.path) {
            // Delete old image from Cloudinary if it exists and is not the default image
            const oldImageUrl = oldData.productImage[0];
            if (oldImageUrl && oldImageUrl.includes('cloudinary.com')) {
                try {
                    // Extract public_id from Cloudinary URL
                    const publicId = oldImageUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                    console.log("Old image deleted from Cloudinary");
                } catch (err) {
                    console.error("Error deleting old image from Cloudinary:", err);
                }
            }
            newImageUrl = req.file.path; // New Cloudinary URL
        } else {
            newImageUrl = oldData.productImage[0]; // Keep existing image
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            productName,
            productDescription,
            productPrice,
            productStatus,
            productStockQuantity,
            productImage: [newImageUrl]
        }, {
            new: true,
        });

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        console.error("Edit product error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Please provide product ID" });
        }

        // Find the product to get its image URL
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Delete image from Cloudinary if it exists
        let imageUrl = product.productImage;
        if (Array.isArray(imageUrl)) {
            imageUrl = imageUrl[0]; // Take the first image if it's an array
        }

        if (imageUrl && imageUrl.includes('cloudinary.com')) {
            try {
                // Extract public_id from Cloudinary URL
                const publicId = imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from Cloudinary successfully");
            } catch (err) {
                console.error("Error deleting image from Cloudinary:", err);
            }
        }

        // Delete the product from the database
        await Product.findByIdAndDelete(id);

        // Remove the product from all user carts
        await User.updateMany(
            {},
            { $pull: { cart: { product: id } } }
        );

        // Remove the product from all existing orders
        await Order.updateMany(
            { 'items.product': id },
            { $pull: { items: { product: id } } }
        );

        res.status(200).json({
            success: true,
            message: "Product and associated image deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// update product Status
exports.updateProductStatus = async(req,res)=>{
    const id = req.params.id;
    const { productStatus } = req.body;

    // validate order status
    if(!productStatus || !["available", "unavailable"].includes(productStatus.toLowerCase())) {
        return res.status(400).json({ message: "Invalid product status" });
    }

    // check if order exists or not
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }

    // update the order status
    const updatedProduct = await Product.findByIdAndUpdate(id,{
        productStatus
    },{
        new:true
    })

    res.status(200).json({
        message: "Product status updated successfully",
        data: updatedProduct
    });
}

// update product stock and price
exports.updateProductStockAndPrice = async(req,res)=>{
    const id = req.params.id;
    const { productStockQuantity,productPrice } = req.body;

    // validate order status
    if(!productStockQuantity && !productPrice) {
        return res.status(400).json({ message: "provide all fields" });
    }

    // check if order exists or not
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }

    // update the order status
    const updatedProduct = await Product.findByIdAndUpdate(id,{
        productStockQuantity : productStockQuantity ? productStockQuantity : product.productStockQuantity, 
        productPrice : productPrice ? productPrice : product.productPrice
    },{
        new:true
    })

    res.status(200).json({
        message: "Product stock and price updated successfully",
        data: updatedProduct
    });
}

// get orders of a product (how much order has been done in a single product)
exports.getOrdersOfProduct = async(req,res)=>{
    const {id:productId} = req.params;
    
    const product = await Product.findById(productId)
    if(!product){
        return res.status(400).json({
            message:"No product found!"
        })
    }

    const orders = await Order.find({"items.product":productId})

    res.status(200).json({
        message:"Orders of product fetched successfully",
        data:orders
    })
}