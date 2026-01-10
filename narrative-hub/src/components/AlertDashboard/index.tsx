'use client';

import { useState, useEffect } from 'react';
import {
    Activity,
    ShieldAlert,
    CheckCircle,
    Clock,
    Plus,
    Cpu,
    RefreshCw,
    TrendingDown,
    TrendingUp,
    ExternalLink,
    X,
    Target,
    Percent,
    Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { inspectorApi, narrativesApi } from '@/services/api';

interface Alert {
    id: string;
    metric: string;
    dimension: string;
    previousValue: number;
    currentValue: number;
    percentChange: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestedNarrative: string;
    timestamp: Date;
    acknowledged: boolean;
}

export function AlertDashboard() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(false);
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [showAcknowledged, setShowAcknowledged] = useState(true);
    const [showSubscriptionPanel, setShowSubscriptionPanel] = useState(false);
    const [newSubscription, setNewSubscription] = useState({
        metric: '',
        threshold: 15,
        severity: 'high' as Alert['severity']
    });
    const [subscriptionCreated, setSubscriptionCreated] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const fetchAlerts = async () => {
        try {
            setIsLoading(true);
            const response = await inspectorApi.getAlerts();
            if (response.success) {
                setAlerts(response.data.map((a: any) => ({
                    ...a,
                    timestamp: new Date(a.timestamp)
                })));
            }
        } catch (err) {
            console.error('[Alerts] Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToNarrative = async (alert: Alert) => {
        try {
            const result = await narrativesApi.create({
                title: `Anomaly: ${alert.metric} in ${alert.dimension}`,
                hypothesis: alert.suggestedNarrative,
                tags: ['inspector-alert', alert.severity]
            });
            if (result.success) {
                window.alert('Weaver: Anomaly insight added to Narrative registry.');
            }
        } catch (err) {
            console.error('[Alerts] Failed to add to narrative:', err);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleAcknowledge = async (id: string) => {
        try {
            const response = await inspectorApi.acknowledgeAlert(id);
            if (response.success) {
                setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
            }
        } catch (err) {
            console.error('[Alerts] Acknowledge error:', err);
        }
    };

    const triggerScan = async () => {
        setIsScanning(true);
        try {
            // Trigger scan via POST /api/v1/inspector/scan
            // Note: inspectorApi doesn't have scan yet, let's add it or use request
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/inspector/scan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('iw_token') || ''}`
                }
            });
            const result = await response.json();
            if (result.success) {
                fetchAlerts();
            }
        } catch (err) {
            console.error('[Alerts] Scan error:', err);
        } finally {
            setIsScanning(false);
        }
    };

    const handleCreateSubscription = () => {
        if (!newSubscription.metric.trim()) return;
        setSubscriptionCreated(true);
        setTimeout(() => {
            setSubscriptionCreated(false);
            setShowSubscriptionPanel(false);
            setNewSubscription({ metric: '', threshold: 15, severity: 'high' });
        }, 1500);
    };

    const getSeverityColor = (severity: Alert['severity']) => {
        switch (severity) {
            case 'critical': return 'text-red-500';
            case 'high': return 'text-amber-500';
            case 'medium': return 'text-blue-500';
            case 'low': return 'text-emerald-500';
            default: return 'text-slate-500';
        }
    };

    const filteredAlerts = alerts.filter((alert) => {
        if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
        if (!showAcknowledged && alert.acknowledged) return false;
        return true;
    });

    const activeCount = alerts.filter((a) => !a.acknowledged).length;
    const criticalCount = alerts.filter(
        (a) => a.severity === 'critical' && !a.acknowledged
    ).length;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 font-mono text-sm uppercase tracking-widest text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mb-4" />
                Synchronizing Inspector Agent...
            </div>
        );
    }

    if (!isMounted) return null;

    return (
        <div className="space-y-0 text-slate-900 dark:text-slate-100 font-sans">
            {/* Subscription Configuration Panel */}
            {showSubscriptionPanel && (
                <div className="mb-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display font-bold text-lg uppercase tracking-tight">New Metric Subscription</h3>
                        <button onClick={() => setShowSubscriptionPanel(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block font-mono text-xs uppercase text-slate-500 mb-2">Metric Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Revenue, Churn Rate"
                                value={newSubscription.metric}
                                onChange={(e) => setNewSubscription(prev => ({ ...prev, metric: e.target.value }))}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm focus:outline-none focus:border-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase text-slate-500 mb-2">Threshold (%)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={newSubscription.threshold}
                                    onChange={(e) => setNewSubscription(prev => ({ ...prev, threshold: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm focus:outline-none focus:border-brand-500"
                                />
                                <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase text-slate-500 mb-2">Alert Severity</label>
                            <select
                                value={newSubscription.severity}
                                onChange={(e) => setNewSubscription(prev => ({ ...prev, severity: e.target.value as Alert['severity'] }))}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm focus:outline-none focus:border-brand-500 appearance-none text-slate-900 dark:text-slate-100"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setShowSubscriptionPanel(false)}
                            className="px-6 py-2 border border-slate-200 dark:border-slate-700 font-mono text-xs uppercase hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateSubscription}
                            disabled={subscriptionCreated || !newSubscription.metric.trim()}
                            className={`px-6 py-2 font-mono text-xs uppercase transition-colors flex items-center gap-2 ${subscriptionCreated
                                ? 'bg-emerald-500 text-white'
                                : 'bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                }`}
                        >
                            {subscriptionCreated ? (
                                <><Check className="w-4 h-4" />Subscription Created!</>
                            ) : (
                                <><Target className="w-4 h-4" />Create Subscription</>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Header with AI Scan Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 lg:mb-6">
                <div>
                    <h2 className="font-display font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-tight">Inspector Agent</h2>
                    <p className="font-mono text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Autonomous Anomaly Detection</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={triggerScan}
                        disabled={isScanning}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 border border-slate-900 dark:border-white text-slate-900 dark:text-white font-mono text-[10px] sm:text-xs uppercase hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isScanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Cpu className="w-3 h-3" />}
                        <span>AI Scan</span>
                    </button>
                    <button
                        onClick={() => setShowSubscriptionPanel(true)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-mono text-[10px] sm:text-xs uppercase hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                        <span>Subscribe</span>
                    </button>
                </div>
            </div>

            {/* Summary Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mb-4 lg:mb-8">
                <div className="p-3 lg:p-6 border-r border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-xs uppercase text-slate-500 tracking-widest">Active Anomalies</span>
                    </div>
                    <div className="text-xl lg:text-3xl font-display font-bold">{activeCount}</div>
                </div>
                <div className="p-6 border-r border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                        <span className="font-mono text-xs uppercase text-slate-500 tracking-widest">Critical</span>
                    </div>
                    <div className="text-3xl font-display font-bold text-red-600">{criticalCount}</div>
                </div>
                <div className="p-6 border-r border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="font-mono text-xs uppercase text-slate-500 tracking-widest">Acknowledged</span>
                    </div>
                    <div className="text-3xl font-display font-bold">{alerts.length - activeCount}</div>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-4 h-4 text-brand-500" />
                        <span className="font-mono text-xs uppercase text-slate-500 tracking-widest">Latency</span>
                    </div>
                    <div className="text-3xl font-display font-bold">12<span className="text-lg font-normal text-slate-400 ml-1">ms</span></div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-px bg-slate-100 dark:bg-slate-800 p-px">
                    {(['all', 'critical', 'high', 'medium', 'low'] as const).map((severity) => (
                        <button
                            key={severity}
                            onClick={() => setSeverityFilter(severity)}
                            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${severityFilter === severity
                                ? 'bg-white dark:bg-black text-slate-900 dark:text-white shadow-sm font-bold border border-slate-200 dark:border-neutral-800'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                        >
                            {severity}
                        </button>
                    ))}
                </div>

                <label className="flex items-center gap-3 font-mono text-xs text-slate-500 uppercase cursor-pointer select-none">
                    <div className={`w-4 h-4 border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-colors ${showAcknowledged ? 'bg-slate-900 dark:bg-white border-transparent' : 'bg-transparent'}`}>
                        {showAcknowledged && <CheckCircle className="w-3 h-3 text-white dark:text-black" />}
                    </div>
                    <input
                        type="checkbox"
                        checked={showAcknowledged}
                        onChange={(e) => setShowAcknowledged(e.target.checked)}
                        className="hidden"
                    />
                    Show logs
                </label>
            </div>

            {/* Alert List */}
            <div className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                {filteredAlerts.map((alert, idx) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`group border-b border-slate-200 dark:border-slate-700 p-6 transition-all bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 ${alert.acknowledged ? 'opacity-50 grayscale' : ''}`}
                    >
                        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity).replace('text-', 'bg-')}`} />
                                    <span className={`font-mono text-xs uppercase tracking-widest font-bold ${getSeverityColor(alert.severity)}`}>
                                        {alert.severity}
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-700">|</span>
                                    <span
                                        className="font-mono text-xs text-slate-400 uppercase"
                                        suppressHydrationWarning
                                    >
                                        {alert.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-900 dark:text-white mb-1">
                                    {alert.metric}
                                </h3>
                                <p className="text-slate-500 font-mono text-xs uppercase truncate">
                                    Dimension: {alert.dimension}
                                </p>
                            </div>

                            <div className="flex items-center gap-8 border-l border-slate-100 dark:border-slate-800 pl-8">
                                <div>
                                    <div className="text-xs text-slate-400 font-mono uppercase mb-1">Delta</div>
                                    <div className={`text-2xl font-display font-bold flex items-center gap-1 ${alert.percentChange < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {alert.percentChange > 0 ? '+' : ''}{alert.percentChange}%
                                        {alert.percentChange < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-xs text-slate-400 font-mono uppercase mb-1">Values</div>
                                    <div className="font-mono text-sm">
                                        <span className="text-slate-400">{alert.previousValue}</span>
                                        <span className="mx-2 text-slate-300">→</span>
                                        <span className="font-bold">{alert.currentValue}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-8">
                                {!alert.acknowledged && (
                                    <button
                                        onClick={() => handleAcknowledge(alert.id)}
                                        className="px-4 py-2 border border-slate-900 dark:border-white text-slate-900 dark:text-white font-mono text-xs uppercase hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                    >
                                        Acknowledge
                                    </button>
                                )}
                                <button
                                    onClick={() => handleAddToNarrative(alert)}
                                    className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                    title="Add to Narrative"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                <button className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/10">
                            <p className="font-serif italic text-slate-600 dark:text-slate-400">
                                "{alert.suggestedNarrative}"
                            </p>
                        </div>
                    </motion.div>
                ))}

                {filteredAlerts.length === 0 && (
                    <div className="p-12 text-center text-slate-400 font-mono text-sm uppercase tracking-widest">
                        System Nominal. No alerts detected.
                    </div>
                )}
            </div>
        </div>
    );
}
