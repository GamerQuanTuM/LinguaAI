"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Brain, Hand, Lock, Sparkles, History } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

type VocabWord = {
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
};

export default function VocabularyPage() {
  const [loading, setLoading] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [todayCards, setTodayCards] = useState<VocabWord[]>([]);

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    api.get("/modules/today")
      .then(res => {
        setHasCompleted(res.data.hasCompleted);
        if (res.data.lesson?.vocabulary) {
          setTodayCards(res.data.lesson.vocabulary as VocabWord[]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleNext = () => {
    if (exiting) return;
    setExiting(true);
    if (currentCardIndex < todayCards.length - 1) {
      setTimeout(() => {
        setCurrentCardIndex(prev => prev + 1);
        setIsFlipped(false);
        setExiting(false);
      }, 350);
    } else {
      setTimeout(() => setSessionComplete(true), 350);
    }
  };

  const reset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    setExiting(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-12 text-center flex flex-col items-center">
          <Sparkles className="animate-spin mb-6 text-[var(--primary)]" size={48} />
          <h2 className="text-2xl font-bold mb-2">Loading Vocabulary...</h2>
          <p className="opacity-60">Fetching today's words.</p>
        </div>
      </div>
    );
  }

  if (!hasCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-[var(--card)] border-2 border-[var(--card-border)] flex items-center justify-center">
          <Lock size={40} className="opacity-40" />
        </div>
        <h1 className="text-3xl font-bold">Today's Vocabulary is Locked</h1>
        <p className="opacity-60 max-w-md text-lg">
          Complete today's lesson module first before reviewing vocabulary flashcards.
        </p>
        <Link href="/dashboard/modules">
          <button className="btn-primary px-10 py-4 text-lg shadow-xl shadow-[var(--primary)]/20 hover:scale-105 transition-transform">
            Go to Today's Lesson →
          </button>
        </Link>
        <Link href="/dashboard/vocabulary/history" className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline">
          <History size={16} /> View Past Vocabulary Archive
        </Link>
      </div>
    );
  }

  const currentCard = todayCards[currentCardIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Brain className="text-[var(--secondary)]" /> Today's Vocabulary
          </h1>
          <p className="opacity-70 mt-1">Tap the card to reveal the meaning.</p>
        </div>
        <Link href="/dashboard/vocabulary/history" className="flex items-center gap-2 text-sm px-4 py-2 glass-panel hover:border-[var(--secondary)] transition-colors shrink-0">
          <History size={16} /> History
        </Link>
      </div>

      {/* Flashcard Session */}
      <AnimatePresence mode="wait">
        {!sessionComplete ? (
          <div className="flex flex-col items-center">
            {/* Progress */}
            <div className="w-full max-w-md mb-2">
              <div className="h-1 bg-[var(--card-border)] rounded-full">
                <div
                  className="h-full bg-[var(--secondary)] rounded-full transition-all duration-300"
                  style={{ width: `${(currentCardIndex / todayCards.length) * 100}%` }}
                />
              </div>
              <div className="text-xs opacity-50 mt-1 text-center">Card {currentCardIndex + 1} of {todayCards.length}</div>
            </div>

            <div
              className="relative h-[420px] w-full max-w-sm sm:max-w-md perspective-1000 cursor-pointer"
              onClick={() => !exiting && setIsFlipped(!isFlipped)}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentCardIndex}
                  initial={{ x: 300, opacity: 0, rotate: 8 }}
                  animate={{ x: 0, opacity: 1, rotate: 0 }}
                  exit={{ x: -300, opacity: 0, rotate: -8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                  className="w-full h-full absolute inset-0"
                >
                  <motion.div
                    className="w-full h-full relative transform-style-3d transition-transform duration-500"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    initial={false}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden glass-panel flex flex-col items-center justify-center p-8 border-2 border-[var(--card-border)]">
                      <div className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-6 bg-[var(--primary)]/10 px-3 py-1 rounded-full">Target Language</div>
                      <h2 className="text-5xl font-bold mb-4 text-center">{currentCard.word}</h2>
                      <div className="mt-auto opacity-60 flex items-center gap-2 text-sm animate-pulse">
                        <Hand size={16} /> Tap to flip
                      </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden glass-panel flex flex-col items-center justify-center p-6 border-2 border-[var(--secondary)] rotate-y-180">
                      <div className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)] mb-3 bg-[var(--secondary)]/10 px-3 py-1 rounded-full">English</div>
                      <h2 className="text-4xl font-bold mb-3 text-center">{currentCard.translation}</h2>
                      <div className="w-full bg-[var(--background)] p-4 rounded-xl border border-[var(--card-border)] text-sm text-center opacity-80 mb-4">
                        "{currentCard.example}"
                        <div className="text-xs mt-1 opacity-60 italic">{currentCard.exampleTranslation}</div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="mt-2 bg-[var(--secondary)] text-white px-8 py-3 rounded-full font-bold hover:brightness-110 transition-all"
                      >
                        Next →
                      </button>
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
            className="text-center glass-panel p-12 max-w-md mx-auto"
          >
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-2 title-gradient">Session Complete!</h2>
            <p className="opacity-70 mb-8">You've reviewed all {todayCards.length} words for today.</p>
            <button onClick={reset} className="btn-primary flex items-center gap-2 mx-auto">
              <RotateCcw size={20} /> Review Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Today's full word list */}
      <section>
        <h2 className="text-sm font-bold mb-3 opacity-60 uppercase tracking-widest">Today's Full Word List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {todayCards.map((w, i) => (
            <div key={i} className="glass-panel p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)] flex items-center justify-center font-bold text-sm shrink-0">{i + 1}</div>
              <div>
                <div className="font-bold text-lg">{w.word}</div>
                <div className="text-sm opacity-70">{w.translation}</div>
                <div className="text-xs opacity-50 mt-1 italic">"{w.example}"</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Link to history */}
      <div className="text-center">
        <Link href="/dashboard/vocabulary/history" className="inline-flex items-center gap-2 px-6 py-3 glass-panel hover:border-[var(--secondary)] transition-colors text-sm font-bold">
          <History size={16} /> View All Past Vocabulary →
        </Link>
      </div>
    </div>
  );
}
