'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to the main login page which uses Supabase
        router.replace('/login')
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="text-white text-xl">Redirecting to login...</div>
        </div>
    )
}
