import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient()

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const format = searchParams.get('format') || 'json'
        const type = searchParams.get('type') || 'all'

        let data: any = {}

        // Fetch meetings
        if (type === 'all' || type === 'meetings') {
            const { data: meetings } = await supabase
                .from('meetings')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
            data.meetings = meetings || []
        }

        // Fetch contacts
        if (type === 'all' || type === 'contacts') {
            const { data: contacts } = await supabase
                .from('contacts')
                .select('*')
                .eq('user_id', session.user.id)
                .order('name', { ascending: true })
            data.contacts = contacts || []
        }

        // Fetch notes
        if (type === 'all' || type === 'notes') {
            const { data: notes } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
            data.notes = notes || []
        }

        // Fetch action items
        if (type === 'all' || type === 'action-items') {
            const { data: meetings } = await supabase
                .from('meetings')
                .select('id')
                .eq('user_id', session.user.id)

            const meetingIds = meetings?.map(m => m.id) || []

            if (meetingIds.length > 0) {
                const { data: actionItems } = await supabase
                    .from('action_items')
                    .select('*')
                    .in('meeting_id', meetingIds)
                data.actionItems = actionItems || []
            } else {
                data.actionItems = []
            }
        }

        if (format === 'csv') {
            // Convert to CSV
            let csv = ''

            if (data.meetings) {
                csv += 'MEETINGS\n'
                csv += 'Title,Description,Status,Start Time,Location,Type\n'
                data.meetings.forEach((m: any) => {
                    csv += `"${m.title || ''}","${m.description || ''}","${m.status || ''}","${m.start_time || ''}","${m.location || ''}","${m.meeting_type || ''}"\n`
                })
                csv += '\n'
            }

            if (data.contacts) {
                csv += 'CONTACTS\n'
                csv += 'Name,Email,Phone,Company,Role\n'
                data.contacts.forEach((c: any) => {
                    csv += `"${c.name || ''}","${c.email || ''}","${c.phone || ''}","${c.company || ''}","${c.role || ''}"\n`
                })
                csv += '\n'
            }

            if (data.notes) {
                csv += 'NOTES\n'
                csv += 'Content,Created At\n'
                data.notes.forEach((n: any) => {
                    csv += `"${(n.content || '').replace(/"/g, '""')}","${n.created_at || ''}"\n`
                })
            }

            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="tvi3w-export-${new Date().toISOString().split('T')[0]}.csv"`,
                },
            })
        }

        // Return JSON
        return NextResponse.json({
            exportedAt: new Date().toISOString(),
            ...data,
        })
    } catch (error: any) {
        console.error('Export API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
