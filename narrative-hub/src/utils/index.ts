/**
 * Utility functions for Insight Weaver
 */

import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names with conditional support
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/**
 * Format a number with K/M/B suffixes
 */
export function formatNumber(num: number): string {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
}

/**
 * Format a date relative to now
 */
export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return target.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        ...options,
    });
}

/**
 * Format a time for display
 */
export function formatTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
    return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get severity color classes
 */
export function getSeverityColor(severity: 'low' | 'medium' | 'high' | 'critical'): {
    bg: string;
    text: string;
    border: string;
} {
    switch (severity) {
        case 'critical':
            return {
                bg: 'bg-red-100 dark:bg-red-950/30',
                text: 'text-red-700 dark:text-red-400',
                border: 'border-red-200 dark:border-red-900',
            };
        case 'high':
            return {
                bg: 'bg-amber-100 dark:bg-amber-950/30',
                text: 'text-amber-700 dark:text-amber-400',
                border: 'border-amber-200 dark:border-amber-900',
            };
        case 'medium':
            return {
                bg: 'bg-blue-100 dark:bg-blue-950/30',
                text: 'text-blue-700 dark:text-blue-400',
                border: 'border-blue-200 dark:border-blue-900',
            };
        case 'low':
            return {
                bg: 'bg-emerald-100 dark:bg-emerald-950/30',
                text: 'text-emerald-700 dark:text-emerald-400',
                border: 'border-emerald-200 dark:border-emerald-900',
            };
    }
}

/**
 * Get status color classes
 */
export function getStatusColor(status: 'draft' | 'review' | 'published'): {
    bg: string;
    text: string;
} {
    switch (status) {
        case 'draft':
            return {
                bg: 'bg-slate-100 dark:bg-slate-800',
                text: 'text-slate-700 dark:text-slate-300',
            };
        case 'review':
            return {
                bg: 'bg-amber-100 dark:bg-amber-950/30',
                text: 'text-amber-700 dark:text-amber-400',
            };
        case 'published':
            return {
                bg: 'bg-emerald-100 dark:bg-emerald-950/30',
                text: 'text-emerald-700 dark:text-emerald-400',
            };
    }
}

/**
 * Calculate confidence display
 */
export function formatConfidence(confidence: number): {
    percentage: string;
    level: 'low' | 'medium' | 'high';
    color: string;
} {
    const percentage = `${Math.round(confidence * 100)}%`;

    if (confidence >= 0.8) {
        return { percentage, level: 'high', color: 'text-emerald-600' };
    }
    if (confidence >= 0.5) {
        return { percentage, level: 'medium', color: 'text-amber-600' };
    }
    return { percentage, level: 'low', color: 'text-red-600' };
}

/**
 * Parse query string to object
 */
export function parseQueryString(query: string): Record<string, string> {
    return Object.fromEntries(new URLSearchParams(query));
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
    const filtered = Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)]);

    return new URLSearchParams(filtered).toString();
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}
