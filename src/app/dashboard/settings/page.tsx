export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings ⚙️</h1>
            <div className="glass-panel p-6 space-y-6">
                <div>
                    <h3 className="font-bold mb-2">Learning Goal</h3>
                    <select className="p-2 rounded border border-[var(--card-border)] bg-[var(--background)] w-full max-w-xs">
                        <option>Casual (5 min/day)</option>
                        <option>Regular (15 min/day)</option>
                        <option>Hardcore (1 hour/day)</option>
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                    <span>Sound Effects</span>
                    <input type="checkbox" className="toggle" defaultChecked />
                </div>
            </div>
        </div>
    );
}
