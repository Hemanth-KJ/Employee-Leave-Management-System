import {
    CalendarDays,
    Clock3,
    FileText,
    LogOut,
    Plus,
    UserRound,
    ArrowRight,
    Sparkles,
    Bell,
    CheckCheck,
    Trash2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../services/authService";
import { getMyLeaves } from "../../services/leaveService";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteAllNotifications,
} from "../../services/notificationService";

import NotificationToast from "../../components/NotificationToast";
import ThemeToggle from "../../components/ThemeToggle";

const EmployeeDashboard = () => {
    const navigate = useNavigate();

    const notificationRef = useRef(null);

    // =====================================================
    // STATE
    // =====================================================

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const [notifications, setNotifications] = useState([]);
    const [notificationLoading, setNotificationLoading] =
        useState(false);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [deletingNotifications, setDeletingNotifications] =
        useState(false);

    const username =
        localStorage.getItem("username") || "Employee";

    // =====================================================
    // LOAD LEAVES
    // =====================================================

    useEffect(() => {
        let cancelled = false;

        const loadDashboard = async () => {
            try {
                const data = await getMyLeaves();

                if (cancelled) {
                    return;
                }

                setLeaves(
                    Array.isArray(data?.leaveRequests)
                        ? data.leaveRequests
                        : []
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load dashboard:",
                    error.response?.data ||
                        error.message ||
                        error
                );

                setLeaves([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    // =====================================================
    // LOAD NOTIFICATIONS
    // =====================================================

    const loadNotifications = async () => {
        try {
            setNotificationLoading(true);

            const data = await getNotifications();

            setNotifications(
                Array.isArray(data?.notifications)
                    ? data.notifications
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error.response?.data ||
                    error.message ||
                    error
            );

            setNotifications([]);
        } finally {
            setNotificationLoading(false);
        }
    };

    // =====================================================
    // INITIAL NOTIFICATION LOAD
    // =====================================================

    useEffect(() => {
        let mounted = true;

        const initialLoad = async () => {
            if (!mounted) {
                return;
            }

            await loadNotifications();
        };

        const timer = setTimeout(() => {
            initialLoad();
        }, 0);

        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, []);

    // =====================================================
    // AUTO REFRESH NOTIFICATIONS
    // =====================================================

    useEffect(() => {
        const interval = setInterval(() => {
            loadNotifications();
        }, 30000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // =====================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =====================================================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // =====================================================
    // UNREAD COUNT
    // =====================================================

    const unreadCount = notifications.filter(
        (notification) =>
            notification.is_read === false
    ).length;

    // =====================================================
    // MARK ONE NOTIFICATION AS READ
    // =====================================================

    const handleNotificationClick = async (
        notification
    ) => {
        if (notification.is_read) {
            return;
        }

        try {
            await markNotificationAsRead(
                notification.id
            );

            setNotifications((previous) =>
                previous.map((item) =>
                    item.id === notification.id
                        ? {
                              ...item,
                              is_read: true,
                          }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error.response?.data ||
                    error.message ||
                    error
            );
        }
    };

    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) {
            return;
        }

        try {
            await markAllNotificationsAsRead();

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    is_read: true,
                }))
            );
        } catch (error) {
            console.error(
                "Failed to mark all notifications:",
                error.response?.data ||
                    error.message ||
                    error
            );
        }
    };

    // =====================================================
    // DELETE ALL NOTIFICATIONS
    // =====================================================

    const handleDeleteAllNotifications = async () => {
        if (
            notifications.length === 0 ||
            deletingNotifications
        ) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete all notifications?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingNotifications(true);

            await deleteAllNotifications();

            setNotifications([]);

            setShowNotifications(false);
        } catch (error) {
            console.error(
                "Failed to delete all notifications:",
                error.response?.data ||
                    error.message ||
                    error
            );

            window.alert(
                "Failed to delete notifications. Please try again."
            );
        } finally {
            setDeletingNotifications(false);
        }
    };

    // =====================================================
    // LEAVE COUNTS
    // =====================================================

    const pendingCount = leaves.filter(
        (leave) =>
            leave.status?.toLowerCase() ===
            "pending"
    ).length;

    const approvedCount = leaves.filter(
        (leave) =>
            leave.status?.toLowerCase() ===
            "approved"
    ).length;

    const rejectedCount = leaves.filter(
        (leave) =>
            leave.status?.toLowerCase() ===
            "rejected"
    ).length;

    // =====================================================
    // FORMAT NOTIFICATION DATE
    // =====================================================

    const formatNotificationDate = (createdAt) => {
        if (!createdAt) {
            return "";
        }

        const date = new Date(createdAt);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleString([], {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        logout();

        navigate("/login");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">

            {/* =================================================
                NOTIFICATION TOAST
            ================================================= */}

            <NotificationToast />

            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/85">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

                    {/* BRAND */}

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20">
                            EL
                        </div>

                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                                Employee Leave
                            </p>

                            <p className="text-xs text-slate-500">
                                Management System
                            </p>
                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="flex items-center gap-3">

                        {/* USER */}

                        <div className="hidden items-center gap-3 sm:flex">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <UserRound size={17} />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {username}
                                </p>

                                <p className="text-xs text-slate-500">
                                    Employee
                                </p>
                            </div>

                        </div>

                        {/* =================================================
                            NOTIFICATIONS
                        ================================================= */}

                        <div
                            ref={notificationRef}
                            className="relative"
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNotifications(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                                aria-label="Notifications"
                            >

                                <Bell size={19} />

                                {unreadCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                                        {unreadCount > 9
                                            ? "9+"
                                            : unreadCount}
                                    </span>
                                )}

                            </button>

                            {/* =================================================
                                NOTIFICATION DROPDOWN
                            ================================================= */}

                            {showNotifications && (
                                <div className="absolute right-0 top-12 z-50 w-[350px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">

                                    {/* HEADER */}

                                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">

                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                Notifications
                                            </h3>

                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {unreadCount >
                                                0
                                                    ? `${unreadCount} unread notification${
                                                          unreadCount >
                                                          1
                                                              ? "s"
                                                              : ""
                                                      }`
                                                    : "You're all caught up"}
                                            </p>
                                        </div>

                                        {/* HEADER ACTIONS */}

                                        {notifications.length >
                                            0 && (
                                            <div className="flex items-center gap-3">

                                                {unreadCount >
                                                    0 && (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleMarkAllAsRead
                                                        }
                                                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <CheckCheck
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        <span className="hidden sm:inline">
                                                            Mark all
                                                        </span>
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleDeleteAllNotifications
                                                    }
                                                    disabled={
                                                        deletingNotifications
                                                    }
                                                    className="flex items-center gap-1.5 text-xs font-medium text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                                                    title="Delete all notifications"
                                                >
                                                    <Trash2
                                                        size={
                                                            14
                                                        }
                                                    />

                                                    <span>
                                                        {deletingNotifications
                                                            ? "Deleting..."
                                                            : "Delete all"}
                                                    </span>
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                    {/* NOTIFICATION LIST */}

                                    <div className="max-h-[400px] overflow-y-auto">

                                        {notificationLoading ? (
                                            <div className="px-5 py-10 text-center">

                                                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />

                                                <p className="mt-3 text-xs text-slate-400">
                                                    Loading notifications...
                                                </p>

                                            </div>
                                        ) : notifications.length ===
                                          0 ? (
                                            <div className="px-5 py-10 text-center">

                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                                    <Bell
                                                        size={
                                                            20
                                                        }
                                                    />
                                                </div>

                                                <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    No notifications
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    New updates will
                                                    appear here.
                                                </p>

                                            </div>
                                        ) : (
                                            notifications.map(
                                                (
                                                    notification
                                                ) => (
                                                    <button
                                                        key={
                                                            notification.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            handleNotificationClick(
                                                                notification
                                                            )
                                                        }
                                                        className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 dark:border-slate-800 ${
                                                            notification.is_read
                                                                ? "bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60"
                                                                : "bg-blue-50/70 hover:bg-blue-50 dark:bg-blue-500/5 dark:hover:bg-blue-500/10"
                                                        }`}
                                                    >

                                                        {/* ICON */}

                                                        <div
                                                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                                                notification.is_read
                                                                    ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                                                                    : "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                                            }`}
                                                        >
                                                            <Bell
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </div>

                                                        {/* CONTENT */}

                                                        <div className="min-w-0 flex-1">

                                                            <div className="flex items-start justify-between gap-2">

                                                                <p
                                                                    className={`text-sm leading-5 ${
                                                                        notification.is_read
                                                                            ? "font-normal text-slate-600 dark:text-slate-400"
                                                                            : "font-semibold text-slate-900 dark:text-white"
                                                                    }`}
                                                                >
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>

                                                                {!notification.is_read && (
                                                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                                                                )}

                                                            </div>

                                                            <p className="mt-1 text-[11px] text-slate-400">
                                                                {formatNotificationDate(
                                                                    notification.created_at
                                                                )}
                                                            </p>

                                                        </div>

                                                    </button>
                                                )
                                            )
                                        )}

                                    </div>

                                </div>
                            )}

                        </div>

                        {/* THEME */}

                        <ThemeToggle />

                        {/* LOGOUT */}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        >
                            <LogOut size={16} />

                            <span className="hidden sm:inline">
                                Logout
                            </span>
                        </button>

                    </div>

                </div>

            </header>

            {/* =================================================
                MAIN
            ================================================= */}

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

                {/* =================================================
                    WELCOME
                ================================================= */}

                <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm transition-colors duration-300 sm:p-8 dark:border-slate-800 dark:from-blue-600/20 dark:via-slate-900 dark:to-slate-900">

                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

                    <div className="relative">

                        <div className="mb-4 flex items-center gap-2">

                            <Sparkles
                                size={17}
                                className="text-blue-600 dark:text-blue-400"
                            />

                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Employee Portal
                            </p>

                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Welcome back, {username}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                            Manage your leave requests,
                            track approvals, and keep
                            everything organized from
                            your dashboard.
                        </p>

                    </div>

                </section>

                {/* =================================================
                    ACTION CARDS
                ================================================= */}

                <section className="mt-8 grid gap-5 md:grid-cols-2">

                    {/* APPLY LEAVE */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/employee/apply-leave"
                            )
                        }
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40 dark:hover:shadow-blue-950/30"
                    >

                        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition group-hover:bg-blue-500/20" />

                        <div className="relative">

                            <div className="flex items-start justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Plus size={24} />
                                </div>

                                <ArrowRight
                                    size={20}
                                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400"
                                />

                            </div>

                            <h2 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">
                                Apply for Leave
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-500">
                                Submit a new leave request
                                with dates, reason, and
                                supporting documents.
                            </p>

                        </div>

                    </button>

                    {/* LEAVE HISTORY */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/employee/leave-history"
                            )
                        }
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40 dark:hover:shadow-indigo-950/30"
                    >

                        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl transition group-hover:bg-indigo-500/20" />

                        <div className="relative">

                            <div className="flex items-start justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <FileText size={24} />
                                </div>

                                <ArrowRight
                                    size={20}
                                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600 dark:text-slate-600 dark:group-hover:text-indigo-400"
                                />

                            </div>

                            <h2 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">
                                Leave History
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-500">
                                View your submitted requests,
                                their current status, and
                                manager remarks.
                            </p>

                        </div>

                    </button>

                </section>

                {/* =================================================
                    QUICK OVERVIEW
                ================================================= */}

                <section className="mt-10">

                    <div className="mb-5">

                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Quick Overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your leave request summary
                        </p>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">

                        {/* PENDING */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

                            <div className="flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                                    <Clock3 size={20} />
                                </div>

                                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Pending
                                </span>

                            </div>

                            <p className="mt-5 text-sm text-slate-500">
                                Pending Requests
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                                {loading
                                    ? "..."
                                    : pendingCount}
                            </p>

                        </div>

                        {/* APPROVED */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

                            <div className="flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                                    <CalendarDays size={20} />
                                </div>

                                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Approved
                                </span>

                            </div>

                            <p className="mt-5 text-sm text-slate-500">
                                Approved Requests
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                                {loading
                                    ? "..."
                                    : approvedCount}
                            </p>

                        </div>

                        {/* REJECTED */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

                            <div className="flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                                    <FileText size={20} />
                                </div>

                                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Rejected
                                </span>

                            </div>

                            <p className="mt-5 text-sm text-slate-500">
                                Rejected Requests
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                                {loading
                                    ? "..."
                                    : rejectedCount}
                            </p>

                        </div>

                    </div>

                </section>

                {/* FOOTER */}

                <footer className="mt-12 border-t border-slate-200 pt-6 text-center dark:border-slate-800">

                    <p className="text-xs text-slate-400">
                        Employee Leave Management System
                    </p>

                </footer>

            </main>

        </div>
    );
};

export default EmployeeDashboard;