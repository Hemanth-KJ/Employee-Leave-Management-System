import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import EmployeeDashboard
    from "./pages/employee/EmployeeDashboard";

import ProtectedRoute
    from "./components/ProtectedRoute";

import RoleRoute
    from "./components/RoleRoute";
import ApplyLeave
    from "./pages/employee/ApplyLeave";
import LeaveHistory 
    from "./pages/employee/LeaveHistory";
import ManagerDashboard
    from "./pages/manager/ManagerDashboard";
import ManagerLeaves 
    from "./pages/manager/ManagerLeaves";
import ManagerEmployees 
    from "./pages/manager/ManagerEmployees";
const App = () => {
    return (
        <Routes>

            {/* Public */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* Authenticated */}

            <Route element={<ProtectedRoute />}>

                {/* Employee */}

                <Route element={<RoleRoute allowedRole="employee" />}>

                    <Route
                        path="/employee/dashboard"
                        element={
                            <EmployeeDashboard />
                        }
                    />
                     <Route
                       path="/employee/apply-leave"
                       element={<ApplyLeave />}
                    />
                    <Route
                       path="/employee/leave-history"
                       element={<LeaveHistory />}
                    />

                </Route>


                {/* Manager routes  */}
              <Route element={<RoleRoute allowedRole="manager" />}>

                       <Route
                         path="/manager/dashboard"
                          element={<ManagerDashboard />}
                          />

                      </Route>
                      <Route
                        path="/manager/leaves"
                        element={<ManagerLeaves />}
                      />
                      <Route
                        path="/manager/employees"
                        element={<ManagerEmployees />}
                      />
            </Route>


            {/* Unknown */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
};

export default App;