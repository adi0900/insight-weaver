'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Maximize2, RefreshCw } from 'lucide-react';

interface EmbeddedVizProps {
    vizUrl: string;
    width?: string | number;
    height?: string | number;
    hideTabs?: boolean;
    hideToolbar?: boolean;
    onLoad?: () => void;
    onError?: (error: Error) => void;
}

export function EmbeddedViz({
    vizUrl,
    width = '100%',
    height = 400,
    hideTabs = true,
    hideToolbar = false,
    onLoad,
    onError,
}: EmbeddedVizProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // In production, this would load the actual Tableau Embedding API
        // For now, we simulate the loading behavior
        const loadViz = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Simulate API loading time
                await new Promise((resolve) => setTimeout(resolve, 1500));

                // In production:
                // const { TableauViz } = await import('@tableau/embedding-api');
                // const viz = new TableauViz();
                // viz.src = vizUrl;
                // viz.hideTabs = hideTabs;
                // viz.toolbar = hideToolbar ? 'hidden' : 'top';
                // containerRef.current?.appendChild(viz);

                setIsLoading(false);
                onLoad?.();
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to load visualization');
                setError(error.message);
                setIsLoading(false);
                onError?.(error);
            }
        };

        loadViz();

        return () => {
            // Cleanup viz on unmount
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [vizUrl, hideTabs, hideToolbar, onLoad, onError]);

    const handleRefresh = () => {
        setIsLoading(true);
        // Simulate refresh
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <div
            className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800"
            style={{ width, height }}
        >
            {/* Toolbar */}
            {!hideToolbar && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors"
                        title="Fullscreen"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-3" />
                    <span className="text-sm text-slate-500">Loading visualization...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <div className="text-red-500 mb-2">⚠️</div>
                    <span className="text-sm text-slate-500">{error}</span>
                    <button
                        onClick={handleRefresh}
                        className="mt-3 btn-secondary text-sm"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Placeholder (in production, the actual viz would render here) */}
            {!isLoading && !error && (
                <div
                    ref={containerRef}
                    className="w-full h-full flex items-center justify-center text-slate-400"
                >
                    <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <div className="text-sm">Tableau Visualization</div>
                        <div className="text-xs text-slate-500 mt-1 max-w-48 truncate">
                            {vizUrl}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
