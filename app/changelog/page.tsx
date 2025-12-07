const CHANGELOG = [
    { version: '1.5.0', date: 'Dec 2024', changes: ['Focus Mode with Pomodoro timer', 'Goals tracking system', 'User onboarding flow', 'Keyboard shortcuts reference'] },
    { version: '1.4.0', date: 'Dec 2024', changes: ['Archive page for cancelled items', 'Quick Note instant capture', 'Statistics dashboard', 'Meeting reminders'] },
    { version: '1.3.0', date: 'Dec 2024', changes: ['Favorites system', 'Recurring meetings', 'Bulk actions', 'CSV contact import'] },
    { version: '1.2.0', date: 'Dec 2024', changes: ['Meeting attachments', 'Insights analytics', 'Profile management', 'Global search'] },
    { version: '1.1.0', date: 'Dec 2024', changes: ['AI meeting analysis', 'Tag system', 'Export functionality', 'Reports generation'] },
    { version: '1.0.0', date: 'Dec 2024', changes: ['Initial release', 'Meeting management', 'Contact management', 'Note taking', 'Google auth'] },
]

export default function ChangelogPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-8"><span className="text-4xl">📋</span><div><h1 className="text-3xl font-bold text-white">Changelog</h1><p className="text-gray-400">What's new in Tvi3W</p></div></div>

                <div className="space-y-8">
                    {CHANGELOG.map((release, i) => (
                        <div key={release.version} className="relative pl-8">
                            {i < CHANGELOG.length - 1 && <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-700"></div>}
                            <div className="absolute left-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white">✓</div>
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-white">v{release.version}</h2>
                                    <span className="text-gray-500 text-sm">{release.date}</span>
                                </div>
                                <ul className="space-y-2">
                                    {release.changes.map(c => <li key={c} className="text-gray-400 flex items-center gap-2"><span className="text-green-400">•</span>{c}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
