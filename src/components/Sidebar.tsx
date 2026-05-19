"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    BrainCircuit,
    Sparkles,
    User,
    Settings,
    BarChart2,
    Menu,
    X,
    Bot,
    Languages,
    LogOut,
    Hash,
    Lock,
    Unlock,
} from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const mainNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Modules", href: "/dashboard/modules", icon: BookOpen },
    { name: "Vocabulary", href: "/dashboard/vocabulary", icon: BrainCircuit },
    { name: "Grammar", href: "/dashboard/grammar", icon: Sparkles },
    { name: "Ask AI", href: "/dashboard/ask", icon: Bot },
    { name: "Progress", href: "/dashboard/progress", icon: BarChart2 },
    // { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

function NavLink({ href, name, icon: Icon, active, onClick }: { href: string; name: string; icon: any; active: boolean; onClick?: () => void }) {
    return (
        <Link href={href} onClick={onClick}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                : "hover:bg-[var(--card)] hover:text-[var(--primary)] text-[var(--foreground)] opacity-80 hover:opacity-100"
                }`}>
                <Icon size={20} />
                <span className="font-medium">{name}</span>
            </div>
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Clear the cookie used by Next.js middleware
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/login");
    };
    const [isKoreanBeginner, setIsKoreanBeginner] = useState(false);
    const [isTestUnlocked, setIsTestUnlocked] = useState(false);

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            if (userData) {
                const user = JSON.parse(userData);
                // Show Hangul guide for Korean learners at beginner/elementary level
                const isKorean = user.language?.toLowerCase() === "korean";
                const isBeginner = ["beginner", "elementary", "a1", "a2"].some(
                    (lvl) => user.level?.toLowerCase().includes(lvl)
                );
                setIsKoreanBeginner(isKorean && isBeginner);
            }
        } catch (e) {
            // ignore
        }

        const checkWeekend = () => {
            const now = new Date();
            const day = now.getDay();
            setIsTestUnlocked(day === 0 || day === 6);
        };

        checkWeekend();
        const interval = setInterval(checkWeekend, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
        <>
            <div className="flex-1 space-y-1 overflow-y-auto">
                {mainNavItems.map((item) => (
                    <NavLink
                        key={item.href}
                        href={item.href}
                        name={item.name}
                        icon={item.icon}
                        active={pathname === item.href}
                        onClick={onClose}
                    />
                ))}

                {/* Korean Beginner Hangul section */}
                {isKoreanBeginner && (
                    <div className="pt-3 mt-3 border-t border-[var(--card-border)]">
                        <div className="px-4 mb-2 text-xs font-bold uppercase tracking-widest opacity-40">
                            Korean Essentials
                        </div>
                        <Link href="/dashboard/hangul" onClick={onClose}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/dashboard/hangul"
                                ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg"
                                : "hover:bg-[var(--card)] hover:text-[var(--primary)] text-[var(--foreground)] opacity-80 hover:opacity-100"
                                }`}>
                                <Languages size={20} />
                                <div>
                                    <div className="font-medium leading-tight">한글 Guide</div>
                                    <div className="text-xs opacity-60 leading-tight mt-0.5">Hangul reference</div>
                                </div>
                            </div>
                        </Link>
                        <Link href="/dashboard/numbers" onClick={onClose}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/dashboard/numbers"
                                ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg"
                                : "hover:bg-[var(--card)] hover:text-[var(--primary)] text-[var(--foreground)] opacity-80 hover:opacity-100"
                                }`}>
                                <Hash size={20} />
                                <div>
                                    <div className="font-medium leading-tight">숫자 Numbers</div>
                                    <div className="text-xs opacity-60 leading-tight mt-0.5">Sino &amp; Native systems</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-6 border-t border-[var(--card-border)] space-y-3">
                <div className={`p-4 rounded-xl text-white text-center shadow-lg transition-all ${isTestUnlocked
                    ? "bg-gradient-to-br from-[var(--success)] to-[var(--primary)]"
                    : "bg-gradient-to-br from-gray-500 to-gray-600 opacity-80"
                    }`}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                        {isTestUnlocked ? <Unlock size={16} /> : <Lock size={16} />}
                        <p className="text-sm font-bold">Weekly Test</p>
                    </div>
                    <p className="text-xs opacity-90 mb-3">
                        {isTestUnlocked ? "Test is live! Good luck!" : "Unlocks on Weekends"}
                    </p>
                    {isTestUnlocked ? (
                        <Link href="/dashboard/test">
                            <button className="w-full text-xs bg-white text-[var(--success)] py-2 rounded-lg font-bold hover:scale-105 transition-transform">
                                Take Test Now
                            </button>
                        </Link>
                    ) : (
                        <div className="text-xs bg-white/20 text-white/60 py-2 rounded-lg font-bold cursor-not-allowed">
                            Prepare Test
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--error)] opacity-70 hover:opacity-100 hover:bg-[var(--error)]/10 transition-all font-medium text-sm"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </>
    );

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

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 h-full w-64 bg-[var(--background)] border-r border-[var(--card-border)] z-40 flex flex-col p-6 pt-20 md:hidden shadow-2xl"
                    >
                        <SidebarContent onClose={() => setIsOpen(false)} />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex h-full w-64 bg-[var(--background)] border-r border-[var(--card-border)] flex-col p-6 sticky top-0">
                <div className="flex justify-between items-center mb-8">
                    <div className="text-2xl font-bold title-gradient">LinguaAI</div>
                    <ThemeToggle />
                </div>
                <SidebarContent />
            </aside>
        </>
    );
}
