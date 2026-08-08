import {
    CalendarDays,
    Clock3,
    FileText,
    LogOut,
    Plus,
    UserRound,
    ArrowRight,
    Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../services/authService";
import { getMyLeaves } from "../../services/leaveService";

import NotificationToast from "../../components/NotificationToast";
import ThemeToggle from "../../components/ThemeToggle";


const EmployeeDashboard = () => {

    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);


    const username =
        localStorage.getItem("username") ||
        "Employee";


    useEffect(() => {

        let cancelled = false;


        const loadDashboard = async () => {

            try {

                const data =
                    await getMyLeaves();


                if (cancelled) {
                    return;
                }


                setLeaves(
                    data.leaveRequests || []
                );


            } catch (error) {

                if (cancelled) {
                    return;
                }


                console.error(
                    "Failed to load dashboard:",
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


    const pendingCount =
        leaves.filter(
            (leave) =>
                leave.status?.toLowerCase() ===
                "pending"
        ).length;


    const approvedCount =
        leaves.filter(
            (leave) =>
                leave.status?.toLowerCase() ===
                "approved"
        ).length;


    const rejectedCount =
        leaves.filter(
            (leave) =>
                leave.status?.toLowerCase() ===
                "rejected"
        ).length;


    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    return (

        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">

            {/* ========================================= */}
            {/* NOTIFICATION TOAST */}
            {/* ========================================= */}

            <NotificationToast />


            {/* ========================================= */}
            {/* NAVBAR */}
            {/* ========================================= */}

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

                            <p className="text-xs text-slate-500 dark:text-slate-500">
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


            {/* ========================================= */}
            {/* MAIN */}
            {/* ========================================= */}

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">


                {/* ========================================= */}
                {/* WELCOME */}
                {/* ========================================= */}

                <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm transition-colors duration-300 sm:p-8 dark:border-slate-800 dark:from-blue-600/20 dark:via-slate-900 dark:to-slate-900">


                    {/* Background decoration */}

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


                {/* ========================================= */}
                {/* ACTION CARDS */}
                {/* ========================================= */}

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


                {/* ========================================= */}
                {/* QUICK OVERVIEW */}
                {/* ========================================= */}

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


                {/* ========================================= */}
                {/* FOOTER */}
                {/* ========================================= */}

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