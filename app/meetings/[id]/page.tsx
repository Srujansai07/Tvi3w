import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import MeetingActions from './actions'

export const dynamic = 'force-dynamic'

interface Props {
    params: { id: string }
}

export default async function MeetingDetailPage({ params }: Props) {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    const { data: meeting, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', session.user.id)
        .single()

    if (error || !meeting) {
        notFound()
    }

    // Fetch notes for this meeting
    const { data: notes } = await supabase
        .from('notes')
        .select('*')
        .eq('meeting_id', params.id)
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/meetings" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
                    ← Back to Meetings
                </Link>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{meeting.title || 'Untitled Meeting'}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${meeting.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                                    meeting.status === 'scheduled' ? 'bg-blue-900/50 text-blue-400' :
                                        meeting.status === 'cancelled' ? 'bg-red-900/50 text-red-400' :
                                            'bg-gray-700 text-gray-400'
                                }`}>
                                {meeting.status || 'draft'}
                            </span>
                        </div>
                        <MeetingActions meetingId={params.id} />
                    </div>

                    <p className="text-gray-400 mb-6">{meeting.description || 'No description'}</p>

                    <div className="grid gap-4 md:grid-cols-2 text-sm">
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <span className="text-gray-400">📅 Date</span>
                            <p className="text-white font-medium">
                                {meeting.start_time ? new Date(meeting.start_time).toLocaleDateString() : 'Not set'}
                            </p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <span className="text-gray-400">⏰ Time</span>
                            <p className="text-white font-medium">
                                {meeting.start_time ? new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not set'}
                                {meeting.end_time && ` - ${new Date(meeting.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            </p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <span className="text-gray-400">📍 Location</span>
                            <p className="text-white font-medium">{meeting.location || 'Not set'}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <span className="text-gray-400">🏷️ Type</span>
                            <p className="text-white font-medium capitalize">{meeting.meeting_type?.replace('_', ' ') || 'General'}</p>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Meeting Notes</h2>
                        <Link
                            href={`/notes/new?meeting_id=${params.id}`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                            + Add Note
                        </Link>
                    </div>

                    {notes && notes.length > 0 ? (
                        <div className="space-y-3">
                            {notes.map((note: any) => (
                                <div key={note.id} className="bg-gray-700/50 rounded-lg p-4">
                                    <p className="text-white whitespace-pre-wrap">{note.content}</p>
                                    <p className="text-gray-500 text-xs mt-2">
                                        {new Date(note.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-4">No notes for this meeting yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
