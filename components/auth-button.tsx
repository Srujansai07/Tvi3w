'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AuthButton() {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            setLoading(false)

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
                setUser(session?.user ?? null)
            })

            return () => subscription.unsubscribe()
        }

        getUser()
    }, [supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        setUser(null)
    }

    if (loading) {
        return (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-700/50" />
        )
    }

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <div className="hidden md:block text-sm text-gray-300">
                    {user.email}
                </div>
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                    Sign Out
                </button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                    {user.email?.[0].toUpperCase()}
                </div>
            </div>
        )
    }

    return (
        <Link
            href="/login"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
        >
            Sign In
        </Link>
    )
}
