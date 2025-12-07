'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TEMPLATES = [
    { id: '1', name: 'Team Standup', duration: 15, description: 'Daily team sync meeting', icon: '🏃' },
    { id: '2', name: 'One-on-One', duration: 30, description: 'Personal check-in meeting', icon: '👥' },
    { id: '3', name: 'Sprint Planning', duration: 60, description: 'Plan upcoming sprint work', icon: '📋' },
    { id: '4', name: 'Retrospective', duration: 45, description: 'Team retrospective session', icon: '🔄' },
    { id: '5', name: 'Client Call', duration: 30, description: 'External client meeting', icon: '📞' },
    { id: '6', name: 'Interview', duration: 60, description: 'Candidate interview', icon: '🎯' },
    { id: '7', name: 'Brainstorm', duration: 45, description: 'Creative ideation session', icon: '💡' },
    { id: '8', name: 'Review', duration: 30, description: 'Code or design review', icon: '👀' },
]

export default function TemplatesPage() {
    const supabase = createClient()
    const router = useRouter()
    const [creating, setCreating] = useState<string | null>(null)

    const useTemplate = async (template: typeof TEMPLATES[0]) => {
        setCreating(template.id)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }

        const start = new Date()
        start.setHours(start.getHours() + 1, 0, 0, 0)
        const end = new Date(start.getTime() + template.duration * 60000)

        const { data, error } = await supabase.from('meetings').insert({
            user_id: session.user.id,
            title: template.name,
            description: template.description,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            status: 'scheduled',
        }).select().single()

        if (!error && data) router.push(`/meetings/${data.id}`)
        setCreating(null)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8"><span className="text-4xl">📄</span><div><h1 className="text-3xl font-bold text-white">Templates</h1><p className="text-gray-400">Quick-start meeting templates</p></div></div>
                <div className="grid gap-4 md:grid-cols-2">
                    {TEMPLATES.map(t => (
                        <div key={t.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-4xl">{t.icon}</span>
                                <span className="text-gray-500 text-sm">{t.duration} min</span>
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-1">{t.name}</h3>
                            <p className="text-gray-400 text-sm mb-4">{t.description}</p>
                            <button onClick={() => useTemplate(t)} disabled={creating === t.id} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                                {creating === t.id ? 'Creating...' : 'Use Template'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
