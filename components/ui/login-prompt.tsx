'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LoginPromptProps {
    isOpen: boolean
    onClose: () => void
    message?: string
}

export default function LoginPrompt({ isOpen, onClose, message }: LoginPromptProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                {/* Icon */}
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Sign In Required
                    </h2>
                    <p className="text-gray-400">
                        {message || 'Please sign in to save your data and access all features.'}
                    </p>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-300">
                        <span className="text-green-500">✓</span>
                        Save meetings, contacts & notes
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <span className="text-green-500">✓</span>
                        Access AI analysis features
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <span className="text-green-500">✓</span>
                        Sync across all devices
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <Link
                        href="/login"
                        className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                        Sign In / Sign Up
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    )
}

// Hook to easily use login prompt
export function useLoginPrompt() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')

    const showLoginPrompt = (customMessage?: string) => {
        setMessage(customMessage || '')
        setIsOpen(true)
    }

    const closeLoginPrompt = () => {
        setIsOpen(false)
    }

    return { isOpen, message, showLoginPrompt, closeLoginPrompt }
}
