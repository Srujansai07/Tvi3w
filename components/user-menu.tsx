'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import Avatar from './ui/avatar'

export default function UserMenu() {
    const { user, signOut, loading } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    if (loading) {
        return <div className="h-10 w-10 animate-pulse rounded-full bg-gray-700" />
    }

    if (!user) {
        return (
            <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
                Sign In
            </Link>
        )
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none"
            >
                <Avatar url={user.user_metadata?.avatar_url} name={user.email} size="sm" />
                <span className="hidden md:block text-sm text-gray-300">{user.email}</span>
                <svg className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-50">
                    <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        👤 Profile
                    </Link>
                    <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        📊 Dashboard
                    </Link>
                    <hr className="my-1 border-gray-700" />
                    <button
                        onClick={() => {
                            setIsOpen(false)
                            signOut()
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                    >
                        🚪 Sign Out
                    </button>
                </div>
            )}
        </div>
    )
}
