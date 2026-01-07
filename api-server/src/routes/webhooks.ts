import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateBody } from '../middleware/validate.js';

export const webhooksRouter = Router();

// ============================================
// IN-MEMORY STORAGE
// ============================================

interface WebhookConfig {
    id: string;
    type: 'slack' | 'custom';
    url: string;
    events: string[];
    enabled: boolean;
    secret?: string;
    createdAt: Date;
    userId: string;
}

const webhooks: Map<string, WebhookConfig> = new Map();

// ============================================
// SCHEMAS
// ============================================

const configureWebhookSchema = z.object({
    type: z.enum(['slack', 'custom']),
    url: z.string().url('Invalid webhook URL'),
    events: z.array(z.string()).min(1, 'At least one event type is required'),
    enabled: z.boolean().default(true),
});

const updateWebhookSchema = z.object({
    url: z.string().url().optional(),
    events: z.array(z.string()).optional(),
    enabled: z.boolean().optional(),
});

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/v1/webhooks
 * List all webhook configurations
 */
webhooksRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id || 'anonymous';
        const results = Array.from(webhooks.values())
            .filter((w) => w.userId === userId)
            .map(({ secret, ...w }) => w); // Exclude secrets from response

        res.json({
            success: true,
            data: results,
        });
    })
);

/**
 * POST /api/v1/webhooks/configure
 * Create a new webhook configuration
 */
webhooksRouter.post(
    '/configure',
    validateBody(configureWebhookSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { type, url, events, enabled } = req.body;
        const userId = (req as any).user?.id || 'anonymous';

        const id = `whk_${uuidv4().slice(0, 8)}`;
        const secret = uuidv4();

        const webhook: WebhookConfig = {
            id,
            type,
            url,
            events,
            enabled,
            secret,
            createdAt: new Date(),
            userId,
        };

        webhooks.set(id, webhook);

        res.status(201).json({
            success: true,
            data: {
                id,
                type,
                url,
                events,
                enabled,
                secret, // Return secret only on creation
                createdAt: webhook.createdAt,
            },
        });
    })
);

/**
 * PATCH /api/v1/webhooks/:id
 * Update a webhook configuration
 */
webhooksRouter.patch(
    '/:id',
    validateBody(updateWebhookSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const webhook = webhooks.get(req.params.id);

        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Webhook not found',
            });
        }

        const { url, events, enabled } = req.body;

        if (url !== undefined) webhook.url = url;
        if (events !== undefined) webhook.events = events;
        if (enabled !== undefined) webhook.enabled = enabled;

        webhooks.set(req.params.id, webhook);

        const { secret, ...response } = webhook;
        res.json({
            success: true,
            data: response,
        });
    })
);

/**
 * DELETE /api/v1/webhooks/:id
 * Delete a webhook configuration
 */
webhooksRouter.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const exists = webhooks.has(req.params.id);

        if (!exists) {
            return res.status(404).json({
                success: false,
                error: 'Webhook not found',
            });
        }

        webhooks.delete(req.params.id);

        res.json({
            success: true,
            message: 'Webhook deleted',
        });
    })
);

/**
 * POST /api/v1/webhooks/:id/test
 * Send a test webhook
 */
webhooksRouter.post(
    '/:id/test',
    asyncHandler(async (req: Request, res: Response) => {
        const webhook = webhooks.get(req.params.id);

        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Webhook not found',
            });
        }

        // Create test payload
        const testPayload = {
            event: 'test',
            timestamp: new Date().toISOString(),
            payload: {
                message: 'This is a test webhook from Insight Weaver',
                webhookId: webhook.id,
            },
        };

        try {
            // In production, actually send the webhook
            // const response = await fetch(webhook.url, {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     'X-Webhook-Secret': webhook.secret,
            //   },
            //   body: JSON.stringify(testPayload),
            // });

            // For now, simulate success
            res.json({
                success: true,
                message: 'Test webhook sent successfully',
                payload: testPayload,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to send test webhook',
            });
        }
    })
);

/**
 * POST /api/v1/webhooks/:id/rotate-secret
 * Rotate webhook secret
 */
webhooksRouter.post(
    '/:id/rotate-secret',
    asyncHandler(async (req: Request, res: Response) => {
        const webhook = webhooks.get(req.params.id);

        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Webhook not found',
            });
        }

        const newSecret = uuidv4();
        webhook.secret = newSecret;
        webhooks.set(req.params.id, webhook);

        res.json({
            success: true,
            data: {
                id: webhook.id,
                secret: newSecret,
            },
        });
    })
);

// ============================================
// WEBHOOK EVENT TYPES
// ============================================

export const WEBHOOK_EVENTS = [
    'alert.created',
    'alert.acknowledged',
    'narrative.created',
    'narrative.published',
    'narrative.updated',
    'insight.generated',
    'export.completed',
];
