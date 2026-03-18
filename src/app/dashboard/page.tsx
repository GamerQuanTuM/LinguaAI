"use client";

import { motion } from "framer-motion";
import { Play, TrendingUp, Zap, Book, Award } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
    // const [addedToFlashcards, setAddedToFlashcards] = useState(false);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">안녕하세요, Traveler! 🇰🇷</h1>
                    <p className="text-[var(--foreground)] opacity-60">You're on a 5-day streak. Keep it up!</p>
                </div>
                <div className="flex items-center gap-3 bg-[var(--card)] p-2 rounded-full border border-[var(--card-border)]">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        <Zap size={16} fill="currentColor" />
                    </div>
                    <span className="font-bold pr-2">5 Days</span>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {/* Main Action: Continue Lesson */}
                <motion.div variants={item} className="col-span-1 md:col-span-2 glass-panel p-6 relative overflow-hidden group hover:border-[var(--primary)] transition-colors">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold px-3 py-1 rounded-full border border-[var(--primary)]/20">Current Module</span>
                            <span className="text-sm opacity-60">15 mins</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Ordering in Seoul 🥘</h3>
                        <p className="opacity-70 mb-6 max-w-md">Learn how to order Bibimbap and ask for side dishes.</p>

                        <Link href="/dashboard/modules">
                            <button className="bg-[var(--primary)] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-110 transition-transform hover:scale-105 shadow-xl shadow-[var(--primary)]/20">
                                <Play size={20} fill="currentColor" /> Continue Lesson
                            </button>
                        </Link>
                    </div>
                    {/* Decoration */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                </motion.div>

                {/* Daily Grammar/Vocab */}
                <motion.div variants={item} className="glass-panel p-6 relative overflow-hidden flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[var(--secondary)]/10 rounded-lg text-[var(--secondary)]">
                            <Book size={20} />
                        </div>
                        <h4 className="font-bold">Word of the Day</h4>
                    </div>
                    <div className="text-center py-4 flex-1 flex flex-col justify-center">
                        <div className="text-3xl font-bold mb-1 text-[var(--secondary)]">친구</div>
                        <div className="text-sm italic opacity-60">/chin-gu/ • Friend</div>
                    </div>
                    {/* <button
                        onClick={() => setAddedToFlashcards(true)}
                        disabled={addedToFlashcards}
                        className={`w-full mt-2 py-2 rounded-lg border transition-colors text-sm font-medium flex items-center justify-center gap-2 ${addedToFlashcards
                                ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20'
                                : 'border-[var(--card-border)] hover:bg-[var(--secondary)] hover:text-white'
                            }`}
                    >
                        {addedToFlashcards ? <><Check size={16} /> Added</> : 'Add to Flashcards'}
                    </button> */}
                </motion.div>

                {/* Progress Stats */}
                <motion.div variants={item} className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[var(--accent)]/10 rounded-lg text-[var(--accent)]">
                            <TrendingUp size={20} />
                        </div>
                        <h4 className="font-bold">Weekly Progress</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>XP Earned</span>
                                <span className="font-bold">1,250 / 2,000</span>
                            </div>
                            <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--accent)] w-[62%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Lessons Completed</span>
                                <span className="font-bold">4 / 7</span>
                            </div>
                            <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--success)] w-[57%]" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Next Achievement */}
                <motion.div variants={item} className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                            <Award size={20} />
                        </div>
                        <h4 className="font-bold">Next Achievement</h4>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[var(--card-border)] flex items-center justify-center opacity-50 grayscale">
                            🏆
                        </div>
                        <div>
                            <div className="font-bold">Hangul Hero</div>
                            <div className="text-xs opacity-60">Master the Korean alphabet</div>
                            <div className="text-xs font-medium text-[var(--primary)] mt-1">80% Completed</div>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
