const pool = require("../config/db");

const createLeaveRequest = async ({
    employeeId,
    reason,
    startDate,
    endDate,
    file,
}) => {
    const client = await pool.connect();

    try {
        // Start transaction
        await client.query("BEGIN");

        // 1. Create leave request
        const leaveResult = await client.query(
            `
            INSERT INTO leave_requests (
                employee_id,
                reason,
                start_date,
                end_date
            )
            VALUES ($1, $2, $3, $4)
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
                employeeId,
                reason,
                startDate,
                endDate,
            ]
        );

        const leaveRequest = leaveResult.rows[0];

        // 2. Save document metadata
        if (file) {
            await client.query(
                `
                INSERT INTO leave_documents (
                    leave_request_id,
                    original_name,
                    stored_name,
                    file_path,
                    mime_type,
                    file_size
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                [
                    leaveRequest.id,
                    file.originalname,
                    file.filename,
                    file.path,
                    file.mimetype,
                    file.size,
                ]
            );
        }

        // Commit transaction
        await client.query("COMMIT");

        return leaveRequest;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};


// ========================================
// GET MY LEAVE REQUESTS
// ========================================

const getMyLeaveRequests = async (employeeId) => {
    const result = await pool.query(
        `
        SELECT
            lr.id,
            lr.reason,
            lr.start_date,
            lr.end_date,
            lr.status,
            lr.remarks,
            lr.reviewed_at,
            lr.created_at,

            ld.original_name,
            ld.stored_name,
            ld.file_path,
            ld.mime_type,
            ld.file_size

        FROM leave_requests lr

        LEFT JOIN leave_documents ld
            ON lr.id = ld.leave_request_id

        WHERE lr.employee_id = $1

        ORDER BY lr.created_at DESC
        `,
        [employeeId]
    );

    return result.rows;
};


// ========================================
// UPDATE LEAVE REQUEST
// ========================================

const updateLeaveRequest = async (req, res) => {

    let uploadedNewFile = null;

    try {

        const { id } = req.params;

        const {
            reason,
            startDate,
            endDate
        } = req.body;

        uploadedNewFile = req.file || null;

        if (
            !reason ||
            !reason.trim() ||
            !startDate ||
            !endDate
        ) {

            // If validation fails after upload,
            // remove newly uploaded file
            if (
                uploadedNewFile &&
                fs.existsSync(uploadedNewFile.path)
            ) {
                fs.unlinkSync(
                    uploadedNewFile.path
                );
            }

            return res.status(400).json({
                success: false,
                message:
                    "Reason, start date and end date are required"
            });
        }


        if (endDate < startDate) {

            if (
                uploadedNewFile &&
                fs.existsSync(uploadedNewFile.path)
            ) {
                fs.unlinkSync(
                    uploadedNewFile.path
                );
            }

            return res.status(400).json({
                success: false,
                message:
                    "End date cannot be before start date"
            });
        }


        // JWT user ID
        const employeeId = req.user.id;


        const result =
            await leaveService.updateLeaveRequest(
                id,
                employeeId,
                reason.trim(),
                startDate,
                endDate,
                uploadedNewFile
            );


        // Delete old physical file
        if (
            result.oldFilePath &&
            fs.existsSync(result.oldFilePath)
        ) {

            fs.unlinkSync(
                result.oldFilePath
            );

            console.log(
                "Old document deleted:",
                result.oldFilePath
            );
        }


        return res.status(200).json({

            success: true,

            message:
                "Leave request updated successfully",

            leaveRequest:
                result.leaveRequest

        });


    } catch (error) {

        // If database update failed,
        // remove newly uploaded file
        if (
            uploadedNewFile &&
            fs.existsSync(uploadedNewFile.path)
        ) {

            try {

                fs.unlinkSync(
                    uploadedNewFile.path
                );

            } catch (fileError) {

                console.error(
                    "Failed to remove uploaded file:",
                    fileError
                );
            }
        }


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

                message:
                    "Leave request not found"

            });
        }


        if (
            error.message ===
            "Only pending leave requests can be updated"
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
                "Failed to update leave request"

        });
    }
};

// ========================================
// DELETE LEAVE REQUEST
// ========================================

const deleteLeaveRequest = async (leaveId, employeeId) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Get leave + document information
        const existing = await client.query(
            `
            SELECT
                lr.id,
                lr.status,
                ld.file_path
            FROM leave_requests lr

            LEFT JOIN leave_documents ld
                ON lr.id = ld.leave_request_id

            WHERE lr.id = $1
            AND lr.employee_id = $2
            `,
            [leaveId, employeeId]
        );

        if (existing.rows.length === 0) {

            throw new Error(
                "Leave request not found"
            );
        }

        const leave = existing.rows[0];

        // Only pending requests can be deleted
        if (leave.status !== "pending") {

            throw new Error(
                "Only pending leave requests can be deleted"
            );
        }

        // Delete leave request
        // leave_documents will be deleted automatically
        // because of ON DELETE CASCADE
        await client.query(
            `
            DELETE FROM leave_requests
            WHERE id = $1
            AND employee_id = $2
            AND status = 'pending'
            `,
            [leaveId, employeeId]
        );

        await client.query("COMMIT");

        return {
            success: true,
            filePath: leave.file_path
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
    createLeaveRequest,
    getMyLeaveRequests,
    updateLeaveRequest,
    deleteLeaveRequest,
};