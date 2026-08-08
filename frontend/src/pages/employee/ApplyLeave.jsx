import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    FileUp,
    Send,
    X,
} from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ThemeToggle from "../../components/ThemeToggle";

import { applyLeave } from "../../services/leaveService";

const ApplyLeave = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        reason: "",
        startDate: null,
        endDate: null,
    });

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleReasonChange = (event) => {
        setForm((previous) => ({
            ...previous,
            reason: event.target.value,
        }));
    };

    const handleStartDateChange = (date) => {
        setForm((previous) => ({
            ...previous,
            startDate: date,

            endDate:
                previous.endDate &&
                date &&
                previous.endDate < date
                    ? null
                    : previous.endDate,
        }));

        setError("");
    };

    const handleEndDateChange = (date) => {
        setForm((previous) => ({
            ...previous,
            endDate: date,
        }));

        setError("");
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);
        setError("");
    };

    const removeFile = () => {
        setFile(null);
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!form.reason.trim()) {
            setError("Please enter a leave reason.");
            return;
        }

        if (!form.startDate || !form.endDate) {
            setError("Please select both leave dates.");
            return;
        }

        if (form.endDate < form.startDate) {
            setError(
                "End date cannot be before start date."
            );
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append(
                "reason",
                form.reason.trim()
            );

            formData.append(
                "start_date",
                formatDate(form.startDate)
            );

            formData.append(
                "end_date",
                formatDate(form.endDate)
            );

            if (file) {
                formData.append(
                    "document",
                    file
                );
            }

            await applyLeave(formData);

            setSuccess(
                "Leave request submitted successfully."
            );

            setForm({
                reason: "",
                startDate: null,
                endDate: null,
            });

            setFile(null);

            setTimeout(() => {
                navigate(
                    "/employee/leave-history"
                );
            }, 1200);

        } catch (error) {
            console.error(
                "Apply leave error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to submit leave request."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">

            {/* ================= NAVBAR ================= */}

            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/90">

                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

                    {/* LEFT */}

                    <div className="flex items-center gap-4">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/employee/dashboard"
                                )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20 sm:flex">
                            EL
                        </div>

                        <div>
                            <h1 className="font-semibold text-slate-900 dark:text-white">
                                Apply for Leave
                            </h1>

                            <p className="text-xs text-slate-500">
                                Submit a new leave request
                            </p>
                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-3">

                        <ThemeToggle />

                    </div>

                </div>

            </header>

            {/* ================= CONTENT ================= */}

            <main className="mx-auto max-w-5xl px-6 py-10">

                <div className="mb-8">

                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Employee Portal
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        New Leave Request
                    </h2>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Provide the details of your leave request below.
                    </p>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
                        {success}
                    </div>
                )}

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 transition-colors duration-300 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
                >

                    {/* DATES */}

                    <div className="grid gap-6 md:grid-cols-2">

                        {/* START DATE */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Start Date
                            </label>

                            <div className="relative">

                                <CalendarDays
                                    size={19}
                                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                />

                                <DatePicker
                                    selected={form.startDate}
                                    onChange={handleStartDateChange}
                                    selectsStart
                                    startDate={form.startDate}
                                    endDate={form.endDate}
                                    minDate={new Date()}
                                    dateFormat="dd MMM yyyy"
                                    placeholderText="Select start date"
                                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                                    calendarClassName="custom-calendar"
                                    popperClassName="custom-calendar-popper"
                                    showPopperArrow={false}
                                />

                            </div>

                        </div>

                        {/* END DATE */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                End Date
                            </label>

                            <div className="relative">

                                <CalendarDays
                                    size={19}
                                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                />

                                <DatePicker
                                    selected={form.endDate}
                                    onChange={handleEndDateChange}
                                    selectsEnd
                                    startDate={form.startDate}
                                    endDate={form.endDate}
                                    minDate={
                                        form.startDate ||
                                        new Date()
                                    }
                                    dateFormat="dd MMM yyyy"
                                    placeholderText="Select end date"
                                    disabled={!form.startDate}
                                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                                    calendarClassName="custom-calendar"
                                    popperClassName="custom-calendar-popper"
                                    showPopperArrow={false}
                                />

                            </div>

                            {!form.startDate && (
                                <p className="mt-2 text-xs text-slate-400 dark:text-slate-600">
                                    Select the start date first.
                                </p>
                            )}

                        </div>

                    </div>

                    {/* REASON */}

                    <div className="mt-6">

                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Leave Reason
                        </label>

                        <textarea
                            value={form.reason}
                            onChange={handleReasonChange}
                            rows={5}
                            placeholder="Explain the reason for your leave..."
                            required
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                        />

                    </div>

                    {/* DOCUMENT */}

                    <div className="mt-6">

                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">

                            Supporting Document

                            <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-600">
                                Optional
                            </span>

                        </label>

                        {!file ? (

                            <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-500/50 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-blue-500/5">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition group-hover:scale-110 dark:text-blue-400">
                                    <FileUp size={23} />
                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-800 dark:text-white">
                                    Upload supporting document
                                </p>

                                <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">
                                    PDF, JPG, PNG or other supported file
                                </p>

                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                            </label>

                        ) : (

                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">

                                <div className="flex min-w-0 items-center gap-3">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        <FileUp size={19} />
                                    </div>

                                    <div className="min-w-0">

                                        <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                                            {file.name}
                                        </p>

                                        <p className="text-xs text-slate-400 dark:text-slate-600">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-500/10 hover:text-red-500"
                                >
                                    <X size={18} />
                                </button>

                            </div>

                        )}

                    </div>

                    {/* BUTTONS */}

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/employee/dashboard"
                                )
                            }
                            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Send size={17} />

                            {loading
                                ? "Submitting..."
                                : "Submit Leave Request"}

                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
};

export default ApplyLeave;