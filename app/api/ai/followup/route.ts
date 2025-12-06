import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateFollowUpEmail } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { meetingTitle, notes, attendees } = await request.json()

        if (!notes || !meetingTitle) {
            return NextResponse.json({ error: 'Meeting title and notes are required' }, { status: 400 })
        }

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
                { status: 500 }
            )
        }

        const email = await generateFollowUpEmail(meetingTitle, notes, attendees)

        return NextResponse.json({ email })
    } catch (error: any) {
        console.error('Follow-up Email API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
