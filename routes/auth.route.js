const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup",authController.register);

router.post("/signin", authController.signIn);

router.get("/users",
    authMiddleware.isAuthenticated,
    authMiddleware.isAdmin, 
    authController.getAllUsers);

module.exports = router;