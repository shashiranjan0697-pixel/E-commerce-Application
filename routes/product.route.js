const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });


const productController = require("../controller/product.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create",
    authMiddleware.isAuthenticated,
    authMiddleware.isAdmin,
    upload.single("image"),

    productController.createProduct);

router.delete("/:id", 
    productController.removeProductById);

router.get("/:id",
    productController.getProductById);

router.patch("/:id",
    upload.single("image"),
    productController.updateProductId);

router.get("/",
    productController.getAllProduct);



module.exports = router;