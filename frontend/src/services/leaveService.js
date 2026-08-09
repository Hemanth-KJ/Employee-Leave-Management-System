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
export const updateLeave = async (id, leaveData) => {

    const formData = new FormData();

    formData.append("reason", leaveData.reason);
    formData.append("startDate", leaveData.startDate);
    formData.append("endDate", leaveData.endDate);

    if (leaveData.document) {
        formData.append("document", leaveData.document);
    }

    console.log("========== UPDATE FORM DATA ==========");
    console.log("File:", leaveData.document);
    console.log("File name:", leaveData.document?.name);
    console.log("File type:", leaveData.document?.type);
    console.log("======================================");

    const response = await api.put(
        `/leaves/${id}`,
        formData
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