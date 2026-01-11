'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClientOnly from '@/components/ClientOnly';
import {
    Sparkles,
    MessageSquare,
    FileText,
    Bell,
    Database,
    User,
    Menu,
    X,
    Plus,
    Activity,
    LogOut,
    Info
} from 'lucide-react';
import { AgentChat } from '@/components/AgentChat';
import { NarrativeTimeline } from '@/components/NarrativeTimeline';
import { AlertDashboard } from '@/components/AlertDashboard';
import { DataSourcePanel } from '@/components/DataSourcePanel';
import { WorkflowModal } from '@/components/WorkflowModal';
import { ProductGuide } from '@/components/ProductGuide';

type View = 'chat' | 'narratives' | 'alerts' | 'data';

export default function DashboardPage() {
    const [currentView, setCurrentView] = useState<View>('chat');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
    const [isProductGuideOpen, setIsProductGuideOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Auto-open guide on first visit
    useEffect(() => {
        setIsMounted(true);

        // SELF-HEALING AUTH: Ensure demo token is set even if landing page was cached
        if (typeof window !== 'undefined') {
            if (!localStorage.getItem('iw_token')) {
                console.log('[Auth] Restoring demo session...');
                localStorage.setItem('iw_token', 'demo-token');
            }
            if (!localStorage.getItem('custom_viz_url')) {
                localStorage.setItem('custom_viz_url', 'https://public.tableau.com/views/RegionalSampleWorkbook/Storms');
            }
        }

        const hasSeenGuide = localStorage.getItem('insight-weaver-onboarded');
        if (!hasSeenGuide) {
            setIsProductGuideOpen(true);
            localStorage.setItem('insight-weaver-onboarded', 'true');
        }
    }, []);

    const navItems: { id: View; label: string; icon: typeof MessageSquare }[] = [
        { id: 'chat', label: 'Concierge', icon: MessageSquare },
        { id: 'narratives', label: 'Narratives', icon: FileText },
        { id: 'alerts', label: 'Alerts', icon: Bell },
        { id: 'data', label: 'Data Sources', icon: Database },
    ];

    const renderView = () => {
        switch (currentView) {
            case 'chat':
                return <AgentChat />;
            case 'narratives':
                return <NarrativeTimeline />;
            case 'alerts':
                return <AlertDashboard />;
            case 'data':
                return <DataSourcePanel />;
            default:
                return <AgentChat />;
        }
    };

    const handleNavClick = (id: View) => {
        setCurrentView(id);
        setSidebarOpen(false); // Close sidebar on mobile after selection
    };

    if (!isMounted) return null;

    return (
        <ClientOnly>
            <div className="h-screen bg-slate-100 dark:bg-neutral-950 flex overflow-hidden font-sans text-slate-900 dark:text-slate-100">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed lg:relative inset-y-0 left-0 z-40
                    w-72 lg:w-80 flex-shrink-0 flex flex-col 
                    border-r border-slate-200 dark:border-neutral-800 
                    bg-white dark:bg-black
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    {/* Logo Area */}
                    <div className="h-16 lg:h-24 flex items-center justify-between px-4 lg:px-8 border-b border-slate-200 dark:border-neutral-800">
                        <Link href="/" className="flex items-center gap-3 lg:gap-4 group">
                            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                                <Sparkles className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-bold text-base lg:text-lg leading-none uppercase tracking-tighter">Insight<br />Weaver</span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 lg:py-8 px-0 overflow-y-auto">
                        <div className="px-4 lg:px-8 mb-6">
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 block mb-4 text-left">
                                Main Modules
                            </span>
                            <div className="space-y-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavClick(item.id)}
                                        className={`group w-full flex items-center justify-between px-0 py-3 transition-all border-b border-transparent hover:border-slate-200 dark:hover:border-neutral-800 ${currentView === item.id
                                            ? 'text-brand-600 dark:text-white'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon className={`w-4 h-4 ${currentView === item.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                            <span className={`font-mono text-xs uppercase tracking-widest ${currentView === item.id ? 'font-bold' : 'font-medium'}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                        {currentView === item.id && (
                                            <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="px-4 lg:px-8 space-y-4">
                            <button
                                onClick={() => setIsProductGuideOpen(true)}
                                className="w-full flex items-center gap-4 px-0 py-3 text-slate-500 hover:text-brand-500 transition-colors border-b border-transparent hover:border-brand-500"
                            >
                                <Info className="w-4 h-4" />
                                <span className="font-mono text-xs uppercase tracking-widest font-medium">Product Guide</span>
                            </button>

                            <div className="hidden lg:block">
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 block mb-4 text-left">
                                    System Status
                                </span>
                                <div className="p-4 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-mono text-slate-500 uppercase">Analysis</span>
                                        <Activity className="w-3 h-3 text-brand-500" />
                                    </div>
                                    <div className="text-2xl font-display font-bold">2,840</div>
                                    <div className="text-[10px] text-slate-400 mt-1">QUERIES PROCESSED</div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* User Profile / Exit */}
                    <div className="p-4 lg:p-8 border-t border-slate-200 dark:border-neutral-800">
                        <div className="flex items-center gap-3 lg:gap-4 mb-4 text-left">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-neutral-900 flex items-center justify-center border border-slate-200 dark:border-neutral-800">
                                <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <div className="font-display font-bold text-sm uppercase">Demo User</div>
                                <div className="font-mono text-[10px] text-slate-400">ADMINISTRATOR</div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = '/';
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-neutral-800 text-xs font-mono uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors"
                        >
                            <LogOut className="w-3 h-3" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 bg-slate-100 dark:bg-neutral-950">
                    <header className="h-16 lg:h-24 flex-shrink-0 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between px-4 lg:px-10 bg-white dark:bg-black">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="text-left">
                                <div className="flex items-center gap-2 lg:gap-3 mb-0.5 lg:mb-1">
                                    <div className="w-2 h-2 bg-brand-500 animate-pulse rounded-full" />
                                    <span className="font-mono text-[10px] lg:text-xs uppercase tracking-[0.15em] lg:tracking-[0.2em] text-slate-400">Live</span>
                                </div>
                                <h1 className="text-lg lg:text-3xl font-display font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                                    {currentView === 'chat' && 'Concierge'}
                                    {currentView === 'narratives' && 'Narratives'}
                                    {currentView === 'alerts' && 'Alerts'}
                                    {currentView === 'data' && 'Data Source'}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 lg:gap-4">
                            <button
                                onClick={() => setIsWorkflowModalOpen(true)}
                                className="group flex items-center gap-2 lg:gap-3 px-3 lg:px-6 py-2 lg:py-3 bg-black dark:bg-white text-white dark:text-black font-mono text-[10px] lg:text-xs uppercase tracking-wider hover:bg-brand-600 dark:hover:bg-brand-500 transition-colors"
                            >
                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                <span className="hidden sm:inline">New Workflow</span>
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-y-auto">
                            {renderView()}
                        </div>
                    </div>
                </main>

                <WorkflowModal
                    isOpen={isWorkflowModalOpen}
                    onClose={() => setIsWorkflowModalOpen(false)}
                />

                <ProductGuide
                    isOpen={isProductGuideOpen}
                    onClose={() => setIsProductGuideOpen(false)}
                />
            </div>
        </ClientOnly>
    );
}
