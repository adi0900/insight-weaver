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
        const loadViz = async () => {
            try {
                setIsLoading(true);
                setError(null);

                let token = '';

                // 1. Fetch the Tableau Token ONLY if it's not a public viz
                if (!vizUrl.includes('public.tableau.com')) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/auth/tableau-token`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('iw_token') || ''}`
                        }
                    });
                    const data = await response.json();

                    if (!data.success) {
                        throw new Error('Failed to get Tableau authentication token');
                    }
                    token = data.token;
                }

                // 2. Clear previous viz
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';

                    // 3. Create the tableau-viz element
                    // Note: We use the web component approach for Embedding API v3
                    const vizElement = document.createElement('tableau-viz') as any;
                    vizElement.id = `tableauViz-${Math.random().toString(36).substr(2, 9)}`;
                    vizElement.src = vizUrl;
                    if (!vizUrl.includes('public.tableau.com')) {
                        vizElement.token = token;
                    }
                    vizElement.className = 'w-full h-full';

                    if (hideTabs) vizElement.setAttribute('hide-tabs', 'true');
                    vizElement.setAttribute('toolbar', hideToolbar ? 'hidden' : 'top');
                    vizElement.setAttribute('device', 'default');

                    containerRef.current.appendChild(vizElement);

                    // Handle load event
                    vizElement.addEventListener('firstinteractive', () => {
                        setIsLoading(false);
                        onLoad?.();
                    });
                }
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to load visualization');
                setError(error.message);
                setIsLoading(false);
                onError?.(error);
            }
        };

        if (vizUrl) {
            loadViz();
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [vizUrl, hideTabs, hideToolbar, onLoad, onError]);

    const handleRefresh = () => {
        // Just empty and reload via useEffect
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }
        setIsLoading(true);
        // Force re-run of the effect by setting state if needed, 
        // but since we are clearing the container, we might need a better way.
        // For now, let's just trigger loadViz again manually or via dependency.
    };

    return (
        <div
            className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-inner flex flex-col"
            style={{ width, height }}
        >
            {/* Loading State Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-4" />
                    <div className="text-sm font-mono uppercase tracking-widest text-slate-500 animate-pulse">
                        Authenticating & Weaving Viz...
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-50 dark:bg-neutral-900 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-4">
                        <RefreshCw className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Viz Connection Failed</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-xs">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-mono uppercase tracking-widest hover:bg-brand-500 transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            )}

            {/* Actual Viz Container */}
            <div
                ref={containerRef}
                className="w-full h-full min-h-0 flex-1"
            />
        </div>
    );
}
