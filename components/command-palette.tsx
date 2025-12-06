'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useGlobalShortcuts, ShortcutsHelp } from '@/lib/keyboard-shortcuts'

const quickActions = [
    { icon: '📅', label: 'New Meeting', href: '/meetings/new', shortcut: 'Shift+N' },
    { icon: '👤', label: 'Add Contact', href: '/contacts/new', shortcut: 'Shift+C' },
    { icon: '📝', label: 'New Note', href: '/notes/new', shortcut: '' },
    { icon: '🤖', label: 'AI Analysis', href: '/analysis', shortcut: 'A' },
]

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false)
    const { showHelp, setShowHelp, shortcuts } = useGlobalShortcuts()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + K to open command palette
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(s => !s)
            }
            // Escape to close
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    if (showHelp) {
        return <ShortcutsHelp shortcuts={shortcuts} onClose={() => setShowHelp(false)} />
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-110 z-40"
                title="Quick Actions (Ctrl+K)"
            >
                ⚡
            </button>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-24 z-50" onClick={() => setIsOpen(false)}>
            <div
                className="bg-gray-800 rounded-xl p-4 border border-gray-700 w-full max-w-md mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Type a command..."
                        className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                    />
                </div>

                <div className="space-y-1">
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{action.icon}</span>
                                <span className="text-white">{action.label}</span>
                            </div>
                            {action.shortcut && (
                                <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-400 text-xs font-mono">
                                    {action.shortcut}
                                </kbd>
                            )}
                        </Link>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                    <button
                        onClick={() => { setIsOpen(false); setShowHelp(true) }}
                        className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">⌨️</span>
                            <span className="text-white">Keyboard Shortcuts</span>
                        </div>
                        <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-400 text-xs font-mono">/</kbd>
                    </button>
                </div>
            </div>
        </div>
    )
}
