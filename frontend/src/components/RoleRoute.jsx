import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRole }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== allowedRole) {
        if (role === "manager") {
            return (
                <Navigate
                    to="/manager/dashboard"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/employee/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
};

export default RoleRoute;