import { useEffect, useState } from "react";

import {
    Bell,
    CheckCircle,
    XCircle,
    X,
} from "lucide-react";

import {
    getNotifications,
    markNotificationAsRead,
} from "../services/notificationService";

const NotificationToast = () => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        let active = true;

        const loadNotifications = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const data = await getNotifications();

                if (!active) {
                    return;
                }

                const notifications = Array.isArray(
                    data?.notifications
                )
                    ? data.notifications
                    : [];

                const unreadNotification =
                    notifications.find(
                        (item) => item.is_read === false
                    );

                if (unreadNotification) {
                    setNotification(unreadNotification);
                }
            } catch (error) {
                console.error(
                    "Notification loading error:",
                    error.response?.data ||
                        error.message ||
                        error
                );
            }
        };

        const initialLoad = setTimeout(() => {
            loadNotifications();
        }, 0);

        const interval = setInterval(() => {
            loadNotifications();
        }, 10000);

        return () => {
            active = false;

            clearTimeout(initialLoad);
            clearInterval(interval);
        };
    }, []);

    const handleClose = async () => {
        if (!notification) {
            return;
        }

        const notificationId = notification.id;

        setNotification(null);

        try {
            await markNotificationAsRead(
                notificationId
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

    if (!notification) {
        return null;
    }

    const message =
        notification.message?.toLowerCase() || "";

    const approved = message.includes("approved");

    const rejected = message.includes("rejected");

    return (
        <div className="fixed right-5 top-5 z-[9999] w-[380px] max-w-[calc(100vw-40px)]">

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl shadow-black/50">

                <div className="flex items-start gap-4">

                    {/* ICON */}

                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            approved
                                ? "bg-green-500/10 text-green-400"
                                : rejected
                                ? "bg-red-500/10 text-red-400"
                                : "bg-blue-500/10 text-blue-400"
                        }`}
                    >
                        {approved ? (
                            <CheckCircle size={22} />
                        ) : rejected ? (
                            <XCircle size={22} />
                        ) : (
                            <Bell size={22} />
                        )}
                    </div>

                    {/* MESSAGE */}

                    <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2">

                            <Bell
                                size={16}
                                className="text-blue-400"
                            />

                            <p className="font-semibold text-white">
                                Leave Update
                            </p>

                        </div>

                        <p className="mt-2 text-sm leading-5 text-slate-300">
                            {notification.message}
                        </p>

                        {notification.created_at && (
                            <p className="mt-2 text-[11px] text-slate-500">
                                {new Date(
                                    notification.created_at
                                ).toLocaleString([], {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        )}

                    </div>

                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={handleClose}
                        className="shrink-0 text-slate-500 transition hover:text-white"
                        aria-label="Close notification"
                    >
                        <X size={18} />
                    </button>

                </div>

            </div>

        </div>
    );
};

export default NotificationToast;