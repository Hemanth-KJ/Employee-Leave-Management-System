const authService = require("../services/authService");

/**
 * Register Employee
 */
const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
        }

        const user = await authService.register({
            username,
            password,
        });

        return res.status(201).json({
            success: true,
            message: "Employee registered successfully",
            user,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Login User
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
        }

        const result = await authService.login({
            username,
            password,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: result.token,
            user: result.user,
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    register,
    login,
};