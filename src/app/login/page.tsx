"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import api from "@/lib/axios";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });

            // Axios automatically checks res.status (throws on err)
            const data = res.data;
            localStorage.setItem('token', data.token);
            // Must also set the cookie for SSR middleware
            document.cookie = `token=${data.token}; path=/`;

            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            alert(error.response?.data?.error || 'An error occurred during login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
            <div className="w-full max-w-md glass-panel p-8 relative overflow-hidden">

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold title-gradient">Welcome Back</h2>
                    <p className="text-sm opacity-60">Continue your language journey</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[var(--primary)] text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-[var(--primary)]/20 mt-6"
                    >
                        Log In <ChevronRight size={16} />
                    </button>
                </form>

                <div className="text-center mt-6 text-sm">
                    Don't have an account? <Link href="/signup" className="text-[var(--primary)] font-medium">Sign up</Link>
                </div>

            </div>
        </div>
    );
}
