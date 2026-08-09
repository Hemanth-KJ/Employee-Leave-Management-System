import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    FileText,
    RefreshCw,
    Pencil,
    Trash2,
    X,
    CheckCircle2,
    XCircle,
    Clock3,
    Upload,
    AlertCircle,
} from "lucide-react";

import {
    getMyLeaves,
    updateLeave,
    deleteLeave,
} from "../../services/leaveService";



const LeaveHistory = () => {
    const navigate = useNavigate();

    // =========================
    // LEAVE STATES
    // =========================

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // EDIT STATES
    // =========================

    const [editingLeave, setEditingLeave] = useState(null);

    const [editReason, setEditReason] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editEndDate, setEditEndDate] = useState("");

    const [editDocument, setEditDocument] = useState(null);

    const [saving, setSaving] = useState(false);

    // =========================
    // LOAD LEAVES
    // =========================

    useEffect(() => {
        let mounted = true;

        const fetchLeaves = async () => {
            try {
                setLoading(true);

                const data = await getMyLeaves();

                if (!mounted) {
                    return;
                }

                setLeaves(data.leaveRequests || []);
                setError("");
            } catch (error) {
                console.error(
                    "Failed to load leave history:",
                    error
                );

                if (!mounted) {
                    return;
                }

                setError(
                    error.response?.data?.message ||
                        "Failed to load leave history."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchLeaves();

        return () => {
            mounted = false;
        };
    }, []);

    // =========================
    // REFRESH LEAVES
    // =========================

    const loadLeaves = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyLeaves();

            setLeaves(data.leaveRequests || []);
        } catch (error) {
            console.error(
                "Failed to load leave history:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to load leave history."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

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

    const getStatusClasses = (status) => {
        switch (status) {
            case "approved":
                return {
                    container:
                        "border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400",
                    icon: <CheckCircle2 size={14} />,
                };

            case "rejected":
                return {
                    container:
                        "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400",
                    icon: <XCircle size={14} />,
                };

            default:
                return {
                    container:
                        "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
                    icon: <Clock3 size={14} />,
                };
        }
    };

    // =========================
    // OPEN EDIT MODAL
    // =========================

    const openEdit = (leave) => {
        if (leave.status !== "pending") {
            return;
        }

        setEditingLeave(leave);

        setEditReason(
            leave.reason || ""
        );

        setEditStartDate(
            leave.start_date
                ? leave.start_date.substring(0, 10)
                : ""
        );

        setEditEndDate(
            leave.end_date
                ? leave.end_date.substring(0, 10)
                : ""
        );

        setEditDocument(null);
    };

    // =========================
    // CLOSE EDIT MODAL
    // =========================

    const closeEdit = () => {
        if (saving) {
            return;
        }

        setEditingLeave(null);

        setEditReason("");
        setEditStartDate("");
        setEditEndDate("");
        setEditDocument(null);
    };

    // =========================
    // UPDATE LEAVE
    // =========================

    const handleUpdate = async () => {
        if (!editingLeave) {
            return;
        }

        if (!editReason.trim()) {
            alert("Please enter a reason.");
            return;
        }

        if (!editStartDate || !editEndDate) {
            alert("Please select both dates.");
            return;
        }

        if (editEndDate < editStartDate) {
            alert(
                "End date cannot be before start date."
            );
            return;
        }

        try {
            setSaving(true);

            await updateLeave(
                editingLeave.id,
                {
                    reason: editReason.trim(),
                    startDate: editStartDate,
                    endDate: editEndDate,
                    document: editDocument,
                }
            );

            alert(
                "Leave request updated successfully."
            );

            setEditingLeave(null);

            setEditReason("");
            setEditStartDate("");
            setEditEndDate("");
            setEditDocument(null);

            await loadLeaves();
        } catch (error) {
            console.error(
                "Update leave error:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update leave request."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE LEAVE
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this leave request?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteLeave(id);

            setLeaves((currentLeaves) =>
                currentLeaves.filter(
                    (leave) => leave.id !== id
                )
            );

            alert(
                "Leave request deleted successfully."
            );
        } catch (error) {
            console.error(
                "Delete leave error:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete leave request."
            );
        }
    };

    // =========================
    // COUNTS
    // =========================

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

    // =========================
    // RENDER
    // =========================

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">

            {/* =========================================
                HEADER
            ========================================= */}

            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/85">

                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">

                    {/* LEFT */}

                    <div className="flex items-center gap-3 sm:gap-4">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/employee/dashboard"
                                )
                            }
                            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-x-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                        >
                            <ArrowLeft
                                size={18}
                                className="transition-transform group-hover:-translate-x-0.5"
                            />
                        </button>

                        <div>
                            <h1 className="text-sm font-semibold sm:text-base">
                                Leave History
                            </h1>

                            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-500">
                                Your submitted leave requests
                            </p>
                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-2">

                     

                        <button
                            type="button"
                            onClick={loadLeaves}
                            disabled={loading}
                            title="Refresh leave requests"
                            className="group flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-500 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : "transition-transform group-hover:rotate-180"
                                }
                            />

                            <span className="hidden text-sm font-medium sm:inline">
                                Refresh
                            </span>

                        </button>

                    </div>

                </div>

            </header>


            {/* =========================================
                MAIN
            ========================================= */}

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">

                {/* =========================================
                    PAGE INTRO
                ========================================= */}

                <div className="mb-8">

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">

                                <FileText size={13} />

                                Employee Portal

                            </div>

                            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Your Leave Requests
                            </h2>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Track your submitted requests,
                                review their status, and
                                update pending applications.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/employee/apply-leave"
                                )
                            }
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-600/30"
                        >
                            Apply for Leave
                        </button>

                    </div>

                </div>


                {/* =========================================
                    SUMMARY
                ========================================= */}

                {!loading &&
                    !error &&
                    leaves.length > 0 && (
                        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

                            {/* PENDING */}

                            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

                                <div className="flex items-center justify-between">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                                        <Clock3 size={19} />
                                    </div>

                                    <span className="text-2xl font-bold">
                                        {pendingCount}
                                    </span>

                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Pending Requests
                                </p>

                            </div>


                            {/* APPROVED */}

                            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

                                <div className="flex items-center justify-between">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                                        <CheckCircle2 size={19} />
                                    </div>

                                    <span className="text-2xl font-bold">
                                        {approvedCount}
                                    </span>

                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Approved Requests
                                </p>

                            </div>


                            {/* REJECTED */}

                            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

                                <div className="flex items-center justify-between">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                                        <XCircle size={19} />
                                    </div>

                                    <span className="text-2xl font-bold">
                                        {rejectedCount}
                                    </span>

                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Rejected Requests
                                </p>

                            </div>

                        </div>
                    )}


                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (
                    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/20 dark:bg-red-500/10">

                        <div className="flex items-start gap-3">

                            <div className="mt-0.5 text-red-500 dark:text-red-400">
                                <AlertCircle size={19} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                    Unable to load requests
                                </p>

                                <p className="mt-1 text-sm text-red-600/80 dark:text-red-300/70">
                                    {error}
                                </p>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={loadLeaves}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-500/10"
                        >
                            Retry
                        </button>

                    </div>
                )}


                {/* =========================================
                    LOADING
                ========================================= */}

                {loading && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">

                            <RefreshCw
                                size={25}
                                className="animate-spin text-blue-500"
                            />

                        </div>

                        <p className="mt-5 text-sm font-medium">
                            Loading your leave requests...
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                            Please wait a moment.
                        </p>

                    </div>
                )}


                {/* =========================================
                    EMPTY
                ========================================= */}

                {!loading &&
                    !error &&
                    leaves.length === 0 && (
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14 dark:border-slate-800 dark:bg-slate-900">

                            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

                            <div className="relative">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">

                                    <FileText size={28} />

                                </div>

                                <h3 className="mt-6 text-xl font-semibold">
                                    No leave requests yet
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    You haven't submitted any
                                    leave requests. Create
                                    your first request to get
                                    started.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/employee/apply-leave"
                                        )
                                    }
                                    className="mt-7 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
                                >
                                    Apply for Leave
                                </button>

                            </div>

                        </div>
                    )}


                {/* =========================================
                    LEAVE LIST
                ========================================= */}

                {!loading &&
                    leaves.length > 0 && (
                        <div className="space-y-5">

                            {leaves.map((leave) => {

                                const statusStyle =
                                    getStatusClasses(
                                        leave.status
                                    );

                                return (
                                    <div
                                        key={leave.id}
                                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                                    >

                                        {/* CARD TOP ACCENT */}

                                        <div
                                            className={`h-1 w-full ${
                                                leave.status ===
                                                "approved"
                                                    ? "bg-green-500"
                                                    : leave.status ===
                                                      "rejected"
                                                    ? "bg-red-500"
                                                    : "bg-yellow-500"
                                            }`}
                                        />

                                        <div className="p-5 sm:p-6">

                                            {/* TOP */}

                                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                                                <div className="min-w-0">

                                                    <div className="flex flex-wrap items-center gap-3">

                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                                            <FileText
                                                                size={17}
                                                            />
                                                        </div>

                                                        <h3 className="font-semibold">
                                                            Leave Request
                                                        </h3>

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle.container}`}
                                                        >
                                                            {
                                                                statusStyle.icon
                                                            }

                                                            {
                                                                leave.status
                                                            }
                                                        </span>

                                                    </div>

                                                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
                                                        Submitted{" "}
                                                        {formatDate(
                                                            leave.created_at
                                                        )}
                                                    </p>

                                                </div>

                                                <div className="flex items-center gap-2">

                                                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-[11px] text-slate-500 dark:bg-slate-950 dark:text-slate-500">
                                                        #
                                                        {leave.id?.slice(
                                                            0,
                                                            8
                                                        )}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* DATES */}

                                            <div className="mt-6 grid gap-3 sm:grid-cols-2">

                                                {/* START */}

                                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">

                                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">

                                                        <CalendarDays
                                                            size={14}
                                                            className="text-blue-500"
                                                        />

                                                        Start Date

                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold">
                                                        {formatDate(
                                                            leave.start_date
                                                        )}
                                                    </p>

                                                </div>


                                                {/* END */}

                                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">

                                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">

                                                        <CalendarDays
                                                            size={14}
                                                            className="text-indigo-500"
                                                        />

                                                        End Date

                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold">
                                                        {formatDate(
                                                            leave.end_date
                                                        )}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* REASON */}

                                            <div className="mt-5">

                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    Reason
                                                </p>

                                                <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">

                                                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                                                        {leave.reason}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* DOCUMENT */}

                                            {(leave.document ||
                                                leave.original_name) && (
                                                <div className="mt-5">

                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Supporting Document
                                                    </p>

                                                    <div className="mt-2 flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">

                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                                            <FileText
                                                                size={17}
                                                            />
                                                        </div>

                                                        <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">

                                                            {leave.document
                                                                ?.original_name ||
                                                                leave.original_name ||
                                                                "Supporting Document"}

                                                        </span>

                                                    </div>

                                                </div>
                                            )}


                                            {/* MANAGER REMARKS */}

                                            {leave.remarks && (
                                                <div className="mt-5">

                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Manager's Remarks
                                                    </p>

                                                    <div
                                                        className={`mt-2 rounded-xl border p-4 text-sm leading-6 ${
                                                            leave.status ===
                                                            "approved"
                                                                ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300"
                                                                : leave.status ===
                                                                  "rejected"
                                                                ? "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300"
                                                                : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                                                        }`}
                                                    >
                                                        {
                                                            leave.remarks
                                                        }
                                                    </div>

                                                </div>
                                            )}


                                            {/* EDIT / DELETE */}

                                            {leave.status ===
                                                "pending" && (
                                                <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEdit(
                                                                leave
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                                                    >

                                                        <Pencil
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        Edit Request

                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                leave.id
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                                    >

                                                        <Trash2
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        Delete Request

                                                    </button>

                                                </div>
                                            )}

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

            </main>


            {/* =========================================
                EDIT MODAL
            ========================================= */}

            {editingLeave && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-6 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeEdit();
                        }
                    }}
                >

                    <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6 dark:border-slate-800">

                            <div className="flex items-start gap-3">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Pencil size={19} />
                                </div>

                                <div>

                                    <h2 className="text-lg font-semibold">
                                        Edit Leave Request
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Update your pending
                                        request details.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={closeEdit}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <X size={18} />
                            </button>

                        </div>


                        {/* MODAL BODY */}

                        <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">

                            <div className="space-y-5">

                                {/* REASON */}

                                <div>

                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Leave Reason
                                    </label>

                                    <textarea
                                        value={
                                            editReason
                                        }
                                        onChange={(e) =>
                                            setEditReason(
                                                e.target
                                                    .value
                                            )
                                        }
                                        rows={4}
                                        placeholder="Enter your leave reason..."
                                        disabled={saving}
                                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:bg-slate-950"
                                    />

                                </div>


                                {/* DATES */}

                                <div className="grid gap-4 sm:grid-cols-2">

                                    {/* START */}

                                    <div>

                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Start Date
                                        </label>

                                        <div className="relative mt-2">

                                            <CalendarDays
                                                size={17}
                                                className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="date"
                                                value={
                                                    editStartDate
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setEditStartDate(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                disabled={
                                                    saving
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
                                            />

                                        </div>

                                    </div>


                                    {/* END */}

                                    <div>

                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            End Date
                                        </label>

                                        <div className="relative mt-2">

                                            <CalendarDays
                                                size={17}
                                                className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="date"
                                                value={
                                                    editEndDate
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setEditEndDate(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                disabled={
                                                    saving
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
                                            />

                                        </div>

                                    </div>

                                </div>


                                {/* SUPPORTING DOCUMENT */}

                                <div>

                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Supporting Document
                                    </label>

                                    <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/5">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            <Upload
                                                size={18}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Choose a new
                                                document
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-500">
                                                PDF, JPG, JPEG
                                                or PNG
                                            </p>

                                        </div>

                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            disabled={
                                                saving
                                            }
                                            onChange={(e) =>
                                                setEditDocument(
                                                    e
                                                        .target
                                                        .files?.[0] ||
                                                        null
                                                )
                                            }
                                            className="hidden"
                                        />

                                    </label>


                                    {/* NEW FILE */}

                                    {editDocument && (
                                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2">

                                            <FileText
                                                size={15}
                                                className="shrink-0 text-blue-500"
                                            />

                                            <p className="truncate text-xs font-medium text-blue-600 dark:text-blue-400">
                                                New file:{" "}
                                                {
                                                    editDocument.name
                                                }
                                            </p>

                                        </div>
                                    )}


                                    {/* EXISTING FILE */}

                                    {!editDocument &&
                                        (editingLeave?.document ||
                                            editingLeave?.original_name) && (
                                            <p className="mt-2 text-xs text-slate-500">
                                                Existing document
                                                will be kept unless
                                                you select a new
                                                file.
                                            </p>
                                        )}


                                    {!editDocument &&
                                        !editingLeave?.document &&
                                        !editingLeave?.original_name && (
                                            <p className="mt-2 text-xs text-slate-500">
                                                No supporting
                                                document selected.
                                            </p>
                                        )}

                                </div>

                            </div>

                        </div>


                        {/* MODAL FOOTER */}

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 p-5 sm:flex-row sm:justify-end dark:border-slate-800 dark:bg-slate-950/50">

                            {/* CANCEL */}

                            <button
                                type="button"
                                disabled={saving}
                                onClick={closeEdit}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                Cancel
                            </button>


                            {/* SAVE */}

                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleUpdate}
                                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? (
                                    <span className="flex items-center justify-center gap-2">

                                        <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                        />

                                        Saving...

                                    </span>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default LeaveHistory;