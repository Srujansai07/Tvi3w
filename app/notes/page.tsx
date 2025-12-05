'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NotesPage() {
    const [notes, setNotes] = useState([
        { id: 1, title: 'Meeting Notes - Jan 15', content: 'Discussed Q1 roadmap...', tags: ['meeting', 'planning'], created_at: '2024-01-15' },
        { id: 2, title: 'Product Ideas', content: 'New feature concepts...', tags: ['product', 'ideas'], created_at: '2024-01-14' },
        { id: 3, title: 'Research Notes', content: 'Market analysis findings...', tags: ['research'], created_at: '2024-01-13' },
    ])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' })

    const handleCreateNote = () => {
        const note = {
            id: notes.length + 1,
            title: newNote.title,
            content: newNote.content,
            tags: newNote.tags.split(',').map(t => t.trim()),
            created_at: new Date().toISOString().split('T')[0],
        }
        setNotes([note, ...notes])
        setNewNote({ title: '', content: '', tags: '' })
        setShowCreateModal(false)
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
                            <p className="text-sm text-gray-400 mt-1">Notes</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            + New Note
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Filters */}
                <div className="glass-panel p-4 rounded-xl border border-gray-800 mb-6">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                            <option>All Tags</option>
                            <option>Meeting</option>
                            <option>Planning</option>
                            <option>Research</option>
                        </select>
                    </div>
                </div>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <div key={note.id} className="glass-panel p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors cursor-pointer">
                            <h3 className="text-lg font-semibold text-white mb-2">{note.title}</h3>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-3">{note.content}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {note.tags.map((tag, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500">{note.created_at}</p>
                        </div>
                    ))}
                </div>

                {/* Create Note Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="glass-panel p-8 rounded-xl border border-gray-800 max-w-2xl w-full mx-4">
                            <h2 className="text-2xl font-bold text-white mb-6">Create New Note</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={newNote.title}
                                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        placeholder="Note title..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                                    <textarea
                                        value={newNote.content}
                                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                        rows={6}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                                        placeholder="Write your note..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={newNote.tags}
                                        onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        placeholder="meeting, planning, ideas"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleCreateNote}
                                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Create Note
                                    </button>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
