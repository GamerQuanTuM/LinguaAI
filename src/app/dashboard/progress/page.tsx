export default function ProgressPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Your Progress 📈</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 h-64 flex items-center justify-center">
                    <p className="opacity-50">Activity Chart Placeholder</p>
                </div>
                <div className="glass-panel p-6 h-64 flex items-center justify-center">
                    <p className="opacity-50">Skill Breakdown Placeholder</p>
                </div>
            </div>
        </div>
    );
}
