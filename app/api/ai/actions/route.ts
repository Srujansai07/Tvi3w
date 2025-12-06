import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractActionItems } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { meetingId, notes } = await request.json()

        if (!notes) {
            return NextResponse.json({ error: 'Notes are required' }, { status: 400 })
        }

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
                { status: 500 }
            )
        }

        const actionItems = await extractActionItems(notes)

        // Optionally save action items to the database
        if (meetingId && actionItems.length > 0) {
            const items = actionItems.map(item => ({
                meeting_id: meetingId,
                title: item,
                status: 'pending',
            }))

            await supabase.from('action_items').insert(items)
        }

        return NextResponse.json({ actionItems })
    } catch (error: any) {
        console.error('Extract Action Items API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
