const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestConfig extends RequestInit {
    timeout?: number;
}

class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(
    endpoint: string,
    config: RequestConfig = {}
): Promise<T> {
    const { timeout = 30000, ...fetchConfig } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...fetchConfig,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...fetchConfig.headers,
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new ApiError(
                errorData?.message || `Request failed with status ${response.status}`,
                response.status,
                errorData
            );
        }

        return response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof ApiError) throw error;
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError('Request timeout', 408);
        }
        throw error;
    }
}

// ============================================
// INSIGHTS API
// ============================================

interface GenerateInsightRequest {
    query: string;
    sessionId?: string;
    dataSources?: string[];
}

interface InsightResponse {
    success: boolean;
    data: {
        insightId: string;
        query: string;
        visualization: {
            vizId: string;
            embedUrl: string;
            type: string;
        };
        narrative: string;
        citations: {
            source: string;
            field: string;
            timeRange?: string;
        }[];
        confidence: number;
    };
}

export const insightsApi = {
    generate: (data: GenerateInsightRequest) =>
        request<InsightResponse>('/api/v1/insights/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    get: (id: string) =>
        request<InsightResponse>(`/api/v1/insights/${id}`),
};

// ============================================
// NARRATIVES API
// ============================================

interface Narrative {
    id: string;
    title: string;
    status: 'draft' | 'review' | 'published';
    createdAt: string;
    updatedAt: string;
    revisions: {
        id: string;
        hypothesis: string;
        confidence: number;
        authorId: string;
        timestamp: string;
    }[];
    tags: string[];
    collaborators: string[];
}

interface NarrativesResponse {
    success: boolean;
    data: Narrative[];
}

interface CreateNarrativeRequest {
    title: string;
    hypothesis: string;
    tags?: string[];
}

interface ExportRequest {
    format: 'pdf' | 'markdown' | 'salesforce';
}

export const narrativesApi = {
    list: () => request<NarrativesResponse>('/api/v1/narratives'),

    get: (id: string) =>
        request<{ success: boolean; data: Narrative }>(`/api/v1/narratives/${id}`),

    create: (data: CreateNarrativeRequest) =>
        request<{ success: boolean; data: Narrative }>('/api/v1/narratives', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<Narrative>) =>
        request<{ success: boolean; data: Narrative }>(`/api/v1/narratives/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        request<{ success: boolean }>(`/api/v1/narratives/${id}`, {
            method: 'DELETE',
        }),

    export: (id: string, data: ExportRequest) =>
        request<{ success: boolean; downloadUrl: string }>(
            `/api/v1/narratives/${id}/export`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        ),
};

// ============================================
// INSPECTOR API
// ============================================

interface MetricSubscription {
    id: string;
    metric: string;
    dimension?: string;
    threshold: number;
    thresholdType: 'percent' | 'absolute';
    direction: 'increase' | 'decrease' | 'both';
    enabled: boolean;
}

interface Alert {
    id: string;
    metric: string;
    dimension: string;
    previousValue: number;
    currentValue: number;
    percentChange: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestedNarrative: string;
    timestamp: string;
    acknowledged: boolean;
}

export const inspectorApi = {
    getSubscriptions: () =>
        request<{ success: boolean; data: MetricSubscription[] }>(
            '/api/v1/inspector/subscriptions'
        ),

    subscribe: (data: Omit<MetricSubscription, 'id'>) =>
        request<{ success: boolean; data: MetricSubscription }>(
            '/api/v1/inspector/subscribe',
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        ),

    unsubscribe: (id: string) =>
        request<{ success: boolean }>(`/api/v1/inspector/subscriptions/${id}`, {
            method: 'DELETE',
        }),

    getAlerts: () =>
        request<{ success: boolean; data: Alert[] }>('/api/v1/inspector/alerts'),

    acknowledgeAlert: (id: string) =>
        request<{ success: boolean }>(`/api/v1/inspector/alerts/${id}/acknowledge`, {
            method: 'POST',
        }),
};

// ============================================
// WEBHOOKS API
// ============================================

interface WebhookConfig {
    id: string;
    type: 'slack' | 'custom';
    url: string;
    events: string[];
    enabled: boolean;
}

export const webhooksApi = {
    getConfigs: () =>
        request<{ success: boolean; data: WebhookConfig[] }>('/api/v1/webhooks'),

    configure: (data: Omit<WebhookConfig, 'id'>) =>
        request<{ success: boolean; data: WebhookConfig }>(
            '/api/v1/webhooks/configure',
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        ),

    test: (id: string) =>
        request<{ success: boolean }>(`/api/v1/webhooks/${id}/test`, {
            method: 'POST',
        }),

    delete: (id: string) =>
        request<{ success: boolean }>(`/api/v1/webhooks/${id}`, {
            method: 'DELETE',
        }),
};

// ============================================
// DATA SOURCES API
// ============================================

interface DataSource {
    id: string;
    name: string;
    type: 'tableau' | 'salesforce' | 'snowflake';
    status: 'connected' | 'disconnected' | 'syncing';
    lastSync: string;
    tables: number;
    rowCount: number;
}

export const dataSourcesApi = {
    list: () =>
        request<{ success: boolean; data: DataSource[] }>('/api/v1/data-sources'),

    get: (id: string) =>
        request<{ success: boolean; data: DataSource }>(`/api/v1/data-sources/${id}`),

    sync: (id: string) =>
        request<{ success: boolean }>(`/api/v1/data-sources/${id}/sync`, {
            method: 'POST',
        }),

    test: (id: string) =>
        request<{ success: boolean; healthy: boolean }>(
            `/api/v1/data-sources/${id}/test`
        ),
};

// ============================================
// AUTH API
// ============================================

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

export const authApi = {
    getCurrentUser: () =>
        request<{ success: boolean; data: User }>('/api/v1/auth/me'),

    login: (credentials: { email: string; password: string }) =>
        request<{ success: boolean; data: User; token: string }>('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    logout: () =>
        request<{ success: boolean }>('/api/v1/auth/logout', {
            method: 'POST',
        }),

    initiateOAuth: (provider: 'tableau' | 'salesforce') =>
        request<{ redirectUrl: string }>(`/api/v1/auth/oauth/${provider}/initiate`),
};
