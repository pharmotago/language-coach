export function exportJournalData(moduleCount: number) {
    const journal: Record<string, string> = {};

    // Collect all journal entries from localStorage
    for (let i = 1; i <= moduleCount; i++) {
        const key = `stoic-dad-journal-${i}`;
        const entry = localStorage.getItem(key);
        if (entry) {
            journal[`Module ${i}`] = entry;
        }
    }

    if (Object.keys(journal).length === 0) {
        alert('No journal entries found to export.');
        return;
    }

    // Create formatted text content
    const content = Object.entries(journal)
        .map(([module, entry]) => {
            return `=== ${module} ===\n\n${entry}\n\n`;
        })
        .join('\n');

    const fullContent = `THE STOIC DAD - REFLECTION JOURNAL\nExported: ${new Date().toLocaleDateString()}\n\n${'='.repeat(50)}\n\n${content}`;

    // Create and download file
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stoic-dad-journal-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function resetAllProgress() {
    const confirmed = confirm(
        'Are you sure you want to reset ALL progress?\n\nThis will delete:\n- Completed modules\n- Streak data\n- Journal entries\n- All achievements\n\nThis action cannot be undone.'
    );

    if (!confirmed) return;

    // Double confirmation for safety
    const doubleConfirm = confirm('This is your last chance. Really reset everything?');
    if (!doubleConfirm) return;

    // Clear all Stoic Dad data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('stoic-dad-')) {
            localStorage.removeItem(key);
        }
    });

    alert('All progress has been reset. The page will now reload.');
    window.location.reload();
}
