"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        targetLanguage: "",
        currentLevel: "Beginner",
        dailyGoal: "15 min"
    });

    const languages = [
        { name: "Spanish", flag: "🇪🇸" },
        { name: "French", flag: "🇫🇷" },
        { name: "German", flag: "🇩🇪" },
        { name: "Japanese", flag: "🇯🇵" },
        { name: "Italian", flag: "🇮🇹" },
        { name: "Mandarin", flag: "🇨🇳" },
    ];

    const levels = ["Beginner", "Intermediate", "Advanced"];
    const goals = ["5 min", "15 min", "30 min", "1 hour"];

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else {
            // Submit logic here
            router.push("/dashboard");
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
            <div className="w-full max-w-lg glass-panel p-8 relative overflow-hidden">

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">
                        {step === 1 && "Create Account"}
                        {step === 2 && "Choose Language"}
                        {step === 3 && "Set Your Goal"}
                    </h2>
                    <div className="text-sm text-[var(--foreground)] opacity-50">Step {step} of 3</div>
                </div>

                <div className="relative min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-3">I want to learn...</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.name}
                                                onClick={() => setFormData({ ...formData, targetLanguage: lang.name })}
                                                className={`p-4 rounded-xl border flex items-center gap-2 transition-all ${formData.targetLanguage === lang.name ? 'border-[var(--primary)] bg-[var(--primary)] text-white' : 'border-[var(--card-border)] hover:bg-[var(--card)]'}`}
                                            >
                                                <span className="text-2xl">{lang.flag}</span>
                                                <span className="font-medium">{lang.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3">My level is...</label>
                                    <div className="flex gap-2">
                                        {levels.map((lvl) => (
                                            <button
                                                key={lvl}
                                                onClick={() => setFormData({ ...formData, currentLevel: lvl })}
                                                className={`flex-1 p-2 rounded-lg text-sm border transition-all ${formData.currentLevel === lvl ? 'border-[var(--primary)] bg-[var(--primary)] text-white' : 'border-[var(--card-border)] hover:bg-[var(--card)]'}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="text-4xl mb-2">🎯</div>
                                    <h3 className="text-xl font-semibold">Daily Goal</h3>
                                    <p className="text-sm opacity-70">How much time can you dedicate each day?</p>
                                </div>

                                <div className="space-y-3">
                                    {goals.map((goal) => (
                                        <button
                                            key={goal}
                                            onClick={() => setFormData({ ...formData, dailyGoal: goal })}
                                            className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${formData.dailyGoal === goal ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]' : 'border-[var(--card-border)] hover:bg-[var(--card)]'}`}
                                        >
                                            <span className="font-medium">{goal} / day</span>
                                            {formData.dailyGoal === goal && <Check size={18} />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-[var(--card-border)]">
                    <button
                        onClick={handleBack}
                        className={`flex items-center gap-1 text-sm font-medium hover:text-[var(--primary)] ${step === 1 ? 'invisible' : ''}`}
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-[var(--primary)] text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-[var(--primary)]/20"
                    >
                        {step === 3 ? "Complete" : "Next"} <ChevronRight size={16} />
                    </button>
                </div>

                {step === 1 && (
                    <div className="text-center mt-4 text-sm">
                        Already have an account? <Link href="/login" className="text-[var(--primary)] font-medium">Log in</Link>
                    </div>
                )}

            </div>
        </div>
    );
}
