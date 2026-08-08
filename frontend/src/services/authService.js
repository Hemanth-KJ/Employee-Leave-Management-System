import api from "./api";

export const register = async (userData) => {
    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
};

export const login = async (userData) => {
    const response = await api.post(
        "/auth/login",
        userData
    );

    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
};

export const getStoredUser = () => {
    try {
        return JSON.parse(
            localStorage.getItem("user")
        );
    } catch {
        return null;
    }
};