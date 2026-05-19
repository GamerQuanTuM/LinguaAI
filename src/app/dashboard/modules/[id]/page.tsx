"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Play, CheckCircle } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import api from "@/lib/axios";

type LessonStep = "intro" | "learn" | "quiz" | "complete";

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const [lessonData, setLessonData] = useState<any>(null);
    const [step, setStep] = useState<LessonStep>("intro");
    const [currentLearnIndex, setCurrentLearnIndex] = useState(0);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [quizFeedback, setQuizFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("currentLesson");
        if (stored) {
            const parsed = JSON.parse(stored);
            
            const content: any[] = [];
            const quiz: any[] = [];
            const learnedVocabulary: string[] = [];
            const learnedGrammar: string[] = [];

            if (parsed.vocabulary && Array.isArray(parsed.vocabulary)) {
                parsed.vocabulary.forEach((v: any) => {
                    content.push({
                        type: "vocab",
                        korean: v.word,
                        english: v.translation,
                        phonetic: "", 
                        description: v.example ? `Example: ${v.example} (${v.exampleTranslation})` : "",
                        audio: true
                    });
                    learnedVocabulary.push(v.word);
                    
                    const options = [v.word];
                    parsed.vocabulary.forEach((ov: any) => {
                        if (ov.word !== v.word && options.length < 3) options.push(ov.word);
                    });
                    while(options.length < 3) {
                       options.push("... (padding)"); // Fallback if too few words
                    }
                    const shuffled = options.sort(() => Math.random() - 0.5);
                    quiz.push({
                        question: `How do you translate: '${v.translation}'?`,
                        options: shuffled,
                        correctWord: v.word
                    });
                });
            }

            if (parsed.grammar && Array.isArray(parsed.grammar)) {
                parsed.grammar.forEach((g: any) => {
                    content.push({
                        type: "grammar",
                        title: g.ruleName,
                        text: g.explanation + (g.examples && g.examples.length ? `\n\nExamples:\n${g.examples.join('\n')}` : "")
                    });
                    learnedGrammar.push(g.ruleName);
                });
            }

            if (content.length === 0) {
                // Failsafe
                content.push({ type: "grammar", title: "Practice", text: "You have completed your goals for this module." });
            }

            const finalQuiz = quiz.map((q: any) => ({
                question: q.question,
                options: q.options,
                correct: q.options.indexOf(q.correctWord)
            }));

            if (finalQuiz.length === 0) {
                finalQuiz.push({ question: "Did you understand the lesson?", options: ["Yes", "Absolutely"], correct: 0 });
            }

            setLessonData({
                title: parsed.title || "Custom Lesson",
                submodule: "AI Generated",
                content,
                quiz: finalQuiz,
                rawVocabulary: learnedVocabulary,
                rawGrammar: learnedGrammar
            });
        }
    }, []);

    if (!lessonData) return <div className="p-12 text-center opacity-50">Loading lesson...</div>;

    const totalSteps = 1 + lessonData.content.length + lessonData.quiz.length;

    const handleNext = () => {
        if (step === "intro") {
            setStep("learn");
        } else if (step === "learn") {
            if (currentLearnIndex < lessonData.content.length - 1) {
                setCurrentLearnIndex(prev => prev + 1);
            } else {
                setStep("quiz");
            }
        }
    };

    const handleAnswer = (index: number) => {
        if (quizFeedback !== null) return;
        setSelectedOption(index);

        const isCorrect = index === lessonData.quiz[currentQuizIndex].correct;
        setQuizFeedback(isCorrect ? "correct" : "incorrect");

        if (isCorrect) {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        }

        setTimeout(() => {
            if (currentQuizIndex < lessonData.quiz.length - 1) {
                setCurrentQuizIndex(prev => prev + 1);
                setSelectedOption(null);
                setQuizFeedback(null);
            } else {
                completeLesson();
            }
        }, 1500);
    };

    const completeLesson = async () => {
        setStep("complete");
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        
        // Save Progress
        const token = localStorage.getItem("token");
        if (!token) return;
        
        setSaving(true);
        try {
            await api.post("/progress/save", {
                learnedVocabulary: lessonData.rawVocabulary,
                learnedGrammar: lessonData.rawGrammar
            });
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto min-h-[80vh] flex flex-col">
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
                                        `${((lessonData.content.length + currentQuizIndex + 1) / totalSteps) * 100}%`
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="text-sm font-bold text-[var(--primary)]">
                    Lesson Path
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">

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
                            <h1 className="text-3xl font-bold">{lessonData.title}</h1>
                            <p className="text-xl opacity-70">{lessonData.submodule}</p>
                            <div className="pt-8">
                                <button onClick={handleNext} className="btn-primary px-12 py-4 text-xl shadow-xl w-full md:w-auto">
                                    Let's Start
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === "learn" && (
                        <motion.div
                            key={`learn-${currentLearnIndex}`}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-8"
                        >
                            {lessonData.content[currentLearnIndex].type === 'vocab' ? (
                                <div className="glass-panel p-8 md:p-12 text-center space-y-6 border-2 border-[var(--card-border)]">
                                    <div className="inline-block p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full mb-2">
                                        New Phrase
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--primary)]">
                                        {(lessonData.content[currentLearnIndex] as any).korean}
                                    </h2>
                                    <h3 className="text-2xl font-medium mt-4">
                                        {(lessonData.content[currentLearnIndex] as any).english}
                                    </h3>
                                    <p className="opacity-70 italic text-sm mt-4">
                                        {(lessonData.content[currentLearnIndex] as any).description}
                                    </p>
                                </div>
                            ) : (
                                <div className="glass-panel p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-[var(--background)] to-[var(--primary)]/5 border border-[var(--primary)]/20">
                                    <div className="inline-block p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full mb-2">
                                        Grammar Tip 💡
                                    </div>
                                    <h2 className="text-3xl font-bold">
                                        {(lessonData.content[currentLearnIndex] as any).title}
                                    </h2>
                                    <p className="text-xl leading-relaxed whitespace-pre-wrap">
                                        {(lessonData.content[currentLearnIndex] as any).text}
                                    </p>
                                </div>
                            )}

                            <button onClick={handleNext} className="btn-primary w-full py-4 text-lg mt-8">
                                Got it, next!
                            </button>
                        </motion.div>
                    )}

                    {step === "quiz" && (
                        <motion.div
                            key={`quiz-${currentQuizIndex}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-8">
                                <span className="text-sm font-bold opacity-50 uppercase tracking-widest">Quiz Challenge</span>
                                <h2 className="text-2xl md:text-3xl font-bold mt-2">
                                    {lessonData.quiz[currentQuizIndex].question}
                                </h2>
                            </div>

                            <div className="grid gap-4">
                                {lessonData.quiz[currentQuizIndex].options.map((option: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={quizFeedback !== null}
                                        className={`p-6 rounded-xl border-2 text-left text-lg font-medium transition-all
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

                            <div className="pt-8 flex flex-col gap-3">
                                <Link href="/dashboard/modules">
                                    <button className="btn-primary w-full max-w-sm py-3 text-lg" disabled={saving}>
                                        {saving ? "Saving Progress..." : "Continue Path"}
                                    </button>
                                </Link>
                                <Link href="/dashboard">
                                    <button className="btn-secondary w-full max-w-sm py-3 border-none disabled:opacity-50">
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
