"use client";

import { motion } from "framer-motion";
import { Play, TrendingUp, Zap, Book, Award, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function DashboardHome() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [wordOfTheDay, setWordOfTheDay] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [progressStats, setProgressStats] = useState<any>(null);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            router.push("/login");
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const fetchData = async () => {
            try {
                const [wodRes, statsRes] = await Promise.all([
                    api.get(`/word-of-the-day?language=${parsedUser.language}`),
                    api.get(`/progress/stats`)
                ]);
                setWordOfTheDay(wodRes.data.word);
                setProgressStats(statsRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="glass-panel p-12 text-center flex flex-col items-center justify-center">
                    <Sparkles className="animate-spin mb-6 text-[var(--primary)]" size={48} />
                    <h2 className="text-2xl font-bold mb-2">Syncing Workspace...</h2>
                    <p className="opacity-60">Preparing your dashboard and fetching daily content.</p>
                </div>
            </div>
        );
    }

    const greetingLang: any = {
        "Spanish": "Hola", "French": "Bonjour", "German": "Hallo", "Japanese": "こんにちは", "Italian": "Ciao", "Mandarin": "你好", "Korean": "안녕하세요"
    };
    const greeting = greetingLang[user.language] || "Hello";
    const name = user.email.split('@')[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{greeting}, {name}!</h1>
                    <p className="text-[var(--foreground)] opacity-60">Welcome back. Ready to master {user.language}?</p>
                </div>
                <div className="flex items-center gap-3 bg-[var(--card)] p-2 rounded-full border border-[var(--card-border)]">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        <Zap size={16} fill="currentColor" />
                    </div>
                    <span className="font-bold pr-2">Level {user.level}</span>
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
                            <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold px-3 py-1 rounded-full border border-[var(--primary)]/20">Next Module</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Generate New Lesson</h3>
                        <p className="opacity-70 mb-6 max-w-md">Let AI generate a customized lesson based on your current level ({user.level}).</p>

                        <Link href="/dashboard/modules">
                            <button className="bg-[var(--primary)] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-110 transition-transform hover:scale-105 shadow-xl shadow-[var(--primary)]/20">
                                <Play size={20} fill="currentColor" /> Start Lesson Workspace
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
                        {wordOfTheDay ? (
                            <>
                                <div className="text-3xl font-bold mb-1 text-[var(--secondary)]">{wordOfTheDay.word}</div>
                                <div className="text-sm italic opacity-60 font-medium">✨ {wordOfTheDay.meaning}</div>
                                {wordOfTheDay.example && (
                                    <div className="mt-4 text-xs opacity-70 border-t border-[var(--card-border)] pt-4">
                                        "{wordOfTheDay.example}"
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-sm opacity-60">Generating your word...</div>
                        )}
                    </div>
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
                                <span>Words This Week</span>
                                <span className="font-bold">{progressStats?.weekVocab ?? "—"}</span>
                            </div>
                            <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[var(--secondary)] rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(100, ((progressStats?.weekVocab || 0) / 70) * 100)}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Grammar Rules</span>
                                <span className="font-bold">{progressStats?.weekGrammar ?? "—"}</span>
                            </div>
                            <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(100, ((progressStats?.weekGrammar || 0) / 28) * 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[var(--card-border)]">
                            <span className="text-xs opacity-50">🔥 {progressStats?.streak ?? 0} day streak</span>
                            <Link href="/dashboard/progress" className="text-xs font-bold text-[var(--primary)] hover:underline">View All →</Link>
                        </div>
                    </div>
                </motion.div>

                {/* Evaluation Achievement */}
                <motion.div variants={item} className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                            <Award size={20} />
                        </div>
                        <h4 className="font-bold">Level Evaluation</h4>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[var(--card-border)] flex items-center justify-center">
                            🚀
                        </div>
                        <div>
                            <div className="font-bold">Ready to promote?</div>
                            <div className="text-xs opacity-60">Take an evaluation to level up</div>
                            <Link href="/dashboard/evaluation" className="text-xs font-medium text-[var(--primary)] mt-1 hover:underline">
                                Start Evaluation Mode →
                            </Link>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
