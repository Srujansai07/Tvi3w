'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const SHORTCUTS = [
    {
        category: 'Navigation',
        shortcuts: [
            { keys: ['Ctrl', 'K'], action: 'Open command palette' },
            { keys: ['G', 'D'], action: 'Go to Dashboard' },
            { keys: ['G', 'M'], action: 'Go to Meetings' },
            { keys: ['G', 'C'], action: 'Go to Contacts' },
            { keys: ['G', 'N'], action: 'Go to Notes' },
            { keys: ['G', 'S'], action: 'Go to Settings' },
        ]
    },
    {
        category: 'Actions',
        shortcuts: [
            { keys: ['N', 'M'], action: 'New Meeting' },
            { keys: ['N', 'C'], action: 'New Contact' },
            { keys: ['N', 'N'], action: 'New Note' },
            { keys: ['Ctrl', 'Enter'], action: 'Save/Submit form' },
            { keys: ['Esc'], action: 'Close modal/Cancel' },
        ]
    },
    {
        category: 'Search & Filter',
        shortcuts: [
            { keys: ['/'], action: 'Focus search' },
            { keys: ['Ctrl', 'F'], action: 'Find in page' },
            { keys: ['F'], action: 'Toggle filters' },
        ]
    },
    {
        category: 'Quick Actions',
        shortcuts: [
            { keys: ['Q', 'N'], action: 'Quick Note' },
            { keys: ['?'], action: 'Show shortcuts' },
            { keys: ['Ctrl', 'Shift', 'P'], action: 'Toggle Focus Mode' },
        ]
    }
]

export default function ShortcutsPage() {
    const [activeCategory, setActiveCategory] = useState(SHORTCUTS[0].category)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-4xl">⌨️</span>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Keyboard Shortcuts</h1>
                        <p className="text-gray-400">Navigate faster with shortcuts</p>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {SHORTCUTS.map(cat => (
                        <button
                            key={cat.category}
                            onClick={() => setActiveCategory(cat.category)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeCategory === cat.category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {cat.category}
                        </button>
                    ))}
                </div>

                {/* Shortcuts Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {SHORTCUTS.find(c => c.category === activeCategory)?.shortcuts.map((shortcut, i) => (
                        <div
                            key={i}
                            className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between"
                        >
                            <span className="text-white">{shortcut.action}</span>
                            <div className="flex gap-1">
                                {shortcut.keys.map((key, j) => (
                                    <span key={j}>
                                        <kbd className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm font-mono border border-gray-600">
                                            {key}
                                        </kbd>
                                        {j < shortcut.keys.length - 1 && <span className="text-gray-500 mx-1">+</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* All Shortcuts Table */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-white mb-4">All Shortcuts</h2>
                    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="text-left text-gray-400 text-sm py-3 px-4">Category</th>
                                    <th className="text-left text-gray-400 text-sm py-3 px-4">Action</th>
                                    <th className="text-right text-gray-400 text-sm py-3 px-4">Keys</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SHORTCUTS.flatMap(cat =>
                                    cat.shortcuts.map((s, i) => (
                                        <tr key={`${cat.category}-${i}`} className="border-t border-gray-700/50">
                                            <td className="py-3 px-4 text-gray-500">{cat.category}</td>
                                            <td className="py-3 px-4 text-white">{s.action}</td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex gap-1 justify-end">
                                                    {s.keys.map((key, j) => (
                                                        <kbd key={j} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-mono">
                                                            {key}
                                                        </kbd>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tip */}
                <div className="mt-8 p-4 bg-blue-600/10 rounded-xl border border-blue-500/30">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                            <div className="text-blue-400 font-medium">Pro Tip</div>
                            <p className="text-gray-400 text-sm mt-1">
                                Press <kbd className="px-2 py-0.5 bg-gray-700 rounded text-gray-300">Ctrl</kbd> + <kbd className="px-2 py-0.5 bg-gray-700 rounded text-gray-300">K</kbd> anywhere to open the command palette for quick access to all features.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
