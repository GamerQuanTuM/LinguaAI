"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Sparkles, BookOpen, RotateCcw } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

type VocabWord = {
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
};

type PastLesson = {
  id: string;
  date: string;
  vocabulary: VocabWord[];
};

export default function PastVocabularyPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<PastLesson[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [flashcardMode, setFlashcardMode] = useState<{ lesson: PastLesson; cardIdx: number; flipped: boolean; done: boolean } | null>(null);

  useEffect(() => {
    api.get("/modules/history")
      .then(res => {
        setHistory((res.data.history || []).map((h: any) => ({
          id: h.id,
          date: h.date,
          vocabulary: h.vocabulary as VocabWord[],
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-12 text-center flex flex-col items-center">
          <Sparkles className="animate-spin mb-6 text-[var(--primary)]" size={48} />
          <h2 className="text-2xl font-bold mb-2">Loading Archive...</h2>
        </div>
      </div>
    );
  }

  // Flashcard review mode
  if (flashcardMode) {
    const { lesson, cardIdx, flipped, done } = flashcardMode;
    const card = lesson.vocabulary[cardIdx];

    if (done) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-12 max-w-md">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-2 title-gradient">Review Complete!</h2>
            <p className="opacity-70 mb-8">You reviewed all {lesson.vocabulary.length} words from {new Date(lesson.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}.</p>
            <button onClick={() => setFlashcardMode(null)} className="btn-primary flex items-center gap-2 mx-auto">
              <RotateCcw size={18} /> Back to Archive
            </button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="max-w-xl mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setFlashcardMode(null)} className="text-sm opacity-60 hover:opacity-100 flex items-center gap-1">← Back to Archive</button>
          <span className="text-sm opacity-60">Card {cardIdx + 1} / {lesson.vocabulary.length}</span>
        </div>
        <div className="w-full h-1 bg-[var(--card-border)] rounded-full">
          <div className="h-full bg-[var(--secondary)] rounded-full transition-all" style={{ width: `${(cardIdx / lesson.vocabulary.length) * 100}%` }} />
        </div>

        <div className="relative h-[380px] cursor-pointer perspective-1000" onClick={() => setFlashcardMode(m => m ? { ...m, flipped: !m.flipped } : m)}>
          <motion.div className="w-full h-full transform-style-3d transition-transform duration-500" animate={{ rotateY: flipped ? 180 : 0 }} initial={false}>
            {/* Front */}
            <div className="absolute inset-0 backface-hidden glass-panel flex flex-col items-center justify-center p-8 border-2 border-[var(--card-border)]">
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-6 bg-[var(--primary)]/10 px-3 py-1 rounded-full">Target Language</div>
              <h2 className="text-5xl font-bold text-center">{card.word}</h2>
              <p className="mt-auto opacity-50 text-sm animate-pulse">Tap to flip</p>
            </div>
            {/* Back */}
            <div className="absolute inset-0 backface-hidden glass-panel flex flex-col items-center justify-center p-6 border-2 border-[var(--secondary)] rotate-y-180">
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)] mb-3 bg-[var(--secondary)]/10 px-3 py-1 rounded-full">English</div>
              <h2 className="text-4xl font-bold mb-3 text-center">{card.translation}</h2>
              <div className="w-full bg-[var(--background)] p-4 rounded-xl border border-[var(--card-border)] text-sm text-center opacity-80 mb-4">
                "{card.example}"
                <div className="text-xs mt-1 opacity-60 italic">{card.exampleTranslation}</div>
              </div>
              <button onClick={e => {
                e.stopPropagation();
                if (cardIdx < lesson.vocabulary.length - 1) {
                  setFlashcardMode(m => m ? { ...m, cardIdx: m.cardIdx + 1, flipped: false } : m);
                } else {
                  setFlashcardMode(m => m ? { ...m, done: true } : m);
                }
              }} className="bg-[var(--secondary)] text-white px-8 py-3 rounded-full font-bold hover:brightness-110">
                Next →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/vocabulary" className="text-sm opacity-60 hover:opacity-100">← Today's Vocabulary</Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-xl">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Vocabulary Archive</h1>
          <p className="opacity-60">Review all your past vocabulary days</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-bold mb-2">No Past Vocabulary Yet</h2>
          <p className="opacity-60">Complete more daily lessons for past vocabulary to appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((lesson, i) => (
            <motion.div key={lesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5">
                <button onClick={() => setExpandedId(expandedId === lesson.id ? null : lesson.id)} className="flex-1 flex items-center justify-between text-left hover:opacity-80 transition-opacity">
                  <div>
                    <span className="font-bold text-lg">{new Date(lesson.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <div className="text-sm opacity-50 mt-0.5">{lesson.vocabulary.length} words learned</div>
                  </div>
                  {expandedId === lesson.id ? <ChevronUp size={18} className="opacity-50 shrink-0 ml-2" /> : <ChevronDown size={18} className="opacity-50 shrink-0 ml-2" />}
                </button>
                <button
                  onClick={() => setFlashcardMode({ lesson, cardIdx: 0, flipped: false, done: false })}
                  className="ml-4 shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)] text-sm font-bold hover:bg-[var(--secondary)] hover:text-white transition-colors"
                >
                  <RotateCcw size={14} /> Review
                </button>
              </div>

              {/* Expanded word list */}
              <AnimatePresence>
                {expandedId === lesson.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="border-t border-[var(--card-border)] p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {lesson.vocabulary.map((w, j) => (
                        <div key={j} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)]">
                          <div className="w-7 h-7 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{j + 1}</div>
                          <div>
                            <div className="font-bold">{w.word}</div>
                            <div className="text-sm opacity-60">{w.translation}</div>
                            <div className="text-xs opacity-40 italic mt-0.5">"{w.example}"</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
