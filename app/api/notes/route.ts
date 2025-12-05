import { NextRequest, NextResponse } from 'next/server'

// GET /api/notes - Fetch all notes for authenticated user
export async function GET(request: NextRequest) {
    try {
        // In production, get user from session
        const userId = 'user-123'

        // Fetch from database
        const notes = [
            { id: 1, title: 'Sample Note', content: 'Content here...', tags: ['test'], created_at: new Date().toISOString() }
        ]

        return NextResponse.json({ notes })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST /api/notes - Create new note
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, content, tags, meeting_id } = body

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
        }

        // Save to database
        const note = {
            id: Date.now(),
            title,
            content,
            tags: tags || [],
            meeting_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        return NextResponse.json({ note }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PUT /api/notes/[id] - Update note
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, title, content, tags } = body

        // Update in database
        const note = {
            id,
            title,
            content,
            tags,
            updated_at: new Date().toISOString(),
        }

        return NextResponse.json({ note })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE /api/notes/[id] - Delete note
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Note ID required' }, { status: 400 })
        }

        // Delete from database
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
