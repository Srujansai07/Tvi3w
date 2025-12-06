'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MeetingActions({ meetingId }: { meetingId: string }) {
    const supabase = createClient()
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this meeting?')) return

        setDeleting(true)
        try {
            const { error } = await supabase
                .from('meetings')
                .delete()
                .eq('id', meetingId)

            if (error) throw error
            router.push('/meetings')
            router.refresh()
        } catch (err: any) {
            alert('Error deleting meeting: ' + err.message)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="flex gap-2">
            <button
                onClick={() => router.push(`/meetings/${meetingId}/edit`)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
                Edit
            </button>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
                {deleting ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    )
}
