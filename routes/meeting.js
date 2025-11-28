import express from 'express';
import geminiService from '../services/gemini.js';

const router = express.Router();

/**
 * POST /api/meeting/questions
 * Generate dynamic questions based on meeting context
 */
router.post('/questions', async (req, res) => {
    try {
        const { context, type } = req.body;

        if (!context) {
            return res.status(400).json({
                error: 'Meeting context is required'
            });
        }

        const questions = await geminiService.generateQuestions(context, type || 'all');

        res.json({
            success: true,
            data: questions,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Question generation error:', error);
        res.status(500).json({
            error: 'Failed to generate questions',
            message: error.message
        });
    }
});

/**
 * POST /api/meeting/keypoints
 * Extract key points from meeting transcript
 */
router.post('/keypoints', async (req, res) => {
    try {
        const { transcript } = req.body;

        if (!transcript) {
            return res.status(400).json({
                error: 'Transcript is required'
            });
        }

        const keyPoints = await geminiService.extractKeyPoints(transcript);

        res.json({
            success: true,
            data: {
                keyPoints
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Key points extraction error:', error);
        res.status(500).json({
            error: 'Failed to extract key points',
            message: error.message
        });
    }
});

/**
 * POST /api/meeting/research
 * Get passive research on a topic
 */
router.post('/research', async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({
                error: 'Topic is required'
            });
        }

        const research = await geminiService.passiveResearch(topic);

        res.json({
            success: true,
            data: research,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Research error:', error);
        res.status(500).json({
            error: 'Failed to research topic',
            message: error.message
        });
    }
});

/**
 * POST /api/meeting/summarize
 * Summarize meeting transcript
 */
router.post('/summarize', async (req, res) => {
    try {
        const { transcript } = req.body;

        if (!transcript) {
            return res.status(400).json({
                error: 'Transcript is required'
            });
        }

        const keyPoints = await geminiService.extractKeyPoints(transcript);

        res.json({
            success: true,
            data: {
                summary: keyPoints.join('. '),
                keyPoints
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Summarization error:', error);
        res.status(500).json({
            error: 'Failed to summarize meeting',
            message: error.message
        });
    }
});

export default router;
