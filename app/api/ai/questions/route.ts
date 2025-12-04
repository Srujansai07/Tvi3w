import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { generateMeetingQuestions } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { topic, participants, meetingType } = body

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
        }

        const questions = await generateMeetingQuestions({
            topic,
            participants,
            meetingType,
        })

        return NextResponse.json(questions)
    } catch (error) {
        console.error('Error generating questions:', error)
        return NextResponse.json(
            { error: 'Failed to generate questions' },
            { status: 500 }
        )
    }
}
