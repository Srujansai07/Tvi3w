import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tvi3w.vercel.app'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/dashboard/', '/admin/', '/meetings/', '/contacts/', '/notes/', '/action-items/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
