import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    FileText,
    RefreshCw,

    CalendarDays,
    UserRound,
    Clock3,
    ExternalLink,
    X,
} from "lucide-react";

import {
    getAllLeaves,
    updateLeaveStatus,
    getLeaveDocument,
} from "../../services/managerService";

const ManagerLeaves = () => {
    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedLeave, setSelectedLeave] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [processing, setProcessing] = useState(false);



    

    // =========================
    // LOAD LEAVES
    // =========================

    useEffect(() => {
        let cancelled = false;

        const fetchLeaves = async () => {
            try {
                const data = await getAllLeaves();

                if (cancelled) return;

                setLeaves(data.leaveRequests || []);
                setError("");
            } catch (error) {
                if (cancelled) return;

                console.error(
                    "Failed to load leaves:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Failed to load leave requests."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchLeaves();

        return () => {
            cancelled = true;
        };
    }, []);

    // =========================
    // REFRESH
    // =========================

    const loadLeaves = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllLeaves();

            setLeaves(data.leaveRequests || []);
        } catch (error) {
            console.error(
                "Failed to load leaves:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to load leave requests."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // VIEW DOCUMENT
    // =========================

    const handleViewDocument = async (leaveId) => {
        try {
            const blob = await getLeaveDocument(leaveId);

            const url =
                window.URL.createObjectURL(blob);

            window.open(url, "_blank");

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 10000);
        } catch (error) {
            console.error(
                "Failed to open document:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to open document."
            );
        }
    };

    // =========================
    // REVIEW MODAL
    // =========================

    const openReview = (leave) => {
        setSelectedLeave(leave);
        setRemarks("");
    };

    const closeReview = () => {
        if (processing) return;

        setSelectedLeave(null);
        setRemarks("");
    };

    // =========================
    // UPDATE STATUS
    // =========================

    const handleStatusUpdate = async (status) => {
        if (!selectedLeave) return;

        if (!remarks.trim()) {
            alert("Please enter remarks.");
            return;
        }

        try {
            setProcessing(true);

            await updateLeaveStatus(
                selectedLeave.id,
                status,
                remarks
            );

            setLeaves((currentLeaves) =>
                currentLeaves.map((leave) =>
                    leave.id === selectedLeave.id
                        ? {
                              ...leave,
                              status,
                              remarks:
                                  remarks.trim(),
                              reviewed_at:
                                  new Date().toISOString(),
                          }
                        : leave
                )
            );

            setSelectedLeave(null);
            setRemarks("");
        } catch (error) {
            console.error(
                "Failed to update leave:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update leave request."
            );
        } finally {
            setProcessing(false);
        }
    };

    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =========================
    // STATUS STYLE
    // =========================

    const getStatusStyle = (status) => {
        if (status === "approved") {
            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400";
        }

        if (status === "rejected") {
            return "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400";
        }

        return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    };

    // =========================
    // STATUS ICON
    // =========================

    const getStatusIcon = (status) => {
        if (status === "approved") {
            return <CheckCircle size={15} />;
        }

        if (status === "rejected") {
            return <XCircle size={15} />;
        }

        return <Clock3 size={15} />;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">

            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/90">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                    {/* LEFT SIDE */}

                    <div className="flex items-center gap-3 sm:gap-4">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/manager/dashboard"
                                )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="hidden sm:block">

                            <h1 className="font-semibold text-slate-900 dark:text-white">
                                Leave Requests
                            </h1>

                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                Review employee applications
                            </p>

                        </div>

                        <div className="sm:hidden">

                            <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Leave Requests
                            </h1>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="flex items-center gap-2">

                      

                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={loadLeaves}
                            disabled={loading}
                            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 sm:px-4"
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            <span className="hidden sm:inline">
                                Refresh
                            </span>

                        </button>

                    </div>

                </div>

            </header>

            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

                {/* PAGE HEADER */}

                <div className="mb-8">

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

                        <div>

                            <div className="mb-3 flex items-center gap-2">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <FileText size={16} />
                                </div>

                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    Manager Portal
                                </p>

                            </div>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                Employee Leave Requests
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Review employee leave applications,
                                check supporting documents, and
                                approve or reject pending requests.
                            </p>

                        </div>

                        {/* REQUEST COUNT */}

                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <FileText size={19} />
                            </div>

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Total Requests
                                </p>

                                <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">
                                    {leaves.length}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/20 dark:bg-red-500/10">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 dark:text-red-400">
                                <XCircle size={17} />
                            </div>

                            <p className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={loadLeaves}
                            className="text-sm font-semibold text-red-600 transition hover:text-red-800 dark:text-red-300 dark:hover:text-white"
                        >
                            Retry
                        </button>

                    </div>
                )}

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">

                            <RefreshCw
                                size={24}
                                className="animate-spin text-blue-600 dark:text-blue-400"
                            />

                        </div>

                        <p className="mt-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                            Loading leave requests...
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Please wait while we fetch the latest requests.
                        </p>

                    </div>

                )}

                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    leaves.length === 0 && (

                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">

                                <FileText size={28} />

                            </div>

                            <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
                                No leave requests
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-500">
                                There are currently no employee leave
                                requests available for review.
                            </p>

                        </div>

                    )}

                {/* =================================================
                    LEAVE LIST
                ================================================= */}

                {!loading &&
                    leaves.length > 0 && (

                        <div className="space-y-5">

                            {leaves.map((leave) => (

                                <div
                                    key={leave.id}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none"
                                >

                                    {/* CARD TOP ACCENT */}

                                    <div
                                        className={`h-1 w-full ${
                                            leave.status ===
                                            "approved"
                                                ? "bg-emerald-500"
                                                : leave.status ===
                                                  "rejected"
                                                ? "bg-red-500"
                                                : "bg-amber-500"
                                        }`}
                                    />

                                    <div className="p-5 sm:p-6">

                                        {/* ================= TOP ================= */}

                                        <div className="flex flex-col justify-between gap-5 lg:flex-row">

                                            <div className="flex items-start gap-4">

                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">

                                                    <UserRound
                                                        size={21}
                                                    />

                                                </div>

                                                <div>

                                                    <div className="flex flex-wrap items-center gap-3">

                                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                            {leave.employee_username}
                                                        </h3>

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                                                leave.status
                                                            )}`}
                                                        >
                                                            {getStatusIcon(
                                                                leave.status
                                                            )}

                                                            {
                                                                leave.status
                                                            }

                                                        </span>

                                                    </div>

                                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">

                                                        <span>
                                                            Submitted{" "}
                                                            {formatDate(
                                                                leave.created_at
                                                            )}
                                                        </span>

                                                        <span className="hidden text-slate-300 dark:text-slate-700 sm:inline">
                                                            •
                                                        </span>

                                                        <span className="font-mono text-slate-400 dark:text-slate-600">
                                                            #
                                                            {leave.id?.slice(
                                                                0,
                                                                8
                                                            )}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* REVIEW BUTTON */}

                                            {leave.status ===
                                                "pending" && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openReview(
                                                            leave
                                                        )
                                                    }
                                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
                                                >
                                                    Review Request
                                                    <ExternalLink
                                                        size={15}
                                                    />
                                                </button>

                                            )}

                                        </div>

                                        {/* ================= DIVIDER ================= */}

                                        <div className="my-6 border-t border-slate-100 dark:border-slate-800" />

                                        {/* ================= DATES ================= */}

                                        <div className="grid gap-4 sm:grid-cols-2">

                                            {/* START */}

                                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">

                                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                                    <CalendarDays
                                                        size={15}
                                                        className="text-blue-500"
                                                    />

                                                    Start Date

                                                </div>

                                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                    {formatDate(
                                                        leave.start_date
                                                    )}
                                                </p>

                                            </div>

                                            {/* END */}

                                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">

                                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                                    <CalendarDays
                                                        size={15}
                                                        className="text-blue-500"
                                                    />

                                                    End Date

                                                </div>

                                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                    {formatDate(
                                                        leave.end_date
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                        {/* ================= REASON ================= */}

                                        <div className="mt-5">

                                            <div className="mb-2 flex items-center justify-between">

                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    Reason
                                                </p>

                                            </div>

                                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">

                                                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                    {leave.reason}
                                                </p>

                                            </div>

                                        </div>

                                        {/* ================= DOCUMENT ================= */}

                                        {leave.document_id && (

                                            <div className="mt-5">

                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    Supporting Document
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewDocument(
                                                            leave.id
                                                        )
                                                    }
                                                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/5"
                                                >

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">

                                                        <FileText
                                                            size={18}
                                                        />

                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            {leave.original_name ||
                                                                "View Document"}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            Click to open document
                                                        </p>

                                                    </div>

                                                    <ExternalLink
                                                        size={16}
                                                        className="shrink-0 text-slate-400"
                                                    />

                                                </button>

                                            </div>

                                        )}

                                        {/* ================= REMARKS ================= */}

                                        {leave.remarks && (

                                            <div className="mt-5">

                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    Manager Remarks
                                                </p>

                                                <div
                                                    className={`rounded-xl border p-4 ${
                                                        leave.status ===
                                                        "approved"
                                                            ? "border-emerald-500/20 bg-emerald-500/5"
                                                            : leave.status ===
                                                              "rejected"
                                                            ? "border-red-500/20 bg-red-500/5"
                                                            : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                                                    }`}
                                                >

                                                    <p
                                                        className={`text-sm leading-6 ${
                                                            leave.status ===
                                                            "approved"
                                                                ? "text-emerald-700 dark:text-emerald-300"
                                                                : leave.status ===
                                                                  "rejected"
                                                                ? "text-red-700 dark:text-red-300"
                                                                : "text-slate-600 dark:text-slate-300"
                                                        }`}
                                                    >
                                                        {
                                                            leave.remarks
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </main>

            {/* =====================================================
                REVIEW MODAL
            ===================================================== */}

            {selectedLeave && (

                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

                        {/* MODAL HEADER */}

                        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">

                            <div className="flex items-start justify-between gap-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">

                                        <FileText
                                            size={20}
                                        />

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                            Review Leave
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {
                                                selectedLeave.employee_username
                                            }
                                        </p>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={closeReview}
                                    disabled={processing}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                    <X size={18} />
                                </button>

                            </div>

                        </div>

                        {/* MODAL BODY */}

                        <div className="px-6 py-6">

                            {/* LEAVE DETAILS */}

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">

                                <div className="grid gap-5 sm:grid-cols-2">

                                    <div>

                                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                            <CalendarDays
                                                size={14}
                                            />

                                            Start Date

                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {formatDate(
                                                selectedLeave.start_date
                                            )}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                            <CalendarDays
                                                size={14}
                                            />

                                            End Date

                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {formatDate(
                                                selectedLeave.end_date
                                            )}
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Reason
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                        {
                                            selectedLeave.reason
                                        }
                                    </p>

                                </div>

                            </div>

                            {/* REMARKS */}

                            <label className="mt-6 block">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        Manager Remarks
                                    </span>

                                    <span className="text-xs text-slate-500">
                                        Required
                                    </span>

                                </div>

                                <textarea
                                    value={remarks}
                                    onChange={(event) =>
                                        setRemarks(
                                            event.target
                                                .value
                                        )
                                    }
                                    rows={4}
                                    disabled={processing}
                                    placeholder="Enter your remarks before approving or rejecting..."
                                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                                />

                            </label>

                            {/* ACTIONS */}

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">

                                {/* REJECT */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleStatusUpdate(
                                            "rejected"
                                        )
                                    }
                                    disabled={processing}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
                                >

                                    <XCircle size={17} />

                                    {processing
                                        ? "Processing..."
                                        : "Reject Request"}

                                </button>

                                {/* APPROVE */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleStatusUpdate(
                                            "approved"
                                        )
                                    }
                                    disabled={processing}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    <CheckCircle size={17} />

                                    {processing
                                        ? "Processing..."
                                        : "Approve Request"}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default ManagerLeaves;