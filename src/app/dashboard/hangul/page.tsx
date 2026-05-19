"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HANGUL_DATA } from "@/lib/hangulData";

type Tab = "consonants" | "vowels" | "syllable" | "batchim" | "sound-changes";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "consonants", label: "Consonants", emoji: "🔤" },
  { id: "vowels", label: "Vowels", emoji: "🗣️" },
  { id: "syllable", label: "Syllable Blocks", emoji: "🧱" },
  { id: "batchim", label: "받침 Batchim", emoji: "⬇️" },
  { id: "sound-changes", label: "Sound Changes", emoji: "🔄" },
];

export default function HangulPage() {
  const [activeTab, setActiveTab] = useState<Tab>("consonants");
  const [expandedRule, setExpandedRule] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          한글 <span className="opacity-40">|</span> Hangul Reference
        </h1>
        <p className="opacity-60 mt-1">
          The Korean writing system — complete guide including consonants, vowels, syllable structure, 받침 (batchim) and all pronunciation change rules.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30"
                : "glass-panel opacity-60 hover:opacity-100"
            }`}
          >
            <span>{tab.emoji}</span> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

          {/* CONSONANTS */}
          {activeTab === "consonants" && (
            <div className="space-y-6">
              <div className="glass-panel p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">Types</span>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold">Plain: ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅎ</span>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-bold">Aspirated: ㅊ ㅋ ㅌ ㅍ</span>
                  <span className="px-3 py-1 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)] font-bold">Tense: ㄲ ㄸ ㅃ ㅆ ㅉ</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {HANGUL_DATA.consonants.map((c, i) => (
                  <motion.div
                    key={c.char}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass-panel p-4 flex items-center gap-4 hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="text-5xl font-bold text-[var(--primary)] w-14 text-center shrink-0">{c.char}</div>
                    <div className="min-w-0">
                      <div className="font-bold text-lg">{c.romanization}</div>
                      <div className="text-xs opacity-60 leading-snug mt-0.5">{c.sound}</div>
                      <div className="text-xs font-mono text-[var(--accent)] mt-1">{c.ipa}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* VOWELS */}
          {activeTab === "vowels" && (
            <div className="space-y-4">
              <div className="glass-panel p-5 text-sm opacity-70">
                Korean has <strong>10 basic vowels</strong> and several compound vowels formed by combining basics. Each vowel is written with strokes that go right or downward.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {HANGUL_DATA.vowels.map((v, i) => (
                  <motion.div
                    key={v.char}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass-panel p-4 flex items-center gap-4 hover:border-[var(--secondary)] transition-colors"
                  >
                    <div className="text-5xl font-bold text-[var(--secondary)] w-14 text-center shrink-0">{v.char}</div>
                    <div className="min-w-0">
                      <div className="font-bold text-lg">{v.romanization}</div>
                      <div className="text-xs opacity-60 leading-snug mt-0.5">{v.sound}</div>
                      <div className="text-xs font-mono text-[var(--primary)] mt-1">{v.example}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SYLLABLE STRUCTURE */}
          {activeTab === "syllable" && (
            <div className="space-y-6">
              <div className="glass-panel p-6">
                <h2 className="text-xl font-bold mb-2">{HANGUL_DATA.syllableStructure.title}</h2>
                <p className="text-sm opacity-70 leading-relaxed mb-6 p-4 bg-[var(--background)] rounded-xl border-l-4 border-[var(--primary)]">
                  {HANGUL_DATA.syllableStructure.note}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {HANGUL_DATA.syllableStructure.steps.map((step, i) => (
                    <div key={i} className="bg-[var(--background)] p-5 rounded-xl border border-[var(--card-border)]">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded">{step.label}</span>
                        <span className="text-2xl font-bold font-mono">{step.example}</span>
                      </div>
                      <p className="text-sm opacity-70">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual syllable block diagram */}
              <div className="glass-panel p-6">
                <h3 className="font-bold mb-4 text-lg">Syllable Block Layout</h3>
                <div className="grid grid-cols-2 gap-6 text-center text-sm">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Without Batchim</div>
                    <div className="border-2 border-[var(--card-border)] rounded-2xl overflow-hidden inline-block w-32 text-[var(--primary)]">
                      <div className="border-b border-[var(--card-border)] p-3 font-bold text-lg bg-[var(--primary)]/10">Initial (초성)</div>
                      <div className="p-3 font-bold text-lg bg-[var(--secondary)]/10 text-[var(--secondary)]">Vowel (중성)</div>
                    </div>
                    <div className="mt-2 font-mono text-2xl font-bold text-[var(--primary)]">가</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">With Batchim</div>
                    <div className="border-2 border-[var(--card-border)] rounded-2xl overflow-hidden inline-block w-32">
                      <div className="border-b border-[var(--card-border)] p-3 font-bold text-lg bg-[var(--primary)]/10 text-[var(--primary)]">Initial (초성)</div>
                      <div className="border-b border-[var(--card-border)] p-3 font-bold text-lg bg-[var(--secondary)]/10 text-[var(--secondary)]">Vowel (중성)</div>
                      <div className="p-3 font-bold text-lg bg-[var(--warning)]/10 text-[var(--warning)]">Batchim (종성)</div>
                    </div>
                    <div className="mt-2 font-mono text-2xl font-bold text-[var(--primary)]">밥</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BATCHIM */}
          {activeTab === "batchim" && (
            <div className="space-y-5">
              <div className="glass-panel p-5 text-sm leading-relaxed opacity-80 border-l-4 border-[var(--warning)]">
                <strong>받침 (Batchim)</strong> is the final consonant in a Korean syllable block. Even though many different consonants or clusters can be written as batchim, they all reduce to just <strong>7 sounds</strong> when pronounced in isolation.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HANGUL_DATA.batchimRules.map((rule, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-panel p-5 border-l-4 border-[var(--warning)]/50"
                  >
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-2xl font-bold text-[var(--warning)]">{rule.batchim}</span>
                      <span className="text-sm font-mono bg-[var(--warning)]/10 text-[var(--warning)] px-2 py-0.5 rounded">→ {rule.sound}</span>
                    </div>
                    <div className="text-sm font-bold mb-1 font-mono opacity-80">{rule.example}</div>
                    <div className="text-xs opacity-60">{rule.note}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SOUND CHANGES */}
          {activeTab === "sound-changes" && (
            <div className="space-y-3">
              <div className="glass-panel p-5 text-sm opacity-70 border-l-4 border-[var(--error)]">
                Korean pronunciation rules are systematic — sounds change predictably in context. These rules apply automatically in natural speech and are essential for listening comprehension.
              </div>
              {HANGUL_DATA.soundChangeRules.map((rule, i) => (
                <div key={i} className="glass-panel overflow-hidden">
                  <button
                    onClick={() => setExpandedRule(expandedRule === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--primary)]/5 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-lg">{rule.name}</div>
                      <div className="text-sm opacity-60 mt-0.5 line-clamp-1">{rule.rule}</div>
                    </div>
                    {expandedRule === i
                      ? <ChevronUp size={18} className="opacity-50 shrink-0 ml-2" />
                      : <ChevronDown size={18} className="opacity-50 shrink-0 ml-2" />
                    }
                  </button>

                  <AnimatePresence>
                    {expandedRule === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[var(--card-border)] p-5 space-y-4">
                          <div className="p-4 bg-[var(--card)] rounded-xl border-l-4 border-[var(--primary)] text-sm leading-relaxed">
                            {rule.rule}
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs font-bold uppercase tracking-widest opacity-50">Examples</div>
                            {rule.examples.map((ex, j) => (
                              <div key={j} className="flex items-start gap-4 p-3 rounded-xl bg-[var(--background)] text-sm">
                                <div className="shrink-0">
                                  <span className="font-bold text-base">{ex.before}</span>
                                  <span className="opacity-40 mx-2">→</span>
                                  <span className="font-bold text-base text-[var(--primary)]">{ex.after}</span>
                                </div>
                                <div className="text-xs opacity-60 italic mt-0.5">{ex.note}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
