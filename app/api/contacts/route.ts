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
        const { first_name, last_name, email, company, job_title, relationship_type } = body

        if (!first_name || !last_name || !email) {
            return NextResponse.json({ error: 'First name, last name, and email are required' }, { status: 400 })
        }

        const supabase = await createClient()

        const { data: contact, error } = await supabase
            .from('contacts')
            .insert({
                user_id: session.user.id,
                first_name,
                last_name,
                email,
                company,
                job_title,
                relationship_type,
                interaction_count: 0,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating contact:', error)
            return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
        }

        return NextResponse.json(contact)
    } catch (error) {
        console.error('Error in contacts API:', error)
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

        const { data: contacts, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching contacts:', error)
            return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
        }

        return NextResponse.json(contacts)
    } catch (error) {
        console.error('Error in contacts API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
