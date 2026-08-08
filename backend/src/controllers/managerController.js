const pool = require("../config/db");
const fs = require("fs");
const path = require("path");


// ======================================================
// GET ALL EMPLOYEES
// ======================================================

const getEmployees = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                id,
                username,
                created_at
            FROM users
            WHERE role = 'employee'
            ORDER BY created_at DESC
            `
        );

        return res.status(200).json({
            success: true,
            employees: result.rows,
        });

    } catch (error) {
        console.error(
            "Get employees error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve employees",
        });
    }
};


// ======================================================
// GET ALL LEAVE REQUESTS
// ======================================================

const getAllLeaveRequests = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                lr.id,
                lr.employee_id,
                u.username AS employee_username,
                lr.reason,
                lr.start_date,
                lr.end_date,
                lr.status,
                lr.remarks,
                lr.reviewed_at,
                lr.created_at,

                ld.id AS document_id,
                ld.original_name,
                ld.stored_name,
                ld.file_path,
                ld.mime_type,
                ld.file_size

            FROM leave_requests lr

            INNER JOIN users u
                ON lr.employee_id = u.id

            LEFT JOIN leave_documents ld
                ON lr.id = ld.leave_request_id

            ORDER BY lr.created_at DESC
            `
        );

        return res.status(200).json({
            success: true,
            leaveRequests: result.rows,
        });

    } catch (error) {
        console.error(
            "Get leave requests error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve leave requests",
        });
    }
};


// ======================================================
// UPDATE LEAVE STATUS
// ======================================================

const updateLeaveStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status, remarks } =
            req.body;


        if (
            !["approved", "rejected"]
                .includes(status)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Status must be approved or rejected",
            });

        }


        if (
            !remarks ||
            !remarks.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Remarks are required",
            });

        }


        const existing =
            await pool.query(
                `
                SELECT
                    id,
                    employee_id,
                    status
                FROM leave_requests
                WHERE id = $1
                `,
                [id]
            );


        if (existing.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Leave request not found",
            });

        }


        const leave =
            existing.rows[0];


        if (
            leave.status !== "pending"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Only pending leave requests can be reviewed",
            });

        }


        const client =
            await pool.connect();


        try {

            await client.query(
                "BEGIN"
            );


            // =========================
            // UPDATE LEAVE
            // =========================

            const result =
                await client.query(
                    `
                    UPDATE leave_requests
                    SET
                        status = $1,
                        remarks = $2,
                        reviewed_at = NOW()
                    WHERE id = $3
                    RETURNING
                        id,
                        employee_id,
                        reason,
                        start_date,
                        end_date,
                        status,
                        remarks,
                        reviewed_at,
                        created_at
                    `,
                    [
                        status,
                        remarks.trim(),
                        id,
                    ]
                );


            // =========================
            // CREATE NOTIFICATION
            // =========================

            const message =
                status === "approved"
                    ? "Your leave request has been approved."
                    : "Your leave request has been rejected.";


            await client.query(
                `
                INSERT INTO notifications (
                    user_id,
                    message,
                    is_read
                )
                VALUES (
                    $1,
                    $2,
                    FALSE
                )
                `,
                [
                    leave.employee_id,
                    message,
                ]
            );


            await client.query(
                "COMMIT"
            );


            return res.status(200).json({

                success: true,

                message:
                    `Leave request ${status} successfully`,

                leaveRequest:
                    result.rows[0],

            });


        } catch (error) {

            await client.query(
                "ROLLBACK"
            );

            throw error;

        } finally {

            client.release();

        }


    } catch (error) {

        console.error(
            "Update leave status error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to update leave request",

        });

    }
};


// ======================================================
// GET SUPPORTING DOCUMENT
// ======================================================

const getDocument = async (req, res) => {
    try {

        const { id } = req.params;


        const result = await pool.query(
            `
            SELECT
                original_name,
                file_path,
                mime_type
            FROM leave_documents
            WHERE leave_request_id = $1
            `,
            [id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Document not found",
            });
        }


        const document =
            result.rows[0];


        // Check file exists

        if (
            !fs.existsSync(
                document.file_path
            )
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "File not found on server",
            });
        }


        // Content type

        res.setHeader(
            "Content-Type",
            document.mime_type ||
                "application/octet-stream"
        );


        // Display file in browser

        res.setHeader(
            "Content-Disposition",
            `inline; filename="${document.original_name}"`
        );


        return res.sendFile(
            path.resolve(
                document.file_path
            )
        );


    } catch (error) {

        console.error(
            "Get document error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to retrieve document",
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getEmployees,
    getAllLeaveRequests,
    updateLeaveStatus,
    getDocument,
};