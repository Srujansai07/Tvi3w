import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
    const session = await auth()

    // Protected routes
    const protectedPaths = ['/dashboard', '/meetings', '/contacts', '/insights', '/settings']
    const isProtectedPath = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    )

    // Redirect to signin if accessing protected route without auth
    if (isProtectedPath && !session) {
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
        return NextResponse.redirect(signInUrl)
    }

    // Redirect to dashboard if accessing auth pages while authenticated
    if (request.nextUrl.pathname.startsWith('/auth') && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/meetings/:path*',
        '/contacts/:path*',
        '/insights/:path*',
        '/settings/:path*',
        '/auth/:path*',
    ],
}
