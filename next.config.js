/** @type {import('next').NextConfig} */
const nextConfig = {
    // Skip TypeScript and ESLint during builds to prevent timeout
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    },
    // Performance optimizations
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = nextConfig
