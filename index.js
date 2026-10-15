const express = require("express");
require("dotenv").config();

const connectDb = require("./config/database");
const authRouter = require("./routes/auth.route")
const productRouter = require("./routes/product.route");


const app = express();

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/shopnest/api/v1/auth", authRouter);
app.use("/shopnest/api/v1/product", productRouter);

const port = process.env.PORT || 5000;

app.post("/", (req, res) =>{
    res.send("Sopnest server working Fine");
});

app.listen(port, () =>{
    console.log(`Server started at port : ${port}`);
}); 