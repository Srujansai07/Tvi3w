import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MeetingsPage() {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    const { data: meetings, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Meetings</h1>
                        <p className="text-gray-400">Manage your meetings and appointments</p>
                    </div>
                    <Link
                        href="/meetings/new"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                        <span>+</span> New Meeting
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        Error loading meetings: {error.message}
                    </div>
                )}

                {meetings && meetings.length > 0 ? (
                    <div className="space-y-4">
                        {meetings.map((meeting: any) => (
                            <Link
                                key={meeting.id}
                                href={`/meetings/${meeting.id}`}
                                className="block bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors shadow-lg"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white mb-2">{meeting.title || 'Untitled Meeting'}</h3>
                                        <p className="text-gray-400 text-sm mb-3">{meeting.description || 'No description'}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                📅 {meeting.start_time ? new Date(meeting.start_time).toLocaleDateString() : 'No date'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                ⏰ {meeting.start_time ? new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                📍 {meeting.location || 'No location'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${meeting.status === 'completed' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                                                meeting.status === 'scheduled' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' :
                                                    meeting.status === 'cancelled' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                                        'bg-gray-700 text-gray-400 border border-gray-600'
                                            }`}>
                                            {meeting.status || 'draft'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No meetings yet</h3>
                        <p className="text-gray-400 mb-6">Create your first meeting to get started</p>
                        <Link
                            href="/meetings/new"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors inline-block"
                        >
                            Create Your First Meeting
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
