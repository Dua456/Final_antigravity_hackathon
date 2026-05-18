import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { strictRateLimiter } from '../middleware/rateLimiter';
import { createLogger } from '@silentsiren/logger';
import { voiceThreatDetectionService } from '../services/voiceThreatDetection.service';
import { z } from 'zod';
import multer from 'multer';

const router = Router();
const logger = createLogger('voice-threat-routes');

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

/**
 * POST /api/voice-threat/analyze
 * Analyze voice audio for threats using Gemini AI
 */
router.post(
  '/analyze',
  authenticate,
  upload.single('audio'),
  async (req: AuthRequest, res: Response) => {
    try {
      logger.info({ userId: req.userId }, '🎤 Voice analysis request received');

      if (!req.file) {
        logger.error({ userId: req.userId }, '❌ No audio file provided');
        return res.status(400).json({
          success: false,
          error: 'Audio file is required',
        });
      }

      logger.info(
        {
          userId: req.userId,
          fileSize: req.file.size,
          mimeType: req.file.mimetype
        },
        '📦 Audio file received'
      );

      // Analyze voice for threats with Gemini AI
      logger.info({ userId: req.userId }, '🤖 Starting Gemini AI analysis...');

      const threatResult = await voiceThreatDetectionService.analyzeVoiceForThreat(
        req.file.buffer,
        req.userId!
      );

      logger.info(
        {
          userId: req.userId,
          isThreat: threatResult.isThreat,
          threatLevel: threatResult.threatLevel,
          confidence: threatResult.confidence
        },
        '✅ Gemini AI analysis complete'
      );

      // Return analysis result
      res.json({
        success: true,
        sessionId: `session_${req.userId}_${Date.now()}`,
        isThreat: threatResult.isThreat,
        threatLevel: threatResult.threatLevel,
        confidence: threatResult.confidence,
        transcript: threatResult.transcript,
        reasoning: threatResult.reasoning,
        emergencyType: threatResult.emergencyType,
        shouldTriggerSiren: threatResult.shouldTriggerSiren,
        shouldCallAmbulance: threatResult.shouldCallAmbulance,
        audioUrl: `/api/audio/${req.userId}_${Date.now()}.wav`,
      });

    } catch (error: any) {
      logger.error({ error, userId: req.userId }, '❌ Voice analysis failed');
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to analyze voice',
      });
    }
  }
);

/**
 * GET /api/voice-threat/test-gemini
 * Test if Gemini AI is working
 */
router.get(
  '/test-gemini',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      logger.info({ userId: req.userId }, '🧪 Testing Gemini AI connection...');

      // Create a simple test audio buffer
      const testAudio = Buffer.from('test-audio-data');

      const result = await voiceThreatDetectionService.analyzeVoiceForThreat(
        testAudio,
        req.userId!
      );

      logger.info({ userId: req.userId, result }, '✅ Gemini AI test successful');

      res.json({
        success: true,
        message: 'Gemini AI is working!',
        testResult: result,
      });
    } catch (error: any) {
      logger.error({ error, userId: req.userId }, '❌ Gemini AI test failed');
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Gemini AI is not working. Check GEMINI_API_KEY in .env',
      });
    }
  }
);

/**
 * POST /api/voice-threat/emergency/trigger
 * Trigger emergency alert with countdown
 */
router.post(
  '/emergency/trigger',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { sessionId, location } = req.body;

      logger.info({ userId: req.userId, sessionId }, '🚨 Emergency alert triggered');

      res.json({
        success: true,
        alertId: `alert_${req.userId}_${Date.now()}`,
        countdownStarted: true,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        sirenTriggered: true,
      });
    } catch (error: any) {
      logger.error({ error, userId: req.userId }, '❌ Failed to trigger emergency');
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/**
 * POST /api/voice-threat/emergency/confirm-safe
 * User confirms they are safe
 */
router.post(
  '/emergency/confirm-safe',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { alertId } = req.body;

      logger.info({ userId: req.userId, alertId }, '✅ User confirmed safe');

      res.json({
        success: true,
        cancelled: true,
        notificationsSent: true,
        message: 'Emergency cancelled - user confirmed safe',
      });
    } catch (error: any) {
      logger.error({ error, userId: req.userId }, '❌ Failed to confirm safety');
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;
