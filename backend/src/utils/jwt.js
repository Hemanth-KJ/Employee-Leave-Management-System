const jwt = require("jsonwebtoken");

/**
 * Generate JWT token
 * @param {Object} payload
 * @returns {string}
 */
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/**
 * Verify JWT token
 * @param {string} token
 * @returns {Object}
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken,
};