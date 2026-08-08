const express = require("express");

const leaveController = require("../controllers/leaveController");
const authenticateToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

/**
 * Employee applies for leave
 */
router.post(
    "/",
    authenticateToken,
    upload.single("document"),
    leaveController.createLeaveRequest
);
// Employee leave history
router.get(
    "/my",
    authenticateToken,
    leaveController.getMyLeaveRequests
);
router.put(
    "/:id",
    authenticateToken,
    upload.single("document"),
    leaveController.updateLeaveRequest
);

router.delete(
    "/:id",
    authenticateToken,
    leaveController.deleteLeaveRequest
);

module.exports = router;