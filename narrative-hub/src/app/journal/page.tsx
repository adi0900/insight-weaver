'use client';

import Link from 'next/link';
import {
    Sparkles,
    Calendar,
    ArrowRight,
    Tag,
    Clock,
    ChevronRight,
    BookOpen,
    Newspaper
} from 'lucide-react';
import { motion } from 'framer-motion';

const articles = [
    {
        id: '001',
        date: 'Jan 7, 2026',
        category: 'Release',
        title: 'Introducing Insight Weaver MVP',
        excerpt: 'Today we launch the first version of Insight Weaver — an open analytics fabric that bridges the gap between raw data and actionable insights.',
        readTime: '5 min read'
    },
    {
        id: '002',
        date: 'Jan 6, 2026',
        category: 'Technical',
        title: 'Building the Concierge Agent',
        excerpt: 'A deep dive into how we integrated Tableau NLQ with Einstein Trust Layer for grounded, citation-backed AI responses.',
        readTime: '8 min read'
    },
    {
        id: '003',
        date: 'Jan 5, 2026',
        category: 'Design',
        title: 'The Brutalist UI Philosophy',
        excerpt: 'Why we chose architectural minimalism over flashy gradients for an analytics platform that means business.',
        readTime: '4 min read'
    },
    {
        id: '004',
        date: 'Jan 4, 2026',
        category: 'Integration',
        title: 'Connecting Salesforce Data Cloud',
        excerpt: 'Step-by-step guide to configuring your Salesforce Data Cloud semantic layer with Insight Weaver.',
        readTime: '6 min read'
    }
];

const changelog = [
    { version: '1.0.0', date: 'Jan 7, 2026', changes: ['MVP Launch', 'Narrative Hub', 'Concierge Agent', 'Inspector Agent', 'Tableau Integration'] },
    { version: '0.9.0', date: 'Jan 5, 2026', changes: ['Beta testing', 'Export pipeline', 'Slack webhooks'] },
    { version: '0.8.0', date: 'Jan 3, 2026', changes: ['Dashboard UI', 'Mobile responsiveness', 'Dark mode'] }
];

export default function JournalPage() {
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
                                <span className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors ${item.name === 'Journal' ? 'text-brand-500' : 'text-slate-500 group-hover:text-brand-500'}`}>
                                    {item.name}
                                </span>
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 transition-transform duration-300 ${item.name === 'Journal' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
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
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Updates & Insights</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] mb-8">
                            The<br />Insight<br />
                            <span className="text-brand-500">Journal</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                            Product updates, technical deep-dives, and design philosophy from the Insight Weaver team.
                        </p>
                    </div>
                </div>
            </section>

            {/* Articles */}
            <section className="py-16 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Newspaper className="w-5 h-5 text-brand-500" />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Latest Articles</span>
                    </div>

                    <div className="space-y-0 border border-slate-200 dark:border-slate-800">
                        {articles.map((article, idx) => (
                            <motion.article
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-6 lg:p-10 border-b border-slate-200 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                                    <div className="flex items-center gap-4 lg:w-48 shrink-0">
                                        <span className="font-mono text-[10px] text-slate-400">{article.id}</span>
                                        <span className="px-2 py-1 bg-brand-500/10 border border-brand-500/30 font-mono text-[10px] text-brand-600 dark:text-brand-400 uppercase">
                                            {article.category}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl lg:text-2xl font-display font-bold uppercase tracking-tight mb-2 group-hover:text-brand-500 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 lg:shrink-0">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-mono text-xs">{article.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock className="w-4 h-4" />
                                            <span className="font-mono text-xs">{article.readTime}</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Changelog */}
            <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen className="w-5 h-5 text-brand-500" />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Changelog</span>
                    </div>

                    <div className="space-y-6">
                        {changelog.map((release, idx) => (
                            <motion.div
                                key={release.version}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-6"
                            >
                                <div className="flex flex-col items-center">
                                    <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                    {idx < changelog.length - 1 && <div className="w-px h-full bg-slate-200 dark:bg-slate-700" />}
                                </div>
                                <div className="pb-8">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="font-display font-bold text-lg uppercase">v{release.version}</span>
                                        <span className="font-mono text-xs text-slate-400">{release.date}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {release.changes.map((change, i) => (
                                            <span key={i} className="px-3 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs">
                                                {change}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 lg:py-24 bg-slate-950 text-white">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-5xl font-display font-bold uppercase tracking-tighter mb-6">
                        Stay Updated
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Subscribe to the Insight Journal for product updates and analytics best practices.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                        />
                        <button className="px-6 py-3 bg-brand-500 text-white font-display font-bold uppercase tracking-wider hover:bg-brand-600 transition-colors">
                            Subscribe
                        </button>
                    </div>
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
