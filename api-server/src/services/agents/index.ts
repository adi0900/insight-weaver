/**
 * Agent Service
 * Handles Concierge and Inspector agent logic
 */

import { tableauService } from '../tableau/index.js';
import { salesforceService } from '../salesforce/index.js';

// ============================================
// TYPES
// ============================================

interface ConversationContext {
    sessionId: string;
    messages: {
        role: 'user' | 'assistant';
        content: string;
        timestamp: Date;
    }[];
    dataSources?: string[];
}

interface InsightResult {
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
}

interface AnomalyDetectionResult {
    alertId: string;
    metric: string;
    dimension: string;
    previousValue: number;
    currentValue: number;
    percentChange: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestedNarrative: string;
    zScore: number;
}

// ============================================
// CONVERSATION STORAGE
// ============================================

const conversations: Map<string, ConversationContext> = new Map();

// ============================================
// CONCIERGE AGENT
// ============================================

class ConciergeAgent {
    /**
     * Process a natural language query
     */
    async processQuery(
        query: string,
        sessionId: string,
        dataSources?: string[]
    ): Promise<InsightResult> {
        // Get or create conversation context
        let context = conversations.get(sessionId);
        if (!context) {
            context = {
                sessionId,
                messages: [],
                dataSources,
            };
            conversations.set(sessionId, context);
        }

        // Add user message to context
        context.messages.push({
            role: 'user',
            content: query,
            timestamp: new Date(),
        });

        // Execute NLQ via Tableau
        const nlqResult = await tableauService.executeNLQ(query, dataSources?.[0]);

        // Generate narrative
        const narrative = this.generateNarrative(query, nlqResult);

        // Extract citations
        const citations = this.extractCitations(query);

        // Build result
        const result: InsightResult = {
            insightId: `ins_${Date.now().toString(36)}`,
            query,
            visualization: {
                vizId: nlqResult.vizId,
                embedUrl: nlqResult.embedUrl,
                type: 'auto',
            },
            narrative,
            citations,
            confidence: nlqResult.confidence,
        };

        // Add assistant response to context
        context.messages.push({
            role: 'assistant',
            content: narrative,
            timestamp: new Date(),
        });

        return result;
    }

    /**
     * Generate a narrative from query results
     */
    private generateNarrative(query: string, nlqResult: any): string {
        // In production, use Einstein Trust Layer for narrative generation
        return `Based on analysis of your query "${query}", the data indicates significant patterns in the specified metrics. The visualization shows ${nlqResult.interpretedAs}. Confidence in this analysis is ${Math.round(nlqResult.confidence * 100)}%.`;
    }

    /**
     * Extract citations from query context
     */
    private extractCitations(query: string): InsightResult['citations'] {
        // In production, extract actual data sources from query resolution
        return [
            {
                source: 'Connected Data Source',
                field: 'primary_metric',
                timeRange: 'Last 90 days',
            },
        ];
    }

    /**
     * Get conversation history
     */
    getHistory(sessionId: string): ConversationContext | undefined {
        return conversations.get(sessionId);
    }

    /**
     * Clear conversation
     */
    clearConversation(sessionId: string): void {
        conversations.delete(sessionId);
    }
}

// ============================================
// INSPECTOR AGENT
// ============================================

class InspectorAgent {
    private pollingInterval: NodeJS.Timeout | null = null;

    /**
     * Start monitoring metrics
     */
    startMonitoring(intervalMinutes: number = 15): void {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }

        this.pollingInterval = setInterval(() => {
            this.checkMetrics();
        }, intervalMinutes * 60 * 1000);

        console.log(`[Inspector] Started monitoring with ${intervalMinutes}min interval`);
    }

    /**
     * Stop monitoring
     */
    stopMonitoring(): void {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        console.log('[Inspector] Stopped monitoring');
    }

    /**
     * Check metrics for anomalies
     */
    private async checkMetrics(): Promise<void> {
        console.log('[Inspector] Checking metrics for anomalies...');

        // In production:
        // 1. Fetch subscribed metrics
        // 2. Compare with historical data
        // 3. Calculate Z-scores
        // 4. Generate alerts for anomalies
    }

    /**
     * Detect anomaly using Z-score method
     */
    detectAnomaly(
        metric: string,
        dimension: string,
        values: number[],
        threshold: number = 2
    ): AnomalyDetectionResult | null {
        if (values.length < 2) {
            return null;
        }

        const currentValue = values[values.length - 1];
        const previousValues = values.slice(0, -1);

        // Calculate mean and standard deviation
        const mean = previousValues.reduce((a, b) => a + b, 0) / previousValues.length;
        const stdDev = Math.sqrt(
            previousValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
            previousValues.length
        );

        // Calculate Z-score
        const zScore = stdDev === 0 ? 0 : (currentValue - mean) / stdDev;

        // Check if anomaly
        if (Math.abs(zScore) < threshold) {
            return null;
        }

        const percentChange = ((currentValue - mean) / mean) * 100;

        // Determine severity
        let severity: AnomalyDetectionResult['severity'];
        if (Math.abs(zScore) >= 4) severity = 'critical';
        else if (Math.abs(zScore) >= 3) severity = 'high';
        else if (Math.abs(zScore) >= 2.5) severity = 'medium';
        else severity = 'low';

        // Generate suggested narrative
        const direction = zScore > 0 ? 'increased' : 'decreased';
        const suggestedNarrative = `${metric} in ${dimension} has ${direction} significantly. ` +
            `Current value (${currentValue.toFixed(2)}) is ${Math.abs(zScore).toFixed(1)} standard deviations ` +
            `from the historical mean (${mean.toFixed(2)}). Investigation recommended.`;

        return {
            alertId: `alert_${Date.now().toString(36)}`,
            metric,
            dimension,
            previousValue: mean,
            currentValue,
            percentChange,
            severity,
            suggestedNarrative,
            zScore,
        };
    }
}

// ============================================
// EXPORTS
// ============================================

export const conciergeAgent = new ConciergeAgent();
export const inspectorAgent = new InspectorAgent();
