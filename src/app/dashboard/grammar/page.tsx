"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Lock, ChevronRight, ChevronLeft, Sparkles, History } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

type ConjugationForm = { label: string; value: string };
type ConjugationTable = { type: string; forms: ConjugationForm[] };
type IrregularItem = { base: string; result: string; note: string };

type GrammarRule = {
  ruleName: string;
  explanation: string;
  examples: string[];
  conjugations?: ConjugationTable[];
  irregulars?: IrregularItem[];
};

export default function GrammarPage() {
  const [loading, setLoading] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [todayGrammar, setTodayGrammar] = useState<GrammarRule[]>([]);
  const [activeRule, setActiveRule] = useState(0);

  useEffect(() => {
    api.get("/modules/today")
      .then(res => {
        setHasCompleted(res.data.hasCompleted);
        if (res.data.lesson?.grammar) {
          setTodayGrammar(res.data.lesson.grammar as GrammarRule[]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-12 text-center flex flex-col items-center">
          <Sparkles className="animate-spin mb-6 text-[var(--primary)]" size={48} />
          <h2 className="text-2xl font-bold mb-2">Loading Grammar...</h2>
          <p className="opacity-60">Fetching today's rules.</p>
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
        <h1 className="text-3xl font-bold">Today's Grammar is Locked</h1>
        <p className="opacity-60 max-w-md text-lg">
          Complete today's lesson module first to unlock today's grammar rules.
        </p>
        <Link href="/dashboard/modules">
          <button className="btn-primary px-10 py-4 text-lg shadow-xl shadow-[var(--primary)]/20 hover:scale-105 transition-transform">
            Go to Today's Lesson →
          </button>
        </Link>
        <Link href="/dashboard/grammar/history" className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline mt-2">
          <History size={16} /> View Past Grammar Archive
        </Link>
      </div>
    );
  }

  const rule = todayGrammar[activeRule];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Grammar Lab ⚗️</h1>
            <p className="opacity-60">Today's {todayGrammar.length} grammar rules</p>
          </div>
        </div>
        <Link href="/dashboard/grammar/history" className="flex items-center gap-2 text-sm px-4 py-2 glass-panel hover:border-[var(--primary)] transition-colors">
          <History size={16} /> Past Grammar
        </Link>
      </div>

      {/* Rule Tabs */}
      <div className="flex gap-2 flex-wrap">
        {todayGrammar.map((r, i) => (
          <button
            key={i}
            onClick={() => setActiveRule(i)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeRule === i
              ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30"
              : "glass-panel opacity-60 hover:opacity-100"}`}
          >
            Rule {i + 1}
          </button>
        ))}
      </div>

      {/* Active Rule */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRule}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Explanation */}
          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-5 title-gradient">{rule.ruleName}</h2>
            <div className="bg-[var(--card)] p-6 rounded-xl border-l-4 border-[var(--primary)]">
              <h3 className="font-bold text-[var(--primary)] mb-2">💡 Explanation</h3>
              <p className="text-lg leading-relaxed opacity-90">{rule.explanation}</p>
            </div>
          </section>

          {/* Conjugation Tables */}
          {rule.conjugations && rule.conjugations.length > 0 && (
            <section className="glass-panel p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm">表</span>
                Conjugation Tables
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rule.conjugations.map((conj, ci) => (
                  <div key={ci} className="rounded-xl overflow-hidden border border-[var(--card-border)]">
                    <div className="bg-[var(--accent)]/10 px-4 py-3 text-sm font-bold text-[var(--accent)] uppercase tracking-wider border-b border-[var(--card-border)]">
                      {conj.type}
                    </div>
                    <div className="divide-y divide-[var(--card-border)]">
                      {conj.forms.map((form, fi) => (
                        <div key={fi} className="flex justify-between items-center px-4 py-3 text-sm hover:bg-[var(--background)] transition-colors">
                          <span className="opacity-60">{form.label}</span>
                          <span className="font-bold font-mono text-right">{form.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Irregular Forms */}
          {rule.irregulars && rule.irregulars.length > 0 && (
            <section className="glass-panel p-8 border-2 border-[var(--warning)]/30">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-[var(--warning)] text-white flex items-center justify-center text-sm font-bold">!</span>
                <h3 className="text-xl font-bold">Irregular Forms & Exceptions</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {rule.irregulars.map((irr, ii) => (
                  <div key={ii} className="bg-[var(--warning)]/5 border border-[var(--warning)]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-bold">{irr.base}</span>
                      <span className="opacity-40 text-lg">→</span>
                      <span className="font-bold text-lg text-[var(--warning)]">{irr.result}</span>
                    </div>
                    <div className="text-xs opacity-60 italic line-through">{irr.note}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Examples */}
          <section className="glass-panel p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[var(--secondary)] text-white flex items-center justify-center text-sm">✦</span>
              Example Sentences
            </h3>
            <div className="space-y-3">
              {rule.examples.map((ex, i) => (
                <div key={i} className="p-4 rounded-xl border border-[var(--card-border)] bg-[var(--background)]/50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-xs shrink-0 mt-1">{i + 1}</span>
                  <p className="text-base leading-relaxed">{ex}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Prev / Next */}
          <div className="flex justify-between">
            <button onClick={() => setActiveRule(i => Math.max(0, i - 1))} disabled={activeRule === 0} className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel disabled:opacity-30 hover:border-[var(--primary)] transition-colors">
              <ChevronLeft size={18} /> Previous
            </button>
            <button onClick={() => setActiveRule(i => Math.min(todayGrammar.length - 1, i + 1))} disabled={activeRule === todayGrammar.length - 1} className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel disabled:opacity-30 hover:border-[var(--primary)] transition-colors">
              Next <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Today's quick overview */}
      <section>
        <h2 className="text-sm font-bold mb-3 opacity-60 uppercase tracking-widest">Today's Rules Overview</h2>
        <div className="space-y-2">
          {todayGrammar.map((r, i) => (
            <button key={i} onClick={() => setActiveRule(i)} className={`w-full glass-panel p-4 flex items-center gap-4 hover:border-[var(--primary)] transition-colors text-left ${activeRule === i ? "border-[var(--primary)] bg-[var(--primary)]/5" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${activeRule === i ? "bg-[var(--primary)] text-white" : "bg-[var(--primary)]/10 text-[var(--primary)]"}`}>{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold">{r.ruleName}</div>
                <div className="text-sm opacity-50 truncate">{r.explanation}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                {r.conjugations && r.conjugations.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-bold">Conj.</span>}
                {r.irregulars && r.irregulars.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--warning)]/10 text-[var(--warning)] font-bold">Irreg.</span>}
              </div>
              <ChevronRight size={16} className="opacity-30 shrink-0" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
