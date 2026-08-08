import api from "./api";

export const getEmployees = async () => {
    const response = await api.get("/manager/employees");
    return response.data;
};

export const getAllLeaves = async () => {
    const response = await api.get("/manager/leaves");
    return response.data;
};

export const updateLeaveStatus = async (
    id,
    status,
    remarks
) => {
    const response = await api.patch(
        `/manager/leaves/${id}/status`,
        {
            status,
            remarks,
        }
    );

    return response.data;
};

export const getLeaveDocument = async (leaveId) => {
    const response = await api.get(
        `/manager/leaves/${leaveId}/document`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};