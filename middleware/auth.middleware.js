const User = require("../model/user.model")
const http = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const isAuthenticated = async (req, res, next) =>{
    try{

        const token = req.headers["token"];

        if(!token){
            return res.status(http.StatusCodes.BAD_GATEWAY).json({
                success : false,
                message: "Token not provided"
            });
        }

        const response = jwt.verify(token, process.env.AUTH_KEY);

        const user = await User.findById(response.id);

        if (!user) {
            return res.status(http.StatusCodes.NOT_FOUND).json({
                success : false,
                message: "User not found"
            });
        }

        req.user = response.id; 

        next();

    }   catch(err){
        console.log("Error : ", err)
        
        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                err: err.message,
                message : "Invalid token"
            });
    }
}

const isAdmin = async (req, res, next) =>{
    try{

        if(!req.user) {
            return res.status(http.StatusCodes.BAD_REQUEST).json({
                success : false,
                message: "User is not authenticated"
            }); 
        }

        const user = await User.findById(req.user);

        if(!user){
           return res.status(http.StatusCodes.FAILED_DEPENDENCY).json({
                success : false,
                message: "User is not authenticated"
            }); 
        }

        if(user.role !== "ADMIN"){
            return res.status(http.StatusCodes.FORBIDDEN).json({
                success : false,
                message: "User is not admin"
            });
        }

    next();

    }   catch(err){
        console.log("Error : ", err)
        
        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                err: err.message,
                message : "Invalid token"
            });
    }
}


module.exports = {
    isAdmin,
    isAuthenticated
}