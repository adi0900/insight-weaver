import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { tableauService } from '../services/tableau/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateBody } from '../middleware/validate.js';

export const insightsRouter = Router();

// ============================================
// SCHEMAS
// ============================================

const generateInsightSchema = z.object({
    query: z.string().min(1, 'Query is required'),
    sessionId: z.string().optional(),
    dataSources: z.array(z.string()).optional(),
});

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/v1/insights/generate
 * Generate an insight from a natural language query
 */
insightsRouter.post(
    '/generate',
    validateBody(generateInsightSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { query, sessionId, dataSources } = req.body;

        try {
            const nlqResult = await tableauService.executeNLQ(query);

            const response = {
                success: true,
                data: {
                    insightId: `ins_${uuidv4().slice(0, 8)}`,
                    query,
                    visualization: {
                        vizId: nlqResult.vizId,
                        embedUrl: nlqResult.embedUrl,
                        type: 'chart',
                    },
                    narrative: nlqResult.interpretedAs + ". Strategic analysis shows growth opportunities in current segments.",
                    citations: [
                        {
                            source: 'Tableau Cloud: Superstore',
                            field: 'Sales & Profit',
                            timeRange: 'Current Year',
                        },
                    ],
                    confidence: nlqResult.confidence,
                    sessionId: sessionId || uuidv4(),
                },
            };

            res.json(response);
        } catch (err) {
            console.error('[Insights] Failed to generate insight:', err);
            res.status(500).json({
                success: false,
                error: 'Failed to generate insight'
            });
        }
    })
);

/**
 * GET /api/v1/insights/:id
 * Retrieve a specific insight by ID
 */
insightsRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        // TODO: Retrieve from storage
        // For now, return mock data
        res.json({
            success: true,
            data: {
                insightId: id,
                query: 'Sample query',
                visualization: {
                    vizId: 'viz_sample',
                    embedUrl: `https://tableau.example.com/embed/${id}`,
                    type: 'bar_chart',
                },
                narrative: 'This is a sample insight narrative.',
                citations: [],
                confidence: 0.88,
            },
        });
    })
);

/**
 * GET /api/v1/insights
 * List all insights (with pagination)
 */
insightsRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        // TODO: Retrieve from storage with pagination
        res.json({
            success: true,
            data: [],
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            },
        });
    })
);
