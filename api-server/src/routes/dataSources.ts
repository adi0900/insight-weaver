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

        // Always show Tableau as the primary data source with env config
        const tableauSource = {
            id: 'ds_tableau_001',
            name: 'Tableau Cloud',
            type: 'tableau' as const,
            status: tableauService.isConfigured() ? 'connected' as const : 'disconnected' as const,
            lastSync: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
            tables: 12,
            rowCount: 2540000,
            userId: userId,
            metadata: {
                host: process.env.TABLEAU_CLOUD_URL || 'https://prod-in-a.online.tableau.com',
                siteId: process.env.TABLEAU_SITE_ID || 'Not configured',
                configured: tableauService.isConfigured()
            }
        };

        // Try to fetch live data sources from Tableau
        let additionalSources: any[] = [];
        try {
            const tableauSources = await tableauService.getDataSources();
            additionalSources = tableauSources.slice(0, 3).map((ds, idx) => ({
                id: `tableau_ds_${idx + 1}`,
                name: ds.name,
                type: 'tableau' as const,
                status: 'connected' as const,
                lastSync: new Date(ds.updatedAt),
                tables: 3 + idx * 2,
                rowCount: 125000 + idx * 50000,
                userId: userId,
            }));
        } catch (err) {
            console.error('[DataSources] Failed to fetch Tableau sources:', err);
        }

        // Combine with other mock sources
        const results = [
            tableauSource,
            ...additionalSources,
            {
                id: 'ds_sf_001',
                name: 'Salesforce Data Cloud',
                type: 'salesforce' as const,
                status: 'connected' as const,
                lastSync: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
                tables: 8,
                rowCount: 850000,
                userId: userId,
            },
            {
                id: 'ds_snowflake_001',
                name: 'Snowflake Warehouse',
                type: 'snowflake' as const,
                status: 'connected' as const,
                lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
                tables: 24,
                rowCount: 8900000,
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
