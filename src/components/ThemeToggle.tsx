"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--card)] border border-[var(--card-border)] hover:bg-[var(--primary)] hover:text-white transition-colors"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "hard" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
            >
                {theme === "hard" ? <Moon size={20} /> : <Sun size={20} />}
            </motion.div>
        </button>
    );
}
