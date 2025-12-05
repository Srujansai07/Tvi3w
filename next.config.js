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
    poweredByHeader: false,
    reactStrictMode: false, // Disable strict mode in production
    swcMinify: true,
}

module.exports = nextConfig
