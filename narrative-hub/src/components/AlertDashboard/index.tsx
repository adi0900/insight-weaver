'use client';

import { useState } from 'react';
import {
    Bell,
    AlertTriangle,
    TrendingDown,
    TrendingUp,
    CheckCircle,
    XCircle,
    ExternalLink,
    Filter,
    Clock,
    Activity,
    ShieldAlert,
    Plus,
    X,
    Target,
    Percent,
    Check
} from 'lucide-react';
import { motion } from 'framer-motion';

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

const mockAlerts: Alert[] = [
    {
        id: '1',
        metric: 'SDG 11 Progress Score',
        dimension: 'District 7',
        previousValue: 72,
        currentValue: 58,
        percentChange: -19.4,
        severity: 'critical',
        suggestedNarrative:
            'SDG 11 progress in District 7 declined significantly. Initial analysis suggests infrastructure project delays may be the primary factor.',
        timestamp: new Date('2026-01-07T10:30:00'),
        acknowledged: false,
    },
    {
        id: '2',
        metric: 'Customer Satisfaction',
        dimension: 'Enterprise Segment',
        previousValue: 4.2,
        currentValue: 3.8,
        percentChange: -9.5,
        severity: 'high',
        suggestedNarrative:
            'Enterprise customer satisfaction dropped. Correlating with increased support ticket volume over the past 2 weeks.',
        timestamp: new Date('2026-01-07T09:15:00'),
        acknowledged: false,
    },
    {
        id: '3',
        metric: 'Pipeline Value',
        dimension: 'North Region',
        previousValue: 1200000,
        currentValue: 1450000,
        percentChange: 20.8,
        severity: 'low',
        suggestedNarrative:
            'Pipeline value in North Region increased significantly. New enterprise deals in Q1 contributing to the growth.',
        timestamp: new Date('2026-01-07T08:00:00'),
        acknowledged: true,
    },
    {
        id: '4',
        metric: 'Website Conversion Rate',
        dimension: 'Mobile',
        previousValue: 3.2,
        currentValue: 2.4,
        percentChange: -25.0,
        severity: 'high',
        suggestedNarrative:
            'Mobile conversion rate dropped by 25%. Recent app update may have introduced UX issues.',
        timestamp: new Date('2026-01-06T16:45:00'),
        acknowledged: true,
    },
];

export function AlertDashboard() {
    const [alerts, setAlerts] = useState(mockAlerts);
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [showAcknowledged, setShowAcknowledged] = useState(true);
    const [showSubscriptionPanel, setShowSubscriptionPanel] = useState(false);
    const [newSubscription, setNewSubscription] = useState({
        metric: '',
        threshold: 15,
        severity: 'high' as Alert['severity']
    });
    const [subscriptionCreated, setSubscriptionCreated] = useState(false);

    const handleCreateSubscription = () => {
        if (!newSubscription.metric.trim()) return;
        // Simulate API call
        console.log('Creating subscription:', newSubscription);
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
        }
    };

    const handleAcknowledge = (id: string) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === id ? { ...alert, acknowledged: true } : alert
            )
        );
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
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm focus:outline-none focus:border-brand-500 appearance-none"
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

            {/* Header with New Subscription Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 lg:mb-6">
                <h2 className="font-display font-bold text-lg sm:text-xl lg:text-2xl uppercase tracking-tight">Inspector Agent</h2>
                <button
                    onClick={() => setShowSubscriptionPanel(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-mono text-[10px] sm:text-xs uppercase hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white transition-colors"
                >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">New Subscription</span>
                    <span className="sm:hidden">Subscribe</span>
                </button>
            </div>

            {/* Summary Stats Bar - Architectural */}
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

            {/* Alert Grid/Table */}
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
                            {/* Left: Metric Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity).replace('text-', 'bg-')}`} />
                                    <span className={`font-mono text-xs uppercase tracking-widest font-bold ${getSeverityColor(alert.severity)}`}>
                                        {alert.severity}
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-700">|</span>
                                    <span className="font-mono text-xs text-slate-400 uppercase">
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

                            {/* Center: Value Change */}
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

                            {/* Right: Actions */}
                            <div className="flex items-center gap-4 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-8">
                                {!alert.acknowledged && (
                                    <button
                                        onClick={() => handleAcknowledge(alert.id)}
                                        className="btn-secondary px-4 py-2 text-xs font-mono uppercase"
                                    >
                                        Acknowledge
                                    </button>
                                )}
                                <button className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Narrative Expansion (Optional) */}
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
