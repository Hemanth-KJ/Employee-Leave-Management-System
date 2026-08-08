const express = require("express");

const managerController = require("../controllers/managerController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles("manager"));

router.get(
    "/employees",
    managerController.getEmployees
);

router.get(
    "/leaves",
    managerController.getAllLeaveRequests
);

router.get(
    "/leaves/:id/document",
    managerController.getDocument
);

router.patch(
    "/leaves/:id/status",
    managerController.updateLeaveStatus
);

module.exports = router;