import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { analyzeBusinessPitch } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { pitch } = body

        if (!pitch) {
            return NextResponse.json({ error: 'Pitch content is required' }, { status: 400 })
        }

        const analysis = await analyzeBusinessPitch(pitch)

        return NextResponse.json(analysis)
    } catch (error) {
        console.error('Error analyzing pitch:', error)
        return NextResponse.json(
            { error: 'Failed to analyze pitch' },
            { status: 500 }
        )
    }
}
