import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NotesPage() {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    const { data: notes, error } = await supabase
        .from('notes')
        .select(`
      *,
      meetings (id, title)
    `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Notes</h1>
                        <p className="text-gray-400">Your meeting notes and thoughts</p>
                    </div>
                    <Link
                        href="/notes/new"
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                        <span>+</span> New Note
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        Error loading notes: {error.message}
                    </div>
                )}

                {notes && notes.length > 0 ? (
                    <div className="space-y-4">
                        {notes.map((note: any) => (
                            <div
                                key={note.id}
                                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        {note.meetings && (
                                            <Link
                                                href={`/meetings/${note.meetings.id}`}
                                                className="text-blue-400 hover:text-blue-300 text-sm"
                                            >
                                                📅 {note.meetings.title}
                                            </Link>
                                        )}
                                    </div>
                                    <span className="text-gray-500 text-xs">
                                        {new Date(note.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-white whitespace-pre-wrap">{note.content}</p>
                                {note.tags && note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {note.tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-gray-700 rounded text-gray-300 text-xs">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No notes yet</h3>
                        <p className="text-gray-400 mb-6">Start taking notes for your meetings</p>
                        <Link
                            href="/notes/new"
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors inline-block"
                        >
                            Create Your First Note
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
