'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileData {
    full_name: string
    avatar_url: string
    phone: string
    company: string
    role: string
    bio: string
}

export default function ProfilePage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<ProfileData>({
        full_name: '',
        avatar_url: '',
        phone: '',
        company: '',
        role: '',
        bio: '',
    })

    useEffect(() => {
        async function loadProfile() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            setUser(session.user)

            const metadata = session.user.user_metadata || {}
            setProfile({
                full_name: metadata.full_name || metadata.name || '',
                avatar_url: metadata.avatar_url || '',
                phone: metadata.phone || '',
                company: metadata.company || '',
                role: metadata.role || '',
                bio: metadata.bio || '',
            })
            setLoading(false)
        }
        loadProfile()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const { error } = await supabase.auth.updateUser({
                data: profile
            })
            if (error) throw error
            alert('Profile updated!')
        } catch (error: any) {
            alert('Error: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                    <div className="bg-gray-800 rounded-xl p-6 h-96"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
                <p className="text-gray-400 mb-8">Manage your personal information</p>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                            {profile.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <div className="text-white font-medium text-lg">{profile.full_name || user?.email}</div>
                            <div className="text-gray-400">{user?.email}</div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                                <input
                                    type="text"
                                    value={profile.company}
                                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                    className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    placeholder="Acme Inc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <input
                                    type="text"
                                    value={profile.role}
                                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                    className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3"
                                    placeholder="Product Manager"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                rows={4}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 resize-none"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8">
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
                                'Save Profile'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
