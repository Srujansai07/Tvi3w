import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/profile-form'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
    const supabase = createClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                    <p className="text-gray-400">Manage your personal information and preferences.</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
                    <ProfileForm user={session.user} />
                </div>
            </div>
        </div>
    )
}
