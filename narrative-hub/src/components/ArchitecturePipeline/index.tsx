'use client';

import { motion } from 'framer-motion';
import { Database, Zap, FileText, ArrowRight, Layers, Cpu, MessageSquare, Box } from 'lucide-react';
import { useState } from 'react';

const steps = [
    {
        id: '01',
        title: 'INGEST',
        description: 'Multi-source data synchronization via secure connectors.',
        icon: Database,
        detail: '50+ SOURCES',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: '02',
        title: 'REASON',
        description: 'Anomaly detection and pattern recognition engine.',
        icon: Cpu,
        detail: 'NEURAL CORE',
        color: 'from-brand-500 to-amber-500'
    },
    {
        id: '03',
        title: 'NARRATE',
        description: 'Context-aware prose generation with citation chains.',
        icon: MessageSquare,
        detail: 'NLP & LLM',
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: '04',
        title: 'ACT',
        description: 'Automated distribution to Slack, Email, and PDF.',
        icon: ArrowRight,
        detail: 'WEBHOOKS',
        color: 'from-emerald-500 to-green-500'
    }
];

export default function ArchitecturePipeline() {
    const [activeStep, setActiveStep] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 border border-white/10 bg-slate-950/50 backdrop-blur-md">
            {steps.map((step, i) => (
                <div
                    key={step.id}
                    className="group relative p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 last:border-r-0 hover:bg-white/[0.02] transition-colors"
                    onMouseEnter={() => setActiveStep(i)}
                    onMouseLeave={() => setActiveStep(null)}
                >
                    {/* Background Gradient on Hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${step.color} transition-opacity duration-500`} />

                    {/* Top Bar (Brutalist ID) */}
                    <div className="flex justify-between items-start mb-12">
                        <div className="font-mono text-xs text-slate-500 border border-white/10 px-2 py-1">
                            STEP_{step.id}
                        </div>
                        <step.icon className={`w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-300`} />
                    </div>

                    {/* Central Visual (Animated on Hover) */}
                    <div className="h-24 mb-12 flex items-center justify-center relative overflow-hidden">
                        {/* Static State */}
                        <div className="w-16 h-16 border border-white/10 rotate-45 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center">
                            <div className="w-8 h-8 bg-white/5" />
                        </div>

                        {/* Active State Details (Particles/Glow) */}
                        {i === 0 && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <div className="absolute w-20 h-px bg-cyan-500 rotate-90" />
                                <div className="absolute w-20 h-px bg-cyan-500" />
                            </motion.div>
                        )}
                        {i === 1 && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            >
                                <div className="w-20 h-20 border border-dashed border-brand-500 rounded-full" />
                            </motion.div>
                        )}
                        {i === 2 && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <motion.div
                                    className="w-full text-[8px] font-mono text-pink-500 text-center leading-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    GENERATING...<br />ANALYZING...<br />SYNTHESIZING...
                                </motion.div>
                            </motion.div>
                        )}
                        {i === 3 && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <div className="w-0 h-0 border-l-[10px] border-l-emerald-500 border-y-[6px] border-y-transparent pl-1" />
                            </motion.div>
                        )}
                    </div>

                    {/* Content */}
                    <div>
                        <div className="font-mono text-[10px] text-brand-500 uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                            {step.detail}
                        </div>
                        <h3 className="text-3xl font-display font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-[200px]">{step.description}</p>
                    </div>

                    {/* Connecting Pipes (Desktop) */}
                    {i < 3 && (
                        <div className="hidden lg:block absolute top-[60%] -right-[1px] w-[2px] h-8 bg-white/10 z-10">
                            <motion.div
                                className="w-full bg-white h-full origin-top"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: activeStep === i ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    )}

                    {/* Bottom Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                </div>
            ))}
        </div>
    );
}
