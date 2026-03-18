export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Profile 👤</h1>
            <div className="glass-panel p-8 flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-[var(--primary)] flex items-center justify-center text-4xl text-white font-bold">
                    JD
                </div>
                <div>
                    <h2 className="text-2xl font-bold">John Doe</h2>
                    <p className="opacity-70">Learning French • Beginner</p>
                </div>
            </div>
        </div>
    );
}
