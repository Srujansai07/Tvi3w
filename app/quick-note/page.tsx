'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function QuickNotePage() {
    const supabase = createClient()
    const router = useRouter()
    const [content, setContent] = useState('')
    const [saving, setSaving] = useState(false)
    const [recentNotes, setRecentNotes] = useState<any[]>([])

    useEffect(() => {
        async function loadRecent() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const { data } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(5)

            setRecentNotes(data || [])
        }

        loadRecent()
    }, [])

    const handleSave = async () => {
        if (!content.trim()) return

        setSaving(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const { error, data } = await supabase.from('notes').insert({
            user_id: session.user.id,
            content: content.trim(),
        }).select().single()

        if (!error && data) {
            setRecentNotes(prev => [data, ...prev.slice(0, 4)])
            setContent('')
        }

        setSaving(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleSave()
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-4xl">⚡</span>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Quick Note</h1>
                        <p className="text-gray-400">Capture your thoughts instantly</p>
                    </div>
                </div>

                {/* Quick Input */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Start typing... (Ctrl+Enter to save)"
                        rows={6}
                        className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-lg"
                        autoFocus
                    />
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                        <span className="text-gray-500 text-sm">
                            {content.length} characters
                        </span>
                        <button
                            onClick={handleSave}
                            disabled={saving || !content.trim()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                <>Save Note</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Recent Notes */}
                {recentNotes.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-4">Recent Notes</h2>
                        <div className="space-y-3">
                            {recentNotes.map(note => (
                                <div
                                    key={note.id}
                                    className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
                                    onClick={() => router.push(`/notes/${note.id}`)}
                                >
                                    <div className="text-white line-clamp-2">{note.content}</div>
                                    <div className="text-gray-500 text-xs mt-2">
                                        {new Date(note.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Keyboard Shortcuts */}
                <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Keyboard Shortcuts</h3>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <div><kbd className="px-2 py-0.5 bg-gray-700 rounded text-gray-300">Ctrl</kbd> + <kbd className="px-2 py-0.5 bg-gray-700 rounded text-gray-300">Enter</kbd> Save note</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
