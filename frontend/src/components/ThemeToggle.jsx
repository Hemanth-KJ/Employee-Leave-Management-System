import { useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const toggleTheme = () => {
        const newDarkMode = !darkMode;

        setDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add("dark");

            localStorage.setItem(
                "theme",
                "dark"
            );
        } else {
            document.documentElement.classList.remove("dark");

            localStorage.setItem(
                "theme",
                "light"
            );
        }
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={
                darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            className="
                group
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                text-black
                shadow-sm
                transition-all
                duration-300
                hover:bg-slate-100
                hover:shadow-md

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-yellow-400
                dark:hover:bg-slate-800
            "
        >

            {/* Moon */}

            <Moon
                size={19}
                strokeWidth={2}
                className={`
                    absolute
                    text-black
                    transition-all
                    duration-500
                    ease-in-out

                    ${
                        darkMode
                            ? "rotate-[180deg] scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100"
                    }
                `}
            />


            {/* Sun */}

            <Sun
                size={19}
                strokeWidth={2}
                className={`
                    absolute
                    text-yellow-400
                    transition-all
                    duration-500
                    ease-in-out

                    ${
                        darkMode
                            ? "rotate-0 scale-100 opacity-100"
                            : "rotate-[-360deg] scale-0 opacity-0"
                    }
                `}
            />

        </button>
    );
};

export default ThemeToggle;