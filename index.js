const express = require("express");
require("dotenv").config();

const connectDb = require("./config/database");
const authRouter = require("./routes/auth.route")

const app = express();

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/shopnest/api/v1/auth", authRouter);

const port = process.env.PORT || 5000;

app.post("/", (req, res) =>{
    res.send("Sopnest server working Fine");
});

app.listen(port, () =>{
    console.log(`Server started at port : ${port}`);
}); 