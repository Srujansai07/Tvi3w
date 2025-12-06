'use client'

import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Shortcut {
    key: string
    ctrlKey?: boolean
    shiftKey?: boolean
    altKey?: boolean
    action: () => void
    description: string
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if typing in an input
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
                return
            }

            for (const shortcut of shortcuts) {
                const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
                const ctrlMatch = !!shortcut.ctrlKey === e.ctrlKey
                const shiftMatch = !!shortcut.shiftKey === e.shiftKey
                const altMatch = !!shortcut.altKey === e.altKey

                if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
                    e.preventDefault()
                    shortcut.action()
                    break
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [shortcuts])
}

export function useGlobalShortcuts() {
    const router = useRouter()
    const [showHelp, setShowHelp] = useState(false)

    const shortcuts: Shortcut[] = [
        { key: 'h', action: () => router.push('/'), description: 'Go to Home' },
        { key: 'd', action: () => router.push('/dashboard'), description: 'Go to Dashboard' },
        { key: 'm', action: () => router.push('/meetings'), description: 'Go to Meetings' },
        { key: 'c', action: () => router.push('/contacts'), description: 'Go to Contacts' },
        { key: 'n', action: () => router.push('/notes'), description: 'Go to Notes' },
        { key: 't', action: () => router.push('/action-items'), description: 'Go to Tasks' },
        { key: 'a', action: () => router.push('/analysis'), description: 'Go to AI Analysis' },
        { key: 'b', action: () => router.push('/business'), description: 'Go to Business' },
        { key: '/', action: () => setShowHelp(s => !s), description: 'Toggle shortcuts help' },
        { key: 'n', shiftKey: true, action: () => router.push('/meetings/new'), description: 'New Meeting' },
        { key: 'c', shiftKey: true, action: () => router.push('/contacts/new'), description: 'New Contact' },
    ]

    useKeyboardShortcuts(shortcuts)

    return { showHelp, setShowHelp, shortcuts }
}

export function ShortcutsHelp({
    shortcuts,
    onClose
}: {
    shortcuts: Shortcut[]
    onClose: () => void
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        ✕
                    </button>
                </div>
                <div className="space-y-2">
                    {shortcuts.map((s, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                            <span className="text-gray-300">{s.description}</span>
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-300 text-sm font-mono">
                                {s.shiftKey && 'Shift + '}
                                {s.ctrlKey && 'Ctrl + '}
                                {s.altKey && 'Alt + '}
                                {s.key.toUpperCase()}
                            </kbd>
                        </div>
                    ))}
                </div>
                <p className="text-gray-500 text-sm mt-4">Press / to toggle this help</p>
            </div>
        </div>
    )
}
