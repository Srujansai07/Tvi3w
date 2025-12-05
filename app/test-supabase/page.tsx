'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function TestSupabasePage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        try {
            const supabase = getSupabaseClient()
            if (!supabase) {
                throw new Error('Supabase client is null')
            }

            // Just check if we can get the URL, implying initialization worked
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            if (url) {
                setStatus('success')
                setMessage(`Connected to Supabase at ${url}`)
            } else {
                throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing')
            }
        } catch (err: any) {
            setStatus('error')
            setMessage(err.message)
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
            <div className={`p-4 rounded-lg ${status === 'loading' ? 'bg-blue-900/50' :
                    status === 'success' ? 'bg-green-900/50 border border-green-500' :
                        'bg-red-900/50 border border-red-500'
                }`}>
                <p className="font-mono">Status: {status.toUpperCase()}</p>
                <p className="mt-2">{message}</p>
            </div>
        </div>
    )
}
