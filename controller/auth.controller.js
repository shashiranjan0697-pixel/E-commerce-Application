const User = require("../model/user.model")
const http = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const sendMail = require("../utils/email.util");

const register = async (req, res) =>{
    try{

        const {name, email ,password} = req.body;

        if(!name || !email || !password){
            return res.status(http.StatusCodes.BAD_REQUEST).json({
                success:true,
                message : "Please provide all the details."
            });
        }

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            return res.status(http.StatusCodes.CONFLICT).json({
                success: false,
                message: "Email already exists. Please use another email."
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({
           ...req.body,
           password : hashedPass
        });

        let token;
        if(user){
            token = jwt.sign(
            {
                id: user.id,
                email: user.email
            }, 
                process.env.AUTH_KEY,
                {expiresIn:"35d"}
            );

            const to = user.email;
            const sub = "Welcome";
            const body = ` Welcome to Shopnest.
                    token : ${token}`;
            

        const info = await sendMail(to, sub, body);
        }

    return res.status(http.StatusCodes.CREATED).json({
                success: true,
                message : "User successfully created.",
                data :{
                    user :{
                        name:user.name,
                        email:user.email,
                        role:user.role
                    },
                    token: token
                }
            });


    }   catch(err) {

        console.log("Error : ", err)

        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                err: "interval server error",
                message : err.message
            });
    }
}





const signIn = async (req, res) =>{
    try{

        const {email ,password} = req.body;

        if(!email || !password){
            return res.status(http.StatusCodes.BAD_REQUEST).json({
                success:true,
                message: "Please provide both email and password.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(http.StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(http.StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        token = jwt.sign(
            {
                id: user.id,
                email: user.email
            }, 
                process.env.AUTH_KEY,
                {expiresIn:"35d"}
        );

        return res.status(http.StatusCodes.OK).json({
                success: true,
                message : "User successfully signed in.",
                data :{
                    user :{
                        name:user.name,
                        email:user.email,
                        role:user.role
                    },
                    token: token
                }
            });

    }   catch(err){
        console.log("Error : ", err)

        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            err: "interval server error",
            message : err.message
        });
    }
}


const getAllUsers = async (req, res) =>{
    try{

        const users = await User.find({}).select("-password");

        return res.status(http.StatusCodes.ACCEPTED).json({
            success : true,
            message : users.length > 0 ? 
                "All users successfully fetched" :
                "No user found",
            data :{
                users
            }
        })

    }   catch(err) {

        console.log("Error : ", err)

        return res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                err: "interval server error",
                message : err.message
            });
    }
}


module.exports = {
    register,
    signIn,
    getAllUsers
}