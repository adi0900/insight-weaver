'use client';

import { useState, useEffect } from 'react';
import {
    MessageSquare,
    FileText,
    Bell,
    Database,
    Sparkles,
    User,
    LogOut,
    Info,
    Menu,
    X,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const AgentChat = dynamic(() => import('@/components/AgentChat').then(m => m.AgentChat), { ssr: false });
const NarrativeTimeline = dynamic(() => import('@/components/NarrativeTimeline').then(m => m.NarrativeTimeline), { ssr: false });
const AlertDashboard = dynamic(() => import('@/components/AlertDashboard').then(m => m.AlertDashboard), { ssr: false });
const DataSourcePanel = dynamic(() => import('@/components/DataSourcePanel').then(m => m.DataSourcePanel), { ssr: false });
const WorkflowModal = dynamic(() => import('@/components/WorkflowModal').then(m => m.WorkflowModal), { ssr: false });
const ProductGuide = dynamic(() => import('@/components/ProductGuide').then(m => m.ProductGuide), { ssr: false });

type View = 'chat' | 'narratives' | 'alerts' | 'data';

export default function DashboardContent() {
    const [isMounted, setIsMounted] = useState(false);
    const [currentView, setCurrentView] = useState<View>('chat');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isProductGuideOpen, setIsProductGuideOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Self-healing session for demo
        if (typeof window !== 'undefined') {
            if (!localStorage.getItem('iw_token')) {
                localStorage.setItem('iw_token', 'demo-token');
            }
            if (!localStorage.getItem('custom_viz_url')) {
                localStorage.setItem('custom_viz_url', 'https://prod-in-a.online.tableau.com/t/nilambhojwaningp-2072bfe41a/views/WorldIndicators/Economy');
            }
        }
    }, []);

    const navItems: { id: View; label: string; icon: any }[] = [
        { id: 'chat', label: 'Concierge', icon: MessageSquare },
        { id: 'narratives', label: 'Narratives', icon: FileText },
        { id: 'alerts', label: 'Alerts', icon: Bell },
        { id: 'data', label: 'Data Sources', icon: Database },
    ];

    const renderView = () => {
        switch (currentView) {
            case 'chat': return <AgentChat />;
            case 'narratives': return <NarrativeTimeline />;
            case 'alerts': return <AlertDashboard />;
            case 'data': return <DataSourcePanel />;
            default: return <AgentChat />;
        }
    };

    if (!isMounted) return null;

    return (
        <div className="h-screen bg-slate-100 dark:bg-neutral-950 flex overflow-hidden font-sans text-slate-900 dark:text-slate-100">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-white dark:bg-black border-b border-slate-200 dark:border-neutral-800 z-50 flex items-center justify-between px-4">
                <button onClick={() => setSidebarOpen(true)} className="p-2">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="font-display font-bold uppercase tracking-tighter">Insight Weaver</div>
                <div className="w-10" />
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed lg:relative inset-y-0 left-0 z-40
                w-72 lg:w-80 flex-shrink-0 flex flex-col 
                border-r border-slate-200 dark:border-neutral-800 
                bg-white dark:bg-black
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-16 lg:h-24 flex items-center justify-between px-4 lg:px-8 border-b border-slate-200 dark:border-neutral-800">
                    <Link href="/" className="flex items-center gap-3 lg:gap-4 group">
                        <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center transform rotate-45">
                            <Sparkles className="w-4 h-4 -rotate-45" />
                        </div>
                        <span className="font-display font-bold text-base lg:text-lg uppercase tracking-tighter">Insight Weaver</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 py-6 lg:py-8 px-0 overflow-y-auto">
                    <div className="px-4 lg:px-8 mb-6">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 block mb-4">Main Modules</span>
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                                    className={`group w-full flex items-center justify-between px-0 py-3 transition-all border-b border-transparent ${currentView === item.id ? 'text-brand-600 dark:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className="w-4 h-4" />
                                        <span className={`font-mono text-xs uppercase tracking-widest ${currentView === item.id ? 'font-bold' : ''}`}>{item.label}</span>
                                    </div>
                                    {currentView === item.id && <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 lg:px-8 space-y-4">
                        <button onClick={() => setIsProductGuideOpen(true)} className="w-full flex items-center gap-4 py-3 text-slate-500 hover:text-brand-500 transition-colors">
                            <Info className="w-4 h-4" />
                            <span className="font-mono text-xs uppercase tracking-widest">Product Guide</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 lg:p-8 border-t border-slate-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-neutral-900 flex items-center justify-center border border-slate-200">
                            <User className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                            <div className="font-display font-bold text-sm uppercase">Admin</div>
                            <div className="font-mono text-[10px] text-slate-400">ADMINISTRATOR</div>
                        </div>
                    </div>
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                        className="w-full py-3 border border-slate-200 text-xs font-mono uppercase hover:bg-slate-50 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative overflow-hidden mt-16 lg:mt-0">
                <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900">
                    {renderView()}
                </div>
            </main>

            <ProductGuide isOpen={isProductGuideOpen} onClose={() => setIsProductGuideOpen(false)} />
        </div>
    );
}
