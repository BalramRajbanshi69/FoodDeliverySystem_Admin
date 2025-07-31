const express = require("express");
const isAuthenticated = require("../../middleware/isAuthenticated");
const permitTo = require("../../middleware/permitTo");
const router = express.Router();

// Use Cloudinary upload instead of local storage
const { upload } = require("../../cloudinaryConfig");
const catchAsync = require("../../services/catchAsync");
const { createProduct, getOrdersOfProduct, updateProductStatus, updateProductStockAndPrice, deleteProduct, editProduct } = require("../../controller/admin/products/productController");
const { getProducts, getProductById } = require("../../controller/global/globalController");

router.route("/")
    .post(isAuthenticated, permitTo("admin"), upload.single("productImage"), catchAsync(createProduct))
    .get(catchAsync(getProducts))

// Getting how much orders a product made
router.route("/productOrders/:id").get(isAuthenticated, permitTo("admin"), catchAsync(getOrdersOfProduct))

router.route("/status/:id")
    .patch(isAuthenticated, permitTo("admin"), catchAsync(updateProductStatus))

router.route("/stockandprice/:id")
    .patch(isAuthenticated, permitTo("admin"), catchAsync(updateProductStockAndPrice))

router.route("/:id")
    .get(catchAsync(getProductById))
    .delete(isAuthenticated, permitTo("admin"), catchAsync(deleteProduct))
    .patch(isAuthenticated, permitTo("admin"), upload.single("productImage"), catchAsync(editProduct))

module.exports = router