'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Activity {
    id: string
    type: 'meeting' | 'note' | 'contact'
    action: 'created' | 'updated' | 'deleted'
    title: string
    timestamp: string
}

export default function ActivityPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [activities, setActivities] = useState<Activity[]>([])

    useEffect(() => {
        async function loadActivity() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { router.push('/login'); return }

            const [meetings, notes, contacts] = await Promise.all([
                supabase.from('meetings').select('id, title, created_at, updated_at').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(20),
                supabase.from('notes').select('id, content, created_at, updated_at').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(20),
                supabase.from('contacts').select('id, email, created_at').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(20),
            ])

            const allActivities: Activity[] = [
                ...(meetings.data || []).map(m => ({ id: m.id, type: 'meeting' as const, action: 'created' as const, title: m.title, timestamp: m.created_at })),
                ...(notes.data || []).map(n => ({ id: n.id, type: 'note' as const, action: 'created' as const, title: n.content?.slice(0, 50) || 'Note', timestamp: n.created_at })),
                ...(contacts.data || []).map(c => ({ id: c.id, type: 'contact' as const, action: 'created' as const, title: c.email, timestamp: c.created_at })),
            ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 30)

            setActivities(allActivities)
            setLoading(false)
        }
        loadActivity()
    }, [])

    const getIcon = (type: string) => ({ meeting: '📅', note: '📝', contact: '👤' }[type] || '📋')
    const getColor = (type: string) => ({ meeting: 'text-blue-400', note: 'text-green-400', contact: 'text-purple-400' }[type] || 'text-gray-400')

    if (loading) return <div className="container mx-auto px-4 py-8"><div className="max-w-3xl mx-auto animate-pulse"><div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>{[1, 2, 3, 4, 5].map(i => <div key={i} className="bg-gray-800 rounded-xl p-4 h-16 mb-3"></div>)}</div></div>

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-8"><span className="text-4xl">📋</span><div><h1 className="text-3xl font-bold text-white">Activity</h1><p className="text-gray-400">Your recent actions</p></div></div>
                {activities.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700"><div className="text-6xl mb-4">📋</div><div className="text-gray-400">No activity yet</div></div>
                ) : (
                    <div className="space-y-3">
                        {activities.map(a => (
                            <div key={`${a.type}-${a.id}`} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
                                <span className="text-2xl">{getIcon(a.type)}</span>
                                <div className="flex-1 min-w-0">
                                    <div className={`font-medium ${getColor(a.type)} capitalize`}>{a.type} {a.action}</div>
                                    <div className="text-white truncate">{a.title}</div>
                                </div>
                                <div className="text-gray-500 text-sm whitespace-nowrap">{new Date(a.timestamp).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
