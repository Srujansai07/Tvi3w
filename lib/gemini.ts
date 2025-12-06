import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI client
const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

// Get the Gemini model - using gemini-1.5-flash (fast and free tier)
export function getGeminiModel() {
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
}

// Summarize meeting notes
export async function summarizeMeeting(notes: string, meetingTitle?: string): Promise<string> {
    try {
        const model = getGeminiModel()

        const prompt = `You are an AI assistant that summarizes meeting notes.

Meeting Title: ${meetingTitle || 'Untitled Meeting'}

Notes:
${notes}

Please provide a concise summary of this meeting including:
1. Key discussion points
2. Decisions made
3. Important takeaways

Keep the summary brief and professional.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        throw new Error('Failed to summarize meeting: ' + error.message)
    }
}

// Extract action items from notes
export async function extractActionItems(notes: string): Promise<string[]> {
    try {
        const model = getGeminiModel()

        const prompt = `You are an AI assistant that extracts action items from meeting notes.

Notes:
${notes}

Extract all action items, tasks, and follow-ups mentioned in these notes.
Return them as a JSON array of strings, for example: ["Task 1", "Task 2", "Task 3"]
Only return the JSON array, nothing else.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text().trim()

        // Try to parse as JSON
        try {
            const items = JSON.parse(text)
            if (Array.isArray(items)) {
                return items
            }
        } catch {
            // If not valid JSON, split by newlines
            return text.split('\n').filter((item: string) => item.trim().length > 0)
        }

        return []
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        throw new Error('Failed to extract action items: ' + error.message)
    }
}

// Generate follow-up email
export async function generateFollowUpEmail(
    meetingTitle: string,
    notes: string,
    attendees?: string[]
): Promise<string> {
    try {
        const model = getGeminiModel()

        const attendeeList = attendees?.length
            ? `Attendees: ${attendees.join(', ')}`
            : ''

        const prompt = `You are an AI assistant that generates professional follow-up emails after meetings.

Meeting Title: ${meetingTitle}
${attendeeList}

Notes:
${notes}

Generate a professional follow-up email that:
1. Thanks attendees for their time
2. Summarizes key discussion points
3. Lists action items and who is responsible
4. Mentions next steps if any

Keep the tone professional but friendly.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        throw new Error('Failed to generate follow-up email: ' + error.message)
    }
}

// Analyze meeting trends
export async function analyzeMeetingTrends(meetings: any[]): Promise<string> {
    try {
        const model = getGeminiModel()

        const meetingData = meetings.map(m => ({
            title: m.title,
            type: m.meeting_type,
            status: m.status,
            date: m.start_time,
        }))

        const prompt = `You are an AI assistant that analyzes meeting patterns.

Meeting Data:
${JSON.stringify(meetingData, null, 2)}

Analyze these meetings and provide insights on:
1. Meeting frequency patterns
2. Most common meeting types
3. Completion rate
4. Suggestions for improving meeting efficiency

Keep the analysis brief and actionable.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        throw new Error('Failed to analyze meeting trends: ' + error.message)
    }
}
