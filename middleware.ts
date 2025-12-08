import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        // Only these routes need middleware session handling
        '/dashboard/:path*',
        '/profile/:path*',
        '/auth/:path*',
        '/login',
    ],
}

