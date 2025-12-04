import { NextRequest, NextResponse } from 'next/server'
import { analyzeContent } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const { content } = await request.json()

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Content is required' },
                { status: 400 }
            )
        }

        const result = await analyzeContent(content)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Analysis API error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
