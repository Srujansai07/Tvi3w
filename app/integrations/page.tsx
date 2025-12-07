'use client'

const INTEGRATIONS = [
    { name: 'Google Calendar', icon: '📅', status: 'connected', description: 'Sync your Google Calendar events' },
    { name: 'Slack', icon: '💬', status: 'available', description: 'Get meeting notifications in Slack' },
    { name: 'Zoom', icon: '🎥', status: 'available', description: 'Create Zoom meetings automatically' },
    { name: 'Microsoft Teams', icon: '👥', status: 'available', description: 'Integrate with MS Teams' },
    { name: 'Notion', icon: '📝', status: 'available', description: 'Sync notes to Notion' },
    { name: 'Trello', icon: '📋', status: 'available', description: 'Create cards from action items' },
    { name: 'Zapier', icon: '⚡', status: 'available', description: 'Connect to 5000+ apps' },
    { name: 'Gmail', icon: '✉️', status: 'connected', description: 'Send meeting invites via Gmail' },
]

export default function IntegrationsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8"><span className="text-4xl">🔗</span><div><h1 className="text-3xl font-bold text-white">Integrations</h1><p className="text-gray-400">Connect your favorite tools</p></div></div>
                <div className="grid gap-4 md:grid-cols-2">
                    {INTEGRATIONS.map(i => (
                        <div key={i.name} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{i.icon}</span>
                                    <div>
                                        <h3 className="text-white font-semibold">{i.name}</h3>
                                        <p className="text-gray-500 text-sm">{i.description}</p>
                                    </div>
                                </div>
                            </div>
                            <button className={`w-full py-2 rounded-lg font-medium transition-colors ${i.status === 'connected' ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                {i.status === 'connected' ? '✓ Connected' : 'Connect'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
