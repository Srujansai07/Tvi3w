'use client'

import { useAuth } from '@/lib/auth-context'
import { useOnboarding } from '@/lib/hooks/use-onboarding'
import OnboardingModal from '@/components/onboarding-modal'

export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const { showOnboarding, loading, completeOnboarding } = useOnboarding()

    if (loading) {
        return <>{children}</>
    }

    return (
        <>
            {children}
            {showOnboarding && user && (
                <OnboardingModal userId={user.id} onComplete={completeOnboarding} />
            )}
        </>
    )
}
