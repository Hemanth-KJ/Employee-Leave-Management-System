import { useCallback, useEffect, useRef, useState } from "react";

import {
    Bell,
    CheckCheck,
    Trash2,
    RefreshCw,
    X,
    Check,
} from "lucide-react";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteAllNotifications,
} from "../services/notificationService";

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    // ========================================
    // FETCH NOTIFICATIONS
    // ========================================

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getNotifications();

            setNotifications(
                response?.notifications || []
            );
        } catch (error) {
            console.error(
                "Fetch notifications error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to fetch notifications"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {
        let cancelled = false;

        const loadNotifications = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getNotifications();

                if (cancelled) {
                    return;
                }

                setNotifications(
                    response?.notifications || []
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Fetch notifications error:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                        "Failed to fetch notifications"
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadNotifications();

        return () => {
            cancelled = true;
        };
    }, []);

    // ========================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ========================================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {
                setIsOpen(false);
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

    // ========================================
    // UNREAD COUNT
    // ========================================

    const unreadCount = notifications.filter(
        (notification) =>
            !notification.is_read
    ).length;

    // ========================================
    // MARK ONE AS READ
    // ========================================

    const handleMarkAsRead = async (
        notificationId
    ) => {
        try {
            setActionLoading(true);
            setError("");

            await markNotificationAsRead(
                notificationId
            );

            setNotifications((current) =>
                current.map((notification) =>
                    notification.id ===
                    notificationId
                        ? {
                              ...notification,
                              is_read: true,
                          }
                        : notification
                )
            );
        } catch (error) {
            console.error(
                "Mark notification as read error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to mark notification as read"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================
    // MARK ALL AS READ
    // ========================================

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");

            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    is_read: true,
                }))
            );
        } catch (error) {
            console.error(
                "Mark all notifications error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to mark notifications as read"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================
    // DELETE ALL
    // ========================================

    const handleDeleteAll = async () => {
        if (notifications.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete all notifications?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");

            await deleteAllNotifications();

            setNotifications([]);
        } catch (error) {
            console.error(
                "Delete all notifications error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to delete notifications"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================
    // FORMAT DATE
    // ========================================

    const formatNotificationDate = (
        createdAt
    ) => {
        if (!createdAt) {
            return "";
        }

        const date = new Date(createdAt);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    return (
        <div
            ref={dropdownRef}
            className="relative"
        >
            {/* ========================================
                NOTIFICATION BUTTON
            ======================================== */}

            <button
                type="button"
                onClick={() =>
                    setIsOpen((current) => !current)
                }
                className="
                    relative
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    text-slate-600
                    transition

                    hover:border-blue-200
                    hover:bg-blue-50
                    hover:text-blue-600

                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:text-slate-400
                    dark:hover:border-blue-500/30
                    dark:hover:bg-blue-500/10
                    dark:hover:text-blue-400
                "
                aria-label="Notifications"
                aria-expanded={isOpen}
            >
                <Bell size={19} />

                {unreadCount > 0 && (
                    <span
                        className="
                            absolute
                            -right-1
                            -top-1
                            flex
                            min-h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500
                            px-1
                            text-[10px]
                            font-bold
                            text-white
                            ring-2
                            ring-white
                            dark:ring-slate-950
                        "
                    >
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </button>

            {/* ========================================
                DROPDOWN
            ======================================== */}

            {isOpen && (
                <div
                    className="
                        absolute
                        right-0
                        z-50
                        mt-3
                        w-[calc(100vw-2rem)]
                        max-w-[420px]
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-2xl
                        shadow-slate-900/10

                        dark:border-slate-800
                        dark:bg-slate-900
                        dark:shadow-black/30
                    "
                >
                    {/* HEADER */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-slate-200
                            px-4
                            py-4
                            dark:border-slate-800
                        "
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <h3
                                    className="
                                        text-base
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    Notifications
                                </h3>

                                {unreadCount > 0 && (
                                    <span
                                        className="
                                            rounded-full
                                            bg-blue-100
                                            px-2
                                            py-0.5
                                            text-[11px]
                                            font-semibold
                                            text-blue-700
                                            dark:bg-blue-500/10
                                            dark:text-blue-400
                                        "
                                    >
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Leave management updates
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setIsOpen(false)
                            }
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-400
                                transition
                                hover:bg-slate-100
                                hover:text-slate-700
                                dark:hover:bg-slate-800
                                dark:hover:text-white
                            "
                        >
                            <X size={17} />
                        </button>
                    </div>

                    {/* ACTION BAR */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-slate-100
                            bg-slate-50/70
                            px-4
                            py-2
                            dark:border-slate-800
                            dark:bg-slate-950/40
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                handleMarkAllAsRead
                            }
                            disabled={
                                unreadCount === 0 ||
                                actionLoading
                            }
                            className="
                                flex
                                items-center
                                gap-1.5
                                rounded-lg
                                px-2
                                py-1.5
                                text-xs
                                font-medium
                                text-blue-600
                                transition
                                hover:bg-blue-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                dark:text-blue-400
                                dark:hover:bg-blue-500/10
                            "
                        >
                            <CheckCheck size={14} />
                            Mark all read
                        </button>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={
                                    fetchNotifications
                                }
                                disabled={loading}
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-500
                                    transition
                                    hover:bg-slate-200
                                    hover:text-slate-800
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                    dark:text-slate-400
                                    dark:hover:bg-slate-800
                                    dark:hover:text-white
                                "
                            >
                                <RefreshCw
                                    size={14}
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDeleteAll
                                }
                                disabled={
                                    notifications.length ===
                                        0 ||
                                    actionLoading
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-500
                                    transition
                                    hover:bg-red-50
                                    hover:text-red-600
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                    dark:text-slate-400
                                    dark:hover:bg-red-500/10
                                    dark:hover:text-red-400
                                "
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    {/* ERROR */}

                    {error && (
                        <div
                            className="
                                border-b
                                border-red-100
                                bg-red-50
                                px-4
                                py-3
                                dark:border-red-500/20
                                dark:bg-red-500/10
                            "
                        >
                            <div className="flex items-start gap-2">
                                <X
                                    size={15}
                                    className="mt-0.5 shrink-0 text-red-500"
                                />

                                <p
                                    className="
                                        text-xs
                                        leading-5
                                        text-red-600
                                        dark:text-red-400
                                    "
                                >
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATION LIST */}

                    <div className="max-h-[420px] overflow-y-auto">
                        {/* LOADING */}

                        {loading &&
                            notifications.length ===
                                0 && (
                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        px-6
                                        py-12
                                    "
                                >
                                    <RefreshCw
                                        size={24}
                                        className="
                                            animate-spin
                                            text-blue-500
                                        "
                                    />

                                    <p
                                        className="
                                            mt-3
                                            text-sm
                                            text-slate-500
                                        "
                                    >
                                        Loading notifications...
                                    </p>
                                </div>
                            )}

                        {/* EMPTY */}

                        {!loading &&
                            notifications.length ===
                                0 && (
                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        px-6
                                        py-12
                                        text-center
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-slate-100
                                            text-slate-400
                                            dark:bg-slate-800
                                            dark:text-slate-500
                                        "
                                    >
                                        <Bell size={25} />
                                    </div>

                                    <h4
                                        className="
                                            mt-4
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                            dark:text-white
                                        "
                                    >
                                        No notifications
                                    </h4>

                                    <p
                                        className="
                                            mt-1
                                            max-w-[260px]
                                            text-xs
                                            leading-5
                                            text-slate-500
                                        "
                                    >
                                        New leave requests
                                        and manager updates
                                        will appear here.
                                    </p>
                                </div>
                            )}

                        {/* NOTIFICATIONS */}

                        {notifications.map(
                            (notification) => {
                                const isUnread =
                                    !notification.is_read;

                                return (
                                    <div
                                        key={
                                            notification.id
                                        }
                                        className={`
                                            border-b
                                            border-slate-100
                                            px-4
                                            py-4
                                            transition
                                            dark:border-slate-800
                                            ${
                                                isUnread
                                                    ? "bg-blue-50/60 dark:bg-blue-500/5"
                                                    : "bg-white dark:bg-slate-900"
                                            }
                                        `}
                                    >
                                        <div className="flex gap-3">
                                            {/* ICON */}

                                            <div
                                                className={`
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    ${
                                                        isUnread
                                                            ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                                    }
                                                `}
                                            >
                                                <Bell size={16} />
                                            </div>

                                            {/* CONTENT */}

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <p
                                                        className={`
                                                            text-sm
                                                            leading-5
                                                            ${
                                                                isUnread
                                                                    ? "font-medium text-slate-900 dark:text-white"
                                                                    : "text-slate-600 dark:text-slate-400"
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            notification.message
                                                        }
                                                    </p>

                                                    {isUnread && (
                                                        <span
                                                            className="
                                                                mt-1
                                                                h-2
                                                                w-2
                                                                shrink-0
                                                                rounded-full
                                                                bg-blue-500
                                                            "
                                                        />
                                                    )}
                                                </div>

                                                <div className="mt-2 flex items-center justify-between gap-2">
                                                    <p
                                                        className="
                                                            text-[11px]
                                                            text-slate-400
                                                        "
                                                    >
                                                        {formatNotificationDate(
                                                            notification.created_at
                                                        )}
                                                    </p>

                                                    {isUnread && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleMarkAsRead(
                                                                    notification.id
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading
                                                            }
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1
                                                                rounded-lg
                                                                px-2
                                                                py-1
                                                                text-[11px]
                                                                font-medium
                                                                text-blue-600
                                                                transition
                                                                hover:bg-blue-100
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-50
                                                                dark:text-blue-400
                                                                dark:hover:bg-blue-500/10
                                                            "
                                                        >
                                                            <Check
                                                                size={
                                                                    13
                                                                }
                                                            />

                                                            Mark read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;