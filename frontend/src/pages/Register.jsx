import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    UserRound,
    Clock3,
    ShieldCheck,
} from "lucide-react";

import { register } from "../services/authService";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (form.username.trim().length < 3) {
            setError(
                "Username must contain at least 3 characters."
            );
            return;
        }

        if (form.password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        setLoading(true);

        try {
            await register({
                username: form.username.trim(),
                password: form.password,
            });

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">

            {/* ================= BACKGROUND ================= */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div className="absolute left-[-12%] top-[-20%] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[120px]" />

                <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />

            </div>


            {/* ================= MAIN LAYOUT ================= */}

            <div className="relative mx-auto flex min-h-screen max-w-[1600px]">


                {/* =====================================================
                    LEFT BRANDING SECTION
                ===================================================== */}

                <section className="relative hidden w-1/2 flex-col justify-between border-r border-slate-200 bg-white/70 px-10 py-12 lg:flex xl:px-16 xl:py-14">

                    {/* ================= LOGO ================= */}

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20">
                            EL
                        </div>

                        <div>

                            <p className="text-base font-semibold text-slate-900">
                                Employee Leave
                            </p>

                            <p className="text-xs text-slate-500">
                                Management System
                            </p>

                        </div>

                    </div>


                    {/* ================= LEFT CONTENT ================= */}

                    <div className="max-w-xl">

                        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-500">
                            Employee Leave Management
                        </p>


                        <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 xl:text-5xl">

                            Manage your leave,

                            <span className="text-blue-600">
                                {" "}the smarter way.
                            </span>

                        </h1>


                        <p className="mt-6 max-w-lg text-base leading-7 text-slate-500 xl:text-lg">
                            A simple and secure platform designed
                            to make employee leave management
                            easier. Submit requests, track approvals,
                            and stay updated from one place.
                        </p>


                        {/* ================= FEATURES ================= */}

                        <div className="mt-10 space-y-6">


                            {/* Feature 1 */}

                            <div className="flex items-start gap-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                                    <UserRound size={18} />
                                </div>

                                <div>

                                    <p className="text-sm font-semibold text-slate-800">
                                        Employee Accounts
                                    </p>

                                    <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                                        Manage your profile and
                                        leave information easily.
                                    </p>

                                </div>

                            </div>


                            {/* Feature 2 */}

                            <div className="flex items-start gap-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                                    <ShieldCheck size={18} />
                                </div>

                                <div>

                                    <p className="text-sm font-semibold text-slate-800">
                                        Secure Authentication
                                    </p>

                                    <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                                        Your account and leave
                                        information stay protected.
                                    </p>

                                </div>

                            </div>


                            {/* Feature 3 */}

                            <div className="flex items-start gap-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                                    <Clock3 size={18} />
                                </div>

                                <div>

                                    <p className="text-sm font-semibold text-slate-800">
                                        Faster Leave Management
                                    </p>

                                    <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                                        Submit requests and monitor
                                        their approval status easily.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ================= SMALL INFO ================= */}

                        <div className="mt-10 flex items-center gap-3">

                            <div className="h-px w-10 bg-blue-200" />

                            <p className="text-xs font-medium text-slate-400">
                                Simple • Secure • Efficient
                            </p>

                        </div>

                    </div>


                    {/* ================= FOOTER ================= */}

                    <div className="flex items-center justify-between">

                        <p className="text-xs text-slate-400">
                            Employee Leave Management System
                        </p>

                        <p className="text-xs text-slate-400">
                            © 2026
                        </p>

                    </div>

                </section>


                {/* =====================================================
                    RIGHT REGISTER SECTION
                ===================================================== */}

                <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 sm:py-14 lg:w-1/2 lg:px-12 lg:py-10 xl:px-20">

                    <div className="w-full max-w-md">


                        {/* ================= MOBILE LOGO ================= */}

                        <div className="mb-8 flex items-center gap-3 lg:hidden">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20">
                                EL
                            </div>

                            <div>

                                <p className="font-semibold text-slate-900">
                                    Employee Leave
                                </p>

                                <p className="text-xs text-slate-500">
                                    Management System
                                </p>

                            </div>

                        </div>


                        {/* ================= REGISTER CARD ================= */}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">


                            {/* Heading */}

                            <div className="mb-8">

                                <p className="mb-2 text-sm font-semibold text-blue-500">
                                    Get started
                                </p>

                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    Create your account
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Register as an employee to
                                    manage your leave requests.
                                </p>

                            </div>


                            {/* ================= ERROR ================= */}

                            {error && (
                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                                    {error}
                                </div>
                            )}


                            {/* ================= SUCCESS ================= */}

                            {success && (
                                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-600">
                                    {success}
                                </div>
                            )}


                            {/* ================= FORM ================= */}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >


                                {/* Username */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Username
                                    </label>

                                    <div className="relative">

                                        <UserRound
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            name="username"
                                            value={
                                                form.username
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Choose a username"
                                            autoComplete="username"
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        />

                                    </div>

                                </div>


                                {/* Password */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Password
                                    </label>

                                    <div className="relative">

                                        <LockKeyhole
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={
                                                form.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Create a password"
                                            autoComplete="new-password"
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-11 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        />


                                        {/* Show Password */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                        >

                                            {showPassword ? (
                                                <EyeOff
                                                    size={18}
                                                />
                                            ) : (
                                                <Eye
                                                    size={18}
                                                />
                                            )}

                                        </button>

                                    </div>


                                    <p className="mt-2 text-xs text-slate-400">
                                        Minimum 6 characters
                                    </p>

                                </div>


                                {/* ================= CREATE ACCOUNT ================= */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:bg-blue-500 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {loading
                                        ? "Creating account..."
                                        : "Create Account"}

                                    {!loading && (
                                        <ArrowRight
                                            size={18}
                                            className="transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    )}

                                </button>

                            </form>


                            {/* ================= LOGIN LINK ================= */}

                            <div className="mt-8 border-t border-slate-200 pt-6 text-center">

                                <p className="text-sm text-slate-500">

                                    Already have an account?{" "}

                                    <Link
                                        to="/login"
                                        className="font-semibold text-blue-500 transition hover:text-blue-600"
                                    >
                                        Sign in
                                    </Link>

                                </p>

                            </div>

                        </div>


                        {/* Mobile Footer */}

                        <p className="mt-6 text-center text-xs text-slate-400 lg:hidden">
                            Employee Leave Management System
                        </p>

                    </div>

                </section>

            </div>

        </div>
    );
};

export default Register;