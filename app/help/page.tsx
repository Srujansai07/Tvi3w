'use client'

import Link from 'next/link'

const HELP_TOPICS = [
    { title: 'Getting Started', icon: '🚀', items: ['Create your first meeting', 'Add contacts', 'Take notes', 'Use AI features'] },
    { title: 'Meetings', icon: '📅', items: ['Schedule meetings', 'Set reminders', 'Recurring meetings', 'Meeting templates'] },
    { title: 'Notes & Tags', icon: '📝', items: ['Quick notes', 'Tag organization', 'Search notes', 'Export notes'] },
    { title: 'AI Features', icon: '🤖', items: ['Meeting analysis', 'Extract action items', 'Smart summaries', 'Insights'] },
    { title: 'Settings', icon: '⚙️', items: ['Profile settings', 'Notifications', 'Integrations', 'Data export'] },
    { title: 'Keyboard Shortcuts', icon: '⌨️', items: ['Navigation', 'Quick actions', 'Focus mode', 'Search'] },
]

const FAQS = [
    { q: 'How do I create a meeting?', a: 'Click the "New Meeting" button on the dashboard or press N+M.' },
    { q: 'Can I import contacts from CSV?', a: 'Yes! Go to /import to upload a CSV file with your contacts.' },
    { q: 'How does AI analysis work?', a: 'Our AI analyzes your meeting notes to extract key points, action items, and summaries.' },
    { q: 'Is my data secure?', a: 'Yes, all data is encrypted and stored securely in Supabase.' },
]

export default function HelpPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8"><span className="text-4xl">❓</span><div><h1 className="text-3xl font-bold text-white">Help Center</h1><p className="text-gray-400">Find answers and learn how to use Tvi3W</p></div></div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
                    {HELP_TOPICS.map(t => (
                        <div key={t.title} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="text-3xl mb-3">{t.icon}</div>
                            <h3 className="text-white font-semibold mb-3">{t.title}</h3>
                            <ul className="space-y-1">
                                {t.items.map(item => <li key={item} className="text-gray-400 text-sm">• {item}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">FAQs</h2>
                <div className="space-y-4 mb-12">
                    {FAQS.map((f, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-white font-semibold mb-2">{f.q}</h3>
                            <p className="text-gray-400">{f.a}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-blue-600/10 rounded-xl p-6 border border-blue-500/30 text-center">
                    <div className="text-3xl mb-3">💬</div>
                    <h3 className="text-white font-semibold mb-2">Still need help?</h3>
                    <p className="text-gray-400 mb-4">Contact our support team</p>
                    <Link href="/feedback" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">Contact Support</Link>
                </div>
            </div>
        </div>
    )
}
