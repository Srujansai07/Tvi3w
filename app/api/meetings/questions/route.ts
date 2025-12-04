import { NextRequest, NextResponse } from 'next/server'
import { generateMeetingQuestions } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const { topic, context } = await request.json()

        if (!topic || typeof topic !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Topic is required' },
                { status: 400 }
            )
        }

        const result = await generateMeetingQuestions(topic, context)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Meeting questions API error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
