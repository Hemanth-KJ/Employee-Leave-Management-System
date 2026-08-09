const db = require("../config/db");

// Get current user's notifications
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await db.query(
            `
            SELECT *
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );

        res.status(200).json({
            notifications: result.rows,
        });
    } catch (error) {
        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch notifications",
        });
    }
};

// Mark one notification as read
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const notificationId = req.params.id;

        await db.query(
            `
            UPDATE notifications
            SET is_read = true
            WHERE id = $1
            AND user_id = $2
            `,
            [notificationId, userId]
        );

        res.status(200).json({
            message: "Notification marked as read",
        });
    } catch (error) {
        console.error(
            "Mark notification as read error:",
            error
        );

        res.status(500).json({
            message: "Failed to mark notification as read",
        });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await db.query(
            `
            UPDATE notifications
            SET is_read = true
            WHERE user_id = $1
            `,
            [userId]
        );

        res.status(200).json({
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error(
            "Mark all notifications error:",
            error
        );

        res.status(500).json({
            message: "Failed to mark notifications as read",
        });
    }
};

// Delete all notifications
const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        await db.query(
            `
            DELETE FROM notifications
            WHERE user_id = $1
            `,
            [userId]
        );

        res.status(200).json({
            message: "All notifications deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete all notifications error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete notifications",
        });
    }
};

module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteAllNotifications,
};