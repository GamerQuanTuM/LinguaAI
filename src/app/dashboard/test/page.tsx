"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle, XCircle, Trophy, Sparkles } from "lucide-react";
import api from "@/lib/axios";
import confetti from "canvas-confetti";

type Question = {
    type: "multiple-choice" | "translate-word" | "correct-sentence" | "write-sentence";
    questionText: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
};

export default function TestPage() {
    const router = useRouter();
    const [testState, setTestState] = useState<"intro" | "loading" | "taking" | "feedback" | "complete">("intro");
    const [testId, setTestId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    
    // Test Progress
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);

    // Current Question State
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [typedAnswer, setTypedAnswer] = useState("");
    const [lastFeedback, setLastFeedback] = useState<"correct" | "incorrect" | null>(null);

    const startTest = async () => {
        setTestState("loading");
        try {
            const res = await api.post("/test/generate");
            setTestId(res.data.testId);
            setQuestions(res.data.test.questions);
            setTestState("taking");
        } catch (error) {
            console.error("Failed to generate test", error);
            alert("Could not load the test right now. Are you sure you've learned something this week?");
            setTestState("intro");
        }
    };

    const submitAnswer = () => {
        const question = questions[currentIndex];
        
        // Validation
        if (question.type === "multiple-choice" && !selectedOption) return;
        if (question.type !== "multiple-choice" && !typedAnswer.trim()) return;

        let isCorrect = false;

        if (question.type === "multiple-choice") {
            isCorrect = selectedOption === question.correctAnswer;
        } else {
            // Normalize for lenient text checking
            const normalizedTyped = typedAnswer.trim().toLowerCase().replace(/[.,!?]/g, "");
            const normalizedCorrect = question.correctAnswer.trim().toLowerCase().replace(/[.,!?]/g, "");
            isCorrect = normalizedTyped === normalizedCorrect;
        }

        if (isCorrect) setScore(s => s + 1);
        setLastFeedback(isCorrect ? "correct" : "incorrect");
        setTestState("feedback");
    };

    const nextQuestion = async () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(i => i + 1);
            setSelectedOption(null);
            setTypedAnswer("");
            setLastFeedback(null);
            setTestState("taking");
        } else {
            // Calculate final score
            const finalScore = score + (lastFeedback === "correct" ? 1 : 0);
            setTestState("complete");
            confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });

            // Send score to DB
            try {
                await api.post("/test/submit", { testId, score: finalScore });
            } catch (e) {
                console.error("Failed to submit score", e);
            }
        }
    };

    if (testState === "intro") {
        return (
            <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
                <div className="w-20 h-20 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy size={40} />
                </div>
                <h1 className="text-4xl font-bold">Comprehensive Weekly Test 📝</h1>
                <p className="opacity-70 text-xl">
                    Prove your skills on the vocabulary and grammar you've practiced this week.
                </p>

                <div className="glass-panel p-8 text-left space-y-4 max-w-sm mx-auto">
                    <h3 className="font-bold text-lg text-center">Test Format</h3>
                    <ul className="list-disc pl-5 opacity-80 space-y-2">
                        <li>Exactly 10 Questions</li>
                        <li>Includes multiple choice, translations, and sentence rewriting</li>
                        <li>Based strictly on your recent learning history</li>
                    </ul>
                </div>

                <button onClick={startTest} className="btn-primary w-full max-w-sm py-4 text-xl shadow-xl shadow-[var(--primary)]/30 transition-transform hover:scale-105">
                    Start Test Now
                </button>
            </div>
        );
    }

    if (testState === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="glass-panel p-12 text-center flex flex-col items-center justify-center">
                    <Sparkles className="animate-spin mb-6 text-[var(--primary)]" size={48} />
                    <h2 className="text-2xl font-bold mb-2">Generating Evaluation...</h2>
                    <p className="opacity-60">AI is analyzing your week's progress to construct a custom test.</p>
                </div>
            </div>
        );
    }

    if (testState === "taking" || testState === "feedback") {
        const q = questions[currentIndex];
        const isMixedChoice = q.type === "multiple-choice";

        return (
            <div className="max-w-3xl mx-auto space-y-8 py-8">
                <div className="flex items-center justify-between mb-8 opacity-60 font-bold text-sm">
                    <span className="uppercase tracking-widest text-[var(--primary)]">Question {currentIndex + 1} of {questions.length}</span>
                    <span>Score: {score}</span>
                </div>

                <motion.div 
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-8 border-2"
                >
                    <div className="mb-8">
                        <span className="inline-block bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold px-3 py-1 rounded-full mb-4">
                            {q.type.replace("-", " ")}
                        </span>
                        <h2 className="text-3xl font-bold leading-tight">{q.questionText}</h2>
                    </div>

                    {isMixedChoice ? (
                        <div className="grid gap-4">
                            {q.options?.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => testState === "taking" && setSelectedOption(opt)}
                                    disabled={testState === "feedback"}
                                    className={`p-5 rounded-xl border-2 text-left text-lg font-medium transition-all ${
                                        selectedOption === opt && testState === "taking" ? "border-[var(--primary)] bg-[var(--primary)]/10" :
                                        testState === "taking" ? "border-[var(--card-border)] hover:border-[var(--primary)]" :
                                        testState === "feedback" && opt === q.correctAnswer ? "border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]" :
                                        testState === "feedback" && selectedOption === opt ? "border-[var(--error)] bg-[var(--error)]/10 text-[var(--error)]" :
                                        "border-[var(--card-border)] opacity-40 grayscale"
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <input 
                                type="text"
                                placeholder="Type your answer here..."
                                value={testState === "taking" ? typedAnswer : typedAnswer || "— No Answer Provided —"}
                                onChange={(e) => setTypedAnswer(e.target.value)}
                                disabled={testState === "feedback"}
                                className={`w-full p-6 text-xl rounded-xl border-2 bg-[var(--background)] outline-none transition-colors ${
                                    testState === "taking" ? "border-[var(--card-border)] focus:border-[var(--primary)]" :
                                    lastFeedback === "correct" ? "border-[var(--success)] text-[var(--success)]" : "border-[var(--error)] text-[var(--error)]"
                                }`}
                                onKeyDown={(e) => { 
                                    if(e.key === "Enter" && testState === "taking") submitAnswer();
                                }}
                            />
                            {testState === "feedback" && lastFeedback === "incorrect" && (
                                <div className="p-4 bg-[var(--success)]/10 text-[var(--success)] rounded-xl border border-[var(--success)] font-bold text-lg">
                                    Expected: {q.correctAnswer}
                                </div>
                            )}
                        </div>
                    )}

                </motion.div>

                <AnimatePresence>
                    {testState === "feedback" && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--card-border)] shadow-xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                {lastFeedback === "correct" ? (
                                    <div className="w-12 h-12 rounded-full bg-[var(--success)]/20 text-[var(--success)] flex items-center justify-center">
                                        <CheckCircle size={28} />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-[var(--error)]/20 text-[var(--error)] flex items-center justify-center">
                                        <XCircle size={28} />
                                    </div>
                                )}
                                <div>
                                    <h4 className={`font-bold text-lg ${lastFeedback === "correct" ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
                                        {lastFeedback === "correct" ? "Perfect!" : "Keep learning."}
                                    </h4>
                                    <p className="opacity-80 text-sm mt-1 max-w-md">{q.explanation}</p>
                                </div>
                            </div>
                            <button onClick={nextQuestion} className="bg-[var(--primary)] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-110">
                                Next <ChevronRight size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {testState === "taking" && (
                    <div className="text-right">
                        <button 
                            onClick={submitAnswer} 
                            disabled={(isMixedChoice && !selectedOption) || (!isMixedChoice && !typedAnswer.trim())}
                            className="bg-[var(--primary)] text-white px-10 py-4 rounded-full font-bold text-lg disabled:opacity-50 transition-all hover:scale-105"
                        >
                            Submit Answer
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (testState === "complete") {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
                <div className="text-8xl mb-6">🏆</div>
                <h1 className="text-4xl font-bold">Test Complete!</h1>
                <p className="text-xl opacity-70">Here are your results for the week</p>

                <div className="glass-panel p-12 my-8 inline-block mt-4">
                    <div className="text-6xl font-black title-gradient">
                        {percentage}%
                    </div>
                    <div className="text-lg font-bold mt-2 font-mono">
                        ({score} / {questions.length} Correct)
                    </div>
                </div>

                <div className="max-w-xs mx-auto space-y-4">
                    <button onClick={() => router.push("/dashboard")} className="btn-primary w-full py-4 text-xl">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
