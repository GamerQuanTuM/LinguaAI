"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, BookOpen, Brain, Trophy, TrendingUp, CalendarDays, Sparkles, Star } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

type Stats = {
  totalDaysLearned: number;
  totalVocab: number;
  totalGrammar: number;
  streak: number;
  weekDaysActive: number;
  weekVocab: number;
  weekGrammar: number;
  level: string;
  language: string;
  memberSince: string;
  last30: { date: string; vocab: number; grammar: number }[];
  tests: { score: number | null; takenAt: string | null }[];
  avgTestScore: number | null;
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 flex flex-col gap-3"
    >
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-black">{value}</div>
        <div className="font-bold opacity-80 mt-0.5">{label}</div>
        {sub && <div className="text-xs opacity-50 mt-1">{sub}</div>}
      </div>
    </motion.div>
  );
}

function ActivityBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="text-xs font-bold opacity-60">{value > 0 ? value : ""}</div>
      <div className="w-full flex-1 bg-[var(--card-border)] rounded-full overflow-hidden flex flex-col justify-end" style={{ height: "80px" }}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full rounded-full bg-gradient-to-t from-[var(--primary)] to-[var(--secondary)]"
        />
      </div>
      <div className="text-xs opacity-40">{label}</div>
    </div>
  );
}

export default function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/progress/stats")
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-12 text-center flex flex-col items-center">
          <Sparkles className="animate-spin mb-6 text-[var(--primary)]" size={48} />
          <h2 className="text-2xl font-bold mb-2">Calculating Progress...</h2>
          <p className="opacity-60">Crunching your learning data.</p>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalDaysLearned === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Progress 📈</h1>
        <div className="glass-panel p-12 text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold mb-2">Nothing yet — let's start!</h2>
          <p className="opacity-60 mb-8">Complete your first lesson to see progress stats here.</p>
          <Link href="/dashboard/modules">
            <button className="btn-primary px-10 py-4 text-lg shadow-xl shadow-[var(--primary)]/20 hover:scale-105 transition-transform">
              Start Learning Now →
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Build a 7-slot week grid (Mon–Sun)
  const todayDow = new Date().getDay();
  const weekSlots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (todayDow - i < 0 ? 7 + i - todayDow : todayDow - i));
    d.setHours(0, 0, 0, 0);
    const match = stats.last30.find(l => {
      const ld = new Date(l.date);
      return ld.toDateString() === d.toDateString();
    });
    return { day: DAYS_OF_WEEK[i], active: !!match, vocab: match?.vocab || 0, grammar: match?.grammar || 0 };
  });

  // Last 14 days for mini bar chart
  const last14 = stats.last30.slice(-14);
  const maxItems = Math.max(...last14.map(d => d.vocab + d.grammar), 1);

  const memberDays = Math.floor((Date.now() - new Date(stats.memberSince).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-10 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Progress 📈</h1>
          <p className="opacity-60">Learning {stats.language} • {stats.level} Level • Member for {memberDays} days</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Flame size={24} className="text-orange-400" />} label="Day Streak" value={stats.streak} sub={stats.streak > 0 ? "Keep it going!" : "Start today!"} color="bg-orange-500/10" />
        <StatCard icon={<BookOpen size={24} className="text-[var(--secondary)]" />} label="Words Learned" value={stats.totalVocab} sub={`This week: ${stats.weekVocab}`} color="bg-[var(--secondary)]/10" />
        <StatCard icon={<Brain size={24} className="text-[var(--primary)]" />} label="Grammar Rules" value={stats.totalGrammar} sub={`This week: ${stats.weekGrammar}`} color="bg-[var(--primary)]/10" />
        <StatCard icon={<Trophy size={24} className="text-yellow-400" />} label="Avg Test Score" value={stats.avgTestScore !== null ? `${stats.avgTestScore}%` : "—"} sub={`${stats.tests.length} tests taken`} color="bg-yellow-500/10" />
      </div>

      {/* This Week's Activity */}
      <section className="glass-panel p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CalendarDays size={20} className="text-[var(--primary)]" /> This Week's Activity
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {weekSlots.map((slot, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                  slot.active
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30"
                    : "bg-[var(--card-border)] opacity-40"
                }`}
              >
                {slot.active && (
                  <>
                    <div className="text-xs font-bold">{slot.vocab}V</div>
                    <div className="text-xs opacity-80">{slot.grammar}G</div>
                  </>
                )}
              </div>
              <span className={`text-xs font-bold ${slot.active ? "opacity-100" : "opacity-40"}`}>{slot.day}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs opacity-50">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[var(--primary)] inline-block" /> Active day</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[var(--card-border)] inline-block" /> No activity</span>
          <span className="ml-auto">V = Vocab words • G = Grammar rules</span>
        </div>
      </section>

      {/* 2-column: Activity chart + Test History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Last 14 Days Bar Chart */}
        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-[var(--accent)]" /> Last 14 Days
          </h2>
          {last14.length === 0 ? (
            <div className="text-center opacity-50 py-10">No data yet</div>
          ) : (
            <div className="flex items-end gap-1.5 h-[100px]">
              {last14.map((d, i) => (
                <ActivityBar key={i} value={d.vocab + d.grammar} max={maxItems} label={d.date.split(" ")[1]} />
              ))}
            </div>
          )}
          <p className="text-xs opacity-40 mt-4 text-center">Total items learned per day (vocab + grammar)</p>
        </section>

        {/* Test History */}
        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Star size={20} className="text-yellow-400" /> Test History
          </h2>
          {stats.tests.length === 0 ? (
            <div className="text-center opacity-50 py-10">No tests taken yet. Tests unlock on weekends!</div>
          ) : (
            <div className="space-y-3">
              {stats.tests.slice(0, 8).map((t, i) => {
                const pct = t.score ?? 0;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="text-xs opacity-50 w-20 shrink-0">
                      {t.takenAt ? new Date(t.takenAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "—"}
                    </div>
                    <div className="flex-1 h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className={`h-full rounded-full ${pct >= 80 ? "bg-[var(--success)]" : pct >= 50 ? "bg-yellow-400" : "bg-[var(--error)]"}`}
                      />
                    </div>
                    <div className={`text-sm font-bold w-10 text-right shrink-0 ${pct >= 80 ? "text-[var(--success)]" : pct >= 50 ? "text-yellow-400" : "text-[var(--error)]"}`}>
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Total Lifetime Stats */}
      <section className="glass-panel p-6">
        <h2 className="text-xl font-bold mb-6">Lifetime Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-black title-gradient">{stats.totalDaysLearned}</div>
            <div className="text-sm opacity-60 mt-1">Days Studied</div>
          </div>
          <div>
            <div className="text-4xl font-black title-gradient">{stats.totalVocab}</div>
            <div className="text-sm opacity-60 mt-1">Words Learned</div>
          </div>
          <div>
            <div className="text-4xl font-black title-gradient">{stats.totalGrammar}</div>
            <div className="text-sm opacity-60 mt-1">Grammar Rules</div>
          </div>
          <div>
            <div className="text-4xl font-black title-gradient">{stats.tests.length}</div>
            <div className="text-sm opacity-60 mt-1">Tests Taken</div>
          </div>
        </div>
      </section>
    </div>
  );
}
