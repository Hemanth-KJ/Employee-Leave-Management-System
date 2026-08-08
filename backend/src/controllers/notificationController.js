const pool = require("../config/db");

// ==========================================
// GET LOGGED-IN USER NOTIFICATIONS
// ==========================================
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                id,
                message,
                is_read,
                created_at
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            notifications: result.rows,
        });

    } catch (error) {
        console.error(
            "Get notifications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve notifications",
        });
    }
};


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE notifications
            SET is_read = TRUE
            WHERE id = $1
            AND user_id = $2
            RETURNING
                id,
                message,
                is_read,
                created_at
            `,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            notification: result.rows[0],
        });

    } catch (error) {
        console.error(
            "Mark notification read error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to mark notification as read",
        });
    }
};


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await pool.query(
            `
            UPDATE notifications
            SET is_read = TRUE
            WHERE user_id = $1
            AND is_read = FALSE
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });

    } catch (error) {
        console.error(
            "Mark all notifications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to mark notifications as read",
        });
    }
};


module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
};