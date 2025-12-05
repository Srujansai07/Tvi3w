import { NextRequest, NextResponse } from 'next/server'

// POST /api/search - Global semantic search
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { query, filters, limit = 20 } = body

        if (!query || query.trim().length === 0) {
            return NextResponse.json({ error: 'Query required' }, { status: 400 })
        }

        // In production, use vector search with embeddings
        // For now, simple keyword search simulation
        const results = {
            meetings: [
                {
                    id: 1,
                    type: 'meeting',
                    title: 'Product Strategy Meeting',
                    snippet: 'Discussed Q1 roadmap and feature prioritization...',
                    date: '2024-01-15',
                    relevance: 0.95,
                },
            ],
            contacts: [
                {
                    id: 1,
                    type: 'contact',
                    name: 'John Doe',
                    company: 'Acme Inc',
                    snippet: 'CEO, met at tech conference',
                    relevance: 0.88,
                },
            ],
            notes: [
                {
                    id: 1,
                    type: 'note',
                    title: 'Meeting Notes - Jan 15',
                    snippet: 'Key points from product discussion...',
                    date: '2024-01-15',
                    relevance: 0.82,
                },
            ],
            insights: [
                {
                    id: 1,
                    type: 'insight',
                    title: 'Pattern Detected',
                    snippet: 'You have most meetings on Thursdays...',
                    relevance: 0.75,
                },
            ],
        }

        // Apply filters
        let filteredResults: any[] = []
        if (!filters || filters.includes('all')) {
            filteredResults = [
                ...results.meetings,
                ...results.contacts,
                ...results.notes,
                ...results.insights,
            ]
        } else {
            if (filters.includes('meetings')) filteredResults.push(...results.meetings)
            if (filters.includes('contacts')) filteredResults.push(...results.contacts)
            if (filters.includes('notes')) filteredResults.push(...results.notes)
            if (filters.includes('insights')) filteredResults.push(...results.insights)
        }

        // Sort by relevance
        filteredResults.sort((a, b) => b.relevance - a.relevance)

        // Limit results
        filteredResults = filteredResults.slice(0, limit)

        return NextResponse.json({
            query,
            results: filteredResults,
            total: filteredResults.length,
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// GET /api/search/suggestions - Get search suggestions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q') || ''

        // Return search suggestions based on query
        const suggestions = [
            'Product Strategy Meeting',
            'Q1 Roadmap',
            'John Doe',
            'Meeting notes',
            'Action items',
        ].filter(s => s.toLowerCase().includes(query.toLowerCase()))

        return NextResponse.json({ suggestions })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
