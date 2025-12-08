import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    // If already authenticated with Supabase, redirect to dashboard
    if (session) {
        redirect('/dashboard')
    }

    return <>{children}</>
}
