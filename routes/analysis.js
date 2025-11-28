import express from 'express';
import geminiService from '../services/gemini.js';

const router = express.Router();

/**
 * POST /api/analysis/content
 * Analyze content from social media platforms
 */
router.post('/content', async (req, res) => {
    try {
        const { content, platform } = req.body;

        if (!content) {
            return res.status(400).json({
                error: 'Content is required'
            });
        }

        const analysis = await geminiService.analyzeContent(content, platform || 'general');

        res.json({
            success: true,
            data: analysis,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze content',
            message: error.message
        });
    }
});

/**
 * POST /api/analysis/sentiment
 * Get sentiment analysis for content
 */
router.post('/sentiment', async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                error: 'Content is required'
            });
        }

        const analysis = await geminiService.analyzeContent(content);

        res.json({
            success: true,
            data: {
                sentiment: analysis.sentiment
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze sentiment',
            message: error.message
        });
    }
});

/**
 * POST /api/analysis/insights
 * Get actionable insights from content
 */
router.post('/insights', async (req, res) => {
    try {
        const { content, platform } = req.body;

        if (!content) {
            return res.status(400).json({
                error: 'Content is required'
            });
        }

        const analysis = await geminiService.analyzeContent(content, platform);

        res.json({
            success: true,
            data: {
                insights: analysis.insights,
                suggestedActions: analysis.suggestedActions,
                trendAnalysis: analysis.trendAnalysis,
                networkOpportunities: analysis.networkOpportunities
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Insights error:', error);
        res.status(500).json({
            error: 'Failed to generate insights',
            message: error.message
        });
    }
});

export default router;
