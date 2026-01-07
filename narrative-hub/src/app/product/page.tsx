'use client';

import Link from 'next/link';
import {
    Sparkles,
    MessageSquare,
    Bell,
    FileText,
    Database,
    Zap,
    ArrowRight,
    Check,
    BarChart3,
    Layers,
    Shield,
    GitBranch
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        id: 'F1',
        title: 'Narrative Hub',
        subtitle: 'Collaborative Insights',
        description: 'React-based interface for viewing, creating, and managing analytical narratives with full revision history.',
        icon: FileText,
        capabilities: [
            'Timeline view of chronological narrative revisions',
            'Insight cards with embedded Tableau visualizations',
            'Revision history with author tracking and diff views',
            'Export to PDF and Markdown formats'
        ]
    },
    {
        id: 'F2',
        title: 'Concierge Agent',
        subtitle: 'Conversational Analytics',
        description: 'Natural language interface that transforms questions into Tableau visualizations with full citation chains.',
        icon: MessageSquare,
        capabilities: [
            'Chat interface with message history',
            'Natural language → Tableau NLQ pipeline',
            'Source citations for every generated insight',
            'Follow-up questions with session context'
        ]
    },
    {
        id: 'F3',
        title: 'Inspector Agent',
        subtitle: 'Proactive Monitoring',
        description: 'Background agent that monitors configured KPIs and alerts when anomalies are detected.',
        icon: Bell,
        capabilities: [
            'Metric subscription configuration',
            'Threshold-based anomaly detection',
            'Auto-generated preliminary narratives',
            'Slack webhook integration'
        ]
    },
    {
        id: 'F4',
        title: 'Data Integration',
        subtitle: 'Unified Access',
        description: 'Connectors for Tableau Cloud and Salesforce Data Cloud enabling real-time data access.',
        icon: Database,
        capabilities: [
            'Tableau Cloud API authentication',
            'Data source listing and metadata',
            'Query execution via Tableau NLQ',
            'Connection health monitoring'
        ]
    },
    {
        id: 'F5',
        title: 'Export Pipeline',
        subtitle: 'Action & Distribution',
        description: 'Export narratives to multiple formats and trigger automated workflows.',
        icon: Zap,
        capabilities: [
            'PDF export with embedded visualizations',
            'Markdown export for documentation',
            'Salesforce Knowledge publishing',
            'Slack notifications via webhooks'
        ]
    }
];

export default function ProductPage() {
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
                                <span className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors ${item.name === 'Product' ? 'text-brand-500' : 'text-slate-500 group-hover:text-brand-500'}`}>
                                    {item.name}
                                </span>
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 transition-transform duration-300 ${item.name === 'Product' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-px bg-slate-200 dark:bg-slate-800 pl-px border-l border-slate-200 dark:border-slate-800 ml-auto">
                        <Link href="/dashboard" className="h-full flex items-center px-6 lg:px-10 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 font-display font-bold text-sm lg:text-base uppercase tracking-wider hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white transition-colors">
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
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Product Overview</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] mb-8">
                            The Complete<br />Analytics<br />
                            <span className="text-brand-500">Fabric</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                            Five integrated modules that transform raw data into actionable narratives.
                            Built on Tableau Cloud and Salesforce Data Cloud.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div className="space-y-0 border border-slate-200 dark:border-slate-800">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group grid grid-cols-1 lg:grid-cols-12 border-b border-slate-200 dark:border-slate-800 last:border-b-0"
                            >
                                {/* Feature Header */}
                                <div className="lg:col-span-4 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-white dark:bg-slate-950">
                                            <feature.icon className="w-5 h-5 text-brand-500" />
                                        </div>
                                        <span className="font-mono text-xs text-slate-400 uppercase">{feature.id}</span>
                                    </div>
                                    <h3 className="text-2xl lg:text-3xl font-display font-bold uppercase tracking-tight mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="font-mono text-xs text-brand-500 uppercase tracking-widest">
                                        {feature.subtitle}
                                    </p>
                                </div>

                                {/* Feature Content */}
                                <div className="lg:col-span-8 p-6 lg:p-10">
                                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {feature.capabilities.map((cap, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <Check className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                                                <span className="text-sm text-slate-700 dark:text-slate-300">{cap}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 lg:py-24 bg-slate-950 dark:bg-black text-white">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-5xl font-display font-bold uppercase tracking-tighter mb-6">
                        Ready to Transform Your Data?
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Start building defensible narratives from your enterprise data in minutes.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-500 text-white font-display font-bold uppercase tracking-wider hover:bg-brand-600 transition-colors"
                    >
                        Launch Dashboard
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
