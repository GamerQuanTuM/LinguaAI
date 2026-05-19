"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, BrainCircuit, RotateCcw, Lock, Unlock, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function ModulesPage() {
    const router = useRouter();
    const [generating, setGenerating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);
    const [timeUntilTest, setTimeUntilTest] = useState("");
    const [isTestUnlocked, setIsTestUnlocked] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get("/modules/history");
                setHistory(res.data.history);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };

        const calculateTestCountdown = () => {
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
            
            // Unlocked on Saturday and Sunday
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                setIsTestUnlocked(true);
                setTimeUntilTest("Test is Unlocked!");
            } else {
                setIsTestUnlocked(false);
                let daysUntilSaturday = 6 - dayOfWeek;
                const nextSaturday = new Date(now);
                nextSaturday.setDate(now.getDate() + daysUntilSaturday);
                nextSaturday.setHours(0, 0, 0, 0);

                const diffTime = nextSaturday.getTime() - now.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);

                if (diffDays > 0) {
                    setTimeUntilTest(`Coming up in ${diffDays} day${diffDays > 1 ? 's' : ''}`);
                } else if (diffHours > 0) {
                    setTimeUntilTest(`Coming up in ${diffHours} hour${diffHours > 1 ? 's' : ''}`);
                } else {
                    setTimeUntilTest("Coming up soon");
                }
            }
        };

        fetchHistory();
        calculateTestCountdown();
    }, []);

    const generateOrStartLesson = async (type: "vocabulary" | "grammar") => {
        setGenerating(true);
        try {
            const res = await api.post("/modules/generate");
            const fullLesson = res.data.lesson;

            // Filter based on user's choice
            const filteredLesson = {
                title: type === "vocabulary" ? "Daily Vocabulary Drill" : "Daily Grammar Rules",
                vocabulary: type === "vocabulary" ? fullLesson.vocabulary : [],
                grammar: type === "grammar" ? fullLesson.grammar : []
            };

            localStorage.setItem("currentLesson", JSON.stringify(filteredLesson));
            router.push("/dashboard/modules/active");
        } catch (error) {
            console.error(error);
            alert("Error preparing lesson");
            setGenerating(false);
        }
    };

    const startRevision = (pastLesson: any, type: "vocabulary" | "grammar") => {
        const filteredLesson = {
            title: `Review: ${new Date(pastLesson.date).toLocaleDateString()} (${type})`,
            vocabulary: type === "vocabulary" ? pastLesson.vocabulary : [],
            grammar: type === "grammar" ? pastLesson.grammar : []
        };
        localStorage.setItem("currentLesson", JSON.stringify(filteredLesson));
        router.push("/dashboard/modules/active");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="glass-panel p-12 text-center flex flex-col items-center justify-center">
                    <Sparkles className="animate-spin mb-6 text-[var(--primary)]" size={48} />
                    <h2 className="text-2xl font-bold mb-2">Loading Modules...</h2>
                    <p className="opacity-60">Fetching your lesson history and weekly test status.</p>
                </div>
            </div>
        );
    }

    if (generating) {
        return (
            <div className="glass-panel p-12 text-center flex flex-col items-center justify-center min-h-[50vh]">
                <Sparkles className="animate-spin mb-6 text-[var(--primary)]" size={48} />
                <h2 className="text-2xl font-bold mb-2">Crafting your lesson...</h2>
                <p className="opacity-60">The AI is preparing your targeted learning path. This usually takes 10-15 seconds.</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-2">AI Lesson Workspace ⚡</h1>
                <p className="opacity-70">Your curated daily 10 vocabulary words and 4 grammar rules.</p>
            </div>

            {/* Today's Lessons */}
            <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap size={20} className="text-[var(--primary)]" /> Today's Core Lessons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => generateOrStartLesson("vocabulary")}
                        className="glass-panel p-6 cursor-pointer border-2 border-transparent hover:border-[var(--primary)] transition-all group"
                    >
                        <div className="p-4 inline-block rounded-full mb-4 bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Vocabulary Drill</h3>
                        <p className="opacity-60 text-sm mb-4">Master today's 10 new words and phrases.</p>
                        <span className="text-sm font-bold text-[var(--primary)] group-hover:underline">Start Practice →</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => generateOrStartLesson("grammar")}
                        className="glass-panel p-6 cursor-pointer border-2 border-transparent hover:border-[var(--secondary)] transition-all group"
                    >
                        <div className="p-4 inline-block rounded-full mb-4 bg-[var(--secondary)] text-white shadow-lg shadow-[var(--secondary)]/30 group-hover:scale-110 transition-transform">
                            <BrainCircuit size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Grammar Rules</h3>
                        <p className="opacity-60 text-sm mb-4">Learn today's 4 core sentence structures.</p>
                        <span className="text-sm font-bold text-[var(--secondary)] group-hover:underline">Start Practice →</span>
                    </motion.div>
                </div>
            </section>

            {/* Weekend Test Section */}
            <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    {isTestUnlocked ? <Unlock size={20} className="text-[var(--success)]" /> : <Lock size={20} className="text-[var(--card-border)]" />}
                    Weekly Knowledge Test
                </h2>
                <motion.div 
                    className={`glass-panel p-6 relative overflow-hidden flex items-center justify-between transition-colors border-2 ${isTestUnlocked ? "border-[var(--success)] cursor-pointer hover:bg-[var(--success)]/5" : "border-[var(--card-border)] opacity-80"}`}
                    onClick={() => {
                        if(isTestUnlocked) router.push("/dashboard/test");
                    }}
                >
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Comprehensive Weekend Test</h3>
                        <p className="opacity-60 text-sm max-w-md">
                            A custom test covering all the vocabulary and grammar you've learned this week.
                        </p>
                    </div>
                    <div className="ml-4 text-right">
                        <div className={`text-sm font-bold px-4 py-2 rounded-full inline-block ${isTestUnlocked ? "bg-[var(--success)] text-white" : "bg-[var(--card-border)] text-white"}`}>
                            {timeUntilTest}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Revision Section */}
            {history.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><RotateCcw size={20} className="text-[var(--primary)] opacity-70" /> Revise Previous Days</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {history.map((lesson: any, i: number) => (
                            <div key={lesson.id} className="glass-panel p-4 flex flex-col justify-between">
                                <div className="mb-4">
                                    <h4 className="font-bold">{new Date(lesson.date).toLocaleDateString()}</h4>
                                    <p className="text-xs opacity-60">10 Vocab • 4 Grammar</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => startRevision(lesson, "vocabulary")}
                                        className="flex-1 text-xs py-2 rounded-lg bg-[var(--background)] border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors text-center font-bold"
                                    >
                                        Revise Vocab
                                    </button>
                                    <button 
                                        onClick={() => startRevision(lesson, "grammar")}
                                        className="flex-1 text-xs py-2 rounded-lg bg-[var(--background)] border border-[var(--secondary)] text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-white transition-colors text-center font-bold"
                                    >
                                        Revise Grammar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
