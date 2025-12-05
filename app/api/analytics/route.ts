import { NextRequest, NextResponse } from 'next/server'

// GET /api/analytics/dashboard - Get dashboard analytics
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y

        // Calculate analytics
        const analytics = {
            period,
            meetings: {
                total: 45,
                thisWeek: 8,
                avgDuration: 42, // minutes
                byType: {
                    professional: 25,
                    presentation: 10,
                    interview: 5,
                    informal: 5,
                },
                trend: '+12%', // vs previous period
            },
            contacts: {
                total: 127,
                newThisMonth: 15,
                byRelationship: {
                    professional: 80,
                    personal: 30,
                    vendor: 17,
                },
                topContacts: [
                    { name: 'John Doe', interactions: 12 },
                    { name: 'Jane Smith', interactions: 10 },
                    { name: 'Bob Johnson', interactions: 8 },
                ],
            },
            insights: {
                total: 234,
                actionable: 45,
                patterns: 12,
                recommendations: 28,
            },
            productivity: {
                meetingsPerWeek: 8.5,
                avgMeetingDuration: 42,
                actionItemsCompleted: 67,
                actionItemsPending: 23,
                completionRate: 74, // percentage
            },
            engagement: {
                questionsAsked: 156,
                notesCreated: 89,
                transcriptsGenerated: 45,
                summariesCreated: 45,
            },
            timeDistribution: [
                { day: 'Mon', hours: 3.5 },
                { day: 'Tue', hours: 4.2 },
                { day: 'Wed', hours: 3.8 },
                { day: 'Thu', hours: 5.1 },
                { day: 'Fri', hours: 2.9 },
            ],
            meetingsByMonth: [
                { month: 'Jan', count: 45 },
                { month: 'Feb', count: 52 },
                { month: 'Mar', count: 48 },
            ],
        }

        return NextResponse.json({ analytics })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// GET /api/analytics/insights - Get AI insights analytics
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { metric } = body // 'meetings', 'contacts', 'productivity'

        // Generate insights based on metric
        const insights = {
            metric,
            insights: [
                {
                    type: 'pattern',
                    title: 'Peak meeting time detected',
                    description: 'You have most meetings on Thursdays between 2-4 PM',
                    confidence: 0.85,
                },
                {
                    type: 'recommendation',
                    title: 'Follow-up needed',
                    description: '5 contacts haven\'t been reached in over 30 days',
                    confidence: 0.92,
                },
                {
                    type: 'trend',
                    title: 'Meeting duration increasing',
                    description: 'Average meeting duration up 15% this month',
                    confidence: 0.78,
                },
            ],
        }

        return NextResponse.json({ insights })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
