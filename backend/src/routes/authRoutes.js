const express = require("express");

const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Protected profile
router.get(
    "/profile",
    authenticateToken,
    authController.getProfile
);

module.exports = router;