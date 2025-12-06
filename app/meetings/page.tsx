'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchBar from '@/components/ui/search-bar'
import FilterChips from '@/components/ui/filter-chips'

interface Meeting {
    id: string
    title: string
    description: string | null
    start_time: string | null
    location: string | null
    status: string
    meeting_type: string | null
}

const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
]

export default function MeetingsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [meetings, setMeetings] = useState<Meeting[]>([])
    const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        async function fetchMeetings() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('meetings')
                .select('*')
                .eq('user_id', session.user.id)
                .order('start_time', { ascending: false })

            if (error) {
                setError(error.message)
            } else {
                setMeetings(data || [])
                setFilteredMeetings(data || [])
            }
            setLoading(false)
        }
        fetchMeetings()
    }, [])

    useEffect(() => {
        let result = meetings

        // Apply search filter
        if (searchQuery) {
            result = result.filter(m =>
                m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.location?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(m => m.status === statusFilter)
        }

        setFilteredMeetings(result)
    }, [searchQuery, statusFilter, meetings])

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
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
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

                {/* Search and Filter */}
                <div className="mb-6 space-y-4">
                    <SearchBar
                        placeholder="Search meetings..."
                        onSearch={setSearchQuery}
                        className="max-w-md"
                    />
                    <FilterChips
                        options={statusOptions}
                        selected={statusFilter}
                        onChange={setStatusFilter}
                    />
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        Error: {error}
                    </div>
                )}

                {filteredMeetings.length > 0 ? (
                    <div className="space-y-4">
                        {filteredMeetings.map((meeting) => (
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
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {searchQuery || statusFilter !== 'all' ? 'No matching meetings' : 'No meetings yet'}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchQuery || statusFilter !== 'all'
                                ? 'Try a different search or filter'
                                : 'Create your first meeting to get started'}
                        </p>
                        {!(searchQuery || statusFilter !== 'all') && (
                            <Link
                                href="/meetings/new"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors inline-block"
                            >
                                Create Your First Meeting
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
