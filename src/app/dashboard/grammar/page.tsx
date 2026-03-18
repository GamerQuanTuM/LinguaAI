"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Bookmark } from "lucide-react";
import confetti from "canvas-confetti";

export default function GrammarPage() {
    const [practiceActive, setPracticeActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

    const lessons = {
        title: "Subject Marking Particles: 이 (i) / 가 (ga)",
        level: "Beginner • Level 1",
        introduction: "In English, word order often determines the subject of a sentence (e.g., 'The dog bites the man' vs 'The man bites the dog'). In Korean, **Particles** are attached to words to indicate their role.",
        core_concept: {
            definition: "**Subject Particles** mark the noun as the 'doer' or the 'subject' of the verb.",
            rule: "The choice between **이** and **가** depends entirely on the sound at the end of the previous noun."
        },
        rules: [
            {
                condition: "Ends in a Consonant (Batchim)",
                ending: "이 (i)",
                example_kr: "학생 (Student)",
                example_full: "학생이 (The student...)",
                explanation: "Hakseng ends in 'ng', so we add 'i' to make it flow smoothly."
            },
            {
                condition: "Ends in a Vowel (No Batchim)",
                ending: "가 (ga)",
                example_kr: "의자 (Chair)",
                example_full: "의자가 (The chair...)",
                explanation: "Uija ends in 'a', so we add 'ga'."
            }
        ],
        irregular: [
            {
                noun: "나 (I - Casual)",
                result: "내가 (Nae-ga)",
                note: "Not '나가'"
            },
            {
                noun: "저 (I - Formal)",
                result: "제가 (Je-ga)",
                note: "Not '저가'"
            },
            {
                noun: "너 (You)",
                result: "네가 (Ne-ga)",
                note: "Not '너가'"
            },
            {
                noun: "누구 (Who)",
                result: "누가 (Nu-ga)",
                note: "Not '누구가'"
            }
        ],
        examples: [
            { kr: "선생님이 가요.", en: "The teacher is going.", breakdown: "Teacher (선생님) + 이 + go (가요)" },
            { kr: "비가 와요.", en: "The rain is coming (It's raining).", breakdown: "Rain (비) + 가 + come (와요)" },
            { kr: "제가 할게요.", en: "I will do it (formal).", breakdown: "I (저 -> 제) + 가 + do (할게요) [Irregular]" }
        ]
    };

    const questions = [
        {
            q: "Choose the correct particle for 'School' (학교 - ends in 'yo')",
            options: ["학교이", "학교가"],
            correct: 1,
            hint: "Ends in a vowel, so needs 가."
        },
        {
            q: "Choose the correct particle for 'Bag' (가방 - ends in 'ng')",
            options: ["가방이", "가방가"],
            correct: 0,
            hint: "Ends in a consonant, so needs 이."
        },
        {
            q: "Complete: ____ _ (The friend eats.) - Friend is '친구'",
            options: ["친구가 먹어요", "친구이 먹어요"],
            correct: 0,
            hint: "친구 (Chingu) ends in a vowel."
        },
        {
            q: "How do you say 'I' (Formal) as a Subject?",
            options: ["저가", "제가"],
            correct: 1,
            hint: "This is an irregular form! 저 + 가 becomes 제가."
        }
    ];

    const handleAnswer = (idx: number) => {
        if (feedback !== null) return;

        const isCorrect = idx === questions[currentStep].correct;
        setFeedback(isCorrect ? "correct" : "incorrect");

        if (isCorrect) {
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.8 }
            });
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentStep < questions.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setPracticeActive(false);
                setCurrentStep(0);
                alert("Practice Complete! Great job.");
            }
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl">
                    <Bookmark size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Grammar Lab ⚗️</h1>
                    <p className="opacity-60">{lessons.level}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* TEXTBOOK CONTENT */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Intro Card */}
                    <section className="glass-panel p-8">
                        <h2 className="text-2xl font-bold mb-4 title-gradient">{lessons.title}</h2>
                        <p className="text-lg leading-relaxed opacity-80 mb-6">{lessons.introduction}</p>

                        <div className="bg-[var(--card)] p-6 rounded-xl border-l-4 border-[var(--primary)] shadow-sm">
                            <h3 className="font-bold text-[var(--primary)] mb-2">💡 Core Concept</h3>
                            <p className="mb-4">{lessons.core_concept.definition}</p>
                            <p className="text-sm opacity-70 italic">{lessons.core_concept.rule}</p>
                        </div>
                    </section>

                    {/* Rules Table */}
                    <section className="glass-panel p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm">1</span>
                            The Golden Rules
                        </h3>

                        <div className="grid gap-6">
                            {lessons.rules.map((rule, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50">
                                    <div className="md:w-1/3 space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wider opacity-50 text-[var(--primary)]">Condition</div>
                                        <div className="font-medium">{rule.condition}</div>
                                        <div className="text-xs bg-[var(--card-border)] inline-block px-2 py-1 rounded">Use <span className="font-bold">{rule.ending}</span></div>
                                    </div>
                                    <div className="md:w-2/3 space-y-2 border-t md:border-t-0 md:border-l border-[var(--card-border)] pt-4 md:pt-0 md:pl-6">
                                        <div className="text-xs font-bold uppercase tracking-wider opacity-50 text-[var(--primary)]">Example</div>
                                        <div className="font-mono text-lg">{rule.example_kr} → <span className="text-[var(--success)] font-bold">{rule.example_full}</span></div>
                                        <p className="text-sm opacity-70 leading-relaxed">{rule.explanation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Irregular Forms */}
                    <section className="glass-panel p-8 border-2 border-[var(--warning)]/30">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 rounded-full bg-[var(--warning)] text-white flex items-center justify-center text-sm font-bold">!</span>
                            <h3 className="text-xl font-bold">Irregular Changes</h3>
                        </div>
                        <p className="mb-6 opacity-80">Some pronouns change their form completely when combined with the Subject Particle **가**.</p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {lessons.irregular.map((item, idx) => (
                                <div key={idx} className="bg-[var(--card)] p-4 rounded-xl border border-[var(--card-border)] text-center">
                                    <div className="text-sm opacity-50 mb-1">{item.noun}</div>
                                    <div className="text-xl font-bold text-[var(--warning)] mb-2">{item.result}</div>
                                    <div className="text-xs line-through opacity-40">{item.note}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Examples List */}
                    <section className="glass-panel p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[var(--secondary)] text-white flex items-center justify-center text-sm">2</span>
                            Sentence Examples
                        </h3>
                        <div className="space-y-4">
                            {lessons.examples.map((ex, i) => (
                                <div key={i} className="p-4 rounded-xl hover:bg-[var(--card)] transition-colors border-b border-[var(--card-border)] last:border-0">
                                    <p className="text-xl font-bold mb-1">{ex.kr}</p>
                                    <p className="opacity-70 mb-3">{ex.en}</p>
                                    <div className="text-xs font-mono bg-[var(--background)] p-2 rounded text-[var(--primary)] inline-block">
                                        🧠 {ex.breakdown}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* SIDEBAR / PRACTICE */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        <div className="glass-panel p-6 bg-gradient-to-br from-[var(--primary)]/10 to-transparent border-[var(--primary)]/20">
                            <h3 className="font-bold text-lg mb-2">Ready to practice?</h3>
                            <p className="text-sm opacity-70 mb-6">Test your understanding of 이 and 가 with 3 quick questions.</p>

                            {!practiceActive ? (
                                <button
                                    onClick={() => setPracticeActive(true)}
                                    className="btn-primary w-full shadow-lg flex items-center justify-center gap-2 group"
                                >
                                    Start Exercise <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[var(--background)] p-5 rounded-xl border border-[var(--primary)] shadow-2xl"
                                >
                                    <div className="flex justify-between items-center mb-4 text-sm">
                                        <span className="font-bold text-[var(--primary)]">Q {currentStep + 1} of {questions.length}</span>
                                        <button onClick={() => setPracticeActive(false)} className="opacity-50 hover:opacity-100">Exit</button>
                                    </div>

                                    <p className="font-medium mb-6 leading-relaxed">{questions[currentStep].q}</p>

                                    <div className="space-y-3">
                                        {questions[currentStep].options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(idx)}
                                                disabled={feedback !== null}
                                                className={`w-full p-3 rounded-lg border-2 text-left transition-all text-sm font-medium
                                                ${feedback === null ? 'border-[var(--card-border)] hover:border-[var(--primary)]' : ''}
                                                ${feedback === 'correct' && idx === questions[currentStep].correct ? 'border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]' : ''}
                                                ${feedback === 'incorrect' && idx !== questions[currentStep].correct ? 'opacity-40' : ''}
                                                ${feedback === 'incorrect' && idx === questions[currentStep].correct ? 'border-[var(--success)] text-[var(--success)]' : ''}
                                            `}
                                            >
                                                <div className="flex justify-between items-center">
                                                    {opt}
                                                    {feedback === 'correct' && idx === questions[currentStep].correct && <CheckCircle size={16} />}
                                                    {feedback === 'incorrect' && idx === questions[currentStep].correct && <AlertCircle size={16} />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {feedback === 'incorrect' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 text-xs rounded-lg"
                                        >
                                            <span className="font-bold">Hint:</span> {questions[currentStep].hint}
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        <div className="glass-panel p-6">
                            <h4 className="font-bold text-sm mb-4 opacity-70 uppercase tracking-widest">Related Lessons</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                                    <div className="w-2 h-2 rounded-full bg-[var(--card-border)]" />
                                    Topic Particles (은/는)
                                </li>
                                <li className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                                    <div className="w-2 h-2 rounded-full bg-[var(--card-border)]" />
                                    Object Particles (을/를)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
