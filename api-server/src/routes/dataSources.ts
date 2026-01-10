import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../utils/asyncHandler.js';
import { tableauService } from '../services/tableau/index.js';

export const dataSourcesRouter = Router();

// ============================================
// IN-MEMORY STORAGE (for non-Tableau sources/state)
// ============================================

interface DataSource {
    id: string;
    name: string;
    type: 'tableau' | 'salesforce' | 'snowflake';
    status: 'connected' | 'disconnected' | 'syncing';
    lastSync: Date;
    tables: number;
    rowCount: number;
    config: Record<string, unknown>;
    userId: string;
}

const dataSources: Map<string, DataSource> = new Map();

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/v1/data-sources
 * List all data sources
 */
dataSourcesRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id || 'user_demo';

        // Fetch live data sources from Tableau
        const tableauSources = await tableauService.getDataSources();

        // Transform Tableau sources to our internal format
        const transformedTableau = tableauSources.map(ds => ({
            id: ds.id,
            name: ds.name,
            type: 'tableau' as const,
            status: 'connected' as const,
            lastSync: new Date(ds.updatedAt),
            tables: 12, // Mocked for now
            rowCount: 1250000, // Mocked for now
            userId: userId,
        }));

        // Combine with any other sources (mocked for Salesforce for now)
        const results = [
            ...transformedTableau,
            {
                id: 'ds_sf_001',
                name: 'Salesforce Data Cloud',
                type: 'salesforce' as const,
                status: 'connected' as const,
                lastSync: new Date(Date.now() - 900000),
                tables: 8,
                rowCount: 850000,
                userId: userId,
            }
        ];

        res.json({
            success: true,
            data: results,
        });
    })
);

/**
 * GET /api/v1/data-sources/:id
 * Get a specific data source
 */
dataSourcesRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const dataSource = dataSources.get(req.params.id);

        if (!dataSource) {
            return res.status(404).json({
                success: false,
                error: 'Data source not found',
            });
        }

        const { config, ...response } = dataSource;
        res.json({
            success: true,
            data: response,
        });
    })
);

/**
 * POST /api/v1/data-sources/:id/sync
 * Trigger a sync for a data source
 */
dataSourcesRouter.post(
    '/:id/sync',
    asyncHandler(async (req: Request, res: Response) => {
        const dataSource = dataSources.get(req.params.id);

        if (!dataSource) {
            return res.status(404).json({
                success: false,
                error: 'Data source not found',
            });
        }

        // Set status to syncing
        dataSource.status = 'syncing';
        dataSources.set(req.params.id, dataSource);

        // Simulate sync completion after 5 seconds
        setTimeout(() => {
            dataSource.status = 'connected';
            dataSource.lastSync = new Date();
            dataSources.set(req.params.id, dataSource);
        }, 5000);

        res.json({
            success: true,
            message: 'Sync initiated',
            estimatedDuration: '5 seconds',
        });
    })
);

/**
 * GET /api/v1/data-sources/:id/test
 * Test connection to a data source
 */
dataSourcesRouter.get(
    '/:id/test',
    asyncHandler(async (req: Request, res: Response) => {
        const dataSource = dataSources.get(req.params.id);

        if (!dataSource) {
            return res.status(404).json({
                success: false,
                error: 'Data source not found',
            });
        }

        // In production, actually test the connection
        res.json({
            success: true,
            healthy: dataSource.status !== 'disconnected',
            latencyMs: Math.floor(Math.random() * 50) + 10,
            lastChecked: new Date().toISOString(),
        });
    })
);

/**
 * GET /api/v1/data-sources/:id/tables
 * List tables in a data source
 */
dataSourcesRouter.get(
    '/:id/tables',
    asyncHandler(async (req: Request, res: Response) => {
        const dataSource = dataSources.get(req.params.id);

        if (!dataSource) {
            return res.status(404).json({
                success: false,
                error: 'Data source not found',
            });
        }

        // Return mock table metadata
        res.json({
            success: true,
            data: [
                { name: 'sales_transactions', rowCount: 500000, columns: 15 },
                { name: 'customers', rowCount: 150000, columns: 12 },
                { name: 'products', rowCount: 5000, columns: 8 },
            ],
        });
    })
);
