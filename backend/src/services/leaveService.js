const pool = require("../config/db");
const cloudinary = require("cloudinary").v2;

// ========================================
// CREATE LEAVE REQUEST
// ========================================

const createLeaveRequest = async ({
    employeeId,
    reason,
    startDate,
    endDate,
    file,
}) => {

    const client = await pool.connect();

    try {

        // ========================================
        // START TRANSACTION
        // ========================================

        await client.query("BEGIN");

        // ========================================
        // 1. GET EMPLOYEE DETAILS
        // ========================================

        const employeeResult = await client.query(
            `
            SELECT
                id,
                username
            FROM users
            WHERE id = $1
            `,
            [employeeId]
        );

        if (employeeResult.rows.length === 0) {

            throw new Error(
                "Employee not found"
            );
        }

        const employee = employeeResult.rows[0];

        // ========================================
        // 2. CREATE LEAVE REQUEST
        // ========================================

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

        const leaveRequest =
            leaveResult.rows[0];

        // ========================================
        // 3. SAVE SUPPORTING DOCUMENT
        // ========================================

        if (file) {

            console.log(
                "========== CLOUDINARY FILE =========="
            );

            console.log(
                "Original name:",
                file.originalname
            );

            console.log(
                "Filename / Public ID:",
                file.filename
            );

            console.log(
                "Path:",
                file.path
            );

            console.log(
                "MIME type:",
                file.mimetype
            );

            console.log(
                "Size:",
                file.size
            );

            console.log(
                "===================================="
            );

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

        // ========================================
        // 4. FIND ALL MANAGERS
        // ========================================

        const managerResult = await client.query(
            `
            SELECT
                id,
                username
            FROM users
            WHERE LOWER(role) = 'manager'
            `
        );

        // ========================================
        // 5. CREATE NOTIFICATION MESSAGE
        // ========================================

        const employeeName =
            employee.username || "Employee";

        const notificationMessage =
            `New leave request submitted by ${employeeName} from ${startDate} to ${endDate}.`;

        // ========================================
        // 6. CREATE NOTIFICATION FOR EACH MANAGER
        // ========================================

        for (
            const manager of managerResult.rows
        ) {

            await client.query(
                `
                INSERT INTO notifications (
                    user_id,
                    message,
                    is_read,
                    created_at
                )
                VALUES ($1, $2, false, NOW())
                `,
                [
                    manager.id,
                    notificationMessage,
                ]
            );
        }

        // ========================================
        // 7. COMMIT TRANSACTION
        // ========================================

        await client.query("COMMIT");

        return leaveRequest;

    } catch (error) {

        // ========================================
        // ROLLBACK TRANSACTION
        // ========================================

        await client.query("ROLLBACK");

        console.error(
            "Create leave request service error:",
            error
        );

        throw error;

    } finally {

        client.release();
    }
};


// ========================================
// GET MY LEAVE REQUESTS
// ========================================

const getMyLeaveRequests = async (
    employeeId
) => {

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

const updateLeaveRequest = async (
    leaveId,
    employeeId,
    reason,
    startDate,
    endDate,
    file
) => {

    const client = await pool.connect();

    try {

        // ========================================
        // START TRANSACTION
        // ========================================

        await client.query("BEGIN");

        // ========================================
        // 1. GET EXISTING LEAVE + DOCUMENT
        // ========================================

        const existingResult =
            await client.query(
                `
                SELECT
                    lr.id AS leave_id,
                    lr.status,

                    ld.id AS document_id,
                    ld.original_name,
                    ld.stored_name,
                    ld.file_path,
                    ld.mime_type,
                    ld.file_size

                FROM leave_requests lr

                LEFT JOIN leave_documents ld
                    ON lr.id = ld.leave_request_id

                WHERE lr.id = $1
                AND lr.employee_id = $2
                `,
                [
                    leaveId,
                    employeeId,
                ]
            );

        // ========================================
        // CHECK LEAVE EXISTS
        // ========================================

        if (
            existingResult.rows.length === 0
        ) {

            throw new Error(
                "Leave request not found"
            );
        }

        const existing =
            existingResult.rows[0];

        // ========================================
        // ONLY PENDING LEAVES CAN BE UPDATED
        // ========================================

        if (
            existing.status !== "pending"
        ) {

            throw new Error(
                "Only pending leave requests can be updated"
            );
        }

        // ========================================
        // SAVE OLD CLOUDINARY INFORMATION
        // ========================================

        const oldFilePublicId =
            existing.stored_name;

        const oldMimeType =
            existing.mime_type;

        // ========================================
        // 2. UPDATE LEAVE REQUEST
        // ========================================

        const updateResult =
            await client.query(
                `
                UPDATE leave_requests
                SET
                    reason = $1,
                    start_date = $2,
                    end_date = $3
                WHERE id = $4
                AND employee_id = $5
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
                    reason,
                    startDate,
                    endDate,
                    leaveId,
                    employeeId,
                ]
            );

        const leaveRequest =
            updateResult.rows[0];

        // ========================================
        // 3. NEW FILE WAS UPLOADED
        // ========================================

        if (file) {

            console.log(
                "========================================"
            );

            console.log(
                "NEW FILE UPLOADED TO CLOUDINARY"
            );

            console.log(
                "Original name:",
                file.originalname
            );

            console.log(
                "New Public ID:",
                file.filename
            );

            console.log(
                "New URL:",
                file.path
            );

            console.log(
                "MIME type:",
                file.mimetype
            );

            console.log(
                "========================================"
            );

            // ========================================
            // UPDATE EXISTING DOCUMENT
            // ========================================

            if (existing.document_id) {

                await client.query(
                    `
                    UPDATE leave_documents
                    SET
                        original_name = $1,
                        stored_name = $2,
                        file_path = $3,
                        mime_type = $4,
                        file_size = $5
                    WHERE id = $6
                    `,
                    [
                        file.originalname,
                        file.filename,
                        file.path,
                        file.mimetype,
                        file.size,
                        existing.document_id,
                    ]
                );

            }

            // ========================================
            // IF DOCUMENT DOES NOT EXIST
            // ========================================

            else {

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
                        leaveId,
                        file.originalname,
                        file.filename,
                        file.path,
                        file.mimetype,
                        file.size,
                    ]
                );
            }
        }

        // ========================================
        // 4. COMMIT DATABASE
        // ========================================

        await client.query("COMMIT");

        // ========================================
        // 5. RETURN DATA
        // ========================================

        return {

            ...leaveRequest,

            oldFilePublicId:
                file
                    ? oldFilePublicId
                    : null,

            oldMimeType:
                file
                    ? oldMimeType
                    : null,

            newFilePublicId:
                file
                    ? file.filename
                    : null,

        };

    } catch (error) {

        // ========================================
        // ROLLBACK
        // ========================================

        await client.query("ROLLBACK");

        console.error(
            "Update leave request service error:",
            error
        );

        // ========================================
        // DELETE NEW FILE IF DATABASE FAILED
        // ========================================

        if (
            file &&
            file.filename
        ) {

            try {

                let resourceType = "image";

                if (
                    file.mimetype ===
                    "application/pdf"
                ) {
                    resourceType = "raw";
                }

                await cloudinary.uploader.destroy(
                    file.filename,
                    {
                        resource_type:
                            resourceType,
                    }
                );

                console.log(
                    "Deleted NEW Cloudinary file after database failure:",
                    file.filename
                );

            } catch (cleanupError) {

                console.error(
                    "Failed to cleanup NEW Cloudinary file:",
                    cleanupError.message
                );
            }
        }

        throw error;

    } finally {

        client.release();
    }
};


// ========================================
// DELETE LEAVE REQUEST
// ========================================

const deleteLeaveRequest = async (
    leaveId,
    employeeId
) => {

    const client = await pool.connect();

    try {

        // ========================================
        // START TRANSACTION
        // ========================================

        await client.query("BEGIN");

        // ========================================
        // 1. GET LEAVE + DOCUMENT
        // ========================================

        const existing =
            await client.query(
                `
                SELECT
                    lr.id,
                    lr.status,

                    ld.file_path,
                    ld.stored_name,
                    ld.mime_type

                FROM leave_requests lr

                LEFT JOIN leave_documents ld
                    ON lr.id = ld.leave_request_id

                WHERE lr.id = $1
                AND lr.employee_id = $2
                `,
                [
                    leaveId,
                    employeeId,
                ]
            );

        // ========================================
        // 2. CHECK LEAVE EXISTS
        // ========================================

        if (
            existing.rows.length === 0
        ) {

            throw new Error(
                "Leave request not found"
            );
        }

        const leave =
            existing.rows[0];

        // ========================================
        // 3. ONLY PENDING LEAVES CAN BE DELETED
        // ========================================

        if (
            leave.status !== "pending"
        ) {

            throw new Error(
                "Only pending leave requests can be deleted"
            );
        }

        // ========================================
        // 4. LOG FILE INFORMATION
        // ========================================

        console.log(
            "========== DELETE CLOUDINARY FILE =========="
        );

        console.log(
            "File Public ID:",
            leave.stored_name
        );

        console.log(
            "File Path:",
            leave.file_path
        );

        console.log(
            "MIME Type:",
            leave.mime_type
        );

        console.log(
            "============================================"
        );

        // ========================================
        // 5. DELETE LEAVE REQUEST
        // ========================================

        await client.query(
            `
            DELETE FROM leave_requests
            WHERE id = $1
            AND employee_id = $2
            AND status = 'pending'
            `,
            [
                leaveId,
                employeeId,
            ]
        );

        // ========================================
        // 6. COMMIT
        // ========================================

        await client.query("COMMIT");

        // ========================================
        // 7. RETURN CLOUDINARY INFORMATION
        // ========================================

        return {

            success: true,

            filePath:
                leave.file_path,

            filePublicId:
                leave.stored_name,

            mimeType:
                leave.mime_type,

        };

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Delete leave request service error:",
            error
        );

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