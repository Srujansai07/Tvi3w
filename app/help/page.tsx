import Link from 'next/link'

const shortcuts = [
    { keys: 'H', description: 'Go to Home' },
    { keys: 'D', description: 'Go to Dashboard' },
    { keys: 'M', description: 'Go to Meetings' },
    { keys: 'C', description: 'Go to Contacts' },
    { keys: 'N', description: 'Go to Notes' },
    { keys: 'T', description: 'Go to Tasks' },
    { keys: 'A', description: 'Go to AI Analysis' },
    { keys: '/', description: 'Show shortcuts help' },
    { keys: 'Ctrl+K', description: 'Open Command Palette' },
    { keys: 'Shift+N', description: 'New Meeting' },
    { keys: 'Shift+C', description: 'New Contact' },
]

const features = [
    {
        emoji: '📅',
        title: 'Meetings',
        description: 'Schedule, track, and manage all your meetings in one place. Add notes, track status, and set reminders.',
    },
    {
        emoji: '👥',
        title: 'Contacts',
        description: 'Keep a directory of all your professional contacts with company, role, and contact information.',
    },
    {
        emoji: '📝',
        title: 'Notes',
        description: 'Take notes during meetings and tag them for easy organization and retrieval.',
    },
    {
        emoji: '⚡',
        title: 'Action Items',
        description: 'Track follow-ups and tasks from your meetings. Mark them complete as you go.',
    },
    {
        emoji: '🤖',
        title: 'AI Analysis',
        description: 'Use Gemini AI to summarize meetings, extract action items, and analyze trends.',
    },
    {
        emoji: '📊',
        title: 'Reports',
        description: 'View statistics and export your data in JSON or CSV format.',
    },
    {
        emoji: '🗓️',
        title: 'Calendar',
        description: 'View all your meetings in a calendar format with color-coded status indicators.',
    },
    {
        emoji: '⚙️',
        title: 'Settings',
        description: 'Customize your experience with theme, notifications, and preferences.',
    },
]

export default function HelpPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Help & Documentation</h1>
                <p className="text-gray-400 mb-8">Learn how to use Tvi3W effectively</p>

                {/* Getting Started */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">🚀 Getting Started</h2>
                    <ol className="space-y-3 text-gray-300">
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">1.</span>
                            <span>Sign in with your Google or GitHub account</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">2.</span>
                            <span>Create your first meeting from the Dashboard or Meetings page</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">3.</span>
                            <span>Add contacts you frequently meet with</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">4.</span>
                            <span>Take notes during your meetings</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">5.</span>
                            <span>Use AI Analysis to get insights from your meetings</span>
                        </li>
                    </ol>
                </div>

                {/* Features */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">✨ Features</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {features.map((feature) => (
                            <div key={feature.title} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{feature.emoji}</span>
                                    <h3 className="text-white font-medium">{feature.title}</h3>
                                </div>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">⌨️ Keyboard Shortcuts</h2>
                    <div className="grid gap-2 md:grid-cols-2">
                        {shortcuts.map((shortcut) => (
                            <div key={shortcut.keys} className="flex justify-between items-center py-2 px-3 bg-gray-700/50 rounded-lg">
                                <span className="text-gray-300">{shortcut.description}</span>
                                <kbd className="px-2 py-1 bg-gray-600 rounded text-gray-300 text-sm font-mono">
                                    {shortcut.keys}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4">🔗 Quick Links</h2>
                    <div className="grid gap-3 md:grid-cols-3">
                        <Link href="/dashboard" className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                            <span>📊</span>
                            <span className="text-white">Dashboard</span>
                        </Link>
                        <Link href="/meetings/new" className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                            <span>📅</span>
                            <span className="text-white">New Meeting</span>
                        </Link>
                        <Link href="/analysis" className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                            <span>🤖</span>
                            <span className="text-white">AI Analysis</span>
                        </Link>
                        <Link href="/export" className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                            <span>📦</span>
                            <span className="text-white">Export Data</span>
                        </Link>
                        <Link href="/reports" className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                            <span>📈</span>
                            <span className="text-white">View Reports</span>
                        </Link>
                        <Link href="/settings" className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                            <span>⚙️</span>
                            <span className="text-white">Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
