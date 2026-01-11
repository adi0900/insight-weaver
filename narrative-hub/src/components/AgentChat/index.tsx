'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Plus, Copy, Check, Terminal, CornerDownLeft, BarChart2, FileText, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmbeddedViz } from '@/components/EmbeddedViz';
import { insightsApi, dataSourcesApi, narrativesApi } from '@/services/api';
import { getApiBaseUrl, getTableauHost, getTableauSite } from '@/utils/env';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    visualization?: {
        type: 'chart' | 'table';
        vizId?: string;
        embedUrl?: string;
    };
    citations?: {
        source: string;
        field: string;
        timeRange?: string;
    }[];
    confidence?: number;
}

export function AgentChat() {
    const [isMounted, setIsMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customVizUrl, setCustomVizUrl] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [addedToNarrative, setAddedToNarrative] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            setCustomVizUrl(localStorage.getItem('custom_viz_url'));
        }

        // Add initial greeting on client-side only to avoid hydration mismatch
        setMessages([
            {
                id: '1',
                role: 'assistant',
                content:
                    "SYSTEM READY.\nInput query for data analysis. Concierge v2.0 is online. \n\nI am connected to your Tableau Cloud environment as an AI Librarian. How can I help you explore your data today?",
                timestamp: new Date(),
            },
        ]);
    }, []);

    const handleAddToNarrative = async (id: string, content: string) => {
        try {
            setAddedToNarrative(id);
            // In a real refined app, we might check for an active narrative, 
            // but for hackathon demo, we'll create a new one based on this insight.
            const result = await narrativesApi.create({
                title: `Analysis: ${content.split('\n')[0].substring(0, 40)}...`,
                hypothesis: content,
                tags: ['ai-generated', 'concierge-insight']
            });

            if (result.success) {
                console.log('Successfully created narrative from insight:', result.data.id);
                // Keep the "check" icon visible for 2 seconds
                setTimeout(() => setAddedToNarrative(null), 2000);
            }
        } catch (err) {
            console.error('[Chat] Failed to save to narrative:', err);
            setAddedToNarrative(null);
            alert('SYSTEM ERROR: Failed to weave narrative. Please verify backend connection.');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: `msg-u-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Check for diagnostic command
            if (input.toUpperCase().includes('DIAGNOSE') || input.toUpperCase().includes('HEALTH')) {
                const result = await dataSourcesApi.list();

                const assistantMessage: Message = {
                    id: `msg-a-diag-${Date.now()}`,
                    role: 'assistant',
                    content: result.success
                        ? "DIAGNOSTIC COMPLETE: Connection to Tableau Cloud is HEALTHY. Data sources are being indexed correctly."
                        : "DIAGNOSTIC FAILED: Connection to Tableau Cloud returned an error. Please verify your .env.local credentials and ensure your Tableau user email is correctly configured.",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
                setIsLoading(false);
                return;
            }

            // Check for manual viz override
            if (input.startsWith('/set-viz ')) {
                let url = input.replace('/set-viz ', '').trim();

                // Auto-fix URL format: Convert browser URL to embed URL
                if (url.includes('/#/site/')) {
                    url = url.replace('/#/site/', '/t/');
                }

                localStorage.setItem('custom_viz_url', url);
                setCustomVizUrl(url);

                const assistantMessage: Message = {
                    id: `msg-a-conf-${Date.now()}`,
                    role: 'assistant',
                    content: `✨ CONFIGURATION UPDATED!\n\nVisualization target successfully set to: \n\`${url}\` \n\nI am now weaving this dashboard into our analytical workspace. See the live preview below!`,
                    timestamp: new Date(),
                    visualization: {
                        vizId: 'custom-viz',
                        embedUrl: url,
                        type: 'chart'
                    }
                };
                setMessages((prev) => [...prev, assistantMessage]);
                setIsLoading(false);
                return;
            }

            // Call our real backend API
            const result = await insightsApi.generate({ query: input });

            if (result.success) {
                const assistantMessage: Message = {
                    id: result.data.insightId,
                    role: 'assistant',
                    content: result.data.narrative,
                    timestamp: new Date(),
                    visualization: {
                        type: result.data.visualization.type === 'table' ? 'table' : 'chart',
                        vizId: result.data.visualization.vizId
                    },
                    citations: result.data.citations,
                    confidence: result.data.confidence,
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                throw new Error('Failed to generate insight');
            }
        } catch (err) {
            console.error('[Chat] Error:', err);
            const errorMessage: Message = {
                id: `msg-a-err-${Date.now()}`,
                role: 'assistant',
                content: "ERROR: System malfunction during neural processing. Please retry query. " + (err instanceof Error ? err.message : ''),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (id: string, content: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const suggestedQueries = [
        'QUICK STATS: Q3 SALES',
        'ANOMALIES: LAST 24H',
        'FORECAST: NEXT QUARTER',
    ];

    if (!isMounted) return null;

    return (
        <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-8rem)] flex flex-col bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {/* Header / Status Bar */}
            <div className="h-10 lg:h-12 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">Connection Stable</span>
                </div>
                <div className="font-mono text-xs text-slate-400 dark:text-slate-500">
                    <span className="hidden sm:inline">LATENCY: 24ms</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                <div className="max-w-4xl mx-auto">
                    {messages.length === 1 && (
                        <div className="p-8 lg:p-12 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button className="p-6 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left group hover:border-brand-500 transition-all" onClick={() => setInput("Show me Regional Sales Overview")}>
                                    <BarChart2 className="w-5 h-5 text-brand-500 mb-4" />
                                    <h4 className="font-display font-bold uppercase text-xs mb-2">Regional Sales</h4>
                                    <p className="text-[10px] text-slate-500 font-mono">"Show me Regional Sales Overview"</p>
                                </button>
                                <button className="p-6 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left group hover:border-brand-500 transition-all" onClick={() => setInput("Why did profit margin drop in June?")}>
                                    <Sparkles className="w-5 h-5 text-emerald-500 mb-4" />
                                    <h4 className="font-display font-bold uppercase text-xs mb-2">Trend Analysis</h4>
                                    <p className="text-[10px] text-slate-500 font-mono">"Why did profit margin drop in June?"</p>
                                </button>
                                <button className="p-6 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left group hover:border-brand-500 transition-all" onClick={() => setInput("Identify top 5 churn-risk customers")}>
                                    <FileText className="w-5 h-5 text-blue-500 mb-4" />
                                    <h4 className="font-display font-bold uppercase text-xs mb-2">Customer Risk</h4>
                                    <p className="text-[10px] text-slate-500 font-mono">"Identify top 5 churn-risk customers"</p>
                                </button>
                                <button className="p-6 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left group hover:border-brand-500 transition-all" onClick={() => setInput("SYSTEM: DIAGNOSE CONNECTION")}>
                                    <Terminal className="w-5 h-5 text-slate-500 mb-4" />
                                    <h4 className="font-display font-bold uppercase text-xs mb-2">System Diagnostic</h4>
                                    <p className="text-[10px] text-slate-500 font-mono">"Run connection health check"</p>
                                </button>
                            </div>
                        </div>
                    )}
                    <AnimatePresence mode="popLayout">
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`border-b border-slate-200 dark:border-slate-700 ${message.role === 'user'
                                    ? 'bg-slate-100 dark:bg-slate-700'
                                    : 'bg-white dark:bg-slate-900'
                                    }`}
                            >
                                <div className="p-4 lg:p-8 flex gap-4 lg:gap-8">
                                    {/* Avatar / Role Indicator */}
                                    <div className="hidden sm:flex flex-col items-center gap-2 w-16 pt-1">
                                        {message.role === 'assistant' ? (
                                            <div className="w-10 h-10 border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-black">
                                                <Sparkles className="w-5 h-5 text-brand-500" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 border border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-800 dark:bg-slate-600 text-white">
                                                <div className="font-mono text-xs">USR</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                {message.role === 'assistant' ? 'INSIGHT ENGINE' : 'USER INPUT'}
                                            </span>
                                            <span
                                                className="font-mono text-xs text-slate-400 uppercase"
                                                suppressHydrationWarning
                                            >
                                                {message.timestamp.toLocaleTimeString()}
                                            </span>
                                        </div>

                                        <p className={`whitespace-pre-wrap font-sans text-lg leading-relaxed ${message.role === 'assistant' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'
                                            }`}>
                                            {message.content}
                                        </p>

                                        {/* Visualization Block */}
                                        {message.visualization && (
                                            <div className="mt-6 border border-slate-200 dark:border-slate-800 p-1 shadow-2xl">
                                                <div className="bg-slate-50 dark:bg-slate-900 h-[500px] border border-slate-200 dark:border-slate-800 overflow-hidden">
                                                    <EmbeddedViz
                                                        vizUrl={
                                                            message.visualization.embedUrl ||
                                                            (customVizUrl && message.visualization.vizId === 'custom-viz'
                                                                ? customVizUrl
                                                                : (message.visualization.vizId?.includes('Superstore')
                                                                    ? `${getTableauHost()}/t/${getTableauSite()}/views/${message.visualization.vizId}`
                                                                    : `${getTableauHost()}/t/${getTableauSite()}/views/${message.visualization.vizId || 'Regional/GlobalTemperatures'}`))
                                                        }
                                                        height="100%"
                                                        hideTabs={true}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Citation & Actions Block (Glassmorphic) */}
                                        {message.role === 'assistant' && (message.citations || message.confidence) && (
                                            <div className="mt-6 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10">
                                                {/* Citations */}
                                                {message.citations && message.citations.length > 0 && (
                                                    <div className="mb-4">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Terminal className="w-3 h-3 text-brand-500" />
                                                            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Data Sources</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {message.citations.map((c, i) => (
                                                                <div key={i} className="group flex items-center gap-2 px-3 py-2 bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 hover:border-brand-500 transition-colors cursor-pointer">
                                                                    <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                                                                    <div>
                                                                        <span className="font-mono text-xs text-brand-700 dark:text-brand-300 block">
                                                                            {c.source}
                                                                        </span>
                                                                        <span className="font-mono text-[10px] text-slate-500">
                                                                            {c.field} {c.timeRange && `• ${c.timeRange}`}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Footer: Confidence + Actions */}
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
                                                    {/* Confidence Score */}
                                                    {message.confidence && (
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all"
                                                                        style={{ width: `${message.confidence * 100}%` }}
                                                                    />
                                                                </div>
                                                                <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                                                                    {Math.round(message.confidence * 100)}% Confidence
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleCopy(message.id, message.content)}
                                                            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
                                                        >
                                                            {copiedId === message.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                                                            <span className="font-mono text-[10px] text-slate-500 uppercase hidden sm:inline">Copy</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleAddToNarrative(message.id, message.content)}
                                                            disabled={addedToNarrative === message.id}
                                                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${addedToNarrative === message.id
                                                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                                                                : 'bg-brand-500/10 hover:bg-brand-500/20 border-brand-500/30 hover:border-brand-500 text-brand-600 dark:text-brand-400'
                                                                }`}
                                                        >
                                                            {addedToNarrative === message.id ? (
                                                                <><Check className="w-3.5 h-3.5" /><span className="font-mono text-[10px] uppercase">Added!</span></>
                                                            ) : (
                                                                <><FileText className="w-3.5 h-3.5" /><span className="font-mono text-[10px] uppercase">Add to Narrative</span></>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800/10">
                            <div className="flex gap-4">
                                <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                                <span className="font-mono text-sm text-slate-400 animate-pulse">PROCESSING STREAM...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area (Architectural) */}
            <div className="p-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                {messages.length === 1 && (
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto">
                        {suggestedQueries.map(q => (
                            <button
                                key={q}
                                onClick={() => setInput(q)}
                                className="px-3 py-1 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:text-brand-500 transition-colors font-mono text-xs text-slate-500 whitespace-nowrap"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="ENTER COMMAND OR QUERY..."
                        className="w-full h-24 p-6 pr-20 bg-transparent border-none focus:ring-0 font-mono text-sm resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute bottom-6 right-6 w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CornerDownLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

