// Gemini AI Service for Tvi3W
// Handles all AI-powered features: question generation, transcription, summarization

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set')
}

// Generate contextual questions for meetings
export async function generateMeetingQuestions(context: {
    topic: string
    participants?: string[]
    meetingType?: 'professional' | 'presentation' | 'interview' | 'informal'
}): Promise<{
    professional: string[]
    social: string[]
    humorous: string[]
}> {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured')
    }

    try {
        const prompt = `You are an AI meeting assistant. Generate 3 insightful questions for a ${context.meetingType || 'professional'} meeting about "${context.topic}".

${context.participants ? `Participants: ${context.participants.join(', ')}` : ''}

Generate 3 questions from each angle:
1. **Professional**: Business-focused, strategic questions
2. **Social**: Relationship-building, exploratory questions  
3. **Humorous**: Light-hearted, ice-breaker questions

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "professional": ["question1", "question2", "question3"],
  "social": ["question1", "question2", "question3"],
  "humorous": ["question1", "question2", "question3"]
}`

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`)
        }

        const data = await response.json()
        const text = data.candidates[0].content.parts[0].text

        // Extract JSON from markdown code blocks or plain JSON
        let jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
        if (!jsonMatch) {
            jsonMatch = text.match(/\{[\s\S]*\}/)
        }

        if (!jsonMatch) {
            throw new Error('Failed to parse Gemini response')
        }

        const jsonStr = jsonMatch[1] || jsonMatch[0]
        return JSON.parse(jsonStr)
    } catch (error) {
        console.error('Error generating questions:', error)
        throw error
    }
}

// Summarize meeting transcript
export async function summarizeMeeting(transcript: string): Promise<{
    summary: string
    keyPoints: string[]
    actionItems: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
}> {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured')
    }

    try {
        const prompt = `Analyze this meeting transcript and provide:
1. A concise summary (2-3 sentences)
2. Key points discussed (max 5)
3. Action items identified (if any)
4. Overall sentiment (positive/neutral/negative)

Transcript:
${transcript}

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "summary": "...",
  "keyPoints": ["point1", "point2", "point3"],
  "actionItems": ["item1", "item2"],
  "sentiment": "positive"
}`

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`)
        }

        const data = await response.json()
        const text = data.candidates[0].content.parts[0].text

        let jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
        if (!jsonMatch) {
            jsonMatch = text.match(/\{[\s\S]*\}/)
        }

        if (!jsonMatch) {
            throw new Error('Failed to parse Gemini response')
        }

        const jsonStr = jsonMatch[1] || jsonMatch[0]
        return JSON.parse(jsonStr)
    } catch (error) {
        console.error('Error summarizing meeting:', error)
        throw error
    }
}

// Analyze content (LinkedIn, Twitter, articles)
export async function analyzeContent(content: {
    url?: string
    text: string
    type: 'linkedin' | 'twitter' | 'email' | 'article'
}): Promise<{
    summary: string
    keyTakeaways: string[]
    suggestedActions: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
    relevance: 'high' | 'medium' | 'low'
}> {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured')
    }

    try {
        const prompt = `Analyze this ${content.type} content and provide:
1. A brief summary
2. Key takeaways (max 3)
3. Suggested actions (max 3)
4. Sentiment analysis
5. Relevance score

Content:
${content.text}

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "summary": "...",
  "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3"],
  "suggestedActions": ["action1", "action2", "action3"],
  "sentiment": "positive",
  "relevance": "high"
}`

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`)
        }

        const data = await response.json()
        const text = data.candidates[0].content.parts[0].text

        let jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
        if (!jsonMatch) {
            jsonMatch = text.match(/\{[\s\S]*\}/)
        }

        if (!jsonMatch) {
            throw new Error('Failed to parse Gemini response')
        }

        const jsonStr = jsonMatch[1] || jsonMatch[0]
        return JSON.parse(jsonStr)
    } catch (error) {
        console.error('Error analyzing content:', error)
        throw error
    }
}

// Analyze business pitch (Shark Tank style)
export async function analyzeBusinessPitch(pitch: string): Promise<{
    strengths: string[]
    weaknesses: string[]
    marketViability: string
    investmentRecommendation: 'yes' | 'no' | 'maybe'
    implementationRoadmap: string[]
    risks: string[]
}> {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured')
    }

    try {
        const prompt = `You are a Shark Tank investor. Analyze this business pitch:

${pitch}

Provide:
1. Strengths (max 3)
2. Weaknesses (max 3)
3. Market viability assessment
4. Investment recommendation (yes/no/maybe)
5. Implementation roadmap (max 5 steps)
6. Key risks (max 3)

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "marketViability": "detailed assessment here",
  "investmentRecommendation": "yes",
  "implementationRoadmap": ["step1", "step2", "step3", "step4", "step5"],
  "risks": ["risk1", "risk2", "risk3"]
}`

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`)
        }

        const data = await response.json()
        const text = data.candidates[0].content.parts[0].text

        let jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
        if (!jsonMatch) {
            jsonMatch = text.match(/\{[\s\S]*\}/)
        }

        if (!jsonMatch) {
            throw new Error('Failed to parse Gemini response')
        }

        const jsonStr = jsonMatch[1] || jsonMatch[0]
        return JSON.parse(jsonStr)
    } catch (error) {
        console.error('Error analyzing pitch:', error)
        throw error
    }
}
