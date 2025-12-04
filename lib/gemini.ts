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

Format as JSON:
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

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('Failed to parse Gemini response')
        }

        return JSON.parse(jsonMatch[0])
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

Format as JSON:
{
  "summary": "...",
  "keyPoints": ["point1", "point2", ...],
  "actionItems": ["item1", "item2", ...],
  "sentiment": "positive|neutral|negative"
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

Format as JSON:
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

                // Extract JSON from response
                const jsonMatch = text.match(/\{[\s\S]*\}/)
                if (!jsonMatch) {
                    throw new Error('Failed to parse Gemini response')
                }

                return JSON.parse(jsonMatch[0])
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

Format as JSON:
{
  "summary": "...",
  "keyPoints": ["point1", "point2", ...],
  "actionItems": ["item1", "item2", ...],
  "sentiment": "positive|neutral|negative"
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

                const jsonMatch = text.match(/\{[\s\S]*\}/)
                if (!jsonMatch) {
                    throw new Error('Failed to parse Gemini response')
                }

                return JSON.parse(jsonMatch[0])
            } catch (error) {
                console.error('Error summarizing meeting:', error)
                throw error
            }
        }

        export async function analyzeBusinessPitch(pitch: string): Promise<{
            strengths: string[]
            weaknesses: string[]
            marketViability: string
            investmentRecommendation: 'yes' | 'no' | 'maybe'
            implementationRoadmap: string[]
            risks: string[]
        }> {
            if (!GEMINI_API_KEY) {
                console.error('❌ GEMINI_API_KEY is not configured')
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

                console.log('🔵 Calling Gemini API for pitch analysis...')

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 2048,
                            },
                        }),
                    }
                )

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error('❌ Gemini API error:', response.status, errorText)
                    throw new Error(`Gemini API error: ${response.statusText}`)
                }

                const data = await response.json()
                console.log('✅ Gemini API response received')

                if (!data.candidates || !data.candidates[0]) {
                    console.error('❌ No candidates in response:', JSON.stringify(data))
                    throw new Error('No response from Gemini API')
                }

                const text = data.candidates[0].content.parts[0].text
                console.log('📝 Raw response:', text)

                // Try to extract JSON from markdown code blocks first
                let jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
                if (!jsonMatch) {
                    // Try to find any JSON object
                    jsonMatch = text.match(/\{[\s\S]*\}/)
                }

                if (!jsonMatch) {
                    console.error('❌ Failed to find JSON in response:', text)
                    throw new Error('Failed to parse Gemini response - no JSON found')
                }

                const jsonStr = jsonMatch[1] || jsonMatch[0]
                console.log('🔍 Extracted JSON:', jsonStr)

                const result = JSON.parse(jsonStr)
                console.log('✅ Parsed result:', result)

                return result
            } catch (error) {
                console.error('❌ Error analyzing pitch:', error)
                if (error instanceof Error) {
                    throw new Error(`Pitch analysis failed: ${error.message}`)
                }
                throw error
            }
        }
