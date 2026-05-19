"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Sparkles, FlaskConical } from "lucide-react";
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

type PastLesson = {
  id: string;
  date: string;
  grammar: GrammarRule[];
};

export default function PastGrammarPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<PastLesson[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  useEffect(() => {
    api.get("/modules/history")
      .then(res => {
        setHistory((res.data.history || []).map((h: any) => ({
          id: h.id,
          date: h.date,
          grammar: h.grammar as GrammarRule[],
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <Link href="/dashboard/grammar" className="text-sm opacity-60 hover:opacity-100">← Today's Grammar</Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl">
          <FlaskConical size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Grammar Archive</h1>
          <p className="opacity-60">All grammar rules you've studied, organized by day</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-bold mb-2">No Past Grammar Yet</h2>
          <p className="opacity-60">Complete more daily lessons to build your grammar archive.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((lesson, i) => (
            <motion.div key={lesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel overflow-hidden">
              {/* Day header */}
              <button
                onClick={() => setExpandedId(expandedId === lesson.id ? null : lesson.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--primary)]/5 transition-colors"
              >
                <div>
                  <span className="font-bold text-lg">{new Date(lesson.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <div className="text-sm opacity-50 mt-0.5">{lesson.grammar.length} grammar rules</div>
                </div>
                {expandedId === lesson.id ? <ChevronUp size={18} className="opacity-50 shrink-0" /> : <ChevronDown size={18} className="opacity-50 shrink-0" />}
              </button>

              <AnimatePresence>
                {expandedId === lesson.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="border-t border-[var(--card-border)] p-5 space-y-3">
                      {lesson.grammar.map((rule, j) => {
                        const ruleKey = `${lesson.id}-${j}`;
                        const isRuleOpen = expandedRule === ruleKey;
                        return (
                          <div key={j} className="rounded-xl border border-[var(--card-border)] overflow-hidden">
                            {/* Rule header */}
                            <button
                              onClick={() => setExpandedRule(isRuleOpen ? null : ruleKey)}
                              className="w-full flex items-center justify-between p-4 text-left bg-[var(--background)] hover:bg-[var(--card)] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-xs shrink-0">{j + 1}</div>
                                <span className="font-bold">{rule.ruleName}</span>
                              </div>
                              {isRuleOpen ? <ChevronUp size={16} className="opacity-40 shrink-0" /> : <ChevronDown size={16} className="opacity-40 shrink-0" />}
                            </button>

                            <AnimatePresence>
                              {isRuleOpen && (
                                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                                  <div className="p-4 space-y-4 border-t border-[var(--card-border)]">
                                    {/* Explanation */}
                                    <div className="bg-[var(--card)] p-4 rounded-xl border-l-4 border-[var(--primary)]">
                                      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-2">Explanation</h4>
                                      <p className="text-sm leading-relaxed opacity-90">{rule.explanation}</p>
                                    </div>

                                    {/* Examples */}
                                    <div>
                                      <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Examples</h4>
                                      <div className="space-y-2">
                                        {rule.examples.map((ex, k) => (
                                          <div key={k} className="flex items-start gap-2 text-sm p-2 rounded-lg bg-[var(--background)]">
                                            <span className="text-[var(--secondary)] font-bold shrink-0">{k + 1}.</span>
                                            <span>{ex}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Conjugations */}
                                    {rule.conjugations && rule.conjugations.length > 0 && (
                                      <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">Conjugation Tables</h4>
                                        <div className="space-y-3">
                                          {rule.conjugations.map((conj, ci) => (
                                            <div key={ci} className="rounded-xl overflow-hidden border border-[var(--card-border)]">
                                              <div className="bg-[var(--accent)]/10 px-4 py-2 text-xs font-bold text-[var(--accent)] uppercase tracking-wider">{conj.type}</div>
                                              <div className="divide-y divide-[var(--card-border)]">
                                                {conj.forms.map((form, fi) => (
                                                  <div key={fi} className="flex justify-between items-center px-4 py-2.5 text-sm">
                                                    <span className="opacity-60">{form.label}</span>
                                                    <span className="font-bold font-mono">{form.value}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Irregulars */}
                                    {rule.irregulars && rule.irregulars.length > 0 && (
                                      <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--warning)] mb-3">⚠️ Irregular Forms</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {rule.irregulars.map((irr, ii) => (
                                            <div key={ii} className="bg-[var(--warning)]/5 border border-[var(--warning)]/20 rounded-xl p-3">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm">{irr.base}</span>
                                                <span className="opacity-40">→</span>
                                                <span className="font-bold text-sm text-[var(--warning)]">{irr.result}</span>
                                              </div>
                                              <div className="text-xs opacity-60 line-through">{irr.note}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
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
