import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AnalysisPage() {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    // Fetch meeting stats
    const { data: meetings } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', session.user.id)

    const completedMeetings = meetings?.filter(m => m.status === 'completed').length || 0
    const scheduledMeetings = meetings?.filter(m => m.status === 'scheduled').length || 0
    const totalMeetings = meetings?.length || 0

    // Fetch notes with content length
    const { data: notes } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', session.user.id)

    const totalNotes = notes?.length || 0
    const totalWords = notes?.reduce((acc, note) => acc + (note.content?.split(' ').length || 0), 0) || 0

    // Fetch contacts count
    const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">AI Analysis</h1>
                    <p className="text-gray-400">Insights and analytics from your meetings</p>
                </div>

                {/* Overview Stats */}
                <div className="grid gap-6 md:grid-cols-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-800/50">
                        <div className="text-3xl font-bold text-blue-400">{totalMeetings}</div>
                        <div className="text-gray-400 text-sm">Total Meetings</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-800/50">
                        <div className="text-3xl font-bold text-green-400">{completedMeetings}</div>
                        <div className="text-gray-400 text-sm">Completed</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-800/50">
                        <div className="text-3xl font-bold text-purple-400">{totalNotes}</div>
                        <div className="text-gray-400 text-sm">Notes Taken</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-xl p-6 border border-orange-800/50">
                        <div className="text-3xl font-bold text-orange-400">{contactsCount || 0}</div>
                        <div className="text-gray-400 text-sm">Contacts</div>
                    </div>
                </div>

                {/* AI Features Coming Soon */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">🤖</div>
                            <h2 className="text-xl font-semibold text-white">Meeting Summarizer</h2>
                        </div>
                        <p className="text-gray-400 mb-4">
                            AI-powered meeting summaries that extract key points, action items, and decisions from your meeting notes.
                        </p>
                        <button className="px-4 py-2 bg-blue-600/50 text-blue-300 rounded-lg text-sm font-medium cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">📊</div>
                            <h2 className="text-xl font-semibold text-white">Trend Analysis</h2>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Identify patterns in your meetings, track productivity trends, and get insights on your meeting habits.
                        </p>
                        <button className="px-4 py-2 bg-purple-600/50 text-purple-300 rounded-lg text-sm font-medium cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">💡</div>
                            <h2 className="text-xl font-semibold text-white">Action Item Extractor</h2>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Automatically extract and track action items from your meeting notes with AI-powered task detection.
                        </p>
                        <button className="px-4 py-2 bg-green-600/50 text-green-300 rounded-lg text-sm font-medium cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">📧</div>
                            <h2 className="text-xl font-semibold text-white">Follow-up Generator</h2>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Generate professional follow-up emails based on your meeting notes and discussion points.
                        </p>
                        <button className="px-4 py-2 bg-orange-600/50 text-orange-300 rounded-lg text-sm font-medium cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4">Your Activity Summary</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-white">{scheduledMeetings}</div>
                            <div className="text-gray-400 text-sm">Upcoming Meetings</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-white">{totalWords}</div>
                            <div className="text-gray-400 text-sm">Words in Notes</div>
                        </div>
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <div className="text-2xl font-bold text-white">
                                {Math.round((completedMeetings / (totalMeetings || 1)) * 100)}%
                            </div>
                            <div className="text-gray-400 text-sm">Completion Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
