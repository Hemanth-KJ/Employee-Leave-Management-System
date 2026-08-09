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
// DELETE EMPLOYEE
// ======================================================

const deleteEmployee = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        // ==================================================
        // VALIDATE UUID
        // ==================================================

        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!uuidRegex.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID",
            });
        }


        // ==================================================
        // GET EMPLOYEE + DOCUMENT FILES
        // ==================================================

        const employeeResult = await client.query(
            `
            SELECT
                id,
                username,
                role
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (employeeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        const employee = employeeResult.rows[0];


        // ==================================================
        // SAFETY CHECK
        // ONLY EMPLOYEES CAN BE DELETED
        // ==================================================

        if (employee.role !== "employee") {
            return res.status(403).json({
                success: false,
                message: "Only employee accounts can be deleted",
            });
        }


        // ==================================================
        // GET DOCUMENT FILE PATHS
        // ==================================================

        const documentsResult = await client.query(
            `
            SELECT
                ld.file_path
            FROM leave_documents ld
            INNER JOIN leave_requests lr
                ON ld.leave_request_id = lr.id
            WHERE lr.employee_id = $1
            `,
            [id]
        );

        const filePaths = documentsResult.rows
            .map((document) => document.file_path)
            .filter(Boolean);


        // ==================================================
        // START TRANSACTION
        // ==================================================

        await client.query("BEGIN");


        // ==================================================
        // DELETE EMPLOYEE
        //
        // PostgreSQL CASCADE automatically deletes:
        //
        // users
        //   ↓
        // leave_requests
        //   ↓
        // leave_documents
        //
        // users
        //   ↓
        // notifications
        // ==================================================

        const deleteResult = await client.query(
            `
            DELETE FROM users
            WHERE id = $1
              AND role = 'employee'
            RETURNING
                id,
                username
            `,
            [id]
        );


        if (deleteResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }


        // ==================================================
        // COMMIT DATABASE TRANSACTION
        // ==================================================

        await client.query("COMMIT");


        // ==================================================
        // DELETE PHYSICAL UPLOADED FILES
        //
        // Database records have already been deleted.
        // Missing files are safely ignored.
        // ==================================================

        const fileDeleteResults = await Promise.allSettled(
            filePaths.map(async (filePath) => {
                try {
                    const absolutePath =
                        path.resolve(filePath);

                    await fs.promises.unlink(
                        absolutePath
                    );

                    return {
                        success: true,
                        filePath,
                    };

                } catch (error) {

                    // File may already have been removed.
                    if (error.code === "ENOENT") {
                        return {
                            success: true,
                            filePath,
                        };
                    }

                    throw error;
                }
            })
        );


        // ==================================================
        // LOG FILE CLEANUP WARNINGS
        // ==================================================

        fileDeleteResults.forEach((result) => {

            if (result.status === "rejected") {
                console.warn(
                    "Failed to delete employee document:",
                    result.reason
                );
            }

        });


        // ==================================================
        // SUCCESS
        // ==================================================

        return res.status(200).json({
            success: true,
            message:
                `Employee "${employee.username}" deleted successfully`,
            employee: deleteResult.rows[0],
        });

    } catch (error) {

        // ==================================================
        // ROLLBACK IF TRANSACTION IS STILL ACTIVE
        // ==================================================

        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(
                "Rollback error:",
                rollbackError
            );
        }


        console.error(
            "Delete employee error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Failed to delete employee",
        });

    } finally {

        client.release();
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
            message:
                "Failed to retrieve leave requests",
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
                message: "Document not found",
            });
        }

        const document = result.rows[0];

        // ==============================================
        // CLOUDINARY FILE
        // ==============================================

        if (!document.file_path) {
            return res.status(404).json({
                success: false,
                message: "Document URL not found",
            });
        }

        console.log("========================================");
        console.log("Opening Cloudinary document:");
        console.log(document.file_path);
        console.log("========================================");

        // ==============================================
        // RETURN CLOUDINARY URL
        // ==============================================

        return res.status(200).json({
            success: true,
            originalName: document.original_name,
            mimeType: document.mime_type,
            fileUrl: document.file_path,
        });

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
    deleteEmployee,
    getAllLeaveRequests,
    updateLeaveStatus,
    getDocument,
};