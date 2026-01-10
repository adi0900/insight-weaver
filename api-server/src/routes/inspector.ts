import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateBody } from '../middleware/validate.js';
import { tableauService } from '../services/tableau/index.js';

export const inspectorRouter = Router();

// ... existing code ...

/**
 * POST /api/v1/inspector/scan
 * Trigger a real-time scan for anomalies using Tableau Pulse
 */
inspectorRouter.post(
    '/scan',
    asyncHandler(async (req: Request, res: Response) => {
        try {
            const insights = await tableauService.getPulseInsights();

            // Transform Pulse insights into our Alert format
            const newAlerts = insights.map((insight: any) => {
                const id = `alert_${uuidv4().slice(0, 8)}`;
                const alert: Alert = {
                    id,
                    subscriptionId: insight.metricId || 'pulse_gen',
                    metric: insight.metricName || 'Pulse Metric',
                    dimension: insight.dimensionValue || 'Global',
                    previousValue: insight.previousValue || 0,
                    currentValue: insight.currentValue || 0,
                    percentChange: insight.percentChange || 0,
                    severity: insight.severity === 'high' ? 'critical' : 'high',
                    suggestedNarrative: insight.plainTextInsight || 'No description available.',
                    relatedVizIds: [],
                    timestamp: new Date(),
                    acknowledged: false,
                };
                alerts.set(id, alert);
                return alert;
            });

            res.json({
                success: true,
                count: newAlerts.length,
                data: newAlerts,
            });
        } catch (err) {
            console.error('[Inspector Scan] Error:', err);
            res.status(500).json({
                success: false,
                error: 'Failed to scan for anomalies',
            });
        }
    })
);

// ============================================
// IN-MEMORY STORAGE
// ============================================

interface MetricSubscription {
    id: string;
    metric: string;
    dimension?: string;
    threshold: number;
    thresholdType: 'percent' | 'absolute';
    direction: 'increase' | 'decrease' | 'both';
    enabled: boolean;
    createdAt: Date;
    userId: string;
}

interface Alert {
    id: string;
    subscriptionId: string;
    metric: string;
    dimension: string;
    previousValue: number;
    currentValue: number;
    percentChange: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestedNarrative: string;
    relatedVizIds: string[];
    timestamp: Date;
    acknowledged: boolean;
}

const subscriptions: Map<string, MetricSubscription> = new Map();
const alerts: Map<string, Alert> = new Map();

// Seed with sample alerts for demo
const sampleAlerts: Alert[] = [
    {
        id: 'alert_001',
        subscriptionId: 'sub_001',
        metric: 'SDG 11 Progress Score',
        dimension: 'District 7',
        previousValue: 72,
        currentValue: 58,
        percentChange: -19.4,
        severity: 'critical',
        suggestedNarrative: 'SDG 11 progress in District 7 declined significantly. Initial analysis suggests infrastructure project delays may be the primary factor.',
        relatedVizIds: ['viz_sdg11_trend'],
        timestamp: new Date(),
        acknowledged: false,
    },
    {
        id: 'alert_002',
        subscriptionId: 'sub_002',
        metric: 'Customer Satisfaction',
        dimension: 'Enterprise Segment',
        previousValue: 4.2,
        currentValue: 3.8,
        percentChange: -9.5,
        severity: 'high',
        suggestedNarrative: 'Enterprise customer satisfaction dropped. Correlating with increased support ticket volume over the past 2 weeks.',
        relatedVizIds: ['viz_csat_trend'],
        timestamp: new Date(Date.now() - 3600000),
        acknowledged: false,
    },
];

sampleAlerts.forEach((a) => alerts.set(a.id, a));

// ============================================
// SCHEMAS
// ============================================

const subscribeSchema = z.object({
    metric: z.string().min(1, 'Metric name is required'),
    dimension: z.string().optional(),
    threshold: z.number().positive('Threshold must be positive'),
    thresholdType: z.enum(['percent', 'absolute']),
    direction: z.enum(['increase', 'decrease', 'both']),
    enabled: z.boolean().default(true),
});

const updateSubscriptionSchema = z.object({
    threshold: z.number().positive().optional(),
    thresholdType: z.enum(['percent', 'absolute']).optional(),
    direction: z.enum(['increase', 'decrease', 'both']).optional(),
    enabled: z.boolean().optional(),
});

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/v1/inspector/subscriptions
 * List all metric subscriptions
 */
inspectorRouter.get(
    '/subscriptions',
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id || 'anonymous';
        const results = Array.from(subscriptions.values()).filter(
            (s) => s.userId === userId
        );

        res.json({
            success: true,
            data: results,
        });
    })
);

