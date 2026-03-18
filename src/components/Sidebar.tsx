"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    BrainCircuit,
    Sparkles,
    Trophy,
    User,
    Settings,
    BarChart2,
    Menu,
    X,
    Bot
} from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Modules", href: "/dashboard/modules", icon: BookOpen },
    { name: "Vocabulary", href: "/dashboard/vocabulary", icon: BrainCircuit },
    { name: "Grammar", href: "/dashboard/grammar", icon: Sparkles },
    { name: "Ask AI", href: "/dashboard/ask", icon: Bot },
    { name: "Progress", href: "/dashboard/progress", icon: BarChart2 },
    { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--card-border)]">
                <div className="font-bold text-xl title-gradient">LinguaAI</div>
                <div className="flex gap-2">
                    <ThemeToggle />
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[var(--foreground)]">
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer (AnimatePresence) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 h-full w-64 bg-[var(--background)] border-r border-[var(--card-border)] z-40 flex flex-col p-6 pt-20 md:hidden shadow-2xl"
                    >
                        <div className="flex-1 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                            : "hover:bg-[var(--card)] hover:text-[var(--primary)] text-[var(--foreground)] opacity-80 hover:opacity-100"
                                            }`}>
                                            <Icon size={20} />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar (Static) */}
            <aside className="hidden md:flex h-full w-64 bg-[var(--background)] border-r border-[var(--card-border)] flex-col p-6 sticky top-0">
                <div className="flex justify-between items-center mb-10">
                    <div className="text-2xl font-bold title-gradient">LinguaAI</div>
                    <ThemeToggle />
                </div>

                <div className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                            >
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                    : "hover:bg-[var(--card)] hover:text-[var(--primary)] text-[var(--foreground)] opacity-80 hover:opacity-100"
                                    }`}>
                                    <Icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto pt-6 border-t border-[var(--card-border)]">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white text-center shadow-lg">
                        <p className="text-sm font-bold mb-1">Weekly Test</p>
                        <p className="text-xs opacity-90 mb-2">Coming up in 2 days</p>
                        <Link href="/dashboard/test">
                            <button className="text-xs bg-white text-[var(--primary)] px-3 py-1 rounded-full font-bold hover:scale-105 transition-transform">Prepare</button>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
