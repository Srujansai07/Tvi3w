import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, type, description, start_time, participants } = body

        if (!title || !start_time) {
            return NextResponse.json({ error: 'Title and start_time are required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Create meeting
        const { data: meeting, error } = await supabase
            .from('meetings')
            .insert({
                user_id: session.user.id,
                title,
                type: type || 'professional',
                description,
                start_time,
                is_transcription_complete: false,
                is_analyzed: false,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating meeting:', error)
            return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 })
        }

        // Add participants if provided
        if (participants && typeof participants === 'string') {
            const participantNames = participants.split(',').map((name: string) => name.trim()).filter(Boolean)

            if (participantNames.length > 0) {
                const participantRecords = participantNames.map((name: string) => ({
                    meeting_id: meeting.id,
                    name,
                }))

                await supabase.from('participants').insert(participantRecords)
            }
        }

        return NextResponse.json(meeting)
    } catch (error) {
        console.error('Error in meetings API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createClient()

        const { data: meetings, error } = await supabase
            .from('meetings')
            .select('*')
            .eq('user_id', session.user.id)
            .order('start_time', { ascending: false })

        if (error) {
            console.error('Error fetching meetings:', error)
            return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 })
        }

        return NextResponse.json(meetings)
    } catch (error) {
        console.error('Error in meetings API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
