import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

export const dataSourcesRouter = Router();

/**
 * GET /api/v1/data-sources
 * List all connected data sources
 */
dataSourcesRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        // Mock data showing Tableau as primary data source
        // In production, this would query actual Tableau Server/Online metadata API
        const dataSources = [
            {
                id: 'ds_tableau_001',
                name: 'Tableau Cloud',
                type: 'tableau',
                status: 'connected',
                lastSync: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
                tables: 12,
                rowCount: 2540000,
                metadata: {
                    host: process.env.TABLEAU_HOST || 'https://prod-in-a.online.tableau.com',
                    site: process.env.TABLEAU_SITE_ID || 'your-site-id',
                    workbooks: 8,
                    views: 45
                }
            },
            {
                id: 'ds_salesforce_001',
                name: 'Salesforce Data Cloud',
                type: 'salesforce',
                status: 'connected',
                lastSync: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
                tables: 8,
                rowCount: 1250000
            },
            {
                id: 'ds_snowflake_001',
                name: 'Snowflake Warehouse',
                type: 'snowflake',
                status: 'connected',
                lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
                tables: 24,
                rowCount: 8900000
            }
        ];

        res.json({
            success: true,
            data: dataSources,
        });
    })
);

/**
 * GET /api/v1/data-sources/:id
 * Get details for a specific data source
 */
dataSourcesRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        // In production, fetch specific data source details
        res.json({
            success: true,
            data: {
                id: req.params.id,
                name: 'Tableau Cloud',
                type: 'tableau',
                status: 'connected',
                // More detailed metadata...
            },
        });
    })
);
