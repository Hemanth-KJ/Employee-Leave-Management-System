const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

/*
 * Register Employee
 * POST /api/auth/register
 */
router.post("/register", authController.register);

/*
 * Login User
 * POST /api/auth/login
 */
router.post("/login", authController.login);

module.exports = router;