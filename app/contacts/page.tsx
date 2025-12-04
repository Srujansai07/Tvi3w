import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function ContactsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tvi3W
                            </Link>
                            <p className="text-sm text-gray-400 mt-1">Contacts</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                + Add Contact
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search */}
                <div className="mb-6">
                    <input
                        type="search"
                        placeholder="Search contacts..."
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Empty State */}
                <div className="glass-panel p-12 rounded-xl border border-gray-800 text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No contacts yet</h3>
                    <p className="text-gray-400 mb-6">Add your first contact to start tracking relationships</p>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                        Add First Contact
                    </button>
                </div>
            </main>
        </div>
    )
}
