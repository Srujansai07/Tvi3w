'use client'

import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export type UserRole = 'user' | 'admin'

export function useRole() {
    const { user, loading: authLoading } = useAuth()
    const supabase = createClient()
    const [role, setRole] = useState<UserRole>('user')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRole = async () => {
            if (!user) {
                setLoading(false)
                return
            }

            try {
                // Check user metadata for role
                const userRole = user.app_metadata?.role || user.user_metadata?.role || 'user'
                setRole(userRole as UserRole)
            } catch (error) {
                console.error('Error fetching role:', error)
            } finally {
                setLoading(false)
            }
        }

        if (!authLoading) {
            fetchRole()
        }
    }, [user, authLoading, supabase])

    const isAdmin = role === 'admin'

    return { role, isAdmin, loading: loading || authLoading }
}
