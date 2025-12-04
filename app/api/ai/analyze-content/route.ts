import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { analyzeContent } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { url, text, type } = body

        if (!text) {
            return NextResponse.json({ error: 'Content text is required' }, { status: 400 })
        }

        const analysis = await analyzeContent({ url, text, type })

        return NextResponse.json(analysis)
    } catch (error) {
        console.error('Error analyzing content:', error)
        return NextResponse.json(
            { error: 'Failed to analyze content' },
            { status: 500 }
        )
    }
}
