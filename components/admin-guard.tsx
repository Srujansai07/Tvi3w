'use client'

import { useRole } from '@/lib/hooks/use-role'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading } = useRole()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/dashboard')
        }
    }, [isAdmin, loading, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
        )
    }

    if (!isAdmin) {
        return null
    }

    return <>{children}</>
}
