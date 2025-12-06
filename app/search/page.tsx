'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

function SearchContent() {
    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''

    const [results, setResults] = useState<{
        meetings: any[]
        contacts: any[]
        notes: any[]
    }>({ meetings: [], contacts: [], notes: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function search() {
            if (!query) {
                setLoading(false)
                return
            }

            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const searchTerm = `%${query}%`

            const [meetingsRes, contactsRes, notesRes] = await Promise.all([
                supabase
                    .from('meetings')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
                    .limit(10),
                supabase
                    .from('contacts')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .or(`email.ilike.${searchTerm},company.ilike.${searchTerm}`)
                    .limit(10),
                supabase
                    .from('notes')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .ilike('content', searchTerm)
                    .limit(10),
            ])

            setResults({
                meetings: meetingsRes.data || [],
                contacts: contactsRes.data || [],
                notes: notesRes.data || [],
            })
            setLoading(false)
        }

        search()
    }, [query])

    const total = results.meetings.length + results.contacts.length + results.notes.length

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
                <p className="text-gray-400 mb-8">
                    {query ? `Found ${total} results for "${query}"` : 'Enter a search term'}
                </p>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse h-24"></div>
                        ))}
                    </div>
                ) : total === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <div className="text-gray-400">No results found</div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Meetings */}
                        {results.meetings.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">
                                    Meetings ({results.meetings.length})
                                </h2>
                                <div className="space-y-3">
                                    {results.meetings.map(meeting => (
                                        <Link
                                            key={meeting.id}
                                            href={`/meetings/${meeting.id}`}
                                            className="block bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">📅</span>
                                                <div>
                                                    <div className="text-white font-medium">{meeting.title}</div>
                                                    <div className="text-gray-400 text-sm">
                                                        {new Date(meeting.start_time).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contacts */}
                        {results.contacts.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">
                                    Contacts ({results.contacts.length})
                                </h2>
                                <div className="space-y-3">
                                    {results.contacts.map(contact => (
                                        <Link
                                            key={contact.id}
                                            href={`/contacts/${contact.id}`}
                                            className="block bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">👤</span>
                                                <div>
                                                    <div className="text-white font-medium">{contact.email}</div>
                                                    <div className="text-gray-400 text-sm">{contact.company}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {results.notes.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">
                                    Notes ({results.notes.length})
                                </h2>
                                <div className="space-y-3">
                                    {results.notes.map(note => (
                                        <Link
                                            key={note.id}
                                            href={`/notes/${note.id}`}
                                            className="block bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-green-500 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">📝</span>
                                                <div>
                                                    <div className="text-white font-medium line-clamp-1">{note.content}</div>
                                                    <div className="text-gray-400 text-sm">
                                                        {new Date(note.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
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

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8 animate-pulse"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse h-24"></div>
                        ))}
                    </div>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}
