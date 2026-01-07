/**
 * Tableau Cloud API Service
 * Handles authentication, data source access, and NLQ queries
 */

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// TYPES
// ============================================

interface TableauConfig {
    cloudUrl: string;
    siteId: string;
    clientId: string;
    secretId: string;
    secretValue: string;
}

interface DataSource {
    id: string;
    name: string;
    type: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

interface Workbook {
    id: string;
    name: string;
    description?: string;
    views: View[];
}

interface View {
    id: string;
    name: string;
    contentUrl: string;
}

interface NLQResponse {
    vizId: string;
    embedUrl: string;
    query: string;
    interpretedAs: string;
    confidence: number;
}

// ============================================
// SERVICE
// ============================================

class TableauService {
    private config: TableauConfig | null = null;
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;

    /**
     * Initialize service with configuration from environment
     */
    initialize(): void {
        const cloudUrl = process.env.TABLEAU_CLOUD_URL;
        const siteId = process.env.TABLEAU_SITE_ID;
        const clientId = process.env.TABLEAU_CLIENT_ID;
        const secretId = process.env.TABLEAU_SECRET_ID;
        const secretValue = process.env.TABLEAU_SECRET_VALUE;

        if (!cloudUrl || !siteId || !clientId || !secretId || !secretValue) {
            console.warn('[Tableau] Missing configuration, service will run in mock mode');
            return;
        }

        this.config = {
            cloudUrl,
            siteId,
            clientId,
            secretId,
            secretValue,
        };

        console.log('[Tableau] Service initialized');
    }

    /**
     * Generate JWT for Tableau Connected App authentication
     */
    private generateJWT(userEmail: string): string {
        if (!this.config) {
            throw new Error('Tableau service not configured');
        }

        const payload = {
            iss: this.config.clientId,
            sub: userEmail,
            aud: 'tableau',
            exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
            jti: uuidv4(),
            scp: ['tableau:content:read', 'tableau:insight_definitions_metrics:read'],
        };

        return jwt.sign(payload, this.config.secretValue, {
            algorithm: 'HS256',
            header: {
                alg: 'HS256',
                typ: 'JWT',
                kid: this.config.secretId,
                iss: this.config.clientId,
            },
        });
    }

    /**
     * Authenticate with Tableau Cloud API (placeholder)
     */
    async authenticate(userEmail: string): Promise<string> {
        if (!this.config) {
            console.log('[Tableau] Running in mock mode');
            return 'mock_access_token';
        }

        const jwt = this.generateJWT(userEmail);

        // In production, exchange JWT for access token via Tableau REST API
        // const response = await fetch(`${this.config.cloudUrl}/api/3.22/auth/signin`, {...});

        this.accessToken = 'mock_token';
        this.tokenExpiry = new Date(Date.now() + 3600000);

        return this.accessToken;
    }

    /**
     * Get list of available data sources
     */
    async getDataSources(): Promise<DataSource[]> {
        // In production, call Tableau REST API
        // For now, return mock data
        return [
            {
                id: 'ds_001',
                name: 'Sales Analytics',
                type: 'tableau_extract',
                description: 'Sales and revenue data',
                createdAt: '2025-01-01T00:00:00Z',
                updatedAt: '2026-01-07T00:00:00Z',
            },
            {
                id: 'ds_002',
                name: 'Customer Insights',
                type: 'live_connection',
                description: 'Customer behavior and satisfaction',
                createdAt: '2025-06-15T00:00:00Z',
                updatedAt: '2026-01-07T00:00:00Z',
            },
        ];
    }

    /**
     * Get list of workbooks with views
     */
    async getWorkbooks(): Promise<Workbook[]> {
        return [
            {
                id: 'wb_001',
                name: 'Executive Dashboard',
                views: [
                    { id: 'v_001', name: 'Revenue Overview', contentUrl: 'revenue-overview' },
                    { id: 'v_002', name: 'Regional Performance', contentUrl: 'regional-performance' },
                ],
            },
        ];
    }

    /**
     * Execute Natural Language Query (placeholder for Tableau Next NLQ)
     */
    async executeNLQ(query: string, dataSourceId?: string): Promise<NLQResponse> {
        // In production, call Tableau Next NLQ API
        // For now, return mock response
        console.log(`[Tableau NLQ] Query: "${query}" on datasource: ${dataSourceId || 'default'}`);

        return {
            vizId: `viz_${uuidv4().slice(0, 8)}`,
            embedUrl: `${this.config?.cloudUrl || 'https://tableau.example.com'}/views/auto-generated/${Date.now()}`,
            query,
            interpretedAs: `Generating visualization for: ${query}`,
            confidence: 0.85 + Math.random() * 0.1,
        };
    }

    /**
     * Get embed URL for a visualization
     */
    getEmbedUrl(viewId: string): string {
        return `${this.config?.cloudUrl || 'https://tableau.example.com'}/t/${this.config?.siteId || 'site'}/views/${viewId}`;
    }

    /**
     * Check if service is configured and ready
     */
    isConfigured(): boolean {
        return this.config !== null;
    }
}

export const tableauService = new TableauService();
tableauService.initialize();
