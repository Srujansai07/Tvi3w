import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/dashboard'

    // Use production URL, not request origin (which might be localhost)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth callback error:', error)
            return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`)
        }
    }

    // Redirect to dashboard after successful login
    return NextResponse.redirect(`${baseUrl}${next}`)
}
