"use client";

import { motion } from "framer-motion";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";

const modules = [
    { id: 1, title: "Hangul Basics (한글)", description: "Learn the Korean alphabet letters and sounds.", status: "completed", progress: 100 },
    { id: 2, title: "Greetings & Polite Manners", description: "Hello, Thank you, and Bowing etiquette.", status: "in-progress", progress: 45 },
    { id: 3, title: "Ordering Food (식당)", description: "Reading menus and ordering dishes.", status: "locked", progress: 0 },
    { id: 4, title: "Numbers & Counting", description: "Sino-Korean and Native Korean numbers.", status: "locked", progress: 0 },
    { id: 5, title: "Taking Intracity Bus/Subway", description: "Navigating Seoul public transport.", status: "locked", progress: 0 },
];

export default function ModulesPage() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Learning Path 🗺️</h1>
                <p className="opacity-70">Your journey to fluency in Korean.</p>
            </div>

            <div className="space-y-4">
                {modules.map((module, index) => (
                    <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-panel p-6 flex flex-col md:flex-row items-center gap-6 border-l-4 ${module.status === 'completed' ? 'border-l-[var(--success)]' :
                            module.status === 'in-progress' ? 'border-l-[var(--primary)]' : 'border-l-[var(--card-border)] opacity-70'
                            }`}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold">{module.title}</h3>
                                {module.status === 'completed' && <CheckCircle size={18} className="text-[var(--success)]" />}
                                {module.status === 'locked' && <Lock size={18} className="opacity-50" />}
                            </div>
                            <p className="text-sm opacity-70 mb-3">{module.description}</p>

                            {module.status !== 'locked' && (
                                <div className="w-full max-w-sm h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${module.status === 'completed' ? 'bg-[var(--success)]' : 'bg-[var(--primary)]'}`}
                                        style={{ width: `${module.progress}%` }}
                                    />
                                </div>
                            )}
                        </div>

                        <Link
                            href={module.status !== 'locked' ? `/dashboard/modules/${module.id}` : '#'}
                            className={module.status === 'locked' ? 'pointer-events-none' : ''}
                        >
                            <button
                                disabled={module.status === 'locked'}
                                className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${module.status === 'locked'
                                        ? 'bg-[var(--card-border)] text-[var(--foreground)] opacity-50 cursor-not-allowed'
                                        : 'bg-[var(--primary)] text-white hover:brightness-110 shadow-lg shadow-[var(--primary)]/20'
                                    }`}
                            >
                                {module.status === 'completed' ? 'Review' : module.status === 'in-progress' ? 'Continue' : 'Locked'}
                                {module.status !== 'locked' && <PlayCircle size={18} />}
                            </button>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
