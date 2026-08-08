const express = require("express");

const notificationController =
    require("../controllers/notificationController");

const authenticateToken =
    require("../middleware/authMiddleware");

const router = express.Router();


// All notification endpoints require authentication
router.use(authenticateToken);


// GET /api/notifications
router.get(
    "/",
    notificationController.getMyNotifications
);


// PATCH /api/notifications/:id/read
router.patch(
    "/:id/read",
    notificationController.markAsRead
);


// PATCH /api/notifications/read-all
router.patch(
    "/read-all",
    notificationController.markAllAsRead
);


module.exports = router;