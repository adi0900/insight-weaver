'use client';

import Link from 'next/link';
import {
    Sparkles,
    Building2,
    Users,
    Code,
    BarChart3,
    ArrowRight,
    Target,
    Clock,
    Layers,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const solutions = [
    {
        id: '01',
        userType: 'Domain Experts',
        subtitle: 'City Planners, Analysts',
        pain: 'Hours spent hunting through multiple systems',
        solution: 'Natural language queries, self-service analytics',
        icon: Target,
        example: '"How has the metro line impacted pollution in district 7?"',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: '02',
        userType: 'Executives',
        subtitle: 'C-Suite, Directors',
        pain: 'Information overload, no time for deep dives',
        solution: 'Narrative summaries with drill-down capability',
        icon: TrendingUp,
        example: 'One-click executive briefs with full provenance chains',
        color: 'from-brand-500 to-amber-500'
    },
    {
        id: '03',
        userType: 'Data Teams',
        subtitle: 'Engineers, Scientists',
        pain: 'Constant ad-hoc requests, repetitive reporting',
        solution: 'Automated monitoring, proactive alerts',
        icon: Layers,
        example: 'Set thresholds once, get notified when metrics deviate',
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: '04',
        userType: 'Developers',
        subtitle: 'Platform Engineers',
        pain: 'Building analytics into apps is painful',
        solution: 'Drop-in embedded components',
        icon: Code,
        example: 'Embed insights in any React app with 3 lines of code',
        color: 'from-emerald-500 to-green-500'
    }
];

const useCases = [
    {
        industry: 'Government',
        title: 'SDG Progress Tracking',
        description: 'Monitor Sustainable Development Goals across districts with automated anomaly detection.',
    },
    {
        industry: 'Enterprise',
        title: 'Sales Pipeline Intelligence',
        description: 'Real-time pipeline health with predictive narratives for revenue forecasting.',
    },
    {
        industry: 'Healthcare',
        title: 'Operational Metrics',
        description: 'Track patient flow, resource utilization, and quality indicators with full audit trails.',
    }
];

export default function SolutionsPage() {
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
                                <span className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors ${item.name === 'Solutions' ? 'text-brand-500' : 'text-slate-500 group-hover:text-brand-500'}`}>
                                    {item.name}
                                </span>
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 transition-transform duration-300 ${item.name === 'Solutions' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
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
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Solutions by Role</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] mb-8">
                            Built for<br />Every<br />
                            <span className="text-brand-500">Stakeholder</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                            From domain experts who need quick answers to executives who need defensible narratives—
                            Insight Weaver adapts to every user's workflow.
                        </p>
                    </div>
                </div>
            </section>

            {/* Solutions by User Type */}
            <section className="py-16 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-slate-200 dark:border-slate-800">
                        {solutions.map((sol, idx) => (
                            <motion.div
                                key={sol.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-8 lg:p-12 border-b lg:border-b lg:odd:border-r border-slate-200 dark:border-slate-800 last:border-b-0 lg:last:border-b lg:[&:nth-last-child(2)]:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br ${sol.color}`}>
                                        <sol.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-mono text-xs text-slate-400">{sol.id}</span>
                                </div>

                                <h3 className="text-2xl font-display font-bold uppercase tracking-tight mb-1">
                                    {sol.userType}
                                </h3>
                                <p className="font-mono text-xs text-brand-500 uppercase tracking-widest mb-6">
                                    {sol.subtitle}
                                </p>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <span className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Pain Point</span>
                                        <p className="text-slate-600 dark:text-slate-400">{sol.pain}</p>
                                    </div>
                                    <div>
                                        <span className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Solution</span>
                                        <p className="text-slate-900 dark:text-white font-medium">{sol.solution}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-100 dark:bg-slate-800 border-l-2 border-brand-500">
                                    <p className="font-serif italic text-sm text-slate-600 dark:text-slate-400">
                                        "{sol.example}"
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industry Use Cases */}
            <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Building2 className="w-5 h-5 text-brand-500" />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Industry Applications</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {useCases.map((uc, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                            >
                                <span className="font-mono text-[10px] text-brand-500 uppercase tracking-widest">{uc.industry}</span>
                                <h4 className="text-xl font-display font-bold uppercase mt-2 mb-3">{uc.title}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{uc.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 lg:py-24 bg-slate-950 text-white">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-5xl font-display font-bold uppercase tracking-tighter mb-6">
                        Find Your Solution
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Book a demo tailored to your role and see how Insight Weaver fits your workflow.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-500 text-white font-display font-bold uppercase tracking-wider hover:bg-brand-600 transition-colors"
                    >
                        Get Started
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
