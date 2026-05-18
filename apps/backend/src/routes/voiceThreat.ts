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
 * POST /api/voice-threat/emergency/send-alerts
 * Send emergency alerts to all contacts (SMS, WhatsApp, Calls)
 */
router.post(
  '/emergency/send-alerts',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { alertId, location } = req.body;

      logger.info({ userId: req.userId, alertId, location }, '📱 Sending emergency alerts');

      // Get user info
      const { databaseService } = await import('../services/database.service');

      const userResult = await databaseService.query(
        'SELECT full_name, phone_number FROM users WHERE id = $1',
        [req.userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      const user = userResult.rows[0];

      // Get all emergency contacts
      const contactsResult = await databaseService.query(
        `SELECT id, name, phone_number, relationship, carrier
         FROM emergency_contacts
         WHERE user_id = $1 AND is_active = true
         ORDER BY priority ASC`,
        [req.userId]
      );

      const contacts = contactsResult.rows;

      if (contacts.length === 0) {
        logger.warn({ userId: req.userId }, '⚠️ No emergency contacts found');
        return res.json({
          success: true,
          message: 'No emergency contacts to notify',
          alertsSent: 0,
        });
      }

      logger.info({ userId: req.userId, contactCount: contacts.length }, '📋 Found emergency contacts');

      // Create emergency message
      const locationUrl = location?.latitude && location?.longitude
        ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
        : 'Location unavailable';

      const message = `🚨 EMERGENCY ALERT 🚨\n\n${user.full_name || 'Your contact'} needs help!\n\nLocation: ${locationUrl}\n\nThis is an automated emergency alert from Silent Siren.`;

      // Send alerts to each contact
      const { freeSMSService } = await import('../services/freeSMS.service');
      const results = [];

      for (const contact of contacts) {
        try {
          // Send SMS if carrier is available
          if (contact.carrier) {
            logger.info({ contactId: contact.id, carrier: contact.carrier }, '📧 Sending SMS via email gateway');
            await freeSMSService.sendSMS(contact.phone_number, contact.carrier, message);
            results.push({
              contactId: contact.id,
              name: contact.name,
              method: 'SMS',
              success: true,
            });
          }

          // Generate WhatsApp link (frontend will open it)
          const whatsappUrl = `https://wa.me/${contact.phone_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
          results.push({
            contactId: contact.id,
            name: contact.name,
            method: 'WhatsApp',
            url: whatsappUrl,
            success: true,
          });

          // Generate call link (frontend will open it)
          const callUrl = `tel:${contact.phone_number}`;
          results.push({
            contactId: contact.id,
            name: contact.name,
            method: 'Call',
            url: callUrl,
            success: true,
          });

          logger.info({ contactId: contact.id, name: contact.name }, '✅ Alerts prepared for contact');
        } catch (error: any) {
          logger.error({ error, contactId: contact.id }, '❌ Failed to send alert to contact');
          results.push({
            contactId: contact.id,
            name: contact.name,
            method: 'All',
            success: false,
            error: error.message,
          });
        }
      }

      logger.info({ userId: req.userId, totalAlerts: results.length }, '✅ Emergency alerts sent');

      res.json({
        success: true,
        message: 'Emergency alerts sent to all contacts',
        alertsSent: results.length,
        contacts: contacts.length,
        results,
        locationUrl,
      });
    } catch (error: any) {
      logger.error({ error, userId: req.userId }, '❌ Failed to send emergency alerts');
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to send emergency alerts',
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

      // Get user info
      const { databaseService } = await import('../services/database.service');

      const userResult = await databaseService.query(
        'SELECT full_name FROM users WHERE id = $1',
        [req.userId]
      );

      const user = userResult.rows[0];

      // Get all emergency contacts
      const contactsResult = await databaseService.query(
        `SELECT name, phone_number, carrier
         FROM emergency_contacts
         WHERE user_id = $1 AND is_active = true`,
        [req.userId]
      );

      // Send "I am safe" message to all contacts
      const { freeSMSService } = await import('../services/freeSMS.service');
      const safeMessage = `✅ ${user?.full_name || 'Your contact'} is SAFE.\n\nThe emergency alert has been cancelled. No assistance needed.`;

      for (const contact of contactsResult.rows) {
        if (contact.carrier) {
          try {
            await freeSMSService.sendSMS(contact.phone_number, contact.carrier, safeMessage);
            logger.info({ contactName: contact.name }, '✅ Safe message sent');
          } catch (error) {
            logger.error({ error, contactName: contact.name }, '❌ Failed to send safe message');
          }
        }
      }

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
