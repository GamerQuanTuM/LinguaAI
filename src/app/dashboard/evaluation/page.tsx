"use client";

import { motion } from "framer-motion";
import { Award, Zap, ChevronLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import api from "@/lib/axios";

export default function EvaluationPage() {
    const [evaluating, setEvaluating] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const runEvaluation = async () => {
        setEvaluating(true);
        setError(null);
        try {
            const res = await api.post("/level/evaluate");
            const data = res.data;
            
            setResult(data);
            // Update local storage user level if passed
            if (data.evaluation.passLevel) {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                user.level = data.newLevel;
                localStorage.setItem("user", JSON.stringify(user));
                
                setTimeout(() => {
                    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
                }, 500);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Something went wrong calculating your level.");
        } finally {
            setEvaluating(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 min-h-[70vh] flex flex-col justify-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-colors mb-4">
                <ChevronLeft size={16} /> Back to Dashboard
            </Link>

            <div className="text-center">
                <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award size={40} />
                </div>
                <h1 className="text-4xl font-bold mb-4">Level Evaluation</h1>
                <p className="opacity-70 text-lg">Our AI will analyze your learning history, vocabulary mastered, and test results to see if you are ready to promote to the next fluency level.</p>
            </div>

            {!result && !evaluating && (
                <div className="pt-8 text-center">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={runEvaluation} 
                        className="btn-primary px-12 py-4 text-xl shadow-xl shadow-[var(--primary)]/20"
                    >
                        Start Evaluation
                    </motion.button>
                    {error && <p className="text-[var(--error)] mt-4 p-4 glass-panel border border-[var(--error)]/20">{error}</p>}
                </div>
            )}

            {evaluating && (
                <div className="glass-panel p-12 text-center flex flex-col items-center justify-center">
                    <Zap className="animate-pulse mb-6 text-[var(--primary)]" size={48} />
                    <h2 className="text-2xl font-bold mb-2">Analyzing progress...</h2>
                    <p className="opacity-60">AI is reviewing your vocabulary and grammar retention.</p>
                </div>
            )}

            {result && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`glass-panel p-8 text-center border-2 ${result.evaluation.passLevel ? 'border-[var(--success)] bg-[var(--success)]/5' : 'border-[var(--card-border)]'}`}
                >
                    <div className="text-6xl mb-6">
                        {result.evaluation.passLevel ? '🚀' : '📚'}
                    </div>
                    <h2 className="text-3xl font-bold mb-2">
                        {result.evaluation.passLevel ? 'Congratulations!' : 'Keep Practicing'}
                    </h2>
                    
                    <p className="text-xl mb-6 opacity-80 whitespace-pre-wrap">
                        {result.evaluation.feedback}
                    </p>

                    <div className="inline-block p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)] mb-8">
                        <span className="opacity-60 block text-sm mb-1">Your Level is now</span>
                        <span className="text-2xl font-bold text-[var(--primary)]">{result.newLevel}</span>
                    </div>

                    <div>
                        <Link href="/dashboard">
                            <button className="btn-primary px-12 py-4 text-lg">
                                Return to Dashboard
                            </button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
