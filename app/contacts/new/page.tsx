'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function NewContactPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: '',
        notes: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }

            const { error: insertError } = await supabase
                .from('contacts')
                .insert({
                    user_id: session.user.id,
                    name: formData.name,
                    email: formData.email || null,
                    phone: formData.phone || null,
                    company: formData.company || null,
                    role: formData.role || null,
                    notes: formData.notes || null,
                })

            if (insertError) throw insertError

            router.push('/contacts')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link href="/contacts" className="text-purple-400 hover:text-purple-300 text-sm mb-4 inline-block">
                        ← Back to Contacts
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Add Contact</h1>
                    <p className="text-gray-400">Add a new contact to your network</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Contact name"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Company name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Job title"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-3 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Any additional notes..."
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link
                            href="/contacts"
                            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Adding...
                                </>
                            ) : (
                                'Add Contact'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
