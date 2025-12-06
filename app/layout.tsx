import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/Navigation"
import Footer from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import CommandPalette from "@/components/command-palette"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#1f2937',
}

export const metadata: Metadata = {
    title: {
        default: "Tvi3W - AI-Powered Personal Assistant",
        template: "%s | Tvi3W",
    },
    description: "Your intelligent companion for meetings, analysis, and business insights. Manage meetings, contacts, notes with AI-powered analysis.",
    keywords: ["AI assistant", "meeting management", "notes", "contacts", "business analytics", "productivity"],
    authors: [{ name: "Srujansai07" }],
    creator: "Srujansai07",
    publisher: "Tvi3W",
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Tvi3W",
        title: "Tvi3W - AI-Powered Personal Assistant",
        description: "Your intelligent companion for meetings, analysis, and business insights",
    },
    twitter: {
        card: "summary_large_image",
        title: "Tvi3W - AI-Powered Personal Assistant",
        description: "Your intelligent companion for meetings, analysis, and business insights",
    },
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} flex flex-col min-h-screen`}>
                <AuthProvider>
                    <Navigation />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                    <CommandPalette />
                </AuthProvider>
            </body>
        </html>
    )
}

