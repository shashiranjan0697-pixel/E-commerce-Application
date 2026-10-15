const Product = require("../model/product.model");

require("dotenv").config();
const cloudinary = require("../utils/cloudinary.util");
const http = require("http-status-codes");


const createProduct = async (req, res) =>{
    try{

    const {title, description, category, price, stock, numOfReview} = req.body;

    if(!title || !description || !category || !price) {
        return res.status(http.StatusCodes.BAD_REQUEST).json({
            success : false,
            message : "Please enter all the details of product"
        });
    }
    if(!req.file){
        return res.status(http.StatusCodes.BAD_REQUEST).json({
            success : false,
            message : "file not found"
        });
    }
    
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                        folder: "products",
                    });

    const imageUrl = uploadResult.secure_url;

    const product = await Product.create({
            title,
            description,
            category,
            price,
            imageUrl : imageUrl,
            stock,
            numOfReview 
        });

        return res.status(http.StatusCodes.CREATED).json({
            success : true,
            message : "Product Successfully created",
            data : {
                product
            }
        });

    }   catch(err) {

        console.log("Error : ", err);

        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                err: "interval server error",
                message : err.message
            });

    }
}




const removeProductById = async (req, res) =>{
    try{

        if(!req.params.id) {
            return res.status(http.StatusCodes.BAD_REQUEST).json({
            success : false,
            message : "ProductId not provided"
            });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product){
            return res.status(http.StatusCodes.NOT_FOUND).json({
            success : false,
            message : "Product not found."
            });
        }

        return res.status(http.StatusCodes.CREATED).json({
            success : true,
            message : "Product removed successfully",
            data : {
                product
            }
        });


    }   catch(err){

        console.log("Error : ", err);

        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                err: "interval server error",
                message : err.message
            });

    }
}




const getProductById = async (req, res) =>{
    try{

        if(!req.params.id) {
            return res.status(http.StatusCodes.BAD_REQUEST).json({
            success : false,
            message : "ProductId not provided"
            });
        }

        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(http.StatusCodes.NOT_FOUND).json({
            success : false,
            message : "Product not found."
            });
        }

        return res.status(http.StatusCodes.CREATED).json({
            success : true,
            message : "Product Successfully fetched",
            data : {
                product
            }
        });

    }   catch(err) {

        console.log("Error : ", err);

        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                err: "interval server error",
                message : err.message
            });

    }
}


const getAllProduct = async (req, res) => {
    try{

        const products = await Product.find({});

        if(!products) {
            return res.status(http.StatusCodes.NOT_FOUND).json({
            success : false,
            message : "Product not found."
            });
        }

        return res.status(http.StatusCodes.OK).json({
            success : true,
            message : "All Product fetched.",
            data : {
                products
            }
        });        

    }   catch(err) {

        console.log("Error : ", err);

        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                err: "interval server error",
                message : err.message
            });

    }
}



const updateProductId = async (req, res) => {
    try {
        const { title, description, category, price, stock, numOfReview } = req.body || {};

        if (!req.params.id) {
            return res.status(http.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "ProductId not provided"
            });
        }

        const product = await Product.findById(req.params.id);

        // Check whether product exists
        if (!product) {
            return res.status(http.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Product not found"
            });
        }

        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.category = category ?? product.category;
        product.price = price ?? product.price;
        product.stock = stock ?? product.stock;
        product.numOfReview = numOfReview ?? product.numOfReview;

        // Update image only if a new file is provided
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(
                req.file.path,
                { folder: "products" }
            );

            product.imageUrl = uploadResult.secure_url;
        }

        await product.save();

        return res.status(http.StatusCodes.OK).json({
            success: true,
            message: "Product Updated Successfully.",
            data: {
                product
            }
        });

    } catch (err) {
        console.log("Error:", err);

        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            err: err.message
        });
    }
};



module.exports = {
    createProduct,
    getProductById,
    removeProductById,
    getAllProduct,
    updateProductId
}