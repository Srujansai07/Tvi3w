'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const supabase = createClient()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${location.origin}/auth/reset-password`,
            })

            if (error) throw error

            setMessage({
                type: 'success',
                text: 'Check your email for the password reset link!',
            })
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-white">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-800 p-8 shadow-2xl border border-gray-700">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-blue-400">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-400">Enter your email to receive a reset link</p>
                </div>

                {message && (
                    <div className={`rounded-md p-4 text-sm border ${message.type === 'success' ? 'bg-green-900/50 text-green-200 border-green-500/50' : 'bg-red-900/50 text-red-200 border-red-500/50'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <Link href="/login" className="text-blue-400 hover:text-blue-300">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
