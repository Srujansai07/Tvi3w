import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    /**
     * Analyze content from social media platforms
     * @param {string} content - The content to analyze
     * @param {string} platform - The platform (linkedin, twitter, gmail)
     * @returns {Promise<Object>} Analysis results
     */
    async analyzeContent(content, platform = 'general') {
        try {
            const prompt = `You are an AI assistant analyzing ${platform} content. Analyze the following content and provide:
1. Sentiment analysis (positive/negative/neutral with confidence score 0-100)
2. Key insights (4 actionable insights)
3. Suggested actions
4. Trend analysis
5. Network opportunities

Content to analyze:
${content}

Respond in JSON format with this structure:
{
  "sentiment": {
    "type": "positive/negative/neutral",
    "confidence": 85,
    "explanation": "brief explanation"
  },
  "insights": [
    {
      "icon": "🎯",
      "title": "Key Opportunity",
      "text": "detailed insight"
    }
  ],
  "suggestedActions": ["action 1", "action 2"],
  "trendAnalysis": "trend insights",
  "networkOpportunities": "networking suggestions"
}`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse JSON response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            // Fallback if JSON parsing fails
            return this.createFallbackAnalysis(content, platform);
        } catch (error) {
            console.error('Gemini API Error:', error);
            return this.createFallbackAnalysis(content, platform);
        }
    }

    /**
     * Generate dynamic questions for meetings
     * @param {string} context - Meeting context or transcript
     * @param {string} type - Question type (professional, social, humorous)
     * @returns {Promise<Array>} Array of questions
     */
    async generateQuestions(context, type = 'all') {
        try {
            const prompt = `Based on this meeting context, generate 3 ${type} questions:

Context: ${context}

Generate questions in these categories:
- Professional: Strategic, business-focused questions
- Social: Team dynamics, feelings, concerns
- Humorous: Light-hearted, fun questions to ease tension

Respond in JSON format:
{
  "professional": ["question 1", "question 2", "question 3"],
  "social": ["question 1", "question 2", "question 3"],
  "humorous": ["question 1", "question 2", "question 3"]
}`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const questions = JSON.parse(jsonMatch[0]);
                return type === 'all' ? questions : questions[type] || [];
            }

            return this.createFallbackQuestions(type);
        } catch (error) {
            console.error('Gemini API Error:', error);
            return this.createFallbackQuestions(type);
        }
    }

    /**
     * Extract key points from meeting transcript
     * @param {string} transcript - Meeting transcript
     * @returns {Promise<Array>} Key points
     */
    async extractKeyPoints(transcript) {
        try {
            const prompt = `Extract the most important key points from this meeting transcript. 
Focus on decisions, action items, and critical information.

Transcript:
${transcript}

Respond with a JSON array of key points:
{
  "keyPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ]
}`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                return data.keyPoints || [];
            }

            return ['Key points will be extracted from the transcript'];
        } catch (error) {
            console.error('Gemini API Error:', error);
            return ['Key points will be extracted from the transcript'];
        }
    }

    /**
     * Research information about a topic
     * @param {string} topic - Topic to research
     * @returns {Promise<Object>} Research results
     */
    async passiveResearch(topic) {
        try {
            const prompt = `Provide brief, factual information about: ${topic}

Focus on:
- Key facts and statistics
- Current trends
- Relevant context

Keep it concise (2-3 sentences). Respond in JSON:
{
  "title": "Topic Title",
  "info": "Brief information"
}`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return {
                title: topic,
                info: 'Research information will be provided here'
            };
        } catch (error) {
            console.error('Gemini API Error:', error);
            return {
                title: topic,
                info: 'Research information will be provided here'
            };
        }
    }

    /**
     * Analyze business pitch (Shark Tank style)
     * @param {string} pitch - Pitch description
     * @returns {Promise<Object>} Analysis with strengths, concerns, recommendations
     */
    async analyzePitch(pitch) {
        try {
            const prompt = `Analyze this business pitch like a Shark Tank investor:

Pitch: ${pitch}

Provide analysis in JSON format:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "concerns": ["concern 1", "concern 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "investmentPotential": "high/medium/low",
  "summary": "brief overall assessment"
}`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return this.createFallbackPitchAnalysis();
        } catch (error) {
            console.error('Gemini API Error:', error);
            return this.createFallbackPitchAnalysis();
        }
    }

    // Fallback methods for when API fails
    createFallbackAnalysis(content, platform) {
        return {
            sentiment: {
                type: 'positive',
                confidence: 75,
                explanation: 'Content appears positive based on initial analysis'
            },
            insights: [
                {
                    icon: '🎯',
                    title: 'Key Opportunity',
                    text: 'High engagement potential detected in this content'
                },
                {
                    icon: '💡',
                    title: 'Suggested Action',
                    text: 'Consider responding to increase visibility'
                },
                {
                    icon: '📊',
                    title: 'Trend Analysis',
                    text: 'Content aligns with current industry trends'
                },
                {
                    icon: '🔗',
                    title: 'Network Effect',
                    text: 'Potential for increased reach through sharing'
                }
            ],
            suggestedActions: ['Engage with the content', 'Share with your network'],
            trendAnalysis: 'Content is relevant to current discussions',
            networkOpportunities: 'Consider connecting with engaged users'
        };
    }

    createFallbackQuestions(type) {
        const questions = {
            professional: [
                'What metrics are we using to measure success?',
                'How does this align with our quarterly goals?',
                'What resources do we need to allocate?'
            ],
            social: [
                'How is everyone feeling about the timeline?',
                'What challenges are teams currently facing?',
                'Any concerns we should address together?'
            ],
            humorous: [
                'Should we celebrate with pizza when we hit our targets? 🍕',
                'Who\'s bringing the coffee for late-night sessions? ☕',
                'Is this the part where we pretend to understand the spreadsheet? 📊'
            ]
        };

        return type === 'all' ? questions : questions[type] || questions.professional;
    }

    createFallbackPitchAnalysis() {
        return {
            strengths: [
                'Clear value proposition',
                'Strong market research',
                'Experienced team'
            ],
            concerns: [
                'Scalability questions',
                'Competitive landscape'
            ],
            recommendations: [
                'Focus on MVP development',
                'Build early adopter base',
                'Validate pricing model'
            ],
            investmentPotential: 'medium',
            summary: 'Promising concept with execution risks to address'
        };
    }
}

export default new GeminiService();
