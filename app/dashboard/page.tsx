import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    // Fetch recent meetings
    const { data: meetings } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: false })
        .limit(5)

    // Fetch contacts count
    const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)

    // Fetch notes count
    const { count: notesCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back, {session.user.email}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-xl">
                        <div className="text-4xl mb-2">📅</div>
                        <h3 className="text-xl font-semibold text-white mb-1">Meetings</h3>
                        <p className="text-3xl font-bold text-white">{meetings?.length || 0}</p>
                        <Link href="/meetings" className="text-blue-200 text-sm hover:underline mt-2 inline-block">
                            View all meetings →
                        </Link>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-xl">
                        <div className="text-4xl mb-2">👥</div>
                        <h3 className="text-xl font-semibold text-white mb-1">Contacts</h3>
                        <p className="text-3xl font-bold text-white">{contactsCount || 0}</p>
                        <Link href="/contacts" className="text-purple-200 text-sm hover:underline mt-2 inline-block">
                            Manage contacts →
                        </Link>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-xl">
                        <div className="text-4xl mb-2">📝</div>
                        <h3 className="text-xl font-semibold text-white mb-1">Notes</h3>
                        <p className="text-3xl font-bold text-white">{notesCount || 0}</p>
                        <Link href="/notes" className="text-green-200 text-sm hover:underline mt-2 inline-block">
                            View all notes →
                        </Link>
                    </div>
                </div>

                {/* Recent Meetings */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Recent Meetings</h2>
                        <Link href="/meetings/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                            + New Meeting
                        </Link>
                    </div>

                    {meetings && meetings.length > 0 ? (
                        <div className="space-y-3">
                            {meetings.map((meeting: any) => (
                                <Link
                                    key={meeting.id}
                                    href={`/meetings/${meeting.id}`}
                                    className="block bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-semibold">{meeting.title || 'Untitled Meeting'}</h3>
                                            <p className="text-gray-400 text-sm">{meeting.description || 'No description'}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${meeting.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                                                meeting.status === 'scheduled' ? 'bg-blue-900/50 text-blue-400' :
                                                    'bg-gray-700 text-gray-400'
                                            }`}>
                                            {meeting.status || 'draft'}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-xs mt-2">
                                        {meeting.start_time ? new Date(meeting.start_time).toLocaleDateString() : 'No date set'}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">📅</div>
                            <p className="text-gray-400 mb-4">No meetings yet. Create your first meeting!</p>
                            <Link href="/meetings/new" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors inline-block">
                                Create Meeting
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Link href="/meetings/new" className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                            <span className="text-2xl mb-2">📅</span>
                            <span className="text-sm text-gray-300">New Meeting</span>
                        </Link>
                        <Link href="/contacts/new" className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                            <span className="text-2xl mb-2">👤</span>
                            <span className="text-sm text-gray-300">Add Contact</span>
                        </Link>
                        <Link href="/notes/new" className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                            <span className="text-2xl mb-2">📝</span>
                            <span className="text-sm text-gray-300">New Note</span>
                        </Link>
                        <Link href="/analysis" className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                            <span className="text-2xl mb-2">🤖</span>
                            <span className="text-sm text-gray-300">AI Analysis</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
