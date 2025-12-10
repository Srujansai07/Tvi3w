'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoginPrompt, { useLoginPrompt } from '@/components/ui/login-prompt'

interface Contact {
    id: string
    name: string
    email: string | null
    phone: string | null
    company: string | null
    role: string | null
    is_favorite: boolean
    group_name: string | null
}

const groups = ['All', 'Favorites', 'Clients', 'Team', 'Personal', 'Other']

// Demo data for guests
const demoContacts: Contact[] = [
    {
        id: 'demo-1',
        name: 'John Smith (Demo)',
        email: 'john@example.com',
        phone: '+1 234 567 890',
        company: 'Tech Corp',
        role: 'Product Manager',
        is_favorite: true,
        group_name: 'Clients'
    },
    {
        id: 'demo-2',
        name: 'Sarah Johnson (Demo)',
        email: 'sarah@example.com',
        phone: '+1 987 654 321',
        company: 'Design Studio',
        role: 'Lead Designer',
        is_favorite: false,
        group_name: 'Team'
    },
]

export default function ContactsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedGroup, setSelectedGroup] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const { isOpen, message, showLoginPrompt, closeLoginPrompt } = useLoginPrompt()

    useEffect(() => {
        async function fetchContacts() {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                // Guest mode - show demo data
                setIsLoggedIn(false)
                setContacts(demoContacts)
                setLoading(false)
                return
            }

            setIsLoggedIn(true)
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('user_id', session.user.id)
                .order('name', { ascending: true })

            if (error) setError(error.message)
            else setContacts(data?.map(c => ({ ...c, is_favorite: c.is_favorite || false })) || [])
            setLoading(false)
        }
        fetchContacts()
    }, [])


    const toggleFavorite = async (id: string, currentValue: boolean) => {
        const { error } = await supabase
            .from('contacts')
            .update({ is_favorite: !currentValue })
            .eq('id', id)

        if (!error) {
            setContacts(prev => prev.map(c =>
                c.id === id ? { ...c, is_favorite: !currentValue } : c
            ))
        }
    }

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = !searchQuery ||
            contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.company?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesGroup =
            selectedGroup === 'All' ||
            (selectedGroup === 'Favorites' && contact.is_favorite) ||
            contact.group_name === selectedGroup

        return matchesSearch && matchesGroup
    })

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2, 3, 4].map(i => (
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
                    <div className="mb-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">👋</span>
                            <div>
                                <p className="text-white font-medium">You're in Guest Mode</p>
                                <p className="text-gray-400 text-sm">Sign in to save your contacts and sync across devices</p>
                            </div>
                        </div>
                        <Link href="/login" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                            Sign In
                        </Link>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
                        <p className="text-gray-400">Manage your professional network</p>
                    </div>
                    {isLoggedIn ? (
                        <Link
                            href="/contacts/new"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            + Add Contact
                        </Link>
                    ) : (
                        <button
                            onClick={() => showLoginPrompt('Sign in to add and save your contacts.')}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            + Add Contact
                        </button>
                    )}
                </div>


                {/* Search and Filter */}
                <div className="mb-6 space-y-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search contacts..."
                        className="w-full md:w-1/2 rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-2"
                    />

                    <div className="flex flex-wrap gap-2">
                        {groups.map(group => (
                            <button
                                key={group}
                                onClick={() => setSelectedGroup(group)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedGroup === group
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {group === 'Favorites' && '⭐ '}
                                {group}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        Error: {error}
                    </div>
                )}

                {filteredContacts.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                            {contact.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{contact.name}</h3>
                                            <p className="text-gray-400 text-sm">{contact.role || 'No role'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite(contact.id, contact.is_favorite)}
                                        className={`text-xl transition-transform hover:scale-110 ${contact.is_favorite ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'
                                            }`}
                                    >
                                        {contact.is_favorite ? '⭐' : '☆'}
                                    </button>
                                </div>

                                <div className="mt-3 space-y-1 text-sm">
                                    {contact.email && (
                                        <div className="text-gray-500 flex items-center gap-2">
                                            <span>📧</span>
                                            <a href={`mailto:${contact.email}`} className="hover:text-blue-400">{contact.email}</a>
                                        </div>
                                    )}
                                    {contact.company && (
                                        <div className="text-gray-500 flex items-center gap-2">
                                            <span>🏢</span>
                                            {contact.company}
                                        </div>
                                    )}
                                </div>

                                {contact.group_name && (
                                    <div className="mt-3">
                                        <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">
                                            {contact.group_name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {searchQuery || selectedGroup !== 'All' ? 'No matching contacts' : 'No contacts yet'}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchQuery || selectedGroup !== 'All'
                                ? 'Try a different search or filter'
                                : 'Add your first contact'}
                        </p>
                        {!(searchQuery || selectedGroup !== 'All') && (
                            <Link
                                href="/contacts/new"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors inline-block"
                            >
                                Add Contact
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
