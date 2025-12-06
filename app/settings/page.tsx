'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UserSettings {
    theme: 'dark' | 'light' | 'system'
    notifications: boolean
    emailDigest: 'daily' | 'weekly' | 'never'
    defaultMeetingDuration: number
    timezone: string
}

const defaultSettings: UserSettings = {
    theme: 'dark',
    notifications: true,
    emailDigest: 'weekly',
    defaultMeetingDuration: 30,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}

export default function SettingsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<UserSettings>(defaultSettings)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        async function loadSettings() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            setUser(session.user)

            // Load settings from user metadata
            const userSettings = session.user.user_metadata?.settings || {}
            setSettings({ ...defaultSettings, ...userSettings })
            setLoading(false)
        }
        loadSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const { error } = await supabase.auth.updateUser({
                data: { settings }
            })
            if (error) throw error
            alert('Settings saved!')
        } catch (error: any) {
            alert('Error saving settings: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-800 rounded-xl p-6 h-24"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400 mb-8">Manage your preferences</p>

                {/* Account Section */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Account</h2>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="text-white font-medium">{user?.email}</div>
                            <div className="text-gray-400 text-sm">
                                Member since {new Date(user?.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/profile"
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Edit Profile
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Preferences</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                            <select
                                value={settings.theme}
                                onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="system">System</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Default Meeting Duration</label>
                            <select
                                value={settings.defaultMeetingDuration}
                                onChange={(e) => setSettings({ ...settings, defaultMeetingDuration: parseInt(e.target.value) })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                            >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>1 hour</option>
                                <option value={90}>1.5 hours</option>
                                <option value={120}>2 hours</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                            <input
                                type="text"
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-white">Push Notifications</div>
                                <div className="text-gray-400 text-sm">Receive notifications for meetings</div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-gray-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Digest</label>
                            <select
                                value={settings.emailDigest}
                                onChange={(e) => setSettings({ ...settings, emailDigest: e.target.value as any })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="never">Never</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Data Section */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Data</h2>
                    <div className="flex gap-3">
                        <Link
                            href="/export"
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Export Data
                        </Link>
                        <Link
                            href="/reports"
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            View Reports
                        </Link>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {saving ? (
                        <>
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Saving...
                        </>
                    ) : (
                        'Save Settings'
                    )}
                </button>
            </div>
        </div>
    )
}
