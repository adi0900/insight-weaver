'use client';

import { useState, useEffect } from 'react';
import {
    FileText,
    Clock,
    User,
    ChevronRight,
    Edit3,
    Download,
    MoreHorizontal,
    Tag,
    Eye,
    GitCommit,
    ArrowRight,
    FileDown,
    FileCode,
    History,
    Users,
    Check,
    RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { narrativesApi } from '@/services/api';
import { getApiBaseUrl } from '@/utils/env';

interface Revision {
    id: string;
    hypothesis: string;
    confidence: number;
    authorId: string;
    timestamp: Date;
}

interface Narrative {
    id: string;
    title: string;
    status: 'draft' | 'review' | 'published';
    createdAt: Date;
    updatedAt: Date;
    revisions: Revision[];
    tags: string[];
    collaborators: string[];
}

export function NarrativeTimeline() {
    const [narratives, setNarratives] = useState<Narrative[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNarrative, setSelectedNarrative] = useState<Narrative | null>(null);
    const [filter, setFilter] = useState<'all' | 'draft' | 'review' | 'published'>('all');
    const [exportingPDF, setExportingPDF] = useState(false);
    const [exportingMD, setExportingMD] = useState(false);

    const fetchNarratives = async () => {
        try {
            setIsLoading(true);
            const response = await narrativesApi.list();
            if (response.success) {
                const formatted = response.data.map((n: any) => ({
                    ...n,
                    createdAt: new Date(n.createdAt),
                    updatedAt: new Date(n.updatedAt),
                    revisions: n.revisions.map((r: any) => ({
                        ...r,
                        timestamp: new Date(r.timestamp)
                    }))
                }));
                setNarratives(formatted);
            }
        } catch (err) {
            console.error('[Narratives] Fetch failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNarratives();
    }, []);

    const handleExportPDF = async () => {
        if (!selectedNarrative) return;
        setExportingPDF(true);
        try {
            const apiUrl = getApiBaseUrl();
            window.location.href = `${apiUrl}/api/v1/narratives/${selectedNarrative.id}/download?format=pdf`;

            // Wait a bit to show success state
            setTimeout(() => setExportingPDF(false), 2000);
        } catch (err) {
            console.error('[Export] PDF failed:', err);
            setExportingPDF(false);
        }
    };

    const handleExportMD = async () => {
        if (!selectedNarrative) return;
        setExportingMD(true);
        try {
            const apiUrl = getApiBaseUrl();
            window.location.href = `${apiUrl}/api/v1/narratives/${selectedNarrative.id}/download?format=markdown`;

            setTimeout(() => setExportingMD(false), 2000);
        } catch (err) {
            console.error('[Export] MD failed:', err);
            setExportingMD(false);
        }
    };

    const filteredNarratives = narratives.filter(
        (n) => filter === 'all' || n.status === filter
    );

    const getStatusIndicator = (status: Narrative['status']) => {
        switch (status) {
            case 'draft':
                return <span className="font-mono text-xs uppercase text-slate-400 tracking-wider">Draft</span>;
            case 'review':
                return <span className="font-mono text-xs uppercase text-amber-500 tracking-wider">In Review</span>;
            case 'published':
                return <span className="font-mono text-xs uppercase text-green-500 tracking-wider">Published</span>;
        }
    };

    if (isLoading && narratives.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full font-mono text-sm uppercase tracking-widest text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mb-4" />
                Synchronizing Narrative Hub...
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] lg:h-[calc(100vh-10rem)] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {/* Narrative List - "Log View" */}
            <div className={`flex-1 flex flex-col ${selectedNarrative ? 'hidden lg:flex lg:w-1/2 lg:border-r border-slate-200 dark:border-slate-700' : 'w-full'}`}>
                {/* Toolbar */}
                <div className="h-12 lg:h-14 flex items-center gap-2 sm:gap-4 px-4 lg:px-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-x-auto">
                    <span className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase shrink-0">Filter:</span>
                    {(['all', 'draft', 'review', 'published'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-2 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-colors shrink-0 ${filter === status
                                ? 'text-brand-600 dark:text-brand-400 font-bold decoration-brand-500 underline underline-offset-4'
                                : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
                    {filteredNarratives.map((narrative, idx) => (
                        <div
                            key={narrative.id}
                            onClick={() => setSelectedNarrative(narrative)}
                            className={`group cursor-pointer border-b border-slate-100 dark:border-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedNarrative?.id === narrative.id ? 'bg-slate-100 dark:bg-slate-800' : ''
                                }`}
                        >
                            <div className="p-6 flex gap-4">
                                <div className="flex flex-col items-center gap-2 pt-1">
                                    <div className={`w-2 h-2 rounded-full ${selectedNarrative?.id === narrative.id ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                    <div className="w-px h-full bg-slate-200 dark:bg-slate-800 group-last:hidden" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-mono text-[10px] text-slate-400 uppercase">
                                            ID: {narrative.id.padStart(4, '0')}
                                        </div>
                                        {getStatusIndicator(narrative.status)}
                                    </div>

                                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 transition-colors">
                                        {narrative.title}
                                    </h3>

                                    {narrative.revisions[0] && (
                                        <p className="font-serif italic text-slate-500 text-sm mb-4 line-clamp-2">
                                            "{narrative.revisions[0].hypothesis}"
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-slate-400" />
                                            <span className="font-mono text-[10px] text-slate-400 uppercase">
                                                {narrative.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <GitCommit className="w-3 h-3 text-slate-400" />
                                            <span className="font-mono text-[10px] text-slate-400 uppercase">
                                                {narrative.revisions.length} Revisions
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${selectedNarrative?.id === narrative.id ? 'translate-x-1 text-brand-500' : ''}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Panel - "Inspector View" */}
            <AnimatePresence>
                {selectedNarrative && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: '50%' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="hidden lg:flex flex-col bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700"
                    >
                        {/* Header */}
                        <div className="h-14 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                            <span className="font-mono text-xs uppercase tracking-widest text-slate-500">NARRATIVE_DETAILS</span>
                            <div className="flex gap-1">
                                {/* Export Buttons */}
                                <button
                                    onClick={handleExportPDF}
                                    disabled={exportingPDF}
                                    className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${exportingPDF
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                        }`}
                                    title="Export as PDF"
                                >
                                    {exportingPDF ? <Check className="w-4 h-4 text-emerald-500" /> : <FileDown className="w-4 h-4 text-slate-500" />}
                                    <span className="font-mono text-[10px] uppercase">{exportingPDF ? 'Exported!' : 'PDF'}</span>
                                </button>
                                <button
                                    onClick={handleExportMD}
                                    disabled={exportingMD}
                                    className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${exportingMD
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                        }`}
                                    title="Export as Markdown"
                                >
                                    {exportingMD ? <Check className="w-4 h-4 text-emerald-500" /> : <FileCode className="w-4 h-4 text-slate-500" />}
                                    <span className="font-mono text-[10px] uppercase">{exportingMD ? 'Exported!' : 'MD'}</span>
                                </button>
                                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Edit">
                                    <Edit3 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 border border-slate-200 dark:border-slate-700 font-mono text-xs uppercase tracking-wider">
                                    {selectedNarrative.status}
                                </span>
                                <span className="font-mono text-xs text-slate-400">
                                    Last updated {selectedNarrative.updatedAt.toLocaleDateString()}
                                </span>
                            </div>

                            <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                                {selectedNarrative.title}
                            </h2>

                            <div className="mb-12">
                                <h4 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                                    Active Hypothesis
                                </h4>
                                <div className="bg-white dark:bg-black p-6 border border-slate-200 dark:border-slate-800 relative">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-500" />
                                    <p className="font-serif text-xl italic text-slate-700 dark:text-slate-300 leading-relaxed">
                                        "{selectedNarrative.revisions[0]?.hypothesis || 'No hypothesis set.'}"
                                    </p>
                                    {selectedNarrative.revisions[0]?.confidence && (
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full"
                                                    style={{ width: `${selectedNarrative.revisions[0].confidence * 100}%` }}
                                                />
                                            </div>
                                            <span className="font-mono text-xs text-slate-500">
                                                {Math.round(selectedNarrative.revisions[0].confidence * 100)}% Confidence
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Revision History */}
                            {selectedNarrative.revisions.length > 0 && (
                                <div className="mb-12">
                                    <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                                        <History className="w-3 h-3" />
                                        Revision History ({selectedNarrative.revisions.length})
                                    </h4>
                                    <div className="space-y-0 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
                                        {selectedNarrative.revisions.map((rev, idx) => (
                                            <div key={rev.id} className="relative pl-6 pb-6 last:pb-0">
                                                {/* Timeline Dot */}
                                                <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${idx === 0 ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`} />

                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                                                        {rev.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    {idx === 0 && (
                                                        <span className="px-2 py-0.5 bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-400 font-mono text-[10px] uppercase">Current</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                                    "{rev.hypothesis}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-12">
                                <h4 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                                    Metadata
                                </h4>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <span className="block text-xs font-mono text-slate-500 mb-1">TAGS</span>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedNarrative.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-[10px] uppercase font-bold tracking-wide">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-mono text-slate-500 mb-1">TEAM</span>
                                        <div className="flex gap-2">
                                            {selectedNarrative.collaborators.map(c => (
                                                <div key={c} className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                                    <span className="font-mono text-xs">{c[0].toUpperCase()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-mono text-xs uppercase tracking-wider hover:opacity-90 transition-opacity">
                                    Open Full Report <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

