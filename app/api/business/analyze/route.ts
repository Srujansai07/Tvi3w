import { NextRequest, NextResponse } from 'next/server'
import { analyzeBusinessPitch } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const { pitch } = await request.json()

        if (!pitch || typeof pitch !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Pitch content is required' },
                { status: 400 }
            )
        }

        const result = await analyzeBusinessPitch(pitch)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Business pitch API error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
