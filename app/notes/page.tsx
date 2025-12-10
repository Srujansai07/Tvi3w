'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { TagBadge, TagInput } from '@/components/tags'
import Link from 'next/link'
import LoginPrompt, { useLoginPrompt } from '@/components/ui/login-prompt'

interface Note {
    id: string
    content: string | null
    tags: string[]
    created_at: string
}

// Demo data for guests
const demoNotes: Note[] = [
    {
        id: 'demo-1',
        content: 'This is a sample note to show you how notes work in Tvi3W. You can organize your thoughts, meeting notes, and ideas here.',
        tags: ['demo', 'sample'],
        created_at: new Date().toISOString()
    },
    {
        id: 'demo-2',
        content: 'Meeting action items:\n- Follow up with client\n- Review proposal\n- Schedule team meeting',
        tags: ['meeting', 'action-items'],
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
]

export default function NotesPage() {
    const supabase = createClient()
    const router = useRouter()
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const { isOpen, message, showLoginPrompt, closeLoginPrompt } = useLoginPrompt()

    useEffect(() => {
        async function fetchNotes() {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                // Guest mode - show demo data
                setIsLoggedIn(false)
                setNotes(demoNotes)
                setLoading(false)
                return
            }

            setIsLoggedIn(true)
            const { data, error } = await supabase
                .from('notes')
                .select('id, content, tags, created_at')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })

            if (error) setError(error.message)
            else setNotes(data?.map(n => ({ ...n, tags: n.tags || [] })) || [])
            setLoading(false)
        }
        fetchNotes()
    }, [])

    const filteredNotes = notes.filter(note => {
        const matchesSearch = !searchQuery ||
            note.content?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.every(tag => note.tags?.includes(tag))
        return matchesSearch && matchesTags
    })

    const allTags = [...new Set(notes.flatMap(n => n.tags || []))]

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-800 rounded-xl p-6 h-32"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <LoginPrompt isOpen={isOpen} onClose={closeLoginPrompt} message={message} />

            <div className="max-w-4xl mx-auto">
                {/* Guest Mode Banner */}
                {!isLoggedIn && (
                    <div className="mb-6 bg-gradient-to-r from-green-900/50 to-teal-900/50 border border-green-700/50 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">👋</span>
                            <div>
                                <p className="text-white font-medium">You're in Guest Mode</p>
                                <p className="text-gray-400 text-sm">Sign in to create and save your own notes</p>
                            </div>
                        </div>
                        <Link href="/login" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                            Sign In
                        </Link>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Notes</h1>
                        <p className="text-gray-400">Your notes and thoughts</p>
                    </div>
                    {isLoggedIn ? (
                        <Link
                            href="/notes/new"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            <span>+</span> New Note
                        </Link>
                    ) : (
                        <button
                            onClick={() => showLoginPrompt('Sign in to create and save your notes.')}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            <span>+</span> New Note
                        </button>
                    )}
                </div>


                {/* Search and Filter */}
                <div className="mb-6 space-y-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        className="w-full md:w-1/2 rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-2"
                    />

                    {allTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <span className="text-gray-400 text-sm mr-2">Filter by tags:</span>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTags(
                                        selectedTags.includes(tag)
                                            ? selectedTags.filter(t => t !== tag)
                                            : [...selectedTags, tag]
                                    )}
                                    className={`px-2 py-1 rounded text-xs transition-colors ${selectedTags.includes(tag)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        Error: {error}
                    </div>
                )}

                {filteredNotes.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredNotes.map((note) => (
                            <div
                                key={note.id}
                                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                            >
                                <p className="text-white whitespace-pre-wrap mb-4">
                                    {note.content?.substring(0, 200)}
                                    {(note.content?.length || 0) > 200 ? '...' : ''}
                                </p>

                                {note.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {note.tags.map(tag => (
                                            <TagBadge key={tag} tag={tag} />
                                        ))}
                                    </div>
                                )}

                                <div className="text-gray-500 text-sm">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {searchQuery || selectedTags.length > 0 ? 'No matching notes' : 'No notes yet'}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchQuery || selectedTags.length > 0
                                ? 'Try a different search or filter'
                                : 'Create your first note'}
                        </p>
                        {!(searchQuery || selectedTags.length > 0) && (
                            <Link
                                href="/notes/new"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors inline-block"
                            >
                                Create Note
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
