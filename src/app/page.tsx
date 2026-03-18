"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background text-foreground transition-colors duration-300">

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -left-1/2 w-[100vw] h-[100vw] bg-[var(--primary)] rounded-full blur-[100px] opacity-20"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-1/2 -right-1/2 w-[100vw] h-[100vw] bg-[var(--secondary)] rounded-full blur-[100px] opacity-20"
        />
      </div>

      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 w-full max-w-7xl mx-auto md:left-1/2 md:-translate-x-1/2">
        <div className="text-2xl font-bold title-gradient">LinguaAI</div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <Link href="/login" className="hover:text-[var(--primary)] font-medium">Log In</Link>
        </div>
      </nav>

      <main className="z-10 text-center max-w-2xl px-4 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
        >
          Master a new language with <span className="title-gradient">AI Power</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-foreground/80 mb-8"
        >
          Personalized curriculum, smart vocabulary flashcards, and realtime grammar correction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full"
        >
          <Link href="/signup">
            <button className="btn-primary text-lg px-8 py-3 shadow-xl shadow-[var(--primary)]/20 w-full sm:w-auto">
              Start Learning Free
            </button>
          </Link>
          <button className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto">
            View Demo
          </button>
        </motion.div>
      </main>

    </div>
  );
}
