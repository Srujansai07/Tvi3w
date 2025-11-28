import express from 'express';
import geminiService from '../services/gemini.js';
import { Analysis } from '../models/index.js';

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

        // Save to database
        const savedRecord = await Analysis.create({
            content,
            platform: platform || 'general',
            sentimentScore: analysis.sentiment.confidence,
            sentimentType: analysis.sentiment.type,
            insights: analysis.insights,
            rawResponse: analysis
        });

        res.json({
            success: true,
            data: analysis,
            recordId: savedRecord.id,
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

        // We don't necessarily save every quick sentiment check, but we could if needed.
        // For now, we'll keep it lightweight.

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

        // Save to database as a new analysis record
        const savedRecord = await Analysis.create({
            content,
            platform: platform || 'general',
            sentimentScore: analysis.sentiment.confidence,
            sentimentType: analysis.sentiment.type,
            insights: analysis.insights,
            rawResponse: analysis
        });

        res.json({
            success: true,
            data: {
                insights: analysis.insights,
                suggestedActions: analysis.suggestedActions,
                trendAnalysis: analysis.trendAnalysis,
                networkOpportunities: analysis.networkOpportunities
            },
            recordId: savedRecord.id,
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
