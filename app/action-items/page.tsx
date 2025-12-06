import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ActionItemsList from './action-items-list'

export const dynamic = 'force-dynamic'

export default async function ActionItemsPage() {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    // Fetch action items with meeting info
    const { data: actionItems, error } = await supabase
        .from('action_items')
        .select(`
      *,
      meetings (id, title)
    `)
        .order('created_at', { ascending: false })

    // Filter for user's action items through meeting relationship
    const { data: userMeetings } = await supabase
        .from('meetings')
        .select('id')
        .eq('user_id', session.user.id)

    const userMeetingIds = new Set(userMeetings?.map(m => m.id) || [])
    const userActionItems = actionItems?.filter(item => userMeetingIds.has(item.meeting_id)) || []

    const pendingItems = userActionItems.filter(item => item.status === 'pending')
    const completedItems = userActionItems.filter(item => item.status === 'completed')

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Action Items</h1>
                        <p className="text-gray-400">Track follow-ups from your meetings</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        Error loading action items: {error.message}
                    </div>
                )}

                {/* Pending Action Items */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-yellow-400">⏳</span> Pending ({pendingItems.length})
                    </h2>
                    {pendingItems.length > 0 ? (
                        <ActionItemsList items={pendingItems} />
                    ) : (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                            <p className="text-gray-400">No pending action items. Great job!</p>
                        </div>
                    )}
                </div>

                {/* Completed Action Items */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">✓</span> Completed ({completedItems.length})
                    </h2>
                    {completedItems.length > 0 ? (
                        <ActionItemsList items={completedItems} />
                    ) : (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                            <p className="text-gray-400">No completed action items yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
