import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateBody } from '../middleware/validate.js';
import { exportService } from '../services/export/index.js';

export const narrativesRouter = Router();

// ============================================
// IN-MEMORY STORAGE (replace with DB in production)
// ============================================

interface Revision {
    id: string;
    hypothesis: string;
    confidence: number;
    authorId: string;
    timestamp: Date;
    evidence: unknown[];
    sources: unknown[];
}

interface Narrative {
    id: string;
    title: string;
    status: 'draft' | 'review' | 'published';
    createdAt: Date;
    updatedAt: Date;
    revisions: Revision[];
    collaborators: string[];
    tags: string[];
}

const narratives: Map<string, Narrative> = new Map();

// Seed with sample data for demonstration
const sampleNarrative: Narrative = {
    id: 'nar_001',
    title: 'Q4 2025 Revenue Analysis',
    status: 'published',
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date(),
    revisions: [
        {
            id: 'rev_001',
            hypothesis: 'Revenue growth of 12% driven by regional expansion in Southeast Asia.',
            confidence: 0.92,
            authorId: 'ai_librarian',
            timestamp: new Date(),
            evidence: [],
            sources: ['Tableau: Global Sales']
        }
    ],
    collaborators: ['demo_user'],
    tags: ['finance', 'revenue', 'q4']
};
narratives.set(sampleNarrative.id, sampleNarrative);

// ============================================
// SCHEMAS
// ============================================

const createNarrativeSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    hypothesis: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

const updateNarrativeSchema = z.object({
    title: z.string().optional(),
    status: z.enum(['draft', 'review', 'published']).optional(),
    tags: z.array(z.string()).optional(),
});

const addRevisionSchema = z.object({
    hypothesis: z.string().min(1, 'Hypothesis is required'),
    confidence: z.number().min(0).max(1),
    evidence: z.array(z.unknown()).optional(),
    sources: z.array(z.unknown()).optional(),
});

const exportSchema = z.object({
    format: z.enum(['pdf', 'markdown', 'salesforce']),
});

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/v1/narratives
 * List all narratives
 */
narrativesRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const status = req.query.status as string | undefined;

        let results = Array.from(narratives.values());

        if (status && ['draft', 'review', 'published'].includes(status)) {
            results = results.filter((n) => n.status === status);
        }

        // Sort by updatedAt descending
        results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        res.json({
            success: true,
            data: results,
        });
    })
);

/**
 * GET /api/v1/narratives/:id
 * Get a specific narrative with all revisions
 */
narrativesRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const narrative = narratives.get(req.params.id);

        if (!narrative) {
            return res.status(404).json({
                success: false,
                error: 'Narrative not found',
            });
        }

        res.json({
            success: true,
            data: narrative,
        });
    })
);

/**
 * POST /api/v1/narratives
 * Create a new narrative
 */
narrativesRouter.post(
    '/',
    validateBody(createNarrativeSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { title, hypothesis, tags } = req.body;
        const userId = (req as any).user?.id || 'anonymous';

        const id = `nar_${uuidv4().slice(0, 8)}`;
        const now = new Date();

        const narrative: Narrative = {
            id,
            title,
            status: 'draft',
            createdAt: now,
            updatedAt: now,
            revisions: hypothesis
                ? [
                    {
                        id: `rev_${uuidv4().slice(0, 8)}`,
                        hypothesis,
                        confidence: 0.5,
                        authorId: userId,
                        timestamp: now,
                        evidence: [],
                        sources: [],
                    },
                ]
                : [],
            collaborators: [userId],
            tags: tags || [],
        };

        narratives.set(id, narrative);

        res.status(201).json({
            success: true,
            data: narrative,
        });
    })
);

/**
 * PATCH /api/v1/narratives/:id
 * Update a narrative
 */
narrativesRouter.patch(
    '/:id',
    validateBody(updateNarrativeSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const narrative = narratives.get(req.params.id);

        if (!narrative) {
            return res.status(404).json({
                success: false,
                error: 'Narrative not found',
            });
        }

        const { title, status, tags } = req.body;

        if (title) narrative.title = title;
        if (status) narrative.status = status;
        if (tags) narrative.tags = tags;
        narrative.updatedAt = new Date();

        narratives.set(req.params.id, narrative);

        res.json({
            success: true,
            data: narrative,
        });
    })
);

/**
 * DELETE /api/v1/narratives/:id
 * Delete a narrative
 */
narrativesRouter.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const exists = narratives.has(req.params.id);

        if (!exists) {
            return res.status(404).json({
                success: false,
                error: 'Narrative not found',
            });
        }

        narratives.delete(req.params.id);

        res.json({
            success: true,
            message: 'Narrative deleted',
        });
    })
);

/**
 * POST /api/v1/narratives/:id/revisions
 * Add a new revision to a narrative
 */
narrativesRouter.post(
    '/:id/revisions',
    validateBody(addRevisionSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const narrative = narratives.get(req.params.id);

        if (!narrative) {
            return res.status(404).json({
                success: false,
                error: 'Narrative not found',
            });
        }

        const { hypothesis, confidence, evidence, sources } = req.body;
        const userId = (req as any).user?.id || 'anonymous';

        const revision: Revision = {
            id: `rev_${uuidv4().slice(0, 8)}`,
            hypothesis,
            confidence,
            authorId: userId,
            timestamp: new Date(),
            evidence: evidence || [],
            sources: sources || [],
        };

        narrative.revisions.unshift(revision);
        narrative.updatedAt = new Date();
        narratives.set(req.params.id, narrative);

        res.status(201).json({
            success: true,
            data: revision,
        });
    })
);

/**
 * POST /api/v1/narratives/:id/export
 * Export a narrative to PDF, Markdown, or Salesforce Knowledge
 */
narrativesRouter.post(
    '/:id/export',
    validateBody(exportSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const narrative = narratives.get(req.params.id);

        if (!narrative) {
            return res.status(404).json({
                success: false,
                error: 'Narrative not found',
            });
        }

        const { format } = req.body;
        const result = await exportService.export(narrative as any, format as any);

        res.json({
            success: true,
            downloadUrl: result.downloadUrl || `/api/v1/narratives/${narrative.id}/download?format=${format}`,
            format,
        });
    })
);

/**
 * GET /api/v1/narratives/:id/download
 * Download an exported narrative
 */
narrativesRouter.get(
    '/:id/download',
    asyncHandler(async (req: Request, res: Response) => {
        const narrative = narratives.get(req.params.id);
        if (!narrative) return res.status(404).send('Not found');

        const { format } = req.query;
        const result = await exportService.export(narrative as any, format as any);

        if (format === 'pdf' && result.buffer) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${narrative.title.toLowerCase().replace(/\s+/g, '_')}.pdf"`);
            return res.send(result.buffer);
        } else if (format === 'markdown' && result.content) {
            res.setHeader('Content-Type', 'text/markdown');
            res.setHeader('Content-Disposition', `attachment; filename="${narrative.title.toLowerCase().replace(/\s+/g, '_')}.md"`);
            return res.send(result.content);
        }

        res.status(400).send('Invalid format or export failed');
    })
);
