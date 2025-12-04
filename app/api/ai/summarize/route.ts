import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { summarizeMeeting } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { transcript } = body

        if (!transcript) {
            return NextResponse.json({ error: 'Transcript is required' }, { status: 400 })
        }

        const summary = await summarizeMeeting(transcript)

        return NextResponse.json(summary)
    } catch (error) {
        console.error('Error summarizing meeting:', error)
        return NextResponse.json(
            { error: 'Failed to summarize meeting' },
            { status: 500 }
        )
    }
}
