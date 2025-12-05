'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ContactDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [contact, setContact] = useState({
        id: params.id,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        company: 'Acme Inc',
        job_title: 'CEO',
        phone: '+1 234 567 8900',
        relationship_type: 'professional',
        last_contact: '2024-01-15',
        interaction_count: 12,
        notes: 'Met at tech conference 2023',
    })
    const [isEditing, setIsEditing] = useState(false)
    const [interactions, setInteractions] = useState([
        { date: '2024-01-15', type: 'meeting', title: 'Product Discussion' },
        { date: '2024-01-10', type: 'email', title: 'Follow-up on proposal' },
        { date: '2024-01-05', type: 'call', title: 'Quick sync' },
    ])

    const handleSave = async () => {
        // Save to API
        setIsEditing(false)
    }

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this contact?')) {
            // Delete via API
            router.push('/contacts')
        }
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/contacts" className="text-gray-400 hover:text-white">
                                ← Back
                            </Link>
                            <div>
                                <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Tvi3W
                                </Link>
                                <p className="text-sm text-gray-400 mt-1">Contact Details</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <div className="glass-panel p-8 rounded-xl border border-gray-800">
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {contact.first_name[0]}{contact.last_name[0]}
                                </div>
                                <div className="flex-1">
                                    {!isEditing ? (
                                        <>
                                            <h1 className="text-3xl font-bold text-white mb-2">
                                                {contact.first_name} {contact.last_name}
                                            </h1>
                                            <p className="text-lg text-gray-400 mb-4">{contact.job_title} at {contact.company}</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="text-white">{contact.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <p className="text-white">{contact.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Relationship</p>
                                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm capitalize">
                                                        {contact.relationship_type}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Last Contact</p>
                                                    <p className="text-white">{contact.last_contact}</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={contact.first_name}
                                                    onChange={(e) => setContact({ ...contact, first_name: e.target.value })}
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                                    placeholder="First Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={contact.last_name}
                                                    onChange={(e) => setContact({ ...contact, last_name: e.target.value })}
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                                    placeholder="Last Name"
                                                />
                                            </div>
                                            <input
                                                type="email"
                                                value={contact.email}
                                                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                                placeholder="Email"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={contact.company}
                                                    onChange={(e) => setContact({ ...contact, company: e.target.value })}
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                                    placeholder="Company"
                                                />
                                                <input
                                                    type="text"
                                                    value={contact.job_title}
                                                    onChange={(e) => setContact({ ...contact, job_title: e.target.value })}
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                                    placeholder="Job Title"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h2 className="text-xl font-bold text-white mb-4">📝 Notes</h2>
                            <textarea
                                value={contact.notes}
                                onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                                disabled={!isEditing}
                                className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50"
                                placeholder="Add notes about this contact..."
                            />
                        </div>

                        {/* Interaction History */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h2 className="text-xl font-bold text-white mb-4">📅 Interaction History</h2>
                            <div className="space-y-3">
                                {interactions.map((interaction, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                                            {interaction.type === 'meeting' ? '🤝' : interaction.type === 'email' ? '📧' : '📞'}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium">{interaction.title}</h3>
                                            <p className="text-sm text-gray-400">{interaction.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Actions */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-semibold text-white mb-4">📊 Stats</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-400">Total Interactions</p>
                                    <p className="text-2xl font-bold text-white">{contact.interaction_count}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Relationship Strength</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
                                        </div>
                                        <span className="text-sm text-green-400">Strong</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                    Schedule Meeting
                                </button>
                                <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
                                    Send Email
                                </button>
                                <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
                                    Set Reminder
                                </button>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-semibold text-white mb-4">🏷️ Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                                    VIP
                                </span>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                    Tech
                                </span>
                                <button className="px-3 py-1 border border-dashed border-gray-600 text-gray-400 rounded-full text-sm hover:border-gray-500">
                                    + Add Tag
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
