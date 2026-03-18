"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Bookmark, Trash2 } from "lucide-react";

type Message = {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: Date;
};

type SavedQuery = {
    id: string;
    question: string;
    answer: string;
    date: string;
};

export default function AskAIPage() {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', text: "안녕하세요! I am your AI Korean tutor. Ask me anything about grammar, vocabulary, or culture.", timestamp: new Date() }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('savedQueries');
        if (saved) {
            setSavedQueries(JSON.parse(saved));
        }
    }, []);

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: query, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setQuery("");
        setIsTyping(true);

        // Mock AI Response
        setTimeout(() => {
            const responseText = mockAIResponse(userMsg.text);
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: responseText, timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const mockAIResponse = (input: string): string => {
        const lower = input.toLowerCase();
        if (lower.includes('hello') || lower.includes('hi')) return "안녕하세요 (Annyeonghaseyo)! How can I help you learn Korean today?";
        if (lower.includes('thank')) return "You can say 감사합니다 (Gamsahamnida) for 'Thank you'.";
        if (lower.includes('love')) return "I love you is 사랑해 (Saranghae).";
        if (lower.includes('difference') && lower.includes('topic') && lower.includes('subject')) return "Great question! Subject particles (이/가) mark the doer of the action, while Topic particles (은/는) mark what we are talking about or for contrast.";
        return `That's an interesting question about "${input}". In Korean, context is very important! Could you specify if you want the formal or casual form?`;
    };

    const saveQuery = (msgIndex: number) => {
        // Save the user question (msgIndex - 1) and AI answer (msgIndex)
        if (msgIndex <= 0) return;
        const question = messages[msgIndex - 1].text;
        const answer = messages[msgIndex].text;

        const newSaved: SavedQuery = {
            id: Date.now().toString(),
            question,
            answer,
            date: new Date().toLocaleDateString()
        };

        const updated = [newSaved, ...savedQueries];
        setSavedQueries(updated);
        localStorage.setItem('savedQueries', JSON.stringify(updated));
    };

    const deleteSaved = (id: string) => {
        const updated = savedQueries.filter(q => q.id !== id);
        setSavedQueries(updated);
        localStorage.setItem('savedQueries', JSON.stringify(updated));
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">

            {/* Chat Area */}
            <div className="flex-1 flex flex-col glass-panel overflow-hidden">
                <div className="p-4 border-b border-[var(--card-border)] bg-[var(--card)]/50">
                    <h2 className="font-bold flex items-center gap-2">
                        <Bot className="text-[var(--primary)]" /> AI Tutor Chat
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)] text-white'}`}>
                                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'assistant' ? 'bg-[var(--card)] border border-[var(--card-border)]' : 'bg-[var(--primary)] text-white'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                {msg.role === 'assistant' && (
                                    <button
                                        onClick={() => saveQuery(idx)}
                                        className="mt-2 text-xs opacity-60 flex items-center gap-1 hover:opacity-100 transition-opacity"
                                    >
                                        <Bookmark size={12} /> Save to Notes
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="bg-[var(--card)] p-4 rounded-2xl flex gap-1 items-center">
                                <span className="w-2 h-2 bg-[var(--foreground)] rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-[var(--foreground)] rounded-full animate-bounce delay-100" />
                                <span className="w-2 h-2 bg-[var(--foreground)] rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-[var(--card-border)] bg-[var(--card)]/50">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about grammar, vocabulary..."
                            className="flex-1 p-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                        <button onClick={handleSend} className="btn-primary p-3 rounded-xl aspect-square flex items-center justify-center">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Saved Queries Sidebar */}
            <div className="w-full md:w-80 glass-panel p-4 flex flex-col h-full overflow-hidden">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Bookmark size={18} className="text-[var(--secondary)]" /> Saved Notes
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {savedQueries.length === 0 && (
                        <p className="text-sm opacity-50 text-center py-8">No saved notes yet.</p>
                    )}
                    {savedQueries.map((item) => (
                        <div key={item.id} className="p-3 rounded-lg bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors group relative">
                            <button
                                onClick={() => deleteSaved(item.id)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-1 rounded"
                            >
                                <Trash2 size={12} />
                            </button>
                            <p className="font-bold text-sm mb-1 truncate pr-6">Q: {item.question}</p>
                            <p className="text-xs opacity-70 line-clamp-3 bg-[var(--background)] p-2 rounded">{item.answer}</p>
                            <div className="text-[10px] opacity-40 mt-2 text-right">{item.date}</div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
