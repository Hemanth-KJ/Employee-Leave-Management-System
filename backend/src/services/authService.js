const pool = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

/**
 * Register Employee
 */
const register = async ({ username, password }) => {

    // Check if username already exists
    const existingUser = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert employee
    const result = await pool.query(
        `
        INSERT INTO users (username, password, role)
        VALUES ($1, $2, 'employee')
        RETURNING id, username, role, created_at
        `,
        [username, hashedPassword]
    );

    return result.rows[0];
};

/**
 * Login User
 */
const login = async ({ username, password }) => {

    // Find user
    const result = await pool.query(
        `
        SELECT *
        FROM users
        WHERE username = $1
        `,
        [username]
    );

    if (result.rows.length === 0) {
        throw new Error("Invalid username or password");
    }

    const user = result.rows[0];

    // Compare password
    const passwordMatch = await comparePassword(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw new Error("Invalid username or password");
    }

    // Generate JWT
    const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
        },
    };
};

module.exports = {
    register,
    login,
};