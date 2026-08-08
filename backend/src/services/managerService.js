const pool = require("../config/db");

const getAllEmployees = async () => {
    const result = await pool.query(
        `
        SELECT
            id,
            username,
            role,
            created_at
        FROM users
        WHERE role = 'employee'
        ORDER BY created_at DESC
        `
    );

    return result.rows;
};

module.exports = {
    getAllEmployees,
};