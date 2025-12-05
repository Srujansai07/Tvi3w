'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewMeetingPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        type: 'professional' as 'professional' | 'presentation' | 'interview' | 'informal',
        description: '',
        participants: '',
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Create meeting in database
            const response = await fetch('/api/meetings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    start_time: new Date().toISOString(),
                }),
            })

            if (!response.ok) throw new Error('Failed to create meeting')

            const meeting = await response.json()
            router.push(`/meetings/${meeting.id}/live`)
        } catch (error) {
            console.error('Error creating meeting:', error)
            alert('Failed to create meeting')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tvi3W
                            </Link>
                            <p className="text-sm text-gray-400 mt-1">New Meeting</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="glass-panel p-8 rounded-xl border border-gray-800">
                    <h2 className="text-2xl font-bold text-white mb-6">Start New Meeting</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Meeting Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Product Strategy Discussion"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Meeting Type
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {(['professional', 'presentation', 'interview', 'informal'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`px-4 py-3 rounded-lg font-medium transition-all capitalize ${formData.type === type
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="What will you discuss?"
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                            />
                        </div>

                        {/* Participants */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Participants (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.participants}
                                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                                placeholder="e.g., John, Sarah, Mike"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Comma-separated names</p>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                            >
                                {loading ? 'Starting...' : 'Start Meeting'}
                            </button>
                            <Link
                                href="/meetings"
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
