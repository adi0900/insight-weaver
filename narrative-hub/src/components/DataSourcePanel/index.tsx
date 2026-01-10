'use client';

import { useState, useEffect } from 'react';
import {
    Database,
    Cloud,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    Settings,
    Plus,
    Table,
    BarChart3,
    ArrowUpRight,
    Server,
    Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { dataSourcesApi } from '@/services/api';

interface DataSource {
    id: string;
    name: string;
    type: 'tableau' | 'salesforce' | 'snowflake';
    status: 'connected' | 'disconnected' | 'syncing';
    lastSync: Date;
    tables: number;
    rowCount: number;
}

export function DataSourcePanel() {
    const [dataSources, setDataSources] = useState<DataSource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDataSources = async () => {
        try {
            setIsLoading(true);
            const result = await dataSourcesApi.list();
            if (result.success) {
                const formatted = result.data.map((ds: any) => ({
                    ...ds,
                    lastSync: new Date(ds.lastSync)
                }));
                setDataSources(formatted);
            }
        } catch (err) {
            console.error('[DataSources] Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataSources();
    }, []);

    const getTypeIcon = (type: DataSource['type']) => {
        switch (type) {
            case 'tableau': return <BarChart3 className="w-5 h-5" />;
            case 'salesforce': return <Cloud className="w-5 h-5" />;
            case 'snowflake': return <Database className="w-5 h-5" />;
        }
    };

    const formatRowCount = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
        return count.toString();
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 font-mono text-sm uppercase tracking-widest text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mb-4" />
                Synchronizing Data Matrix...
            </div>
        );
    }

    return (
        <div className="space-y-4 lg:space-y-8 font-sans text-slate-900 dark:text-slate-100">
            {/* Header / Stats */}
            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 lg:gap-6">
                <div>
                    <h2 className="text-xl lg:text-3xl font-display font-bold uppercase mb-2">Data Matrix</h2>
                    <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-slate-500">
                        <span className="flex items-center gap-2">
                            <Server className="w-3 h-3" />
                            {dataSources.length} Nodes Active
                        </span>
                        <span className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
                        <span className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-3 h-3" />
                            Encryption Active
                        </span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-black dark:bg-white text-white dark:text-black font-mono text-[10px] sm:text-xs uppercase tracking-wider hover:opacity-80 transition-opacity">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Initialize Source</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                {dataSources.map((source, idx) => (
                    <motion.div
                        key={source.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white dark:bg-slate-900 p-4 lg:p-8 border border-transparent hover:border-brand-500 hover:z-10 transition-all cursor-pointer relative"
                    >
                        {/* Enhanced Status Indicator */}
                        <div className="absolute top-8 right-8 flex items-center gap-2">
                            {source.status === 'connected' && (
                                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    <span className="font-mono text-[10px] uppercase text-emerald-600 dark:text-emerald-400">Healthy</span>
                                </div>
                            )}
                            {source.status === 'syncing' && (
                                <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/30">
                                    <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                                    <span className="font-mono text-[10px] uppercase text-blue-600 dark:text-blue-400">Syncing</span>
                                </div>
                            )}
                            {source.status === 'disconnected' && (
                                <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/30">
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                    <span className="font-mono text-[10px] uppercase text-red-600 dark:text-red-400">Offline</span>
                                </div>
                            )}
                        </div>

                        {/* Icon Box */}
                        <div className={`w-12 h-12 flex items-center justify-center border border-slate-200 dark:border-slate-800 mb-6 bg-slate-50 dark:bg-slate-900 transition-colors group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20`}>
                            {getTypeIcon(source.type)}
                        </div>

                        <h3 className="text-xl font-display font-bold uppercase leading-tight mb-2 group-hover:text-brand-600 transition-colors">
                            {source.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-8">
                            <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                                {source.type}
                            </span>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <div>
                                <span className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Rows</span>
                                <span className="text-lg font-bold font-display">{formatRowCount(source.rowCount)}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Tables</span>
                                <span className="text-lg font-bold font-display">{source.tables}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Latency</span>
                                <span className="text-lg font-bold font-display text-emerald-500">12<span className="text-sm">ms</span></span>
                            </div>
                        </div>

                        {/* Last Sync with Enhanced Display */}
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <div>
                                    <span className="block text-[10px] font-mono uppercase text-slate-400">Last Sync</span>
                                    <span
                                        className="font-mono text-sm"
                                        suppressHydrationWarning
                                    >
                                        {source.lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {source.lastSync.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Add New Placeholder - Brutalist Style */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 p-8 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                    <div className="w-16 h-16 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:border-brand-500 transition-colors">
                        <Plus className="w-6 h-6 text-slate-400 group-hover:text-brand-500 transition-colors" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-500 group-hover:text-brand-600">Connect Node</span>
                </motion.div>
            </div>
        </div >
    );
}

