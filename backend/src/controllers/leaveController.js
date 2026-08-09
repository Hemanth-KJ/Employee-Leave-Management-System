const leaveService = require("../services/leaveService");
const cloudinary = require("cloudinary").v2;

// ========================================
// CREATE LEAVE REQUEST
// ========================================

const createLeaveRequest = async (req, res) => {

    try {

        const {
            reason,
            start_date,
            end_date,
        } = req.body;

        // ========================================
        // VALIDATE REQUIRED FIELDS
        // ========================================

        if (
            !reason ||
            !start_date ||
            !end_date
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Reason, start date, and end date are required",
            });
        }

        // ========================================
        // VALIDATE SUPPORTING DOCUMENT
        // ========================================

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message:
                    "Supporting document is required",
            });
        }

        // ========================================
        // VALIDATE DATE ORDER
        // ========================================

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (endDate < startDate) {

            return res.status(400).json({
                success: false,
                message:
                    "End date cannot be before start date",
            });
        }

        // ========================================
        // EMPLOYEE ID FROM JWT
        // ========================================

        const employeeId = req.user.id;

        // ========================================
        // CREATE LEAVE REQUEST
        // ========================================

        const leaveRequest =
            await leaveService.createLeaveRequest({
                employeeId,
                reason: reason.trim(),
                startDate: start_date,
                endDate: end_date,
                file: req.file,
            });

        // ========================================
        // SUCCESS
        // ========================================

        return res.status(201).json({

            success: true,

            message:
                "Leave request submitted successfully",

            leaveRequest,

        });

    } catch (error) {

        // ========================================
        // DELETE CLOUDINARY FILE
        // IF DATABASE OPERATION FAILS
        // ========================================

        if (
            req.file &&
            req.file.filename
        ) {

            try {

                // ========================================
                // DETERMINE RESOURCE TYPE
                // ========================================

                let resourceType = "image";

                if (
                    req.file.mimetype ===
                    "application/pdf"
                ) {

                    resourceType = "raw";
                }

                // ========================================
                // DELETE CLOUDINARY FILE
                // ========================================

                await cloudinary.uploader.destroy(
                    req.file.filename,
                    {
                        resource_type:
                            resourceType,
                    }
                );

                console.log(
                    "Deleted uploaded Cloudinary file:",
                    req.file.filename
                );

            } catch (fileError) {

                console.error(
                    "Failed to delete uploaded Cloudinary file:",
                    fileError.message
                );
            }
        }

        console.error(
            "Create leave request error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to create leave request",

        });
    }
};

// ========================================
// GET MY LEAVE REQUESTS
// ========================================

const getMyLeaveRequests = async (
    req,
    res
) => {

    try {

        // ========================================
        // EMPLOYEE ID FROM JWT
        // ========================================

        const employeeId = req.user.id;

        // ========================================
        // GET LEAVE REQUESTS
        // ========================================

        const leaveRequests =
            await leaveService.getMyLeaveRequests(
                employeeId
            );

        return res.status(200).json({

            success: true,

            count:
                leaveRequests.length,

            leaveRequests,

        });

    } catch (error) {

        console.error(
            "Get leave history error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to retrieve leave history",

        });
    }
};

// ========================================
// UPDATE LEAVE REQUEST
// ========================================

const updateLeaveRequest = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const {
            reason,
            startDate,
            endDate,
        } = req.body;

        // ========================================
        // VALIDATE REQUIRED FIELDS
        // ========================================

        if (
            !reason ||
            !reason.trim() ||
            !startDate ||
            !endDate
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Reason, start date and end date are required",

            });
        }

        // ========================================
        // VALIDATE DATE ORDER
        // ========================================

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {

            return res.status(400).json({

                success: false,

                message:
                    "End date cannot be before start date",

            });
        }

        // ========================================
        // EMPLOYEE ID FROM JWT
        // ========================================

        const employeeId = req.user.id;

        // ========================================
        // UPDATE LEAVE
        // ========================================

        const leave =
            await leaveService.updateLeaveRequest(
                id,
                employeeId,
                reason.trim(),
                startDate,
                endDate
            );

        // ========================================
        // SUCCESS
        // ========================================

        return res.status(200).json({

            success: true,

            message:
                "Leave request updated successfully",

            leaveRequest: leave,

        });

    } catch (error) {

        console.error(
            "Update leave error:",
            error
        );

        // ========================================
        // NOT FOUND
        // ========================================

        if (
            error.message ===
            "Leave request not found"
        ) {

            return res.status(404).json({

                success: false,

                message:
                    error.message,

            });
        }

        // ========================================
        // ONLY PENDING CAN BE UPDATED
        // ========================================

        if (
            error.message ===
            "Only pending leave requests can be updated"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    error.message,

            });
        }

        return res.status(500).json({

            success: false,

            message:
                "Failed to update leave request",

        });
    }
};

// ========================================
// DELETE LEAVE REQUEST
// ========================================

const deleteLeaveRequest = async (req, res) => {

    try {

        const { id } = req.params;

        // ========================================
        // EMPLOYEE ID FROM JWT
        // ========================================

        const employeeId = req.user.id;

        // ========================================
        // DELETE LEAVE FROM DATABASE
        // ========================================

        const result =
            await leaveService.deleteLeaveRequest(
                id,
                employeeId
            );

        // ========================================
        // DELETE FILE FROM CLOUDINARY
        // ========================================

        if (result.filePublicId) {

            try {

                console.log(
                    "========================================"
                );

                console.log(
                    "Deleting Cloudinary file:",
                    result.filePublicId
                );

                console.log(
                    "Cloudinary resource type: image"
                );

                // ========================================
                // DELETE CLOUDINARY RESOURCE
                // ========================================

                const cloudinaryResult =
                    await cloudinary.uploader.destroy(
                        result.filePublicId,
                        {
                            resource_type: "image",
                        }
                    );

                console.log(
                    "Cloudinary delete result:",
                    cloudinaryResult
                );

                console.log(
                    "========================================"
                );

            } catch (fileError) {

                console.error(
                    "Failed to delete Cloudinary file:",
                    fileError.message
                );
            }
        }

        // ========================================
        // SUCCESS RESPONSE
        // ========================================

        return res.status(200).json({

            success: true,

            message:
                "Leave request and supporting document deleted successfully",

        });

    } catch (error) {

        console.error(
            "Delete leave error:",
            error
        );

        // ========================================
        // NOT FOUND
        // ========================================

        if (
            error.message ===
            "Leave request not found"
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Leave request not found",

            });
        }

        // ========================================
        // ONLY PENDING CAN BE DELETED
        // ========================================

        if (
            error.message ===
            "Only pending leave requests can be deleted"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    error.message,

            });
        }

        // ========================================
        // SERVER ERROR
        // ========================================

        return res.status(500).json({

            success: false,

            message:
                "Failed to delete leave request",

        });
    }
};

// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
    createLeaveRequest,
    getMyLeaveRequests,
    updateLeaveRequest,
    deleteLeaveRequest,
};