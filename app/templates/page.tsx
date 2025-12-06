'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const templates = [
    {
        id: 'standup',
        name: 'Daily Standup',
        icon: '☀️',
        description: '15-min team sync',
        duration: 15,
        agenda: '- What did you do yesterday?\n- What are you doing today?\n- Any blockers?',
    },
    {
        id: '1on1',
        name: '1:1 Meeting',
        icon: '🤝',
        description: 'Personal check-in',
        duration: 30,
        agenda: '- Personal updates\n- Goals progress\n- Feedback & support\n- Action items',
    },
    {
        id: 'sprint',
        name: 'Sprint Planning',
        icon: '🏃',
        description: 'Plan upcoming sprint',
        duration: 60,
        agenda: '- Review backlog\n- Estimate stories\n- Assign tasks\n- Define sprint goal',
    },
    {
        id: 'retro',
        name: 'Retrospective',
        icon: '🔄',
        description: 'Team reflection',
        duration: 45,
        agenda: '- What went well?\n- What needs improvement?\n- Action items for next sprint',
    },
    {
        id: 'client',
        name: 'Client Call',
        icon: '💼',
        description: 'External client meeting',
        duration: 45,
        agenda: '- Project status\n- Demo new features\n- Feedback discussion\n- Next steps',
    },
    {
        id: 'brainstorm',
        name: 'Brainstorm',
        icon: '💡',
        description: 'Idea generation session',
        duration: 60,
        agenda: '- Define problem\n- Generate ideas\n- Group & prioritize\n- Select winners',
    },
]

export default function TemplatesPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState<string | null>(null)

    const createFromTemplate = async (template: typeof templates[0]) => {
        setLoading(template.id)

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/login')
            return
        }

        const now = new Date()
        now.setHours(now.getHours() + 1)
        now.setMinutes(0, 0, 0)

        const endTime = new Date(now.getTime() + template.duration * 60000)

        const { data, error } = await supabase
            .from('meetings')
            .insert({
                user_id: session.user.id,
                title: template.name,
                description: template.agenda,
                start_time: now.toISOString(),
                end_time: endTime.toISOString(),
                meeting_type: template.id,
                status: 'scheduled',
            })
            .select()
            .single()

        if (error) {
            alert('Error creating meeting: ' + error.message)
            setLoading(null)
            return
        }

        router.push(`/meetings/${data.id}/edit`)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Meeting Templates</h1>
                    <p className="text-gray-400">Quick start with pre-configured meeting types</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => createFromTemplate(template)}
                            disabled={loading === template.id}
                            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all text-left group disabled:opacity-50"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">{template.icon}</span>
                                <div>
                                    <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                                        {template.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">{template.duration} min</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                            <div className="text-xs text-gray-500 bg-gray-700/50 p-2 rounded">
                                <pre className="whitespace-pre-wrap">{template.agenda.substring(0, 80)}...</pre>
                            </div>
                            {loading === template.id && (
                                <div className="mt-3 text-blue-400 text-sm">Creating...</div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/meetings/new"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Or create a blank meeting →
                    </Link>
                </div>
            </div>
        </div>
    )
}
