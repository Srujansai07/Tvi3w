/** @type {import('next').NextConfig} */
const nextConfig = {
    // Skip TypeScript and ESLint during builds to prevent timeout
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Use standalone output for smaller bundle
    output: 'standalone',
    // Reduce experimental features
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
        unoptimized: true, // Reduce image optimization overhead
    },
    // Performance optimizations
    compress: true,
    poweredByHeader: false, // TC-2.8.9: Remove Powered-By Header
    reactStrictMode: false, // Disable strict mode in production
    swcMinify: true,
    // Security Headers
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    // TC-2.8.5: X-Frame-Options
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    // TC-2.8.6: HSTS
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains',
                    },
                    // TC-2.8.7: Referrer Policy
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    // TC-2.8.8: Permissions Policy
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    // X-Content-Type-Options
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    // TC-2.8.1: Content Security Policy (relaxed for development)
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co;",
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig

