import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Users,
    RefreshCw,
    UserRound,
    Search,
    UserCheck,
    Trash2,
    AlertTriangle,
    X,
} from "lucide-react";

import {
    getEmployees,
    deleteEmployee,
} from "../../services/managerService";


const ManagerEmployees = () => {

    const navigate = useNavigate();


    const [employees, setEmployees] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");


    // =====================================================
    // DELETE STATE
    // =====================================================

    const [employeeToDelete, setEmployeeToDelete] =
        useState(null);

    const [deletingEmployeeId, setDeletingEmployeeId] =
        useState(null);


    // =====================================================
    // LOAD EMPLOYEES
    // =====================================================

    useEffect(() => {

        let cancelled = false;


        const fetchEmployees = async () => {

            try {

                const data =
                    await getEmployees();


                if (cancelled) return;


                setEmployees(
                    data.employees || []
                );

                setError("");


            } catch (error) {

                if (cancelled) return;


                console.error(
                    "Failed to load employees:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                        "Failed to load employees."
                );


            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };


        fetchEmployees();


        return () => {
            cancelled = true;
        };

    }, []);


    // =====================================================
    // REFRESH
    // =====================================================

    const loadEmployees = async () => {

        try {

            setLoading(true);
            setError("");


            const data =
                await getEmployees();


            setEmployees(
                data.employees || []
            );


        } catch (error) {

            console.error(
                "Failed to load employees:",
                error
            );


            setError(
                error.response?.data?.message ||
                    "Failed to load employees."
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // DELETE EMPLOYEE
    // =====================================================

    const handleDeleteEmployee = async () => {

        if (!employeeToDelete) {
            return;
        }


        const employeeId =
            employeeToDelete.id;


        try {

            setDeletingEmployeeId(
                employeeId
            );

            setError("");


            await deleteEmployee(
                employeeId
            );


            // Remove employee immediately
            // from the current list.

            setEmployees((currentEmployees) =>
                currentEmployees.filter(
                    (employee) =>
                        employee.id !== employeeId
                )
            );


            // Close modal

            setEmployeeToDelete(null);


        } catch (error) {

            console.error(
                "Failed to delete employee:",
                error
            );


            setError(
                error.response?.data?.message ||
                    "Failed to delete employee."
            );


        } finally {

            setDeletingEmployeeId(null);

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

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


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredEmployees =
        employees.filter(
            (employee) =>
                employee.username
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    )
        );


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-slate-50
            text-slate-900
            transition-colors
            duration-300
            dark:bg-slate-950
            dark:text-white
        ">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="
                sticky
                top-0
                z-40
                border-b
                border-slate-200/80
                bg-white/80
                backdrop-blur-xl
                transition-colors
                duration-300

                dark:border-slate-800
                dark:bg-slate-950/80
            ">

                <div className="
                    mx-auto
                    flex
                    max-w-7xl
                    items-center
                    justify-between
                    px-4
                    py-4
                    sm:px-6
                ">


                    {/* LEFT */}

                    <div className="
                        flex
                        items-center
                        gap-3
                        sm:gap-4
                    ">


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/manager/dashboard"
                                )
                            }
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                text-slate-500
                                shadow-sm
                                transition
                                hover:border-blue-300
                                hover:bg-blue-50
                                hover:text-blue-600

                                dark:border-slate-800
                                dark:bg-slate-900
                                dark:text-slate-400
                                dark:hover:border-blue-500/40
                                dark:hover:bg-blue-500/10
                                dark:hover:text-blue-400
                            "
                        >

                            <ArrowLeft size={18} />

                        </button>


                        {/* Logo */}

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
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
                            ">
                                EL
                            </div>


                            <div className="hidden sm:block">

                                <p className="font-semibold">
                                    Employees
                                </p>

                                <p className="
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-500
                                ">
                                    Manager Portal
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* RIGHT */}

                    <div className="
                        flex
                        items-center
                        gap-2
                        sm:gap-4
                    ">


                        <div className="
                            hidden
                            items-center
                            gap-3
                            md:flex
                        ">

                            <div className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-500/10
                                text-blue-500
                                dark:text-blue-400
                            ">
                                <UserRound size={17} />
                            </div>


                            <div>

                                <p className="text-sm font-medium">
                                    Manager
                                </p>

                                <p className="text-xs text-slate-500">
                                    Administrator
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </header>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="
                mx-auto
                max-w-7xl
                px-4
                py-8
                sm:px-6
                sm:py-10
            ">


                {/* PAGE HEADING */}

                <section className="mb-8">

                    <div className="
                        flex
                        flex-col
                        justify-between
                        gap-5
                        sm:flex-row
                        sm:items-end
                    ">


                        <div>

                            <div className="
                                mb-3
                                flex
                                items-center
                                gap-2
                            ">

                                <span className="
                                    inline-flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-500/10
                                    text-blue-600
                                    dark:text-blue-400
                                ">
                                    <Users size={16} />
                                </span>


                                <p className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                    dark:text-blue-400
                                ">
                                    Manager Portal
                                </p>

                            </div>


                            <h1 className="
                                text-3xl
                                font-bold
                                tracking-tight
                                sm:text-4xl
                            ">
                                Employee Directory
                            </h1>


                            <p className="
                                mt-2
                                max-w-2xl
                                text-sm
                                leading-6
                                text-slate-500
                                dark:text-slate-400
                            ">
                                View and manage employees
                                registered in the leave
                                management system.
                            </p>

                        </div>


                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={loadEmployees}
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
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-600
                                shadow-sm
                                transition
                                hover:border-blue-300
                                hover:bg-blue-50
                                hover:text-blue-600
                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:border-slate-800
                                dark:bg-slate-900
                                dark:text-slate-400
                                dark:hover:border-slate-700
                                dark:hover:bg-slate-800
                                dark:hover:text-white
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

                            Refresh

                        </button>

                    </div>

                </section>


                {/* =====================================================
                    ERROR
                ===================================================== */}

                {error && (

                    <div className="
                        mb-6
                        flex
                        flex-col
                        gap-3
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        px-5
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between

                        dark:border-red-500/20
                        dark:bg-red-500/10
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
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
                            ">
                                !
                            </div>


                            <p className="
                                text-sm
                                text-red-600
                                dark:text-red-400
                            ">
                                {error}
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={loadEmployees}
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


                {/* =====================================================
                    SUMMARY CARDS
                ===================================================== */}

                {!loading && (

                    <div className="
                        mb-6
                        grid
                        gap-4
                        sm:grid-cols-2
                    ">


                        {/* TOTAL */}

                        <div className="
                            group
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            transition
                            hover:-translate-y-0.5
                            hover:shadow-md

                            dark:border-slate-800
                            dark:bg-slate-900
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-500/10
                                    text-blue-600
                                    dark:text-blue-400
                                ">
                                    <Users size={21} />
                                </div>


                                <span className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                ">
                                    Total
                                </span>

                            </div>


                            <p className="
                                mt-5
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            ">
                                Registered Employees
                            </p>


                            <p className="
                                mt-1
                                text-3xl
                                font-bold
                            ">
                                {employees.length}
                            </p>

                        </div>


                        {/* SEARCH RESULT */}

                        <div className="
                            group
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            transition
                            hover:-translate-y-0.5
                            hover:shadow-md

                            dark:border-slate-800
                            dark:bg-slate-900
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-green-500/10
                                    text-green-600
                                    dark:text-green-400
                                ">
                                    <UserCheck size={21} />
                                </div>


                                <span className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                ">
                                    Showing
                                </span>

                            </div>


                            <p className="
                                mt-5
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            ">
                                Matching Employees
                            </p>


                            <p className="
                                mt-1
                                text-3xl
                                font-bold
                            ">
                                {filteredEmployees.length}
                            </p>

                        </div>

                    </div>

                )}


                {/* =====================================================
                    SEARCH
                ===================================================== */}

                {!loading &&
                    employees.length > 0 && (

                        <div className="mb-6">

                            <div className="
                                relative
                                max-w-md
                            ">

                                <Search
                                    size={18}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />


                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search employees..."
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        py-3
                                        pl-11
                                        pr-4
                                        text-sm
                                        text-slate-900
                                        outline-none
                                        shadow-sm
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-500/10

                                        dark:border-slate-800
                                        dark:bg-slate-900
                                        dark:text-white
                                        dark:placeholder:text-slate-600
                                    "
                                />

                            </div>

                        </div>

                    )}


                {/* =====================================================
                    LOADING
                ===================================================== */}

                {loading && (

                    <div className="
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        p-14
                        text-center
                        shadow-sm

                        dark:border-slate-800
                        dark:bg-slate-900
                    ">

                        <div className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-blue-500/10
                        ">

                            <RefreshCw
                                size={25}
                                className="
                                    animate-spin
                                    text-blue-500
                                "
                            />

                        </div>


                        <p className="
                            mt-5
                            font-medium
                        ">
                            Loading employees...
                        </p>


                        <p className="
                            mt-1
                            text-sm
                            text-slate-500
                        ">
                            Please wait while we fetch
                            the employee directory.
                        </p>

                    </div>

                )}


                {/* =====================================================
                    EMPTY
                ===================================================== */}

                {!loading &&
                    employees.length === 0 && (

                        <div className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-14
                            text-center
                            shadow-sm

                            dark:border-slate-800
                            dark:bg-slate-900
                        ">

                            <div className="
                                mx-auto
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-500/10
                                text-blue-600
                                dark:text-blue-400
                            ">
                                <Users size={30} />
                            </div>


                            <h3 className="
                                mt-5
                                text-xl
                                font-semibold
                            ">
                                No employees found
                            </h3>


                            <p className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-slate-500
                                dark:text-slate-400
                            ">
                                There are no employee
                                accounts registered in
                                the system yet.
                            </p>

                        </div>

                    )}


                {/* =====================================================
                    NO SEARCH RESULTS
                ===================================================== */}

                {!loading &&
                    employees.length > 0 &&
                    filteredEmployees.length === 0 && (

                        <div className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-12
                            text-center
                            shadow-sm

                            dark:border-slate-800
                            dark:bg-slate-900
                        ">

                            <div className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-slate-100
                                text-slate-500

                                dark:bg-slate-800
                                dark:text-slate-400
                            ">
                                <Search size={25} />
                            </div>


                            <h3 className="
                                mt-5
                                text-lg
                                font-semibold
                            ">
                                No matching employees
                            </h3>


                            <p className="
                                mt-2
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            ">
                                Try searching with a
                                different username.
                            </p>

                        </div>

                    )}


                {/* =====================================================
                    EMPLOYEE LIST
                ===================================================== */}

                {!loading &&
                    filteredEmployees.length > 0 && (

                        <div className="
                            overflow-hidden
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm

                            dark:border-slate-800
                            dark:bg-slate-900
                        ">


                            {/* LIST HEADER */}

                            <div className="
                                border-b
                                border-slate-200
                                px-5
                                py-5
                                sm:px-6

                                dark:border-slate-800
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">

                                        <div className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-blue-500/10
                                            text-blue-600
                                            dark:text-blue-400
                                        ">
                                            <Users size={19} />
                                        </div>


                                        <div>

                                            <h3 className="font-semibold">
                                                All Employees
                                            </h3>


                                            <p className="
                                                text-xs
                                                text-slate-500
                                                dark:text-slate-500
                                            ">
                                                {filteredEmployees.length}{" "}
                                                employee
                                                {filteredEmployees.length !==
                                                1
                                                    ? "s"
                                                    : ""}{" "}
                                                displayed
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                DESKTOP TABLE
                            ================================================= */}

                            <div className="
                                hidden
                                overflow-x-auto
                                md:block
                            ">

                                <table className="w-full">

                                    <thead className="
                                        border-b
                                        border-slate-200
                                        bg-slate-50

                                        dark:border-slate-800
                                        dark:bg-slate-950/50
                                    ">

                                        <tr>

                                            <th className="
                                                px-6
                                                py-4
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-slate-500
                                            ">
                                                Employee
                                            </th>


                                            <th className="
                                                px-6
                                                py-4
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-slate-500
                                            ">
                                                Username
                                            </th>


                                            <th className="
                                                px-6
                                                py-4
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-slate-500
                                            ">
                                                Joined
                                            </th>


                                            <th className="
                                                px-6
                                                py-4
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-slate-500
                                            ">
                                                Role
                                            </th>


                                            <th className="
                                                px-6
                                                py-4
                                                text-right
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-slate-500
                                            ">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredEmployees.map(
                                            (
                                                employee,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        employee.id
                                                    }
                                                    className="
                                                        border-b
                                                        border-slate-100
                                                        last:border-0
                                                        transition
                                                        hover:bg-slate-50

                                                        dark:border-slate-800
                                                        dark:hover:bg-slate-800/40
                                                    "
                                                >


                                                    {/* EMPLOYEE */}

                                                    <td className="
                                                        px-6
                                                        py-5
                                                    ">

                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        ">

                                                            <div className="
                                                                flex
                                                                h-11
                                                                w-11
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                bg-blue-500/10
                                                                text-blue-600
                                                                dark:text-blue-400
                                                            ">
                                                                <UserRound
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            </div>


                                                            <div>

                                                                <p className="
                                                                    text-sm
                                                                    font-semibold
                                                                ">
                                                                    Employee{" "}
                                                                    {index +
                                                                        1}
                                                                </p>


                                                                <p className="
                                                                    mt-0.5
                                                                    font-mono
                                                                    text-xs
                                                                    text-slate-400
                                                                ">
                                                                    ID:{" "}
                                                                    {employee.id?.slice(
                                                                        0,
                                                                        8
                                                                    )}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* USERNAME */}

                                                    <td className="
                                                        px-6
                                                        py-5
                                                    ">

                                                        <p className="
                                                            text-sm
                                                            font-medium
                                                            text-slate-700
                                                            dark:text-slate-300
                                                        ">
                                                            {
                                                                employee.username
                                                            }
                                                        </p>

                                                    </td>


                                                    {/* JOINED */}

                                                    <td className="
                                                        px-6
                                                        py-5
                                                    ">

                                                        <p className="
                                                            text-sm
                                                            text-slate-500
                                                            dark:text-slate-400
                                                        ">
                                                            {formatDate(
                                                                employee.created_at
                                                            )}
                                                        </p>

                                                    </td>


                                                    {/* ROLE */}

                                                    <td className="
                                                        px-6
                                                        py-5
                                                    ">

                                                        <span className="
                                                            inline-flex
                                                            rounded-full
                                                            border
                                                            border-blue-500/20
                                                            bg-blue-500/10
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-semibold
                                                            text-blue-600

                                                            dark:text-blue-400
                                                        ">
                                                            Employee
                                                        </span>

                                                    </td>


                                                    {/* DELETE */}

                                                    <td className="
                                                        px-6
                                                        py-5
                                                        text-right
                                                    ">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setEmployeeToDelete(
                                                                    employee
                                                                )
                                                            }
                                                            disabled={
                                                                deletingEmployeeId ===
                                                                employee.id
                                                            }
                                                            title="Delete employee"
                                                            className="
                                                                inline-flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                border
                                                                border-red-200
                                                                bg-red-50
                                                                text-red-600
                                                                transition
                                                                hover:border-red-300
                                                                hover:bg-red-100
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-50

                                                                dark:border-red-500/20
                                                                dark:bg-red-500/10
                                                                dark:text-red-400
                                                                dark:hover:border-red-500/40
                                                                dark:hover:bg-red-500/20
                                                            "
                                                        >

                                                            {deletingEmployeeId ===
                                                            employee.id ? (

                                                                <RefreshCw
                                                                    size={16}
                                                                    className="animate-spin"
                                                                />

                                                            ) : (

                                                                <Trash2
                                                                    size={16}
                                                                />

                                                            )}

                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>


                            {/* =================================================
                                MOBILE CARDS
                            ================================================= */}

                            <div className="
                                divide-y
                                divide-slate-200
                                md:hidden

                                dark:divide-slate-800
                            ">

                                {filteredEmployees.map(
                                    (
                                        employee,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                employee.id
                                            }
                                            className="
                                                p-5
                                                transition
                                                hover:bg-slate-50
                                                dark:hover:bg-slate-800/30
                                            "
                                        >


                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                                <div className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-blue-500/10
                                                    text-blue-600
                                                    dark:text-blue-400
                                                ">
                                                    <UserRound
                                                        size={
                                                            19
                                                        }
                                                    />
                                                </div>


                                                <div className="
                                                    min-w-0
                                                ">

                                                    <p className="font-semibold">
                                                        Employee{" "}
                                                        {index +
                                                            1}
                                                    </p>


                                                    <p className="
                                                        truncate
                                                        text-sm
                                                        text-slate-500
                                                        dark:text-slate-400
                                                    ">
                                                        {
                                                            employee.username
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="
                                                mt-5
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                            ">

                                                <div>

                                                    <p className="
                                                        text-xs
                                                        text-slate-400
                                                    ">
                                                        Joined
                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-sm
                                                        text-slate-600
                                                        dark:text-slate-300
                                                    ">
                                                        {formatDate(
                                                            employee.created_at
                                                        )}
                                                    </p>

                                                </div>


                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                ">

                                                    <span className="
                                                        rounded-full
                                                        border
                                                        border-blue-500/20
                                                        bg-blue-500/10
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-semibold
                                                        text-blue-600
                                                        dark:text-blue-400
                                                    ">
                                                        Employee
                                                    </span>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEmployeeToDelete(
                                                                employee
                                                            )
                                                        }
                                                        disabled={
                                                            deletingEmployeeId ===
                                                            employee.id
                                                        }
                                                        title="Delete employee"
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            border
                                                            border-red-200
                                                            bg-red-50
                                                            text-red-600
                                                            transition
                                                            hover:bg-red-100
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50

                                                            dark:border-red-500/20
                                                            dark:bg-red-500/10
                                                            dark:text-red-400
                                                            dark:hover:bg-red-500/20
                                                        "
                                                    >

                                                        {deletingEmployeeId ===
                                                        employee.id ? (

                                                            <RefreshCw
                                                                size={15}
                                                                className="animate-spin"
                                                            />

                                                        ) : (

                                                            <Trash2
                                                                size={15}
                                                            />

                                                        )}

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

            </main>


            {/* =====================================================
                DELETE CONFIRMATION MODAL
            ===================================================== */}

            {employeeToDelete && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-slate-950/60
                        px-4
                        backdrop-blur-sm
                    "
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            if (
                                deletingEmployeeId ===
                                null
                            ) {
                                setEmployeeToDelete(
                                    null
                                );
                            }

                        }

                    }}
                >

                    <div className="
                        w-full
                        max-w-md
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-2xl

                        dark:border-slate-800
                        dark:bg-slate-900
                    ">


                        {/* MODAL HEADER */}

                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                            border-b
                            border-slate-200
                            px-6
                            py-5

                            dark:border-slate-800
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <div className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-red-500/10
                                    text-red-600
                                    dark:text-red-400
                                ">
                                    <AlertTriangle
                                        size={21}
                                    />
                                </div>


                                <div>

                                    <h2 className="
                                        text-lg
                                        font-semibold
                                    ">
                                        Delete Employee
                                    </h2>


                                    <p className="
                                        mt-0.5
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                    ">
                                        This action cannot
                                        be undone.
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setEmployeeToDelete(
                                        null
                                    )
                                }
                                disabled={
                                    deletingEmployeeId !==
                                    null
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
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50

                                    dark:hover:bg-slate-800
                                    dark:hover:text-white
                                "
                            >
                                <X size={17} />
                            </button>

                        </div>


                        {/* MODAL BODY */}

                        <div className="px-6 py-6">

                            <p className="
                                text-sm
                                leading-6
                                text-slate-600
                                dark:text-slate-300
                            ">

                                Are you sure you want to
                                permanently delete{" "}

                                <span className="
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                ">
                                    {employeeToDelete.username}
                                </span>

                                ?

                            </p>


                            <div className="
                                mt-4
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3

                                dark:border-red-500/20
                                dark:bg-red-500/10
                            ">

                                <p className="
                                    text-xs
                                    leading-5
                                    text-red-700
                                    dark:text-red-300
                                ">
                                    The employee account,
                                    leave requests,
                                    uploaded leave documents,
                                    and notifications associated
                                    with this employee will be
                                    permanently removed.
                                </p>

                            </div>

                        </div>


                        {/* MODAL ACTIONS */}

                        <div className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-slate-200
                            bg-slate-50
                            px-6
                            py-4
                            sm:flex-row
                            sm:justify-end

                            dark:border-slate-800
                            dark:bg-slate-950/50
                        ">

                            <button
                                type="button"
                                onClick={() =>
                                    setEmployeeToDelete(
                                        null
                                    )
                                }
                                disabled={
                                    deletingEmployeeId !==
                                    null
                                }
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-slate-600
                                    transition
                                    hover:bg-slate-100
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50

                                    dark:border-slate-700
                                    dark:bg-slate-900
                                    dark:text-slate-300
                                    dark:hover:bg-slate-800
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleDeleteEmployee
                                }
                                disabled={
                                    deletingEmployeeId !==
                                    null
                                }
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-red-600
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-red-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >

                                {deletingEmployeeId !==
                                null ? (

                                    <>
                                        <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                        />

                                        Deleting...
                                    </>

                                ) : (

                                    <>
                                        <Trash2
                                            size={16}
                                        />

                                        Delete Employee
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


export default ManagerEmployees;