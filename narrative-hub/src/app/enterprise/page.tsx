'use client';

import Link from 'next/link';
import {
    Sparkles,
    Shield,
    Server,
    Lock,
    ArrowRight,
    Check,
    Cloud,
    Database,
    Zap,
    Globe,
    Key,
    FileCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const techStack = [
    { layer: 'Frontend', tech: 'React 18, TypeScript, Tailwind CSS', rationale: 'Fast iteration, component reusability' },
    { layer: 'Backend', tech: 'Node.js, Express', rationale: 'JavaScript consistency, ecosystem maturity' },
    { layer: 'Database', tech: 'Salesforce Data Cloud, Tableau Hyper', rationale: 'Native Salesforce integration, live analytics' },
    { layer: 'AI/ML', tech: 'Tableau Next Agents, Einstein Trust Layer', rationale: 'Enterprise-grade, pre-built safety guardrails' },
    { layer: 'Auth', tech: 'OAuth 2.0, Tableau Connected Apps', rationale: 'Standard enterprise authentication' },
    { layer: 'Exports', tech: 'PDFKit, Marked', rationale: 'Lightweight, proven libraries' }
];

const securityFeatures = [
    { icon: Shield, title: 'Einstein Trust Layer', desc: 'Every AI-generated insight is grounded with full provenance chains.' },
    { icon: Lock, title: 'OAuth 2.0', desc: 'Enterprise-grade authentication via Tableau Connected Apps.' },
    { icon: Key, title: 'Credential Security', desc: 'All secrets stored securely with environment-level encryption.' },
    { icon: FileCheck, title: 'Audit Trails', desc: 'Complete logging of all data access and narrative modifications.' }
];

const integrations = [
    { name: 'Tableau Cloud', desc: 'Native API integration for data connectivity and embedding', icon: Database },
    { name: 'Salesforce Data Cloud', desc: 'Semantic layer connection for enterprise data', icon: Cloud },
    { name: 'Slack', desc: 'Webhook notifications for alerts and updates', icon: Zap },
    { name: 'Snowflake', desc: 'Connect via Tableau Bridge for warehouse access', icon: Server }
];

export default function EnterprisePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-[1400px] mx-auto h-16 lg:h-24 flex items-stretch">
                    <div className="flex items-center px-4 lg:px-8 border-r border-slate-200 dark:border-slate-800">
                        <Link href="/" className="flex items-center gap-2 lg:gap-3">
                            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-brand-500 text-white flex items-center justify-center transform rotate-45">
                                <div className="transform -rotate-45">
                                    <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                </div>
                            </div>
                            <span className="font-display font-bold text-base lg:text-xl tracking-tighter uppercase">
                                Insight<span className="hidden lg:inline"><br /></span><span className="lg:hidden"> </span>Weaver
                            </span>
                        </Link>
                    </div>
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-12">
                        {[
                            { name: 'Product', href: '/product' },
                            { name: 'Solutions', href: '/solutions' },
                            { name: 'Enterprise', href: '/enterprise' },
                            { name: 'Journal', href: '/journal' }
                        ].map((item) => (
                            <Link key={item.name} href={item.href} className="group relative h-full flex items-center px-4">
                                <span className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors ${item.name === 'Enterprise' ? 'text-brand-500' : 'text-slate-500 group-hover:text-brand-500'}`}>
                                    {item.name}
                                </span>
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 transition-transform duration-300 ${item.name === 'Enterprise' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-px bg-slate-200 dark:bg-slate-800 pl-px border-l border-slate-200 dark:border-slate-800 ml-auto">
                        <Link href="/dashboard" className="h-full flex items-center px-6 lg:px-10 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 font-display font-bold text-sm lg:text-base uppercase tracking-wider hover:bg-brand-500 transition-colors">
                            Start
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 lg:pt-48 pb-16 lg:pb-24 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 bg-brand-500 rounded-full" />
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Enterprise Grade</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] mb-8">
                            Built for<br />Scale &<br />
                            <span className="text-brand-500">Security</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                            Enterprise architecture with full audit trails, secure credential management,
                            and native integrations with your existing Salesforce ecosystem.
                        </p>
                    </div>
                </div>
            </section>

            {/* Architecture Diagram */}
            <section className="py-16 lg:py-24 bg-slate-950 text-white">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Server className="w-5 h-5 text-brand-500" />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">System Architecture</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-8">
                        {['INGEST', 'REASON', 'NARRATE', 'ACT'].map((stage, idx) => (
                            <motion.div
                                key={stage}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-4 lg:p-6 bg-white/5 border border-white/10 text-center"
                            >
                                <span className="font-mono text-[10px] text-slate-500 block mb-2">0{idx + 1}</span>
                                <span className="font-display font-bold text-sm lg:text-lg uppercase">{stage}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-6 bg-brand-500/20 border border-brand-500/30 text-center">
                        <Globe className="w-6 h-6 text-brand-400 mx-auto mb-2" />
                        <span className="font-display font-bold uppercase">Einstein Trust Layer</span>
                        <p className="font-mono text-xs text-slate-400 mt-1">Grounding, Citations, Audit Trail</p>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Database className="w-5 h-5 text-brand-500" />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Technology Stack</span>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                            <div className="p-4 font-mono text-xs uppercase text-slate-500 border-r border-slate-200 dark:border-slate-800">Layer</div>
                            <div className="p-4 font-mono text-xs uppercase text-slate-500 border-r border-slate-200 dark:border-slate-800">Technology</div>
                            <div className="p-4 font-mono text-xs uppercase text-slate-500">Rationale</div>
                        </div>
                        {techStack.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                                <div className="p-4 font-display font-bold uppercase border-r border-slate-200 dark:border-slate-800">{row.layer}</div>
                                <div className="p-4 font-mono text-sm border-r border-slate-200 dark:border-slate-800">{row.tech}</div>
                                <div className="p-4 text-slate-600 dark:text-slate-400 text-sm">{row.rationale}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security */}
            <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Shield className="w-5 h-5 text-brand-500" />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Security & Compliance</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {securityFeatures.map((feat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                            >
                                <feat.icon className="w-8 h-8 text-brand-500 mb-4" />
                                <h4 className="font-display font-bold uppercase mb-2">{feat.title}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integrations */}
            <section className="py-16 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Zap className="w-5 h-5 text-brand-500" />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Native Integrations</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-slate-200 dark:border-slate-800">
                        {integrations.map((int, idx) => (
                            <div key={idx} className="p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 last:border-r-0 last:border-b-0">
                                <int.icon className="w-6 h-6 text-slate-400 mb-4" />
                                <h4 className="font-display font-bold uppercase mb-2">{int.name}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{int.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 lg:py-24 bg-slate-950 text-white">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-5xl font-display font-bold uppercase tracking-tighter mb-6">
                        Enterprise Ready
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Deploy Insight Weaver in your environment with full security controls and compliance documentation.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-500 text-white font-display font-bold uppercase tracking-wider hover:bg-brand-600 transition-colors"
                    >
                        Request Demo
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-400 uppercase">© 2026 Insight Weaver</span>
                    <div className="flex items-center gap-6">
                        <Link href="/product" className="font-mono text-xs text-slate-500 hover:text-brand-500 uppercase">Product</Link>
                        <Link href="/solutions" className="font-mono text-xs text-slate-500 hover:text-brand-500 uppercase">Solutions</Link>
                        <Link href="/enterprise" className="font-mono text-xs text-slate-500 hover:text-brand-500 uppercase">Enterprise</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
