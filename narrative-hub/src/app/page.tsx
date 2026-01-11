'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Sparkles,
    ArrowRight,
    Play,
    MessageSquare,
    Bell,
    FileText,
    Database,
    Lock,
    Zap,
    CheckCircle2,
    TrendingUp,
    Shield,
    Search,
    Menu
} from 'lucide-react';
import { cn } from '@/utils';
import BrutalistLoader from '@/components/BrutalistLoader';
import HeroInteractive from '@/components/HeroInteractive';
import ArchitecturePipeline from '@/components/ArchitecturePipeline';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    const container = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!isLoaded) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Hero Sequence
        if (document.querySelectorAll('.reveal-text').length > 0) {
            tl.to('.reveal-text', {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out',
            });
        }

        if (document.querySelector('.hero-image-wrapper')) {
            tl.to('.hero-image-wrapper', {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: 'expo.out',
            }, '-=1');
        }

        // Scroll Animations
        gsap.utils.toArray('.fade-up').forEach((el: any) => {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                    }
                }
            );
        });

        // Parallax Dashboard
        gsap.to(dashboardRef.current, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

    }, { scope: container, dependencies: [isLoaded] });

    return (
        <div ref={container} className="min-h-screen bg-surface selection:bg-brand-500 selection:text-white font-sans text-slate-900 overflow-x-hidden">
            <BrutalistLoader onLoadingComplete={() => setIsLoaded(true)} />

            {/* 
        ========================================
        NAVIGATION (Architectural)
        ========================================
      */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-all">
                <div className="max-w-[1400px] mx-auto h-16 lg:h-24 flex items-stretch">

                    {/* Logo Section */}
                    <div className="flex items-center px-4 lg:px-8 border-r border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-brand-500 text-white flex items-center justify-center rounded-none transform rotate-45">
                                <div className="transform -rotate-45">
                                    <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                </div>
                            </div>
                            <span className="font-display font-bold text-base lg:text-xl tracking-tighter uppercase text-slate-950 dark:text-white">
                                Insight<span className="hidden lg:inline"><br /></span><span className="lg:hidden"> </span>Weaver
                            </span>
                        </div>
                    </div>

                    {/* Links Section (Hidden on mobile) */}
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-12">
                        {[
                            { name: 'Product', href: '/product' },
                            { name: 'Solutions', href: '/solutions' },
                            { name: 'Enterprise', href: '/enterprise' },
                            { name: 'Journal', href: '/journal' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group relative h-full flex items-center px-4"
                            >
                                <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 group-hover:text-brand-500 transition-colors">
                                    {item.name}
                                </span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-expo" />
                            </Link>
                        ))}
                    </div>

                    {/* Actions Section */}
                    <div className="flex items-center gap-px bg-slate-200 dark:bg-slate-800 pl-px border-l border-slate-200 dark:border-slate-800 ml-auto">
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('iw_token', 'demo-token');
                                    localStorage.setItem('custom_viz_url', 'https://public.tableau.com/views/RegionalSampleWorkbook/Storms');
                                    router.push('/dashboard');
                                }
                            }}
                            className="hidden sm:flex h-full items-center px-4 lg:px-8 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 font-mono text-xs uppercase tracking-widest transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('iw_token', 'demo-token');
                                    localStorage.setItem('custom_viz_url', 'https://public.tableau.com/views/RegionalSampleWorkbook/Storms');
                                    router.push('/dashboard');
                                }
                            }}
                            className="h-full flex items-center px-6 lg:px-10 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 font-display font-bold text-sm lg:text-base uppercase tracking-wider hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white transition-colors"
                        >
                            Start
                        </button>
                    </div>

                </div>
            </nav>

            <main>
                {/* 
          ========================================
          HERO SECTION (Editorial Style)
          ========================================
        */}
                <section ref={heroRef} className="relative pt-24 lg:pt-40 pb-16 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950">

                    {/* Editorial Grid Lines */}
                    <div className="absolute inset-0 max-w-[1400px] mx-auto border-x border-slate-100 dark:border-slate-800 pointer-events-none" />
                    <div className="absolute top-0 inset-x-0 h-px bg-slate-100 dark:bg-slate-800 pointer-events-none" />

                    <div className="max-w-[1400px] mx-auto px-6 relative z-10">

                        <div className="max-w-6xl mx-auto text-center mb-16 lg:mb-32">
                            <div className="overflow-hidden mb-8 flex justify-center">
                                <div className="reveal-text translate-y-20 opacity-0 flex items-center gap-3 px-5 py-2 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10">
                                    <span className="w-1.5 h-1.5 bg-brand-500" />
                                    <span className="text-xs font-mono uppercase tracking-widest text-slate-500">System v2.0 Live</span>
                                </div>
                            </div>

                            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-display font-bold tracking-tighter leading-[0.85] text-slate-950 dark:text-white mb-6 lg:mb-10">
                                <div className="overflow-hidden"><span className="reveal-text translate-y-32 opacity-0 block">Narratives</span></div>
                                <div className="overflow-hidden">
                                    <span className="reveal-text translate-y-32 opacity-0 block text-slate-300 dark:text-slate-700">
                                        <span className="font-serif italic font-light text-brand-500 pr-4">not</span>
                                        Numbers.
                                    </span>
                                </div>
                            </h1>

                            <div className="max-w-2xl mx-auto overflow-hidden">
                                <p className="reveal-text translate-y-20 opacity-0 text-lg lg:text-2xl font-light text-slate-600 dark:text-slate-400 leading-relaxed px-4 lg:px-0">
                                    The first <span className="font-semibold text-slate-900 dark:text-white">intelligent layer</span> that translates your data warehouse into clear, actionable business prose.
                                </p>
                            </div>

                            <div className="mt-10 lg:mt-16 overflow-hidden px-4 lg:px-0">
                                <div className="reveal-text translate-y-20 opacity-0 flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <button
                                        onClick={() => {
                                            // DEMO LOGIN LOGIC
                                            if (typeof window !== 'undefined') {
                                                localStorage.setItem('iw_token', 'demo-token');
                                                localStorage.setItem('custom_viz_url', 'https://public.tableau.com/views/RegionalSampleWorkbook/Storms');
                                                router.push('/dashboard');
                                            }
                                        }}
                                        className="group w-full sm:w-auto px-12 py-6 bg-slate-950 dark:bg-white text-white dark:text-black font-display font-bold text-lg uppercase tracking-wider hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-4"
                                    >
                                        Start Building
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <Link href="#demo" className="group w-full sm:w-auto px-12 py-6 bg-transparent border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-display font-bold text-lg uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-4">
                                        <Play className="w-5 h-5" />
                                        Manifesto
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Cinematic Dashboard Display */}
                        <div className="hero-image-wrapper scale-90 opacity-0 relative z-10 mx-auto max-w-[1200px]">
                            <HeroInteractive />

                            {/* Decorative Editorial Elements */}
                            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-mono text-slate-300 tracking-[0.2em] hidden xl:block">
                                EST. 2026 — INSIGHT WEAVER
                            </div>
                            <div className="absolute -right-12 top-1/2 -translate-y-1/2 rotate-90 text-xs font-mono text-slate-300 tracking-[0.2em] hidden xl:block">
                                SCROLL FOR INTELLIGENCE
                            </div>
                        </div>

                    </div>
                </section>

                {/* 
          ========================================
          DIVIDER (Sharp Brutalist Line)
          ========================================
        */}
                <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

                {/* 
          ========================================
          FEATURES (Editorial Grid)
          ========================================
        */}
                <section id="features" className="py-20 lg:py-40 bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative">
                    {/* Vertical Grid Line */}
                    <div className="absolute inset-y-0 left-1/2 w-px bg-slate-100 dark:bg-slate-800 hidden lg:block" />

                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                            <div className="sticky top-32 lg:pr-20">
                                <h2 className="fade-up text-4xl md:text-6xl lg:text-8xl font-display font-bold tracking-tighter mb-8 lg:mb-12 leading-[0.9]">
                                    Your Data.<br />
                                    <span className="text-slate-300 dark:text-slate-700 font-serif italic font-light">Commanded.</span>
                                </h2>

                                <p className="fade-up text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-10 lg:mb-16 font-light">
                                    Stop drowning in dashboards. Switch to active intelligence that monitors, analyzes, and narrates for you.
                                </p>

                                <div className="fade-up w-full">
                                    {[
                                        { id: '01', title: 'CONNECT', desc: 'Link Tableau & Salesforce in one click.' },
                                        { id: '02', title: 'ANALYZE', desc: 'AI agents detect anomalies 24/7.' },
                                        { id: '03', title: 'NARRATE', desc: 'Auto-generate reports for stakeholders.' }
                                    ].map((step, i) => (
                                        <div key={i} className="py-8 border-t border-slate-200 dark:border-slate-800 group cursor-pointer hover:pl-4 transition-all duration-300">
                                            <div className="flex items-baseline justify-between mb-2">
                                                <h3 className="text-2xl font-display font-bold">{step.title}</h3>
                                                <span className="font-mono text-sm text-brand-500">{step.id}</span>
                                            </div>
                                            <p className="text-slate-500 font-serif italic text-lg">{step.desc}</p>
                                        </div>
                                    ))}
                                    <div className="border-t border-slate-200 dark:border-slate-800" />
                                </div>
                            </div>

                            <div className="grid gap-0 border-l border-slate-100 dark:border-slate-800 lg:border-none">
                                {/* Feature Cards - Minimalist/Bordered */}

                                <div className="fade-up p-12 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-500">
                                    <div className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center mb-8">
                                        <MessageSquare className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl lg:text-4xl font-display font-bold mb-4 tracking-tight">Concierge Agent</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-light">
                                        "Why did revenue drop in Q3?" <br />
                                        Get answers, not just charts. The Concierge parses your intent and builds the view you need.
                                    </p>
                                </div>

                                <div className="fade-up p-12 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-500">
                                    <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center mb-8">
                                        <Bell className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl lg:text-4xl font-display font-bold mb-4 tracking-tight">Inspector Agent</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-light">
                                        Never miss a beat. Automated Z-score analysis runs in the background, alerting you only when it matters.
                                    </p>
                                </div>

                                <div className="fade-up p-12 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-500">
                                    <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center mb-8">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl lg:text-4xl font-display font-bold mb-4 tracking-tight">Narrative Engine</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-light">
                                        Turn insights into documents. Export to Markdown, PDF, or Salesforce Knowledge with a single click.
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>
                </section>

                {/* 
          ========================================
          HOW IT WORKS (Pipeline - Floating Glass)
          ========================================
        */}
                <section className="py-20 lg:py-40 bg-slate-950 text-white relative overflow-hidden">
                    {/* Background Glow Effects */}
                    <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[150px] -translate-y-1/2" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px]" />

                    <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                        <div className="text-center mb-20 lg:mb-32">
                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                                <span className="w-1.5 h-1.5 bg-brand-500" />
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">The Architecture</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-bold tracking-tighter mb-6">
                                Four Steps to<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Intelligence</span>
                            </h2>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                                A unified pipeline that transforms raw data into actionable narratives.
                            </p>
                        </div>

                        {/* Pipeline Steps - Floating Glass Cards */}
                        {/* Pipeline Steps - High Fidelity Brutalist Component */}
                        <div className="mt-16">
                            <ArchitecturePipeline />
                        </div>
                    </div>
                </section>

                {/* 
          ========================================
          USE CASES (Target Users - Brutalist Grid)
          ========================================
        */}
                <section className="py-20 lg:py-40 bg-white dark:bg-slate-950 relative">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-20 items-center mb-20 lg:mb-32">
                            <div>
                                <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-8">
                                    <span className="w-1.5 h-1.5 bg-brand-500" />
                                    <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Built For</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter mb-6 text-slate-900 dark:text-white">
                                    Every Voice<br />
                                    <span className="font-serif italic font-light text-slate-400">in the Room.</span>
                                </h2>
                            </div>
                            <p className="text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                                From C-suite executives who need quick summaries to data engineers building pipelines, Insight Weaver adapts to your workflow.
                            </p>
                        </div>

                        {/* Use Case Cards - Sharp Brutalist */}
                        <div className="grid md:grid-cols-2 gap-0 border border-slate-200 dark:border-slate-800">
                            {[
                                { role: 'Domain Experts', pain: 'Hours hunting through systems', solution: 'Natural language queries, self-service analytics', icon: Search },
                                { role: 'Executives', pain: 'Information overload, no time', solution: 'Narrative summaries with drill-down', icon: TrendingUp },
                                { role: 'Data Teams', pain: 'Constant ad-hoc requests', solution: 'Automated monitoring, proactive alerts', icon: Bell },
                                { role: 'Developers', pain: 'Building analytics is painful', solution: 'Drop-in embedded components', icon: Lock },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`fade-up group p-10 lg:p-14 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b md:border-b-0 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < 2 ? 'md:border-b' : ''} border-slate-200 dark:border-slate-800`}
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                            <item.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-display font-bold mb-2 text-slate-900 dark:text-white">{item.role}</h3>
                                            <p className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-4">Pain: {item.pain}</p>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.solution}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 
          ========================================
          METRICS (Stats - Glass Cards)
          ========================================
        */}
                <section className="py-20 lg:py-40 bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
                    <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-slate-900 dark:text-white mb-4">
                                Built for <span className="font-serif italic font-light">Speed</span>
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 font-light">
                                Performance metrics that matter.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { value: '<30s', label: 'Question to Insight', sub: 'Average response time' },
                                { value: '85%+', label: 'Detection Accuracy', sub: 'Anomaly identification' },
                                { value: '99%', label: 'Export Success', sub: 'Uptime reliability' },
                                { value: '50+', label: 'Data Connectors', sub: 'Integrations ready' },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="fade-up group relative p-8 lg:p-10 bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 text-center hover:border-brand-500 transition-colors"
                                >
                                    <div className="text-5xl lg:text-6xl font-display font-bold text-brand-500 mb-3">{stat.value}</div>
                                    <div className="text-lg font-display font-bold text-slate-900 dark:text-white mb-1">{stat.label}</div>
                                    <div className="text-sm text-slate-500 font-mono uppercase tracking-wider">{stat.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 
          ========================================
          INTEGRATIONS (Logos + Trust)
          ========================================
        */}
                <section className="py-20 lg:py-32 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                                Enterprise-Grade Integrations
                            </h2>
                            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
                                Connect to the tools you already use
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
                            {['Tableau', 'Salesforce', 'Snowflake', 'Slack', 'BigQuery', 'Databricks'].map((brand, i) => (
                                <div
                                    key={i}
                                    className="w-full h-20 flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-brand-500 hover:opacity-100 transition-all"
                                >
                                    <span className="font-display font-bold text-lg lg:text-xl text-slate-400 uppercase tracking-widest">{brand}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 
          ========================================
          FAQ (Accordion Style)
          ========================================
        */}
                <section className="py-20 lg:py-40 bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-[900px] mx-auto px-6">
                        <div className="text-center mb-16 lg:mb-20">
                            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-slate-900 dark:text-white mb-4">
                                Questions? <span className="font-serif italic font-light">Answered.</span>
                            </h2>
                        </div>

                        <div className="space-y-0 border-t border-slate-200 dark:border-slate-800">
                            {[
                                { q: 'How does Insight Weaver connect to my data?', a: 'We use native Tableau Cloud APIs and Salesforce Data Cloud connectors. No data leaves your environment—we query in place with enterprise-grade security.' },
                                { q: 'Can I trust AI-generated insights?', a: 'Every insight includes full citation chains traced back to source data. Our Einstein Trust Layer ensures grounding and auditability.' },
                                { q: 'What happens when an anomaly is detected?', a: 'The Inspector Agent generates a preliminary narrative and routes alerts to Slack, email, or any webhook endpoint you configure.' },
                                { q: 'How long does setup take?', a: 'Most teams are running queries within 15 minutes. Connect your Tableau Cloud, authorize Salesforce, and you are ready.' },
                                { q: 'Is my data secure?', a: 'We never store your underlying data. All queries run through your existing Tableau and Salesforce security layers with OAuth 2.0 authentication.' },
                            ].map((faq, i) => (
                                <div
                                    key={i}
                                    className="fade-up border-b border-slate-200 dark:border-slate-800 py-8 group"
                                >
                                    <h3 className="text-lg lg:text-xl font-display font-bold text-slate-900 dark:text-white mb-3 flex items-start gap-4">
                                        <span className="font-mono text-sm text-brand-500 pt-1">0{i + 1}</span>
                                        {faq.q}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-10">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 
          ========================================
          FINAL CTA (Dramatic - Floating Glass)
          ========================================
        */}
                <section className="py-32 lg:py-48 bg-slate-950 text-white relative overflow-hidden">
                    {/* Dramatic Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-500/20 via-slate-950 to-slate-950" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-brand-500/10 rounded-full blur-[200px]" />

                    {/* Grid Lines */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                    <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
                        <div className="fade-up inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 backdrop-blur-sm mb-10">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="font-mono text-sm uppercase tracking-widest text-slate-400">Ready to Deploy</span>
                        </div>

                        <h2 className="fade-up text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter mb-8 leading-[0.9]">
                            Stop Interpreting.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-white">Start Commanding.</span>
                        </h2>

                        <p className="fade-up text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light">
                            Join forward-thinking organizations that have replaced dashboard fatigue with active intelligence.
                        </p>

                        <div className="fade-up flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem('iw_token', 'demo-token');
                                        localStorage.setItem('custom_viz_url', 'https://public.tableau.com/views/RegionalSampleWorkbook/Storms');
                                        router.push('/dashboard');
                                    }
                                }}
                                className="group w-full sm:w-auto px-12 py-6 bg-white text-black font-display font-bold text-lg uppercase tracking-wider hover:bg-brand-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-4"
                            >
                                Launch Console
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <Link href="#demo" className="group w-full sm:w-auto px-12 py-6 bg-transparent border border-white/20 text-white font-display font-bold text-lg uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-4">
                                <Play className="w-5 h-5" />
                                Watch Demo
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="bg-slate-950 text-white py-16 lg:py-24 border-t border-slate-800">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-brand-500 text-white flex items-center justify-center transform rotate-45">
                                    <Sparkles className="w-4 h-4 -rotate-45" />
                                </div>
                                <span className="font-display font-bold text-lg uppercase tracking-tighter">Insight Weaver</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Transforming data into narratives that drive decisions.
                            </p>
                        </div>

                        {/* Links */}
                        {[
                            { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
                            { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
                            { title: 'Resources', links: ['Documentation', 'API Reference', 'Community', 'Support'] },
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-6">{col.title}</h4>
                                <ul className="space-y-4">
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-slate-800">
                        <div className="text-slate-500 text-sm font-mono">
                            © 2026 Insight Weaver. All rights reserved.
                        </div>
                        <div className="flex gap-8">
                            {['Twitter', 'GitHub', 'LinkedIn', 'Discord'].map(social => (
                                <a key={social} href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-mono uppercase tracking-wider">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

        </div >
    );
}
