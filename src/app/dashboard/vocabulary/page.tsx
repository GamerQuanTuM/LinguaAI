"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Brain, Check, Hand, ArrowLeftRight } from "lucide-react";

type Card = {
    id: number;
    front: string;
    pronunciation: string;
    back: string;
    context: string;
    conjugation?: {
        type: string;
        forms: { label: string; value: string }[];
    };
};

const mockCards: Card[] = [
    { id: 1, front: "안녕하세요", pronunciation: "/annyeonghaseyo/", back: "Hello", context: "Formal greeting used with strangers or elders." },
    { id: 2, front: "감사합니다", pronunciation: "/gamsahamnida/", back: "Thank you", context: "Formal way to express gratitude." },
    {
        id: 3,
        front: "듣다",
        pronunciation: "/deut-da/",
        back: "To Listen",
        context: "Irregular verb (ㄷ irregular).",
        conjugation: {
            type: "ㄷ Irregular",
            forms: [
                { label: "Present Formal", value: "들어요 (Deureoyo)" },
                { label: "Past", value: "들었어요 (Deureosseoyo)" },
                { label: "Future", value: "들을 거예요 (Deureul geoyeyo)" }
            ]
        }
    },
    { id: 4, front: "친구", pronunciation: "/chin-gu/", back: "Friend", context: "Someone you are close with." },
    { id: 5, front: "사랑해", pronunciation: "/saranghae/", back: "I love you", context: "Casual way to say I love you." },
];

export default function VocabularyPage() {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [exiting, setExiting] = useState(false);

    const handleRate = (difficulty: 'hard' | 'good' | 'easy') => {
        if (!isFlipped || exiting) return;
        setExiting(true);

        // Simulate saving difficulty
        console.log(`Rated card ${mockCards[currentCardIndex].id} as ${difficulty}`);

        if (currentCardIndex < mockCards.length - 1) {
            setTimeout(() => {
                setCurrentCardIndex(prev => prev + 1);
                setIsFlipped(false);
                setExiting(false);
            }, 400); // Wait for exit animation
        } else {
            setSessionComplete(true);
        }
    };

    const reset = () => {
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setSessionComplete(false);
        setExiting(false);
    };

    const currentCard = mockCards[currentCardIndex];

    return (
        <div className="flex flex-col items-center max-w-2xl mx-auto py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <Brain className="text-[var(--secondary)]" /> Vocabulary Trainer
                </h1>
                <p className="opacity-70">Tap the card to reveal the meaning.</p>
            </div>

            <AnimatePresence mode="wait">
                {!sessionComplete ? (
                    <div className="w-full flex flex-col items-center">
                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-[var(--card-border)] rounded-full mb-6 max-w-md mx-auto">
                            <div
                                className="h-full bg-[var(--secondary)] rounded-full transition-all duration-300"
                                style={{ width: `${((currentCardIndex) / mockCards.length) * 100}%` }}
                            />
                        </div>

                        <div className="text-sm opacity-50 mb-2">Card {currentCardIndex + 1} of {mockCards.length}</div>

                        {/* Card Container with Slide Transition */}
                        <div className="relative h-[500px] w-full max-w-sm sm:max-w-md perspective-1000 group cursor-pointer">
                            <AnimatePresence mode="popLayout" custom={exiting}>
                                <motion.div
                                    key={currentCardIndex}
                                    initial={{ x: 300, opacity: 0, rotate: 10 }}
                                    animate={{ x: 0, opacity: 1, rotate: 0 }}
                                    exit={{ x: -300, opacity: 0, rotate: -10 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="w-full h-full absolute inset-0 text-left"
                                    style={{ width: '100%', height: '100%' }}
                                    onClick={() => !exiting && setIsFlipped(!isFlipped)}
                                >
                                    <motion.div
                                        className="w-full h-full relative transform-style-3d transition-transform duration-500"
                                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                                        initial={false}
                                    >
                                        {/* Front Side */}
                                        <div className="absolute inset-0 backface-hidden glass-panel flex flex-col items-center justify-center p-8 border-2 border-[var(--card-border)] shadow-xl bg-[var(--card)]">
                                            <div className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-8 bg-[var(--primary)]/10 px-3 py-1 rounded-full">Korean</div>

                                            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-center break-words w-full">{currentCard.front}</h2>

                                            <div className="mt-auto opacity-60 flex items-center gap-2 text-sm animate-pulse">
                                                <Hand size={16} /> Tap to flip
                                            </div>
                                        </div>

                                        {/* Back Side */}
                                        <div
                                            className="absolute inset-0 backface-hidden glass-panel flex flex-col items-center justify-center p-6 border-2 border-[var(--secondary)] shadow-xl rotate-y-180 bg-[var(--card)]"
                                        >
                                            <div className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)] mb-2 bg-[var(--secondary)]/10 px-3 py-1 rounded-full">English</div>

                                            <h2 className="text-3xl font-bold mb-2 text-center text-[var(--foreground)]">{currentCard.back}</h2>
                                            <p className="text-lg font-mono opacity-60 mb-4">{currentCard.pronunciation}</p>

                                            <div className="bg-[var(--card)] p-3 rounded-xl text-center text-sm opacity-80 mb-4 border border-[var(--card-border)] w-full">
                                                "{currentCard.context}"
                                            </div>

                                            {/* Irregular Conjugation Section */}
                                            {currentCard.conjugation && (
                                                <div className="w-full mb-4 bg-[var(--background)]/50 p-3 rounded-lg border border-[var(--card-border)] text-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[10px] uppercase font-bold text-[var(--warning)] border border-[var(--warning)] px-1 rounded">Irregular</span>
                                                        <span className="font-bold text-xs">{currentCard.conjugation.type}</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {currentCard.conjugation.forms.map((form, idx) => (
                                                            <div key={idx} className="flex justify-between border-b border-[var(--card-border)] last:border-0 pb-1 last:pb-0">
                                                                <span className="opacity-60 text-xs">{form.label}</span>
                                                                <span className="font-bold text-xs">{form.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="w-full grid grid-cols-3 gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => handleRate('hard')} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold text-sm transition-colors border border-red-500/20">
                                                    Hard
                                                </button>
                                                <button onClick={() => handleRate('good')} className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white font-bold text-sm transition-colors border border-yellow-500/20">
                                                    Good
                                                </button>
                                                <button onClick={() => handleRate('easy')} className="p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white font-bold text-sm transition-colors border border-green-500/20">
                                                    Easy
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center glass-panel p-12 w-full max-w-md"
                    >
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-3xl font-bold mb-2 title-gradient">Session Complete!</h2>
                        <p className="opacity-70 mb-8">You've reviewed {mockCards.length} words today.</p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={reset} className="btn-primary flex items-center gap-2">
                                <RotateCcw size={20} /> Review Again
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
