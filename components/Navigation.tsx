'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
    const pathname = usePathname()

    const links = [
        { href: '/', label: 'Home', icon: '🏠' },
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/analysis', label: 'Analysis', icon: '🔍' },
        { href: '/meetings', label: 'Meetings', icon: '🎯' },
        { href: '/business', label: 'Business', icon: '💼' },
    ]

    return (
        <nav className="glass border-b border-gray-700">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Tvi3W
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                    </div>

                    {/* Auth Button */}
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
                        Sign In
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden pb-4">
                    <div className="flex flex-wrap gap-2">
                        {links.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="mr-1">{link.icon}</span>
                                    {link.label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    )
}
