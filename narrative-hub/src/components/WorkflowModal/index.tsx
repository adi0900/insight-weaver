'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Sparkles,
    Bell,
    FileText,
    Zap,
    ArrowRight,
    CheckCircle2,
    Database,
    Loader2
} from 'lucide-react';
import { narrativesApi } from '@/services/api';

interface WorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WorkflowModal({ isOpen, onClose }: WorkflowModalProps) {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const workflowTypes = [
        {
            id: 'deep_dive',
            title: 'Deep Analysis',
            desc: 'Start a conversational investigation into a specific metric.',
            icon: Sparkles,
            color: 'text-brand-500',
            bg: 'bg-brand-500/10'
        },
        {
            id: 'inspector',
            title: 'Auto-Inspector',
            desc: 'Create a background agent to monitor for anomalies 24/7.',
            icon: Bell,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            id: 'narrative',
            title: 'Report Weaver',
            desc: 'Generate a structured board pack from multiple data sources.',
            icon: FileText,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        }
    ];

    const resetAndClose = () => {
        setStep(1);
        setSelectedType(null);
        setIsLoading(false);
        onClose();
    };

    const handleSelectType = async (id: string, title: string) => {
        setIsLoading(true);
        setSelectedType(id);

        try {
            if (id === 'narrative') {
                await narrativesApi.create({
                    title: `New Analysis: ${new Date().toLocaleDateString()}`,
                    hypothesis: 'Initial analysis environment initialized by Weaver.',
                    tags: ['workflow-generated']
                });
            }
            setStep(2);
        } catch (err) {
            console.error('[Workflow] Initialization failed:', err);
            alert('SYSTEM ERROR: Failed to initialize workflow environment.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={resetAndClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <h2 className="font-display font-bold text-xl uppercase tracking-tight">Initialize Workflow</h2>
                            </div>
                            <button onClick={resetAndClose} className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8">
                            {step === 1 ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        {workflowTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                disabled={isLoading}
                                                onClick={() => handleSelectType(type.id, type.title)}
                                                className={`group text-left p-6 border border-slate-200 dark:border-neutral-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50 dark:bg-neutral-900/50 transition-all flex items-start gap-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center ${type.bg} border border-transparent group-hover:border-brand-500/30 transition-colors`}>
                                                    {isLoading && selectedType === type.id ? (
                                                        <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
                                                    ) : (
                                                        <type.icon className={`w-6 h-6 ${type.color}`} />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-display font-bold text-lg uppercase mb-1">{type.title}</div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                                                        {type.desc}
                                                    </div>
                                                </div>
                                                {!isLoading && (
                                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="pt-4 flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest justify-center">
                                        <Database className="w-3 h-3" />
                                        System v2.0 • Data Fabric Ready
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20"
                                    >
                                        <CheckCircle2 className="w-10 h-10" />
                                    </motion.div>
                                    <h3 className="text-2xl font-display font-bold uppercase mb-2">Workflow Queued</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-light mb-8 max-w-sm mx-auto">
                                        The AI Agent has been initialized for your <strong>{workflowTypes.find(t => t.id === selectedType)?.title}</strong>.
                                        Redirecting to focus environment...
                                    </p>
                                    <button
                                        onClick={resetAndClose}
                                        className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-mono text-xs uppercase tracking-widest hover:bg-brand-500 dark:hover:bg-brand-500 transition-colors"
                                    >
                                        Proceed to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
