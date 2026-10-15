const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    title : {
        type:String,
        required : true
    },

    description :{
        type : String,
        required : true
    },
    category :{
        type:String,
        required : true
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },

    imageUrl : {
        type : String,
        required : true
    },

    stock: {
        type: String,
        trim: true,
        enum: {
            values: ["In Stock", "Out Of Stock"],
            message: "{VALUE} is not a valid availability status" // Custom error message
        },
        default: "In Stock"
    },
    numOfReview : {
        type: Number,
        default : 0,
        min: [0, "Number of review cannot be negative"]
    }
},
    {
        timestamps:true
    }
);


module.exports = mongoose.model("Product", productSchema);