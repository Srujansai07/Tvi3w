import express from 'express';
import geminiService from '../services/gemini.js';
import { BusinessRecord } from '../models/index.js';

const router = express.Router();

/**
 * POST /api/business/pitch
 * Analyze business pitch (Shark Tank style)
 */
router.post('/pitch', async (req, res) => {
    try {
        const { pitch } = req.body;

        if (!pitch) {
            return res.status(400).json({
                error: 'Pitch description is required'
            });
        }

        const analysis = await geminiService.analyzePitch(pitch);

        // Save pitch analysis
        const record = await BusinessRecord.create({
            type: 'pitch',
            title: 'Pitch Analysis',
            content: pitch,
            analysis: analysis
        });

        res.json({
            success: true,
            data: analysis,
            recordId: record.id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Pitch analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze pitch',
            message: error.message
        });
    }
});

/**
 * POST /api/business/contract-summary
 * Generate contract summary and key points
 */
router.post('/contract-summary', async (req, res) => {
    try {
        const { contractText, title } = req.body;

        if (!contractText) {
            return res.status(400).json({
                error: 'Contract text is required'
            });
        }

        const keyPoints = await geminiService.extractKeyPoints(contractText);

        // Save contract record
        const record = await BusinessRecord.create({
            type: 'contract',
            title: title || 'Contract Summary',
            content: contractText,
            analysis: { keyPoints, summary: keyPoints.join('. ') }
        });

        res.json({
            success: true,
            data: {
                keyPoints,
                summary: keyPoints.join('. ')
            },
            recordId: record.id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Contract summary error:', error);
        res.status(500).json({
            error: 'Failed to summarize contract',
            message: error.message
        });
    }
});

/**
 * POST /api/business/contact-insights
 * Get insights about a professional contact
 */
router.post('/contact-insights', async (req, res) => {
    try {
        const { contactInfo } = req.body;

        if (!contactInfo) {
            return res.status(400).json({
                error: 'Contact information is required'
            });
        }

        const research = await geminiService.passiveResearch(contactInfo);

        // Save contact research
        const record = await BusinessRecord.create({
            type: 'contact',
            title: `Contact: ${contactInfo}`,
            content: contactInfo,
            analysis: research
        });

        res.json({
            success: true,
            data: research,
            recordId: record.id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Contact insights error:', error);
        res.status(500).json({
            error: 'Failed to get contact insights',
            message: error.message
        });
    }
});

/**
 * POST /api/business/venue-suggestions
 * Get venue suggestions based on requirements
 */
router.post('/venue-suggestions', async (req, res) => {
    try {
        const { requirements } = req.body;

        if (!requirements) {
            return res.status(400).json({
                error: 'Venue requirements are required'
            });
        }

        const suggestions = await geminiService.passiveResearch(`venue for ${requirements}`);

        // Save venue search
        const record = await BusinessRecord.create({
            type: 'venue',
            title: `Venue Search: ${requirements}`,
            content: requirements,
            analysis: suggestions
        });

        res.json({
            success: true,
            data: suggestions,
            recordId: record.id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Venue suggestions error:', error);
        res.status(500).json({
            error: 'Failed to get venue suggestions',
            message: error.message
        });
    }
});

export default router;
