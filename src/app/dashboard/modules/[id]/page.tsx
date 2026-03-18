"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, XCircle, Volume2, Mic, Play, CheckCircle } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

type LessonStep = "intro" | "learn" | "quiz" | "complete";

// Korean Content Data
const LESSON_DATA = {
    title: "Ordering Food",
    submodule: "At the Restaurant",
    content: [
        {
            type: "vocab",
            korean: "비빔밥 주세요.",
            english: "Please give me Bibimbap.",
            phonetic: "/bibimbap juseyo/",
            description: "Polite way to order food.",
            audio: true
        },
        {
            type: "vocab",
            korean: "얼마예요?",
            english: "How much is it?",
            phonetic: "/eolmayeyo?/",
            description: "Essential for shopping and dining.",
            audio: true
        },
        {
            type: "grammar",
            title: "Politeness Partice '요' (Yo)",
            text: "In Korean, adding '요' (yo) to the end of a verb stem makes it polite. Use this with strangers and older people."
        }
    ],
    quiz: [
        {
            question: "How do you say 'Please give me'?",
            options: ["주세요 (Juseyo)", "가세요 (Gaseyo)", "안녕하세요 (Annyeonghaseyo)"],
            correct: 0
        },
        {
            question: "Translate: 'How much is it?'",
            options: ["어디예요? (Eodiyeyo?)", "얼마예요? (Eolmayeyo?)", "누구예요? (Nuguyeyo?)"],
            correct: 1
        }
    ]
};

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const [step, setStep] = useState<LessonStep>("intro");
    const [currentLearnIndex, setCurrentLearnIndex] = useState(0);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [quizFeedback, setQuizFeedback] = useState<"correct" | "incorrect" | null>(null);

    const totalSteps = 1 + LESSON_DATA.content.length + LESSON_DATA.quiz.length;

    const handleNext = () => {
        if (step === "intro") {
            setStep("learn");
        } else if (step === "learn") {
            if (currentLearnIndex < LESSON_DATA.content.length - 1) {
                setCurrentLearnIndex(prev => prev + 1);
            } else {
                setStep("quiz");
            }
        }
    };

    const handleAnswer = (index: number) => {
        if (quizFeedback !== null) return;
        setSelectedOption(index);

        const isCorrect = index === LESSON_DATA.quiz[currentQuizIndex].correct;
        setQuizFeedback(isCorrect ? "correct" : "incorrect");

        if (isCorrect) {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
            });
        }

        setTimeout(() => {
            if (currentQuizIndex < LESSON_DATA.quiz.length - 1) {
                setCurrentQuizIndex(prev => prev + 1);
                setSelectedOption(null);
                setQuizFeedback(null);
            } else {
                setStep("complete");
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                });
            }
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto min-h-[80vh] flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard/modules" className="p-2 hover:bg-black/5 rounded-full">
                    <XCircle size={24} className="opacity-50" />
                </Link>
                <div className="flex-1 mx-4 h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[var(--primary)] text-right pr-2"
                        initial={{ width: 0 }}
                        animate={{
                            width: step === 'complete' ? '100%' :
                                step === 'intro' ? '5%' :
                                    step === 'learn' ? `${((currentLearnIndex + 1) / totalSteps) * 100}%` :
                                        `${((LESSON_DATA.content.length + currentQuizIndex + 1) / totalSteps) * 100}%`
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="text-sm font-bold text-[var(--primary)]">
                    Module {params.id}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">

                    {/* INTRO STEP */}
                    {step === "intro" && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-24 h-24 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Play size={40} fill="currentColor" />
                            </div>
                            <h1 className="text-3xl font-bold">{LESSON_DATA.title}</h1>
                            <p className="text-xl opacity-70">{LESSON_DATA.submodule}</p>
                            <div className="p-4 glass-panel inline-block text-left text-sm opacity-80">
                                <p>🎯 Goal: Order delicious Korean food.</p>
                                <p>⏱️ Time: ~5 mins</p>
                            </div>
                            <div className="pt-8">
                                <button onClick={handleNext} className="btn-primary px-12 py-4 text-xl shadow-xl w-full md:w-auto">
                                    Let's Start
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* LEARN STEP */}
                    {step === "learn" && (
                        <motion.div
                            key={`learn-${currentLearnIndex}`}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-8"
                        >
                            {LESSON_DATA.content[currentLearnIndex].type === 'vocab' ? (
                                <div className="glass-panel p-8 md:p-12 text-center space-y-6 border-2 border-[var(--card-border)]">
                                    <div className="inline-block p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full mb-2">
                                        New Phrase
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--primary)]">
                                        {(LESSON_DATA.content[currentLearnIndex] as any).korean}
                                    </h2>
                                    <p className="text-xl font-mono opacity-60">
                                        {(LESSON_DATA.content[currentLearnIndex] as any).phonetic}
                                    </p>

                                    <div className="w-full h-[1px] bg-[var(--card-border)] my-6"></div>

                                    <h3 className="text-2xl font-medium">
                                        {(LESSON_DATA.content[currentLearnIndex] as any).english}
                                    </h3>

                                    <p className="opacity-70 italic text-sm">
                                        {(LESSON_DATA.content[currentLearnIndex] as any).description}
                                    </p>

                                    <div className="flex gap-4 justify-center pt-8">
                                        <button className="p-4 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-white transition-colors">
                                            <Volume2 size={24} />
                                        </button>
                                        <button className="p-4 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors">
                                            <Mic size={24} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-panel p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-[var(--background)] to-[var(--primary)]/5 border border-[var(--primary)]/20">
                                    <div className="inline-block p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full mb-2">
                                        Grammar Tip 💡
                                    </div>
                                    <h2 className="text-3xl font-bold">
                                        {(LESSON_DATA.content[currentLearnIndex] as any).title}
                                    </h2>
                                    <p className="text-xl leading-relaxed">
                                        {(LESSON_DATA.content[currentLearnIndex] as any).text}
                                    </p>
                                </div>
                            )}

                            <button onClick={handleNext} className="btn-primary w-full py-4 text-lg mt-8">
                                Got it, next!
                            </button>
                        </motion.div>
                    )}

                    {/* QUIZ STEP */}
                    {step === "quiz" && (
                        <motion.div
                            key={`quiz-${currentQuizIndex}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-8">
                                <span className="text-sm font-bold opacity-50 uppercase tracking-widest">Quiz Question</span>
                                <h2 className="text-2xl md:text-3xl font-bold mt-2">
                                    {LESSON_DATA.quiz[currentQuizIndex].question}
                                </h2>
                            </div>

                            <div className="grid gap-4">
                                {LESSON_DATA.quiz[currentQuizIndex].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={quizFeedback !== null}
                                        className={`
                                    p-6 rounded-xl border-2 text-left text-lg font-medium transition-all
                                    ${selectedOption === null ? 'border-[var(--card-border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5' : ''}
                                    ${selectedOption === idx && quizFeedback === 'correct' ? 'border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]' : ''}
                                    ${selectedOption === idx && quizFeedback === 'incorrect' ? 'border-[var(--error)] bg-[var(--error)]/10 text-[var(--error)]' : ''}
                                    ${selectedOption !== null && selectedOption !== idx ? 'opacity-50' : ''}
                                `}
                                    >
                                        <div className="flex justify-between items-center">
                                            {option}
                                            {selectedOption === idx && quizFeedback === 'correct' && <CheckCircle className="text-[var(--success)]" />}
                                            {selectedOption === idx && quizFeedback === 'incorrect' && <XCircle className="text-[var(--error)]" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* COMPLETE STEP */}
                    {step === "complete" && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 py-10"
                        >
                            <div className="text-8xl mb-4">🎉</div>
                            <h2 className="text-4xl font-bold title-gradient">Module Complete!</h2>
                            <p className="text-xl">You earned <span className="font-bold text-[var(--warning)]">50 XP</span></p>

                            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-8">
                                <div className="glass-panel p-4 flex flex-col items-center">
                                    <span className="text-2xl font-bold">100%</span>
                                    <span className="text-xs opacity-60 uppercase">Accuracy</span>
                                </div>
                                <div className="glass-panel p-4 flex flex-col items-center">
                                    <span className="text-2xl font-bold">2m 30s</span>
                                    <span className="text-xs opacity-60 uppercase">Time</span>
                                </div>
                            </div>

                            <div className="pt-8 space-y-3">
                                <Link href="/dashboard/modules">
                                    <button className="btn-primary w-full max-w-sm py-3 text-lg">
                                        Continue Path
                                    </button>
                                </Link>
                                <Link href="/dashboard">
                                    <button className="btn-secondary w-full max-w-sm py-3 border-none">
                                        Back to Dashboard
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

        </div>
    );
}
