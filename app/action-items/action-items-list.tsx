'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ActionItem {
    id: string
    title: string
    status: string
    due_date?: string
    meeting_id: string
    meetings?: { id: string; title: string }
}

export default function ActionItemsList({ items }: { items: ActionItem[] }) {
    const supabase = createClient()
    const router = useRouter()

    const toggleStatus = async (item: ActionItem) => {
        const newStatus = item.status === 'completed' ? 'pending' : 'completed'

        await supabase
            .from('action_items')
            .update({ status: newStatus })
            .eq('id', item.id)

        router.refresh()
    }

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-start gap-4 ${item.status === 'completed' ? 'opacity-60' : ''
                        }`}
                >
                    <button
                        onClick={() => toggleStatus(item)}
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.status === 'completed'
                                ? 'bg-green-600 border-green-600 text-white'
                                : 'border-gray-500 hover:border-blue-500'
                            }`}
                    >
                        {item.status === 'completed' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>
                    <div className="flex-1">
                        <p className={`text-white ${item.status === 'completed' ? 'line-through' : ''}`}>
                            {item.title}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                            {item.meetings && (
                                <Link
                                    href={`/meetings/${item.meetings.id}`}
                                    className="hover:text-blue-400"
                                >
                                    📅 {item.meetings.title}
                                </Link>
                            )}
                            {item.due_date && (
                                <span>📆 Due: {new Date(item.due_date).toLocaleDateString()}</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
