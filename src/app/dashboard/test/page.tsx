export default function TestPage() {
    return (
        <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
            <h1 className="text-4xl font-bold">Weekly Test 📝</h1>
            <p className="opacity-70 text-xl">Prove your skills to climb the leaderboard!</p>

            <div className="glass-panel p-8 text-left space-y-4">
                <h3 className="font-bold text-lg">Format</h3>
                <ul className="list-disc pl-5 opacity-80 space-y-2">
                    <li>20 Questions</li>
                    <li>Mixed Grammar & Vocabulary</li>
                    <li>Time Limit: 15 Minutes</li>
                </ul>
            </div>

            <button className="btn-primary w-full py-4 text-xl shadow-xl shadow-[var(--primary)]/30">Start Test</button>
        </div>
    );
}
