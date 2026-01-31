import { useCourseStore } from "@/store/useCourseStore";

export function Footer() {
    const { unlockedIndex, resetProgress } = useCourseStore();

    return (
        <footer className="mt-20 text-center text-slate-400 text-sm pb-10">
            <div className="max-w-md mx-auto mb-10 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                <h4 className="text-slate-200 font-bold mb-2">Don't break the chain.</h4>
                <p className="text-slate-400 text-xs mb-4">Get a silent nod in your inbox when the next module unlocks.</p>
                <div className="flex gap-2">
                    <input
                        type="email"
                        placeholder="dad@email.com"
                        className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2 focus:ring-1 focus:ring-amber-500 outline-none"
                        aria-label="Email address for daily reminders"
                    />
                    <button
                        className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                        aria-label="Subscribe to reminders"
                        onClick={() => alert("You're on the list. Good work.")}
                    >
                        Join
                    </button>
                </div>
            </div>

            <p className="mb-4">&copy; {new Date().getFullYear()} The Stoic Dad. Memento Mori.</p>

            <div className="flex justify-center flex-wrap gap-4 text-xs text-slate-500 uppercase tracking-widest mb-4">
                <a href="/" className="hover:text-amber-500 transition-colors">Home</a>
                <span>|</span>
                <a href="/journal" className="hover:text-amber-500 transition-colors font-bold text-amber-500/80">My Journal</a>
            </div>

            <div className="flex justify-center gap-4 text-xs text-slate-500 uppercase tracking-widest">
                <button
                    onClick={() => {
                        const { unlockedIndex, journalEntries, completedDates, theme } = useCourseStore.getState();
                        const data = { unlockedIndex, journalEntries, completedDates, theme };
                        const json = JSON.stringify(data);
                        navigator.clipboard.writeText(json).then(() => {
                            alert("Backup data copied to clipboard. Save it somewhere safe!");
                        }).catch(err => {
                            console.error("Failed to copy backup", err);
                            alert("Failed to copy. Try downloading the backup file instead.");
                        });
                    }}
                    className="hover:text-amber-500 transition-colors border-b border-transparent hover:border-amber-500"
                >
                    Copy Backup
                </button>
                <span>|</span>
                <button
                    onClick={() => {
                        const { unlockedIndex, journalEntries, completedDates, theme } = useCourseStore.getState();
                        const data = { unlockedIndex, journalEntries, completedDates, theme };
                        const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `stoic-dad-backup-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                    }}
                    className="hover:text-amber-500 transition-colors border-b border-transparent hover:border-amber-500"
                >
                    Download Backup
                </button>
                <span>|</span>
                <button
                    onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "application/json";
                        input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                try {
                                    const json = JSON.parse(e.target?.result as string);
                                    if (typeof json.unlockedIndex === "number") {
                                        useCourseStore.setState({
                                            unlockedIndex: json.unlockedIndex,
                                            journalEntries: json.journalEntries || {},
                                            completedDates: json.completedDates || [],
                                            theme: json.theme || 'dark'
                                        });
                                        window.location.reload();
                                    } else {
                                        alert("Invalid backup file.");
                                    }
                                } catch (err) {
                                    alert("Failed to parse backup file.");
                                }
                            };
                            reader.readAsText(file);
                        };
                        input.click();
                    }}
                    className="hover:text-amber-500 transition-colors border-b border-transparent hover:border-amber-500"
                >
                    Restore Data
                </button>
                <span>|</span>
                <button
                    onClick={() => {
                        if (confirm("Are you sure you want to reset all progress?")) {
                            resetProgress();
                            window.location.reload();
                        }
                    }}
                    className="hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500"
                    aria-label="Reset all course progress"
                >
                    Reset Progress
                </button>
            </div>
        </footer>
    );
}
