'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
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
    Menu,
    ChevronRight,
    Activity
} from 'lucide-react';
import { cn } from '@/utils';
import dynamic from 'next/dynamic';

const BrutalistLoader = dynamic(() => import('@/components/BrutalistLoader'), { ssr: false });
const HeroInteractive = dynamic(() => import('@/components/HeroInteractive'), { ssr: false });
const ArchitecturePipeline = dynamic(() => import('@/components/ArchitecturePipeline'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function LandingContent() {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const container = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const dashboardPlaceholderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useGSAP(() => {
        if (!isLoaded || !container.current) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Hero Sequence
        const revealTexts = container.current.querySelectorAll('.reveal-text');
        if (revealTexts.length > 0) {
            tl.to(revealTexts, {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out',
            });
        }

        const heroImage = container.current.querySelector('.hero-image-wrapper');
        if (heroImage) {
            tl.to(heroImage, {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: 'expo.out',
            }, '-=1');
        }

        // Scroll Animations
        const fadeUps = container.current.querySelectorAll('.fade-up');
        fadeUps.forEach((el: any) => {
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
        if (dashboardPlaceholderRef.current && heroRef.current) {
            gsap.to(dashboardPlaceholderRef.current, {
                yPercent: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

    }, { scope: container, dependencies: [isLoaded] });

    const handleDemoAuth = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('iw_token', 'demo-token');
            localStorage.setItem('custom_viz_url', 'https://public.tableau.com/views/RegionalSampleWorkbook/Storms');
            router.push('/dashboard');
        }
    };

    if (!isMounted) return null;

    const navLinks = [
        { name: 'Product', href: '/product' },
        { name: 'Solutions', href: '/solutions' },
        { name: 'Enterprise', href: '/enterprise' },
        { name: 'Journal', href: '/journal' }
    ];

    return (
        <div ref={container} className="min-h-screen bg-surface selection:bg-brand-500 selection:text-white font-sans text-slate-900 overflow-x-hidden">
            <BrutalistLoader onLoadingComplete={() => setIsLoaded(true)} />

            {/* NAVIGATION */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-all">
                <div className="max-w-[1400px] mx-auto h-16 lg:h-24 flex items-stretch">
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

                    <div className="hidden lg:flex flex-1 items-center justify-center gap-12">
                        {navLinks.map((item) => (
                            <Link key={item.name} href={item.href} className="group relative h-full flex items-center px-4">
                                <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 group-hover:text-brand-500 transition-colors">
                                    {item.name}
                                </span>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-expo" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-px bg-slate-200 dark:bg-slate-800 pl-px border-l border-slate-200 dark:border-slate-800 ml-auto">
                        <button
                            onClick={handleDemoAuth}
                            className="h-full flex items-center px-6 lg:px-10 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 font-display font-bold text-sm lg:text-base uppercase tracking-wider hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white transition-colors"
                        >
                            Access Console
                        </button>
                    </div>
                </div>
            </nav>

            <main>
                <section ref={heroRef} className="relative pt-24 lg:pt-40 pb-16 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950">
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
                                        <span className="font-serif italic font-light text-brand-500 pr-4">not</span> Numbers.
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
                                        onClick={handleDemoAuth}
                                        className="group w-full sm:w-auto px-12 py-6 bg-slate-950 dark:bg-white text-white dark:text-black font-display font-bold text-lg uppercase tracking-wider hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-4"
                                    >
                                        Access Demo Console
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <Link href="#demo" className="group w-full sm:w-auto px-12 py-6 bg-transparent border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-display font-bold text-lg uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-4">
                                        <Play className="w-5 h-5" />
                                        Manifesto
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div ref={dashboardPlaceholderRef} className="hero-image-wrapper scale-90 opacity-0 relative z-10 mx-auto max-w-[1200px]">
                            <HeroInteractive />
                            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-mono text-slate-300 tracking-[0.2em] hidden xl:block">
                                EST. 2026 — INSIGHT WEAVER
                            </div>
                            <div className="absolute -right-12 top-1/2 -translate-y-1/2 rotate-90 text-xs font-mono text-slate-300 tracking-[0.2em] hidden xl:block">
                                SCROLL FOR INTELLIGENCE
                            </div>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

                <section className="py-20 lg:py-40 bg-slate-50 dark:bg-slate-900/50">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 lg:mb-24 gap-8">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-3 px-5 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-8">
                                    <span className="w-1.5 h-1.5 bg-brand-500" />
                                    <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Pipeline Architecture</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter text-slate-900 dark:text-white">
                                    From Raw Data<br />
                                    <span className="font-serif italic font-light text-slate-400">to Semantic Insights.</span>
                                </h2>
                            </div>
                            <p className="text-xl text-slate-600 dark:text-slate-400 font-light max-w-md leading-relaxed">
                                Our autonomous engine handles the heavy lifting of data interpretation, so you can focus on strategy.
                            </p>
                        </div>
                        <div className="mt-16">
                            <ArchitecturePipeline />
                        </div>
                    </div>
                </section>

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

                <footer className="bg-slate-950 text-white py-16 lg:py-24 border-t border-slate-800">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-slate-500 text-sm font-mono">
                                © 2026 Insight Weaver. v1.0.2-stable
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
