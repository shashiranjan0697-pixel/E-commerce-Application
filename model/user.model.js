const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    password :{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:["CLIENT", "ADMIN", "USER"],
        default:"USER"
    },
    verified : {
        type: Boolean,
        default : false
    }
}, 
    {
        timestamps:true
    }
);


module.exports = mongoose.model("User", userSchema);