import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    UserRound,
    CheckCircle2,
    Clock3,
    ShieldCheck,
} from "lucide-react";

import { login } from "../services/authService";

const Login = () => {
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

    const [entering, setEntering] =
        useState(false);

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
        setLoading(true);

        try {
            const data = await login(form);

            if (!data.token) {
                throw new Error(
                    "Login response did not contain a token."
                );
            }

            localStorage.setItem(
                "token",
                data.token
            );

            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                localStorage.setItem(
                    "role",
                    data.user.role || "employee"
                );

                localStorage.setItem(
                    "username",
                    data.user.username || ""
                );
            }

            const role =
                data.user?.role ||
                data.role ||
                "employee";

            // Start smooth zoom animation
            setEntering(true);

            // Navigate after animation
            setTimeout(() => {
                if (role === "manager") {
                    navigate("/manager/dashboard");
                } else {
                    navigate("/employee/dashboard");
                }
            }, 650);

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Login failed. Please check your credentials."
            );

            setLoading(false);
        }
    };

    return (
        <div
            className={`relative flex min-h-screen overflow-hidden bg-slate-50 text-slate-900 ${
                entering
                    ? "login-zoom-enter"
                    : ""
            }`}
        >

            {/* ================= BACKGROUND ================= */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div className="absolute left-[-12%] top-[-20%] h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[120px]" />

                <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />

            </div>


            {/* ================= LEFT SECTION ================= */}

            <div className="relative hidden w-1/2 flex-col justify-between border-r border-slate-200 bg-white/80 px-10 py-10 lg:flex xl:px-14 xl:py-12">

                {/* Logo */}

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


                {/* Main Content */}

                <div className="max-w-xl">

                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                        Leave Management
                    </p>

                    <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 xl:text-5xl">

                        Manage leave requests

                        <span className="text-blue-600">
                            {" "}smarter.
                        </span>

                    </h1>

                    <p className="mt-5 max-w-lg text-base leading-7 text-slate-500 xl:text-lg">

                        A simple and secure platform that
                        helps employees request leave and
                        enables managers to review and
                        manage requests efficiently.

                    </p>


                    {/* Features */}

                    <div className="mt-8 space-y-4">

                        {/* Feature 1 */}

                        <div className="flex items-center gap-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                <CheckCircle2
                                    size={19}
                                />

                            </div>

                            <div>

                                <p className="text-sm font-semibold text-slate-800">
                                    Easy Leave Requests
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Submit and track leave requests
                                    from one place.
                                </p>

                            </div>

                        </div>


                        {/* Feature 2 */}

                        <div className="flex items-center gap-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                <Clock3
                                    size={19}
                                />

                            </div>

                            <div>

                                <p className="text-sm font-semibold text-slate-800">
                                    Faster Approvals
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Managers can review requests
                                    quickly and efficiently.
                                </p>

                            </div>

                        </div>


                        {/* Feature 3 */}

                        <div className="flex items-center gap-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">

                                <ShieldCheck
                                    size={19}
                                />

                            </div>

                            <div>

                                <p className="text-sm font-semibold text-slate-800">
                                    Secure Access
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Role-based access keeps your
                                    workplace data protected.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Info Cards */}

                    <div className="mt-9 grid max-w-lg grid-cols-2 gap-4">

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                            <p className="text-2xl font-bold text-slate-900">
                                24/7
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Access your leave portal
                            </p>

                        </div>



                    </div>

                </div>


                {/* Footer */}

                <div className="flex items-center justify-between">

                    <p className="text-xs text-slate-400">
                        Employee Leave Management System
                    </p>

                    <p className="text-xs text-slate-400">
                        Secure • Simple • Efficient
                    </p>

                </div>

            </div>


            {/* ================= RIGHT LOGIN ================= */}

            <div className="relative flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-12">

                <div className="w-full max-w-md">


                    {/* Mobile Logo */}

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


                    {/* Login Card */}

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">


                        {/* Heading */}

                        <div className="mb-7">

                            <p className="mb-2 text-sm font-semibold text-blue-600">
                                Welcome back
                            </p>

                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Sign in to your account
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Enter your credentials to
                                continue to your dashboard.
                            </p>

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
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
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        required
                                        disabled={
                                            entering
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
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
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        disabled={
                                            entering
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-11 py-3.5 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        disabled={
                                            entering
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
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

                            </div>


                            {/* Submit */}

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    entering
                                }
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {entering
                                    ? "Entering dashboard..."
                                    : loading
                                    ? "Signing in..."
                                    : "Sign In"}

                                {!loading &&
                                    !entering && (
                                        <ArrowRight
                                            size={18}
                                            className="transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    )}

                            </button>

                        </form>


                        {/* Register */}

                        <div className="mt-7 border-t border-slate-200 pt-6 text-center">

                            <p className="text-sm text-slate-500">

                                Don't have an account?{" "}

                                <Link
                                    to="/register"
                                    className="font-semibold text-blue-600 transition hover:text-blue-500"
                                >
                                    Create account
                                </Link>

                            </p>

                        </div>

                    </div>


                    {/* Mobile Footer */}

                    <p className="mt-6 text-center text-xs text-slate-400 lg:hidden">
                        Employee Leave Management System
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;