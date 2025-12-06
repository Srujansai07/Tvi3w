import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BusinessPage() {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    // Fetch all data for business overview
    const { data: meetings } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: false })

    const { data: contacts } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', session.user.id)

    const userMeetingIds = meetings?.map(m => m.id) || []

    const { data: actionItems } = await supabase
        .from('action_items')
        .select('*')
        .in('meeting_id', userMeetingIds.length > 0 ? userMeetingIds : ['empty'])

    // Calculate business metrics
    const totalMeetings = meetings?.length || 0
    const completedMeetings = meetings?.filter(m => m.status === 'completed').length || 0
    const pendingActionItems = actionItems?.filter(a => a.status === 'pending').length || 0
    const totalContacts = contacts?.length || 0

    // Group meetings by type
    const meetingsByType = meetings?.reduce((acc: any, m) => {
        const type = m.meeting_type || 'general'
        acc[type] = (acc[type] || 0) + 1
        return acc
    }, {}) || {}

    // Recent contacts
    const recentContacts = contacts?.slice(0, 5) || []

    // Upcoming meetings
    const upcomingMeetings = meetings?.filter(m =>
        m.status === 'scheduled' &&
        m.start_time &&
        new Date(m.start_time) > new Date()
    ).slice(0, 5) || []

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Business Overview</h1>
                    <p className="text-gray-400">Your business metrics and insights</p>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-6 md:grid-cols-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-xl">
                        <div className="text-4xl mb-2">📅</div>
                        <div className="text-3xl font-bold text-white">{totalMeetings}</div>
                        <div className="text-blue-200 text-sm">Total Meetings</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-xl">
                        <div className="text-4xl mb-2">✓</div>
                        <div className="text-3xl font-bold text-white">{completedMeetings}</div>
                        <div className="text-green-200 text-sm">Completed</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 shadow-xl">
                        <div className="text-4xl mb-2">⏳</div>
                        <div className="text-3xl font-bold text-white">{pendingActionItems}</div>
                        <div className="text-yellow-200 text-sm">Pending Tasks</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-xl">
                        <div className="text-4xl mb-2">👥</div>
                        <div className="text-3xl font-bold text-white">{totalContacts}</div>
                        <div className="text-purple-200 text-sm">Contacts</div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {/* Upcoming Meetings */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span>📅</span> Upcoming Meetings
                        </h2>
                        {upcomingMeetings.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingMeetings.map((meeting: any) => (
                                    <Link
                                        key={meeting.id}
                                        href={`/meetings/${meeting.id}`}
                                        className="block bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="font-medium text-white">{meeting.title || 'Untitled'}</div>
                                        <div className="text-gray-400 text-sm">
                                            {meeting.start_time && new Date(meeting.start_time).toLocaleDateString()}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No upcoming meetings</p>
                        )}
                        <Link href="/meetings" className="text-blue-400 hover:text-blue-300 text-sm mt-4 inline-block">
                            View all meetings →
                        </Link>
                    </div>

                    {/* Meeting Types */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span>📊</span> Meeting Types
                        </h2>
                        <div className="space-y-3">
                            {Object.entries(meetingsByType).map(([type, count]) => (
                                <div key={type} className="flex justify-between items-center">
                                    <span className="text-gray-300 capitalize">{type.replace('_', ' ')}</span>
                                    <span className="text-white font-semibold">{count as number}</span>
                                </div>
                            ))}
                            {Object.keys(meetingsByType).length === 0 && (
                                <p className="text-gray-400">No meetings yet</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Contacts */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span>👥</span> Recent Contacts
                        </h2>
                        {recentContacts.length > 0 ? (
                            <div className="space-y-3">
                                {recentContacts.map((contact: any) => (
                                    <div key={contact.id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                                            {contact.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <div className="text-white">{contact.name}</div>
                                            <div className="text-gray-400 text-sm">{contact.company || contact.email}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No contacts yet</p>
                        )}
                        <Link href="/contacts" className="text-purple-400 hover:text-purple-300 text-sm mt-4 inline-block">
                            View all contacts →
                        </Link>
                    </div>

                    {/* Action Items */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span>⚡</span> Pending Action Items
                        </h2>
                        {pendingActionItems > 0 ? (
                            <div className="text-center py-4">
                                <div className="text-4xl font-bold text-yellow-400 mb-2">{pendingActionItems}</div>
                                <p className="text-gray-400">tasks need your attention</p>
                            </div>
                        ) : (
                            <p className="text-gray-400">All caught up! No pending tasks.</p>
                        )}
                        <Link href="/action-items" className="text-yellow-400 hover:text-yellow-300 text-sm mt-4 inline-block">
                            View action items →
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Link href="/meetings/new" className="flex flex-col items-center justify-center p-4 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-800/50">
                            <span className="text-2xl mb-2">📅</span>
                            <span className="text-sm text-blue-200">Schedule Meeting</span>
                        </Link>
                        <Link href="/contacts/new" className="flex flex-col items-center justify-center p-4 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-800/50">
                            <span className="text-2xl mb-2">👤</span>
                            <span className="text-sm text-purple-200">Add Contact</span>
                        </Link>
                        <Link href="/notes/new" className="flex flex-col items-center justify-center p-4 bg-green-600/20 rounded-lg hover:bg-green-600/30 transition-colors border border-green-800/50">
                            <span className="text-2xl mb-2">📝</span>
                            <span className="text-sm text-green-200">Take Notes</span>
                        </Link>
                        <Link href="/analysis" className="flex flex-col items-center justify-center p-4 bg-orange-600/20 rounded-lg hover:bg-orange-600/30 transition-colors border border-orange-800/50">
                            <span className="text-2xl mb-2">🤖</span>
                            <span className="text-sm text-orange-200">AI Analysis</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
