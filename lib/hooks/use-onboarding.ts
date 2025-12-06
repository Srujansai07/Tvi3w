'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'

export function useOnboarding() {
    const { user, loading: authLoading } = useAuth()
    const supabase = createClient()
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            if (!user) {
                setLoading(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('name, profession, industry')
                    .eq('id', user.id)
                    .single()

                if (error) throw error

                // Show onboarding if user hasn't filled out their profile
                const isNewUser = !data?.name && !data?.profession && !data?.industry
                setShowOnboarding(isNewUser)
            } catch (error) {
                console.error('Error checking onboarding status:', error)
            } finally {
                setLoading(false)
            }
        }

        if (!authLoading) {
            checkOnboardingStatus()
        }
    }, [user, authLoading, supabase])

    const completeOnboarding = () => {
        setShowOnboarding(false)
    }

    return { showOnboarding, loading: loading || authLoading, completeOnboarding }
}
