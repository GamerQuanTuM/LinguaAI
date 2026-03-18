export default function AchievementsPage() {
    const leaderboard = [
        { rank: 1, name: "Maria S.", xp: 2450 },
        { rank: 2, name: "You", xp: 1250 },
        { rank: 3, name: "John D.", xp: 1100 },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Leaderboard 🏆</h1>
            <div className="glass-panel p-6">
                <div className="space-y-4">
                    {leaderboard.map((user) => (
                        <div key={user.name} className={`flex items-center justify-between p-4 rounded-xl ${user.name === 'You' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card)]'}`}>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-xl w-8">#{user.rank}</span>
                                <span className="font-medium">{user.name}</span>
                            </div>
                            <span className="font-bold">{user.xp} XP</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
