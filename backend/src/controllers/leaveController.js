const leaveService = require("../services/leaveService");
const fs = require("fs");


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

        // Validate required fields
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

        // Validate supporting document
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "Supporting document is required",
            });
        }

        // Validate date order
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (endDate < startDate) {
            return res.status(400).json({
                success: false,
                message:
                    "End date cannot be before start date",
            });
        }

        // Employee ID comes from JWT
        const employeeId = req.user.id;

        const leaveRequest =
            await leaveService.createLeaveRequest({
                employeeId,
                reason: reason.trim(),
                startDate: start_date,
                endDate: end_date,
                file: req.file,
            });

        return res.status(201).json({
            success: true,
            message:
                "Leave request submitted successfully",
            leaveRequest,
        });

    } catch (error) {

        // Delete uploaded file if database operation fails
        if (
            req.file &&
            req.file.path
        ) {
            try {
                if (
                    fs.existsSync(
                        req.file.path
                    )
                ) {
                    fs.unlinkSync(
                        req.file.path
                    );
                }
            } catch (fileError) {
                console.error(
                    "Failed to delete uploaded file:",
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
        // Employee ID comes from JWT
        const employeeId = req.user.id;

        const leaveRequests =
            await leaveService.getMyLeaveRequests(
                employeeId
            );

        return res.status(200).json({
            success: true,
            count: leaveRequests.length,
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

        // Validate required fields
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

        // Validate date order
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            return res.status(400).json({
                success: false,
                message:
                    "End date cannot be before start date",
            });
        }

        // Employee ID comes from JWT
        const employeeId = req.user.id;

        const leave =
            await leaveService.updateLeaveRequest(
                id,
                employeeId,
                reason.trim(),
                startDate,
                endDate
            );

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

        if (
            error.message ===
            "Leave request not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (
            error.message ===
            "Only pending leave requests can be updated"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message,
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

        // User ID comes from JWT
        const employeeId = req.user.id;

        const result =
            await leaveService.deleteLeaveRequest(
                id,
                employeeId
            );


        // Delete physical uploaded file
        if (
            result.filePath &&
            fs.existsSync(result.filePath)
        ) {

            fs.unlinkSync(
                result.filePath
            );

            console.log(
                "Deleted uploaded file:",
                result.filePath
            );
        }


        return res.status(200).json({

            success: true,

            message:
                "Leave request and supporting document deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete leave error:",
            error
        );


        if (
            error.message ===
            "Leave request not found"
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Leave request not found"

            });
        }


        if (
            error.message ===
            "Only pending leave requests can be deleted"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    error.message

            });
        }


        return res.status(500).json({

            success: false,

            message:
                "Failed to delete leave request"

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