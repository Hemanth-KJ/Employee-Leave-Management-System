import api from "./api";

// Apply for a new leave
export const applyLeave = async (formData) => {
    const response = await api.post(
        "/leaves",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};


// Get logged-in employee's leave requests
export const getMyLeaves = async () => {
    const response = await api.get(
        "/leaves/my"
    );

    return response.data;
};


// Update an existing pending leave
export const updateLeave = async (
    id,
    leaveData
) => {
    const response = await api.put(
        `/leaves/${id}`,
        {
            reason: leaveData.reason,
            startDate: leaveData.startDate,
            endDate: leaveData.endDate,
        }
    );

    return response.data;
};


// Delete an existing pending leave
export const deleteLeave = async (id) => {
    const response = await api.delete(
        `/leaves/${id}`
    );

    return response.data;
};