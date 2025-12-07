'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function FavoritesPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [favorites, setFavorites] = useState<{
        meetings: any[]
        contacts: any[]
        notes: any[]
    }>({ meetings: [], contacts: [], notes: [] })

    useEffect(() => {
        async function loadFavorites() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            // Load favorites from user metadata
            const userFavorites = session.user.user_metadata?.favorites || {
                meetings: [],
                contacts: [],
                notes: []
            }

            // Fetch actual data for favorited items
            const [meetingsRes, contactsRes, notesRes] = await Promise.all([
                userFavorites.meetings?.length > 0
                    ? supabase.from('meetings').select('*').in('id', userFavorites.meetings)
                    : Promise.resolve({ data: [] }),
                userFavorites.contacts?.length > 0
                    ? supabase.from('contacts').select('*').in('id', userFavorites.contacts)
                    : Promise.resolve({ data: [] }),
                userFavorites.notes?.length > 0
                    ? supabase.from('notes').select('*').in('id', userFavorites.notes)
                    : Promise.resolve({ data: [] }),
            ])

            setFavorites({
                meetings: meetingsRes.data || [],
                contacts: contactsRes.data || [],
                notes: notesRes.data || [],
            })
            setLoading(false)
        }

        loadFavorites()
    }, [])

    const total = favorites.meetings.length + favorites.contacts.length + favorites.notes.length

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-800 rounded-xl p-6 h-24"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-4xl">⭐</span>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Favorites</h1>
                        <p className="text-gray-400">{total} items saved</p>
                    </div>
                </div>

                {total === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-6xl mb-4">⭐</div>
                        <div className="text-xl text-white mb-2">No favorites yet</div>
                        <p className="text-gray-400 mb-6">Star items to add them here</p>
                        <Link
                            href="/dashboard"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Favorite Meetings */}
                        {favorites.meetings.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <span>📅</span> Meetings ({favorites.meetings.length})
                                </h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {favorites.meetings.map(meeting => (
                                        <Link
                                            key={meeting.id}
                                            href={`/meetings/${meeting.id}`}
                                            className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-colors"
                                        >
                                            <div className="text-white font-medium">{meeting.title}</div>
                                            <div className="text-gray-400 text-sm mt-1">
                                                {new Date(meeting.start_time).toLocaleDateString()}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Favorite Contacts */}
                        {favorites.contacts.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <span>👤</span> Contacts ({favorites.contacts.length})
                                </h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {favorites.contacts.map(contact => (
                                        <Link
                                            key={contact.id}
                                            href={`/contacts/${contact.id}`}
                                            className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-colors"
                                        >
                                            <div className="text-white font-medium">{contact.email}</div>
                                            <div className="text-gray-400 text-sm mt-1">{contact.company}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Favorite Notes */}
                        {favorites.notes.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <span>📝</span> Notes ({favorites.notes.length})
                                </h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {favorites.notes.map(note => (
                                        <Link
                                            key={note.id}
                                            href={`/notes/${note.id}`}
                                            className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-green-500 transition-colors"
                                        >
                                            <div className="text-white line-clamp-2">{note.content}</div>
                                            <div className="text-gray-400 text-sm mt-2">
                                                {new Date(note.created_at).toLocaleDateString()}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
