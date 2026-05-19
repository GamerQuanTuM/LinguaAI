"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { KOREAN_NUMBERS } from "@/lib/koreanNumbersData";

type MainTab = "sino" | "native" | "comparison" | "calendar" | "time";
type SinoTab = "digits" | "units" | "formation" | "practice";
type NativeTab = "digits" | "formation" | "counters" | "practice";

export default function KoreanNumbersPage() {
  const [mainTab, setMainTab] = useState<MainTab>("sino");
  const [sinoTab, setSinoTab] = useState<SinoTab>("digits");
  const [nativeTab, setNativeTab] = useState<NativeTab>("digits");
  const [expandedRule, setExpandedRule] = useState<number | null>(0);

  const main = KOREAN_NUMBERS;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          숫자 <span className="opacity-40">|</span> Korean Numbers
        </h1>
        <p className="opacity-60 mt-1">
          Korean has two number systems — Sino-Korean (Chinese-derived) and Native Korean. Knowing when to use each is essential.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: "sino", label: "Sino-Korean", emoji: "🇨🇳" },
          { id: "native", label: "Native Korean", emoji: "🇰🇷" },
          { id: "calendar", label: "Days & Months", emoji: "📅" },
          { id: "time", label: "Telling Time", emoji: "🕐" },
          { id: "comparison", label: "When to Use Which", emoji: "⚖️" },
        ] as { id: MainTab; label: string; emoji: string }[]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setMainTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
              mainTab === tab.id
                ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30"
                : "glass-panel opacity-60 hover:opacity-100"
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mainTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

          {/* ── SINO-KOREAN ── */}
          {mainTab === "sino" && (
            <div className="space-y-6">
              <div className="glass-panel p-5 text-sm opacity-80 border-l-4 border-[var(--primary)]">
                <strong>Sino-Korean</strong> numbers come from Chinese. Used for: {main.sino.usedFor.join(" • ")}
              </div>

              {/* Sub-tabs */}
              <div className="flex gap-2 flex-wrap">
                {(["digits", "units", "formation", "practice"] as SinoTab[]).map(t => (
                  <button key={t} onClick={() => setSinoTab(t)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${sinoTab === t ? "bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]" : "glass-panel opacity-50 hover:opacity-100"}`}>
                    {t === "digits" ? "0–9" : t === "units" ? "Unit Words" : t === "formation" ? "How to Form" : "Examples"}
                  </button>
                ))}
              </div>

              {/* Digits 0–9 */}
              {sinoTab === "digits" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {main.sino.digits.map((d, i) => (
                    <motion.div key={d.num} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                      className="glass-panel p-5 text-center hover:border-[var(--primary)] transition-colors">
                      <div className="text-2xl font-black text-[var(--primary)] mb-1">{d.num}</div>
                      <div className="text-3xl font-bold mb-1">{d.korean}</div>
                      <div className="text-sm font-mono opacity-60">{d.romanization}</div>
                      {d.note && <div className="text-xs opacity-50 mt-2 leading-snug">{d.note}</div>}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Unit Words */}
              {sinoTab === "units" && (
                <div className="space-y-3">
                  {main.sino.unitWords.map((u, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      className="glass-panel p-5 flex items-center gap-6">
                      <div className="text-center shrink-0 w-28">
                        <div className="text-xs opacity-50 mb-1 font-bold">Value</div>
                        <div className="text-lg font-bold font-mono">{u.value}</div>
                      </div>
                      <div className="shrink-0">
                        <div className="text-3xl font-bold text-[var(--primary)]">{u.korean}</div>
                        <div className="text-sm font-mono opacity-60">{u.romanization}</div>
                      </div>
                      <div className="text-sm opacity-70 italic ml-auto text-right">{u.example}</div>
                    </motion.div>
                  ))}
                  <div className="glass-panel p-5 bg-[var(--warning)]/5 border-l-4 border-[var(--warning)] text-sm">
                    <strong>🔑 Key insight:</strong> Korean groups large numbers in units of <strong>만 (10,000)</strong>, not 1,000 like English. So 100,000 = 십만 (10×만), not 백천.
                  </div>
                </div>
              )}

              {/* Formation Rules */}
              {sinoTab === "formation" && (
                <div className="space-y-5">

                  {/* ── Core concept: positional logic ── */}
                  <div className="glass-panel p-6 space-y-5 border-2 border-[var(--primary)]/30">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      🧠 The Core Rule — How Korean Numbers Work
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="bg-[var(--primary)]/5 rounded-xl p-4 border border-[var(--primary)]/20">
                        <div className="font-bold text-[var(--primary)] mb-2 uppercase tracking-wider text-xs">Digit BEFORE a unit → Multiply</div>
                        <div className="text-2xl font-black mb-2">이 × 십 = <span className="text-[var(--primary)]">20</span></div>
                        <div className="opacity-60 text-xs">The digit 이(2) before 십(10) means <em>2 tens</em> = 20</div>
                      </div>
                      <div className="bg-[var(--secondary)]/5 rounded-xl p-4 border border-[var(--secondary)]/20">
                        <div className="font-bold text-[var(--secondary)] mb-2 uppercase tracking-wider text-xs">Digit AFTER a unit → Add</div>
                        <div className="text-2xl font-black mb-2">이십 + 오 = <span className="text-[var(--secondary)]">25</span></div>
                        <div className="opacity-60 text-xs">오(5) after 이십(20) means <em>20 plus 5</em> = 25</div>
                      </div>
                    </div>

                    {/* Visual breakdown of 이십오 */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Visual Breakdown: 25 = 이십오</div>
                      <div className="flex items-center gap-1 flex-wrap">
                        {[
                          { char: "이", sub: "2", color: "var(--primary)", op: null },
                          { char: "×", sub: "", color: "inherit", op: true },
                          { char: "십", sub: "10", color: "var(--accent)", op: null },
                          { char: "+", sub: "", color: "inherit", op: true },
                          { char: "오", sub: "5", color: "var(--secondary)", op: null },
                          { char: "=", sub: "", color: "inherit", op: true },
                          { char: "25", sub: "", color: "var(--primary)", op: true },
                        ].map((item, i) => (
                          item.op
                            ? <div key={i} className="text-xl font-bold opacity-40 px-1">{item.char}</div>
                            : <div key={i} className="flex flex-col items-center">
                                <div className="text-3xl font-black px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--card-border)]"
                                  style={{ color: `${item.color}` }}>
                                  {item.char}
                                </div>
                                <div className="text-xs opacity-50 mt-1 font-mono">{item.sub}</div>
                              </div>
                        ))}
                      </div>
                    </div>

                    {/* More examples in a mini table */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">More Examples</div>
                      <div className="space-y-2 text-sm">
                        {[
                          { n: 13, k: "십삼", math: "십(10) + 삼(3)", note: "No digit before 십 → just 10, then +3" },
                          { n: 30, k: "삼십", math: "삼(3) × 십(10)", note: "3 tens = 30" },
                          { n: 47, k: "사십칠", math: "사(4) × 십(10) + 칠(7)", note: "4 tens + 7 = 47" },
                          { n: 200, k: "이백", math: "이(2) × 백(100)", note: "2 hundreds = 200" },
                          { n: 352, k: "삼백오십이", math: "삼×백 + 오×십 + 이", note: "300 + 50 + 2" },
                          { n: 4500, k: "사천오백", math: "사×천 + 오×백", note: "4,000 + 500" },
                        ].map((ex, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--card-border)]">
                            <div className="font-mono font-black text-[var(--primary)] w-14 shrink-0 text-right">{ex.n.toLocaleString()}</div>
                            <div className="text-lg font-bold w-28 shrink-0">{ex.k}</div>
                            <div className="text-xs font-mono text-[var(--accent)] shrink-0">{ex.math}</div>
                            <div className="text-xs opacity-40 ml-auto text-right hidden sm:block">{ex.note}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Per-unit deep dives ── */}
                  {/* ── 4-digit grouping rule ── */}
                  <div className="glass-panel p-6 space-y-5 border-2 border-[var(--warning)]/30">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      🔢 The 4-Digit Grouping Rule
                    </h3>

                    {/* English vs Korean comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
                        <div className="font-bold text-red-400 mb-3 uppercase tracking-wider text-xs">English — groups of 3</div>
                        <div className="space-y-1 font-mono">
                          <div className="flex gap-2 items-center">
                            <span className="text-base font-bold">1,000</span>
                            <span className="opacity-40 text-xs">→ one thousand</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="text-base font-bold">1,000,000</span>
                            <span className="opacity-40 text-xs">→ one million</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="text-base font-bold">1,000,000,000</span>
                            <span className="opacity-40 text-xs">→ one billion</span>
                          </div>
                        </div>
                        <div className="mt-3 text-xs opacity-50 italic">Comma every 3 digits</div>
                      </div>
                      <div className="bg-[var(--warning)]/5 rounded-xl p-4 border border-[var(--warning)]/20">
                        <div className="font-bold text-[var(--warning)] mb-3 uppercase tracking-wider text-xs">Korean — groups of 4</div>
                        <div className="space-y-1 font-mono">
                          <div className="flex gap-2 items-center">
                            <span className="text-base font-bold">10,000</span>
                            <span className="text-[var(--warning)] font-bold text-xs">→ 만 (man)</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="text-base font-bold">100,000,000</span>
                            <span className="text-[var(--warning)] font-bold text-xs">→ 억 (eok)</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="text-base font-bold">1,000,000,000,000</span>
                            <span className="text-[var(--warning)] font-bold text-xs">→ 조 (jo)</span>
                          </div>
                        </div>
                        <div className="mt-3 text-xs opacity-50 italic">New unit every 4 digits: 만→억→조</div>
                      </div>
                    </div>

                    {/* The mental trick */}
                    <div className="bg-[var(--accent)]/5 rounded-xl p-4 border border-[var(--accent)]/20 text-sm">
                      <div className="font-bold text-[var(--accent)] mb-2">💡 The Mental Trick</div>
                      <p className="opacity-80 leading-relaxed">
                        To say any large number in Korean, <strong>split it into groups of 4 digits from the right</strong>.
                        Each group gets a unit word: 만, 억, 조. Then read each group using Sino-Korean.
                      </p>
                    </div>

                    {/* Step-by-step walkthrough */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">Step-by-step: How to say 1,234,567</div>

                      {/* Digit blocks visual */}
                      <div className="overflow-x-auto pb-2">
                        <div className="flex items-end gap-2 min-w-max">
                          {/* Group 1: 1 (백만 range) */}
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-xs opacity-40">↓ 만's unit</div>
                            <div className="flex gap-1">
                              {["1","2","3","4"].map((d, i) => (
                                <div key={i} className="w-10 h-12 rounded-lg bg-[var(--primary)]/10 border-2 border-[var(--primary)]/30 flex items-center justify-center text-xl font-black text-[var(--primary)]">{d}</div>
                              ))}
                            </div>
                            <div className="text-xs font-bold text-[var(--primary)] mt-1">천이백삼십사만</div>
                            <div className="text-xs opacity-40 font-mono">1,234 × 만</div>
                          </div>
                          <div className="text-2xl font-bold opacity-30 mb-6">·</div>
                          {/* Group 2: 567 */}
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-xs opacity-40">↓ remaining</div>
                            <div className="flex gap-1">
                              {["5","6","7"].map((d, i) => (
                                <div key={i} className="w-10 h-12 rounded-lg bg-[var(--secondary)]/10 border-2 border-[var(--secondary)]/30 flex items-center justify-center text-xl font-black text-[var(--secondary)]">{d}</div>
                              ))}
                            </div>
                            <div className="text-xs font-bold text-[var(--secondary)] mt-1">오백육십칠</div>
                            <div className="text-xs opacity-40 font-mono">500 + 60 + 7</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)] text-sm">
                        <span className="font-mono font-bold text-lg">1,234,567</span>
                        <span className="mx-3 opacity-40">=</span>
                        <span className="text-xl font-bold">천이백삼십사만 오백육십칠</span>
                      </div>
                    </div>

                    {/* More large number examples */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">More Large Number Examples</div>
                      <div className="space-y-2">
                        {[
                          { n: "10,000", k: "만", split: "1 0000", note: "Just: 만" },
                          { n: "100,000", k: "십만", split: "10 | 0000", note: "십(10) × 만" },
                          { n: "1,000,000", k: "백만", split: "100 | 0000", note: "백(100) × 만" },
                          { n: "1,000,000,000", k: "십억", split: "10 | 0000 | 0000", note: "십(10) × 억 = 1 Billion" },
                          { n: "100,000,000,000", k: "천억", split: "1000 | 0000 | 0000", note: "천(1000) × 억 = 100 Billion" },
                          { n: "1,000,000,000,000", k: "일조", split: "1 | 0000 | 0000 | 0000", note: "1 Trillion" },
                          { n: "123,456,789,012", k: "천이백삼십사억 오천육백칠십팔만 구천십이", split: "1234 | 5678 | 9012", note: "억 group + 만 group + remainder" },
                        ].map((ex, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl bg-[var(--background)] border border-[var(--card-border)] text-sm">
                            <div className="font-mono font-black text-[var(--warning)] w-32 shrink-0">{ex.n}</div>
                            <div className="font-bold flex-1">{ex.k}</div>
                            <div className="text-xs font-mono opacity-40 shrink-0">{ex.note}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-bold uppercase tracking-widest opacity-40 pt-2">Deep Dive — Rules per Unit</div>

                  {main.sino.formationRules.map((rule, i) => (
                    <div key={i} className="glass-panel overflow-hidden">
                      <button onClick={() => setExpandedRule(expandedRule === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--primary)]/5 transition-colors">
                        <div className="font-bold text-lg">{rule.title}</div>
                        {expandedRule === i ? <ChevronUp size={18} className="opacity-50 shrink-0" /> : <ChevronDown size={18} className="opacity-50 shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {expandedRule === i && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="border-t border-[var(--card-border)] p-5 space-y-4">
                              <div className="p-4 bg-[var(--card)] rounded-xl border-l-4 border-[var(--primary)] text-sm leading-relaxed">
                                {rule.rule}
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-[var(--card-border)]">
                                      <th className="text-left py-2 opacity-50 font-bold text-xs uppercase pr-4">Number</th>
                                      <th className="text-left py-2 opacity-50 font-bold text-xs uppercase pr-4">Korean</th>
                                      <th className="text-left py-2 opacity-50 font-bold text-xs uppercase">Breakdown</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[var(--card-border)]">
                                    {rule.examples.map((ex, j) => (
                                      <tr key={j} className="hover:bg-[var(--background)] transition-colors">
                                        <td className="py-3 pr-4 font-mono font-bold text-[var(--primary)]">{ex.number.toLocaleString()}</td>
                                        <td className="py-3 pr-4 text-xl font-bold">{ex.expression}</td>
                                        <td className="py-3 opacity-60 text-xs">{ex.breakdown}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}


              {/* Practice examples */}
              {sinoTab === "practice" && (
                <div className="space-y-3">
                  {main.sino.practiceExamples.map((ex, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass-panel p-5 flex items-center gap-6">
                      <div className="text-3xl font-black text-[var(--primary)] w-24 shrink-0 text-center">{ex.number.toLocaleString()}</div>
                      <div>
                        <div className="text-2xl font-bold">{ex.expression}</div>
                        <div className="text-sm opacity-60 mt-1">{ex.use}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── NATIVE KOREAN ── */}
          {mainTab === "native" && (
            <div className="space-y-6">
              <div className="glass-panel p-5 text-sm opacity-80 border-l-4 border-[var(--secondary)]">
                <strong>Native Korean</strong> numbers are purely Korean. Used for: {main.native.usedFor.join(" • ")}
              </div>

              <div className="flex gap-2 flex-wrap">
                {(["digits", "formation", "counters", "practice"] as NativeTab[]).map(t => (
                  <button key={t} onClick={() => setNativeTab(t)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${nativeTab === t ? "bg-[var(--secondary)]/20 text-[var(--secondary)] border border-[var(--secondary)]" : "glass-panel opacity-50 hover:opacity-100"}`}>
                    {t === "digits" ? "1–99" : t === "formation" ? "How to Form" : t === "counters" ? "Counters" : "Examples"}
                  </button>
                ))}
              </div>

              {/* Native digits */}
              {nativeTab === "digits" && (
                <div className="space-y-3">
                  <div className="glass-panel p-4 text-sm bg-[var(--secondary)]/5">
                    ⚡ <strong>Key rule:</strong> 하나→한, 둘→두, 셋→세, 넷→네, 스물→스무 when followed directly by a counter word.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {main.native.digits.map((d, i) => (
                      <motion.div key={d.num} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                        className="glass-panel p-4 flex items-center gap-4 hover:border-[var(--secondary)] transition-colors">
                        <div className="text-xl font-black text-[var(--secondary)] w-10 text-center shrink-0">{d.num}</div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-2xl font-bold">{d.full}</span>
                            {d.full !== d.shortened && (
                              <span className="text-sm text-[var(--secondary)] font-bold bg-[var(--secondary)]/10 px-2 py-0.5 rounded-full">→ {d.shortened}</span>
                            )}
                          </div>
                          <div className="text-xs font-mono opacity-60 mt-0.5">{d.romanization}</div>
                          {d.note && <div className="text-xs opacity-50 mt-1 leading-snug">{d.note}</div>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Native Formation */}
              {nativeTab === "formation" && (
                <div className="space-y-3">
                  {main.native.formationRules.map((rule, i) => (
                    <div key={i} className="glass-panel overflow-hidden">
                      <button onClick={() => setExpandedRule(expandedRule === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--secondary)]/5 transition-colors">
                        <div className="font-bold text-lg">{rule.title}</div>
                        {expandedRule === i ? <ChevronUp size={18} className="opacity-50 shrink-0" /> : <ChevronDown size={18} className="opacity-50 shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {expandedRule === i && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="border-t border-[var(--card-border)] p-5 space-y-4">
                              <div className="p-4 bg-[var(--card)] rounded-xl border-l-4 border-[var(--secondary)] text-sm leading-relaxed">
                                {rule.rule}
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-[var(--card-border)]">
                                      <th className="text-left py-2 opacity-50 font-bold text-xs uppercase pr-4">Number</th>
                                      <th className="text-left py-2 opacity-50 font-bold text-xs uppercase pr-4">Korean</th>
                                      <th className="text-left py-2 opacity-50 font-bold text-xs uppercase">Breakdown</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[var(--card-border)]">
                                    {rule.examples.map((ex, j) => (
                                      <tr key={j}>
                                        <td className="py-3 pr-4 font-mono font-bold text-[var(--secondary)]">{ex.number}</td>
                                        <td className="py-3 pr-4 text-xl font-bold">{ex.expression}</td>
                                        <td className="py-3 opacity-60 text-xs">{ex.breakdown}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}

              {/* Counters */}
              {nativeTab === "counters" && (
                <div className="space-y-3">
                  <div className="glass-panel p-4 text-sm opacity-70">
                    In Korean, you must use a <strong>counter word</strong> after a number when counting specific things. The number then shortens (하나→한, etc.).
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {main.native.counters.map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="glass-panel p-5 hover:border-[var(--secondary)] transition-colors">
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-3xl font-bold text-[var(--secondary)]">{c.counter}</span>
                          <span className="text-sm font-bold opacity-60">{c.meaning}</span>
                        </div>
                        <div className="text-sm font-mono bg-[var(--background)] p-2 rounded-lg opacity-80 italic">"{c.example}"</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Native Practice */}
              {nativeTab === "practice" && (
                <div className="space-y-3">
                  {main.native.practiceExamples.map((ex, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass-panel p-5 flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-[var(--secondary)] mt-2 shrink-0" />
                      <div>
                        <div className="font-bold opacity-60 text-sm mb-1">{ex.scenario}</div>
                        <div className="text-2xl font-bold">{ex.korean}</div>
                        <div className="text-xs opacity-50 mt-1">{ex.note}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── COMPARISON TABLE ── */}
          {mainTab === "comparison" && (
            <div className="space-y-6">
              <div className="glass-panel p-5 text-sm opacity-80">
                The #1 mistake learners make: using the wrong number system. This table shows exactly which to use in each situation.
              </div>
              <div className="glass-panel overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--card-border)] bg-[var(--background)]">
                      <th className="text-left px-5 py-3 font-bold opacity-50 text-xs uppercase">Context</th>
                      <th className="text-left px-5 py-3 font-bold opacity-50 text-xs uppercase">System</th>
                      <th className="text-left px-5 py-3 font-bold opacity-50 text-xs uppercase">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--card-border)]">
                    {main.comparison.map((row, i) => (
                      <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="hover:bg-[var(--card)] transition-colors">
                        <td className="px-5 py-4 font-bold">{row.context}</td>
                        <td className="px-5 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.system === "Sino"
                            ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                            : "bg-[var(--secondary)]/10 text-[var(--secondary)]"
                            }`}>
                            {row.system}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono opacity-80">{row.example}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-panel p-5 border-l-4 border-[var(--primary)]">
                  <div className="font-bold text-[var(--primary)] mb-2 text-lg">Sino-Korean</div>
                  <ul className="text-sm space-y-1 opacity-80 list-disc pl-4">
                    <li>Dates, months, years</li>
                    <li>Minutes (분), seconds (초)</li>
                    <li>Money (원)</li>
                    <li>Phone numbers, addresses</li>
                    <li>Floors (층), percentages</li>
                    <li>Numbers 100 and above</li>
                  </ul>
                </div>
                <div className="glass-panel p-5 border-l-4 border-[var(--secondary)]">
                  <div className="font-bold text-[var(--secondary)] mb-2 text-lg">Native Korean</div>
                  <ul className="text-sm space-y-1 opacity-80 list-disc pl-4">
                    <li>Age (살)</li>
                    <li>Hours (시)</li>
                    <li>Counting things with 개, 권, 마리...</li>
                    <li>People (명, 분)</li>
                    <li>Number of times (번)</li>
                    <li>Numbers 1–99 in casual context</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── DAYS & MONTHS ── */}
          {mainTab === "calendar" && (() => {
            const cal = main.daysAndMonths;
            return (
              <div className="space-y-8">

                {/* Days of the Week */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold">요일 Days of the Week</h2>
                  <div className="glass-panel p-4 text-sm border-l-4 border-[var(--accent)] opacity-80">
                    💡 {cal.dayMemonic}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cal.daysOfWeek.map((d, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="glass-panel p-4 flex items-center gap-4 hover:border-[var(--accent)] transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xl font-bold shrink-0">
                          {d.hanja.split(" ")[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">{d.korean}</span>
                            <span className="text-xs font-mono opacity-50">{d.romanization}</span>
                          </div>
                          <div className="text-sm font-bold mt-0.5">{d.meaning}</div>
                          <div className="text-xs opacity-50 mt-0.5">{d.hanja} — {d.tip}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Useful Phrases</div>
                    {cal.usefulDayPhrases.map((p, i) => (
                      <div key={i} className="glass-panel p-4">
                        <div className="text-lg font-bold">{p.phrase}</div>
                        <div className="text-xs font-mono opacity-50 mt-0.5">{p.romanization}</div>
                        <div className="text-sm opacity-70 mt-1">{p.meaning}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Months */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold">월 Months of the Year</h2>
                  <div className="glass-panel p-4 text-sm border-l-4 border-[var(--primary)] opacity-80">
                    📌 {cal.dateStructure}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {cal.months.map((m, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                        className={`glass-panel p-4 text-center hover:border-[var(--primary)] transition-colors ${
                          m.breakdown.includes("sound change") ? "border-[var(--warning)]/50" : ""
                        }`}>
                        <div className="text-xs font-bold opacity-40 mb-1">{m.meaning}</div>
                        <div className="text-2xl font-bold text-[var(--primary)] mb-1">{m.korean}</div>
                        <div className="text-xs font-mono opacity-50">{m.romanization}</div>
                        <div className="text-xs opacity-40 mt-2 leading-snug">{m.breakdown}</div>
                        {m.breakdown.includes("sound change") && (
                          <div className="mt-1 text-xs text-[var(--warning)] font-bold">⚠️ Irregular!</div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Irregular Months — Pronunciation Exceptions</div>
                    {cal.monthNotes.map((n, i) => (
                      <div key={i} className="glass-panel p-4 border-l-4 border-[var(--warning)]">
                        <div className="font-bold text-[var(--warning)] mb-1">{n.month}</div>
                        <div className="text-sm opacity-80">{n.rule}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Date Phrases</div>
                    {cal.usefulDatePhrases.map((p, i) => (
                      <div key={i} className="glass-panel p-4">
                        <div className="text-lg font-bold">{p.phrase}</div>
                        <div className="text-xs font-mono opacity-50 mt-0.5">{p.romanization}</div>
                        <div className="text-sm opacity-70 mt-1">{p.meaning}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            );
          })()}

          {/* ── TELLING TIME ── */}
          {mainTab === "time" && (() => {
            const t = main.time;
            return (
              <div className="space-y-8">

                {/* Key rule banner */}
                <div className="glass-panel p-5 border-l-4 border-[var(--primary)] text-sm">
                  🕐 <strong>The golden rule:</strong> {t.structure}
                </div>

                {/* AM/PM vocab */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold">오전 / 오후 — AM & PM</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {t.amPm.map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="glass-panel p-4 text-center hover:border-[var(--primary)] transition-colors">
                        <div className="text-3xl font-bold text-[var(--primary)] mb-1">{item.term}</div>
                        <div className="text-xs font-mono opacity-50 mb-1">{item.romanization}</div>
                        <div className="text-sm font-bold">{item.meaning}</div>
                        <div className="text-xs opacity-40 mt-1">{item.lit}</div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Hours clock grid */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold">시 Hours <span className="text-sm font-normal opacity-50 ml-2">(Native Korean numbers)</span></h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {t.hours.map((h, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                        className="glass-panel p-3 text-center hover:border-[var(--secondary)] transition-colors">
                        <div className="text-xl font-black text-[var(--secondary)] mb-1">{h.num}</div>
                        <div className="text-lg font-bold leading-tight">{h.korean}</div>
                        <div className="text-xs font-mono opacity-40 mt-1">{h.romanization}</div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Minutes */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold">분 Minutes <span className="text-sm font-normal opacity-50 ml-2">(Sino-Korean numbers)</span></h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {t.minutePatterns.map((m, i) => (
                      <div key={i} className="glass-panel p-4 flex items-center gap-4">
                        <div className="text-2xl font-black text-[var(--primary)] w-10 text-center shrink-0">:{m.min.padStart(2, "0")}</div>
                        <div>
                          <div className="font-bold text-lg">{m.korean}</div>
                          <div className="text-xs font-mono opacity-50">{m.romanization}</div>
                          {m.note && <div className="text-xs opacity-60 mt-0.5">{m.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Special expressions */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Special Time Expressions</div>
                    {t.specialMinutes.map((s, i) => (
                      <div key={i} className="glass-panel p-4 flex items-center gap-4">
                        <div className="text-2xl font-bold text-[var(--accent)] w-16 shrink-0 text-center">{s.term}</div>
                        <div>
                          <div className="font-bold">{s.meaning}</div>
                          <div className="text-sm opacity-60 mt-0.5 font-mono italic">{s.example}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Example times */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold">Practice Times</h2>
                  <div className="space-y-2">
                    {t.exampleTimes.map((ex, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        className="glass-panel p-4 flex items-center gap-5">
                        <div className="text-2xl font-black font-mono text-[var(--primary)] w-24 shrink-0">{ex.time}</div>
                        <div className="flex-1">
                          <div className="text-xl font-bold">{ex.korean}</div>
                          <div className="text-xs font-mono opacity-50 mt-0.5">{ex.romanization}</div>
                          <div className="text-xs opacity-40 mt-1 italic">{ex.breakdown}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Useful time phrases */}
                <section className="space-y-3">
                  <h2 className="text-xl font-bold">Useful Time Phrases</h2>
                  {t.usefulTimePhrases.map((p, i) => (
                    <div key={i} className="glass-panel p-4">
                      <div className="text-lg font-bold">{p.phrase}</div>
                      <div className="text-xs font-mono opacity-50 mt-0.5">{p.romanization}</div>
                      <div className="text-sm opacity-70 mt-1">{p.meaning}</div>
                    </div>
                  ))}
                </section>
              </div>
            );
          })()}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
