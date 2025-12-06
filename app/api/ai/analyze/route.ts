import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeMeetingTrends } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
                { status: 500 }
            )
        }

        // Fetch user's meetings
        const { data: meetings, error } = await supabase
            .from('meetings')
            .select('*')
            .eq('user_id', session.user.id)
            .order('start_time', { ascending: false })
            .limit(50)

        if (error) throw error

        if (!meetings || meetings.length === 0) {
            return NextResponse.json({
                analysis: 'Not enough data to analyze. Create some meetings first!'
            })
        }

        const analysis = await analyzeMeetingTrends(meetings)

        return NextResponse.json({ analysis })
    } catch (error: any) {
        console.error('Analyze API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
