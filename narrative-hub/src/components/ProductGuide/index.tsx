'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageSquare, Bell, Database, FileText, ArrowRight, Zap } from 'lucide-react';

interface ProductGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProductGuide({ isOpen, onClose }: ProductGuideProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col lg:flex-row"
                    >
                        {/* Sidebar/Accents */}
                        <div className="lg:w-1/3 bg-black p-8 text-white flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-white text-black flex items-center justify-center transform rotate-45">
                                        <Sparkles className="w-4 h-4 -rotate-45" />
                                    </div>
                                    <span className="font-display font-bold text-lg uppercase tracking-tighter">Insight Weaver</span>
                                </div>
                                <h2 className="text-3xl font-display font-bold leading-tight uppercase mb-4">The AI<br />Librarian</h2>
                                <p className="text-slate-400 font-mono text-xs leading-relaxed uppercase tracking-wider">
                                    Combatting dashboard fatigue by transforming passive data into active narratives.
                                </p>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="p-4 border border-white/10 bg-white/5 font-mono text-[10px] uppercase">
                                    <Zap className="w-3 h-3 text-brand-500 mb-2" />
                                    Current Status: ONLINE
                                    <br />
                                    Modules Active: 4/4
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 lg:p-12 overflow-y-auto max-h-[80vh]">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="space-y-12">
                                {/* Concierge */}
                                <section className="flex gap-6">
                                    <div className="w-12 h-12 shrink-0 bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-brand-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-display font-bold uppercase mb-2">1. The Concierge</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                            Your primary interface. Ask questions in plain English—like "Why did revenue drop in District 7?"—and get AI-interpreted Tableau visualizations instantly.
                                        </p>
                                        <div className="font-mono text-[10px] text-slate-400 uppercase">Try: "Show me Regional Sales Overview"</div>
                                    </div>
                                </section>

                                {/* Inspector */}
                                <section className="flex gap-6">
                                    <div className="w-12 h-12 shrink-0 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                        <Bell className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-display font-bold uppercase mb-2">2. The Inspector (Alerts)</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                            Proactive monitoring. The Inspector watches your Tableau Pulse metrics 24/7. When an anomaly is detected, it generates a narrative alert before you even check the dashboard.
                                        </p>
                                    </div>
                                </section>

                                {/* Narratives */}
                                <section className="flex gap-6">
                                    <div className="w-12 h-12 shrink-0 bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-display font-bold uppercase mb-2">3. Narratives Hub</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                            A library of persistent data stories. Every investigation is saved as a "Narrative," allowing team collaboration, revision history, and high-fidelity PDF/Markdown exports.
                                        </p>
                                    </div>
                                </section>

                                {/* Data Matrix */}
                                <section className="flex gap-6">
                                    <div className="w-12 h-12 shrink-0 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                                        <Database className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-display font-bold uppercase mb-2">4. Data Matrix</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                            Monitor your infrastructure. Real-time health status of your Tableau Cloud, Salesforce Data Cloud, and Snowflake connections.
                                        </p>
                                    </div>
                                </section>

                                <button
                                    onClick={onClose}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-black dark:bg-white text-white dark:text-black font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
                                >
                                    Initialize Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
