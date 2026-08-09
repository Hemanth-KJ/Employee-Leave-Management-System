import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Users,
    FileText,
    Clock3,
    CheckCircle,
    XCircle,
    LogOut,
    RefreshCw,
    UserRound,
    ArrowRight,
} from "lucide-react";

import {
    getEmployees,
    getAllLeaves,
} from "../../services/managerService";

import { logout } from "../../services/authService";

import ThemeToggle from "../../components/ThemeToggle";
import NotificationDropdown from "../../components/NotificationDropdown";

const ManagerDashboard = () => {
    const navigate = useNavigate();

    // ========================================
    // STATE
    // ========================================

    const [employees, setEmployees] = useState([]);
    const [leaves, setLeaves] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const username =
        localStorage.getItem("username") || "Manager";

    // ========================================
    // FETCH DASHBOARD DATA
    // ========================================

    useEffect(() => {
        let cancelled = false;

        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    employeeData,
                    leaveData,
                ] = await Promise.all([
                    getEmployees(),
                    getAllLeaves(),
                ]);

                if (cancelled) {
                    return;
                }

                setEmployees(
                    employeeData?.employees || []
                );

                setLeaves(
                    leaveData?.leaveRequests || []
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Manager dashboard error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Failed to load manager dashboard."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    // ========================================
    // MANUAL REFRESH
    // ========================================

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                employeeData,
                leaveData,
            ] = await Promise.all([
                getEmployees(),
                getAllLeaves(),
            ]);

            setEmployees(
                employeeData?.employees || []
            );

            setLeaves(
                leaveData?.leaveRequests || []
            );
        } catch (error) {
            console.error(
                "Manager dashboard refresh error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to load manager dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // ========================================
    // STATISTICS
    // ========================================

    const pendingCount = leaves.filter(
        (leave) =>
            leave.status === "pending"
    ).length;

    const approvedCount = leaves.filter(
        (leave) =>
            leave.status === "approved"
    ).length;

    const rejectedCount = leaves.filter(
        (leave) =>
            leave.status === "rejected"
    ).length;

    // ========================================
    // RENDER
    // ========================================

    return (
        <div
            className="
                min-h-screen
                bg-slate-50
                text-slate-900
                transition-colors
                duration-300

                dark:bg-slate-950
                dark:text-white
            "
        >
            {/* =========================================
                NAVBAR
            ========================================= */}

            <header
                className="
                    sticky
                    top-0
                    z-40
                    border-b
                    border-slate-200/80
                    bg-white/80
                    backdrop-blur-xl

                    dark:border-slate-800
                    dark:bg-slate-950/80
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        max-w-7xl
                        items-center
                        justify-between
                        px-4
                        py-4
                        sm:px-6
                        lg:px-8
                    "
                >
                    {/* BRAND */}

                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                font-bold
                                text-white
                                shadow-lg
                                shadow-blue-600/20
                            "
                        >
                            EL
                        </div>

                        <div>
                            <p
                                className="
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Employee Leave
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Manager Portal
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            sm:gap-4
                        "
                    >
                        {/* NOTIFICATIONS */}

                        <NotificationDropdown />

                        {/* THEME */}

                        <ThemeToggle />

                        {/* USER */}

                        <div
                            className="
                                hidden
                                items-center
                                gap-3
                                sm:flex
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-500/10
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            >
                                <UserRound size={17} />
                            </div>

                            <div>
                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-slate-800
                                        dark:text-white
                                    "
                                >
                                    {username}
                                </p>

                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    Manager
                                </p>
                            </div>
                        </div>

                        {/* LOGOUT */}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                px-3
                                py-2
                                text-sm
                                font-medium
                                text-slate-600
                                transition

                                hover:border-red-200
                                hover:bg-red-50
                                hover:text-red-600

                                dark:border-slate-800
                                dark:text-slate-400
                                dark:hover:border-red-500/30
                                dark:hover:bg-red-500/10
                                dark:hover:text-red-400
                            "
                        >
                            <LogOut size={16} />

                            <span className="hidden sm:inline">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* =========================================
                MAIN
            ========================================= */}

            <main
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                    lg:py-10
                "
            >
                {/* =========================================
                    HERO / PAGE HEADING
                ========================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-gradient-to-br
                        from-blue-50
                        via-white
                        to-indigo-50
                        p-6
                        shadow-sm

                        dark:border-slate-800
                        dark:from-blue-600/10
                        dark:via-slate-900
                        dark:to-indigo-600/10

                        sm:p-8
                    "
                >
                    {/* DECORATIVE CIRCLE */}

                    <div
                        className="
                            absolute
                            -right-20
                            -top-24
                            h-64
                            w-64
                            rounded-full
                            bg-blue-500/10
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-24
                            -left-20
                            h-56
                            w-56
                            rounded-full
                            bg-indigo-500/10
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            relative
                            flex
                            flex-col
                            justify-between
                            gap-6
                            sm:flex-row
                            sm:items-end
                        "
                    >
                        <div>
                            {/* BADGE */}

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-blue-200
                                    bg-blue-50
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    text-blue-600

                                    dark:border-blue-500/20
                                    dark:bg-blue-500/10
                                    dark:text-blue-400
                                "
                            >
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-blue-500
                                    "
                                />

                                Manager Portal
                            </div>

                            {/* TITLE */}

                            <h1
                                className="
                                    mt-4
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                    dark:text-white
                                    sm:text-4xl
                                "
                            >
                                Welcome, {username}
                            </h1>

                            {/* DESCRIPTION */}

                            <p
                                className="
                                    mt-3
                                    max-w-2xl
                                    text-sm
                                    leading-6
                                    text-slate-500
                                    dark:text-slate-400
                                    sm:text-base
                                "
                            >
                                Manage employees, review
                                leave applications, and
                                monitor approval activity
                                from one place.
                            </p>
                        </div>
                    </div>
                </section>

                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (
                    <div
                        className="
                            mt-6
                            flex
                            flex-col
                            gap-3
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4

                            dark:border-red-500/20
                            dark:bg-red-500/10

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-red-100
                                    text-red-600

                                    dark:bg-red-500/10
                                    dark:text-red-400
                                "
                            >
                                <XCircle size={18} />
                            </div>

                            <p
                                className="
                                    text-sm
                                    text-red-600
                                    dark:text-red-400
                                "
                            >
                                {error}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadDashboard}
                            className="
                                text-left
                                text-sm
                                font-semibold
                                text-red-600
                                transition
                                hover:text-red-800

                                dark:text-red-300
                                dark:hover:text-white
                            "
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* =========================================
                    STATISTICS
                ========================================= */}

                <section className="mt-8">
                    {/* SECTION HEADER */}

                    <div
                        className="
                            mb-4
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Overview
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Current leave management
                                statistics
                            </p>
                        </div>

                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={loadDashboard}
                            disabled={loading}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-slate-600
                                shadow-sm
                                transition

                                hover:border-blue-200
                                hover:bg-blue-50
                                hover:text-blue-600

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:text-slate-400
                                dark:hover:border-blue-500/30
                                dark:hover:bg-blue-500/10
                                dark:hover:text-blue-400
                            "
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            {loading
                                ? "Refreshing..."
                                : "Refresh"}
                        </button>
                    </div>

                    {/* STAT CARDS */}

                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-4
                        "
                    >
                        {/* EMPLOYEES */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-blue-200
                                hover:shadow-lg
                                hover:shadow-blue-500/5

                                dark:border-slate-800
                                dark:bg-slate-900
                                dark:hover:border-blue-500/30
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-500/10
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                >
                                    <Users size={22} />
                                </div>

                                <span
                                    className="
                                        text-xs
                                        font-medium
                                        text-slate-400
                                    "
                                >
                                    Total
                                </span>
                            </div>

                            <p
                                className="
                                    mt-5
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Employees
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-3xl
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {loading
                                    ? "..."
                                    : employees.length}
                            </p>
                        </div>

                        {/* PENDING */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-yellow-200
                                hover:shadow-lg

                                dark:border-slate-800
                                dark:bg-slate-900
                                dark:hover:border-yellow-500/30
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-yellow-500/10
                                        text-yellow-600
                                        dark:text-yellow-400
                                    "
                                >
                                    <Clock3 size={22} />
                                </div>

                                <span
                                    className="
                                        text-xs
                                        font-medium
                                        text-slate-400
                                    "
                                >
                                    Pending
                                </span>
                            </div>

                            <p
                                className="
                                    mt-5
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Pending Requests
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-3xl
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {loading
                                    ? "..."
                                    : pendingCount}
                            </p>
                        </div>

                        {/* APPROVED */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-green-200
                                hover:shadow-lg

                                dark:border-slate-800
                                dark:bg-slate-900
                                dark:hover:border-green-500/30
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-green-500/10
                                        text-green-600
                                        dark:text-green-400
                                    "
                                >
                                    <CheckCircle size={22} />
                                </div>

                                <span
                                    className="
                                        text-xs
                                        font-medium
                                        text-slate-400
                                    "
                                >
                                    Approved
                                </span>
                            </div>

                            <p
                                className="
                                    mt-5
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Approved Requests
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-3xl
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {loading
                                    ? "..."
                                    : approvedCount}
                            </p>
                        </div>

                        {/* REJECTED */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-red-200
                                hover:shadow-lg

                                dark:border-slate-800
                                dark:bg-slate-900
                                dark:hover:border-red-500/30
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-red-500/10
                                        text-red-600
                                        dark:text-red-400
                                    "
                                >
                                    <XCircle size={22} />
                                </div>

                                <span
                                    className="
                                        text-xs
                                        font-medium
                                        text-slate-400
                                    "
                                >
                                    Rejected
                                </span>
                            </div>

                            <p
                                className="
                                    mt-5
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Rejected Requests
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-3xl
                                    font-bold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {loading
                                    ? "..."
                                    : rejectedCount}
                            </p>
                        </div>
                    </div>
                </section>

                {/* =========================================
                    QUICK ACTIONS
                ========================================= */}

                <section className="mt-10">
                    <div className="mb-4">
                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Quick Actions
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Access the main manager tools
                        </p>
                    </div>

                    <div
                        className="
                            grid
                            gap-5
                            md:grid-cols-2
                        "
                    >
                        {/* LEAVE REQUESTS */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/manager/leaves"
                                )
                            }
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                text-left
                                shadow-sm
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-blue-300
                                hover:shadow-xl
                                hover:shadow-blue-500/10

                                dark:border-slate-800
                                dark:bg-slate-900
                                dark:hover:border-blue-500/40
                            "
                        >
                            <div
                                className="
                                    absolute
                                    -right-10
                                    -top-10
                                    h-32
                                    w-32
                                    rounded-full
                                    bg-blue-500/5
                                    blur-3xl
                                    transition
                                    group-hover:bg-blue-500/15
                                "
                            />

                            <div className="relative">
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-blue-500/10
                                            text-blue-600
                                            dark:text-blue-400
                                        "
                                    >
                                        <FileText size={24} />
                                    </div>

                                    <ArrowRight
                                        size={20}
                                        className="
                                            text-slate-400
                                            transition
                                            duration-300
                                            group-hover:translate-x-1
                                            group-hover:text-blue-600

                                            dark:text-slate-600
                                            dark:group-hover:text-blue-400
                                        "
                                    />
                                </div>

                                <h2
                                    className="
                                        mt-6
                                        text-xl
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Leave Requests
                                </h2>

                                <p
                                    className="
                                        mt-2
                                        max-w-lg
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    Review employee leave
                                    applications and approve
                                    or reject pending requests.
                                </p>

                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-medium
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                >
                                    Manage requests

                                    <ArrowRight
                                        size={15}
                                        className="
                                            transition
                                            group-hover:translate-x-1
                                        "
                                    />
                                </div>
                            </div>
                        </button>

                        {/* EMPLOYEES */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/manager/employees"
                                )
                            }
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                text-left
                                shadow-sm
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-indigo-300
                                hover:shadow-xl
                                hover:shadow-indigo-500/10

                                dark:border-slate-800
                                dark:bg-slate-900
                                dark:hover:border-indigo-500/40
                            "
                        >
                            <div
                                className="
                                    absolute
                                    -right-10
                                    -top-10
                                    h-32
                                    w-32
                                    rounded-full
                                    bg-indigo-500/5
                                    blur-3xl
                                    transition
                                    group-hover:bg-indigo-500/15
                                "
                            />

                            <div className="relative">
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-indigo-500/10
                                            text-indigo-600
                                            dark:text-indigo-400
                                        "
                                    >
                                        <Users size={24} />
                                    </div>

                                    <ArrowRight
                                        size={20}
                                        className="
                                            text-slate-400
                                            transition
                                            duration-300
                                            group-hover:translate-x-1
                                            group-hover:text-indigo-600

                                            dark:text-slate-600
                                            dark:group-hover:text-indigo-400
                                        "
                                    />
                                </div>

                                <h2
                                    className="
                                        mt-6
                                        text-xl
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Employees
                                </h2>

                                <p
                                    className="
                                        mt-2
                                        max-w-lg
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    View employees registered
                                    in the employee leave
                                    management system.
                                </p>

                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-medium
                                        text-indigo-600
                                        dark:text-indigo-400
                                    "
                                >
                                    View employees

                                    <ArrowRight
                                        size={15}
                                        className="
                                            transition
                                            group-hover:translate-x-1
                                        "
                                    />
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                {/* FOOTER SPACE */}

                <div className="h-6" />
            </main>
        </div>
    );
};

export default ManagerDashboard;