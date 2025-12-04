import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeContent(content: string) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

        const prompt = `Analyze the following content and provide:
1. Key insights (3-5 points)
2. Sentiment (positive/negative/neutral)
3. Main topics
4. Actionable recommendations

Content: ${content}`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        return {
            success: true,
            analysis: text,
            timestamp: new Date().toISOString(),
        }
    } catch (error) {
        console.error('Gemini API Error:', error)
        return {
            success: false,
            error: 'Failed to analyze content',
        }
    }
}

export async function generateMeetingQuestions(topic: string, context?: string) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

        const prompt = `Generate 5 insightful questions for a meeting about: ${topic}
${context ? `Context: ${context}` : ''}

Make the questions specific, actionable, and designed to drive productive discussion.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        return {
            success: true,
            questions: text,
        }
    } catch (error) {
        console.error('Gemini API Error:', error)
        return {
            success: false,
            error: 'Failed to generate questions',
        }
    }
}

export async function analyzeBusinessPitch(pitch: string) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

        const prompt = `You are a Shark Tank investor. Analyze this business pitch and provide:
1. Strengths (3 points)
2. Weaknesses/Concerns (3 points)
3. Market potential (1-10 score with explanation)
4. Investment recommendation (Yes/No/Maybe with reasoning)

Pitch: ${pitch}`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        return {
            success: true,
            analysis: text,
        }
    } catch (error) {
        console.error('Gemini API Error:', error)
        return {
            success: false,
            error: 'Failed to analyze pitch',
        }
    }
}
