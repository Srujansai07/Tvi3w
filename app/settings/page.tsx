import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
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
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tvi3W
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">Settings</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={session.user.image || '/default-avatar.png'}
                                    alt={session.user.name || 'User'}
                                    className="w-16 h-16 rounded-full border-2 border-gray-700"
                                />
                                <div>
                                    <p className="text-white font-medium">{session.user.name}</p>
                                    <p className="text-sm text-gray-400">{session.user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="glass-panel p-6 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Email Notifications</p>
                                    <p className="text-sm text-gray-400">Receive updates about your meetings</p>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 rounded-lg text-white text-sm">
                                    Enabled
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Auto-transcription</p>
                                    <p className="text-sm text-gray-400">Automatically transcribe meetings</p>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 rounded-lg text-white text-sm">
                                    Enabled
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="glass-panel p-6 rounded-xl border border-red-800/50">
                        <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
                        <div className="space-y-4">
                            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