/**
 * POST /api/v1/inspector/subscribe
 * Create a new metric subscription
 */
inspectorRouter.post(
    '/subscribe',
    validateBody(subscribeSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { metric, dimension, threshold, thresholdType, direction, enabled } = req.body;
        const userId = (req as any).user?.id || 'anonymous';

        const id = `sub_${uuidv4().slice(0, 8)}`;

        const subscription: MetricSubscription = {
            id,
            metric,
            dimension,
            threshold,
            thresholdType,
            direction,
            enabled,
            createdAt: new Date(),
            userId,
        };

        subscriptions.set(id, subscription);

        res.status(201).json({
            success: true,
            data: subscription,
        });
    })
);

/**
 * PATCH /api/v1/inspector/subscriptions/:id
 * Update a subscription
 */
inspectorRouter.patch(
    '/subscriptions/:id',
    validateBody(updateSubscriptionSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const subscription = subscriptions.get(req.params.id);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: 'Subscription not found',
            });
        }

        const { threshold, thresholdType, direction, enabled } = req.body;

        if (threshold !== undefined) subscription.threshold = threshold;
        if (thresholdType !== undefined) subscription.thresholdType = thresholdType;
        if (direction !== undefined) subscription.direction = direction;
        if (enabled !== undefined) subscription.enabled = enabled;

        subscriptions.set(req.params.id, subscription);

        res.json({
            success: true,
            data: subscription,
        });
    })
);

/**
 * DELETE /api/v1/inspector/subscriptions/:id
 * Delete a subscription
 */
inspectorRouter.delete(
    '/subscriptions/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const exists = subscriptions.has(req.params.id);

        if (!exists) {
            return res.status(404).json({
                success: false,
                error: 'Subscription not found',
            });
        }

        subscriptions.delete(req.params.id);

        res.json({
            success: true,
            message: 'Subscription deleted',
        });
    })
);

/**
 * GET /api/v1/inspector/alerts
 * List all alerts
 */
inspectorRouter.get(
    '/alerts',
    asyncHandler(async (req: Request, res: Response) => {
        const severity = req.query.severity as string | undefined;
        const acknowledged = req.query.acknowledged as string | undefined;

        let results = Array.from(alerts.values());

        if (severity && ['low', 'medium', 'high', 'critical'].includes(severity)) {
            results = results.filter((a) => a.severity === severity);
        }

        if (acknowledged !== undefined) {
            results = results.filter((a) => a.acknowledged === (acknowledged === 'true'));
        }

        // Sort by timestamp descending
        results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        res.json({
            success: true,
            data: results,
        });
    })
);

/**
 * GET /api/v1/inspector/alerts/:id
 * Get a specific alert
 */
inspectorRouter.get(
    '/alerts/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const alert = alerts.get(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                error: 'Alert not found',
            });
        }

        res.json({
            success: true,
            data: alert,
        });
    })
);

/**
 * POST /api/v1/inspector/alerts/:id/acknowledge
 * Acknowledge an alert
 */
inspectorRouter.post(
    '/alerts/:id/acknowledge',
    asyncHandler(async (req: Request, res: Response) => {
        const alert = alerts.get(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                error: 'Alert not found',
            });
        }

        alert.acknowledged = true;
        alerts.set(req.params.id, alert);

        res.json({
            success: true,
            data: alert,
        });
    })
);

/**
 * GET /api/v1/inspector/stats
 * Get inspector statistics
 */
inspectorRouter.get(
    '/stats',
    asyncHandler(async (req: Request, res: Response) => {
        const allAlerts = Array.from(alerts.values());

        res.json({
            success: true,
            data: {
                totalSubscriptions: subscriptions.size,
                activeSubscriptions: Array.from(subscriptions.values()).filter((s) => s.enabled).length,
                totalAlerts: alerts.size,
                unacknowledgedAlerts: allAlerts.filter((a) => !a.acknowledged).length,
                criticalAlerts: allAlerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length,
                pollingIntervalMinutes: 15,
            },
        });
    })
);

/**
 * POST /api/v1/inspector/webhook/tableau
 * Receiver for Tableau Webhooks
 */
inspectorRouter.post(
    '/webhook/tableau',
    asyncHandler(async (req: Request, res: Response) => {
        const payload = req.body;
        console.log('[Tableau Webhook] Received:', payload.event_type);

        // If data refresh succeeded, trigger a scan
        if (payload.event_type?.includes('Refresh-Success')) {
            console.log('[Tableau Webhook] Refresh detected. Triggering scan...');
            // In a real app, this would be handled asynchronously
            await tableauService.getPulseInsights();
        }

        res.status(200).json({ received: true });
    })
);
