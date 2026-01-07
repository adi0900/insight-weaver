'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrutalistLoader({ onLoadingComplete }: { onLoadingComplete?: () => void }) {
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Counter animation
        const duration = 2000; // 2 seconds loading time
        const interval = 20;
        const steps = duration / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setCount((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsLoading(false);
                        if (onLoadingComplete) onLoadingComplete();
                    }, 500); // Slight pause at 100%
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onLoadingComplete]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
                    exit={{
                        y: '-100%',
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // Custom bezier for snappy "shutter" feel
                    }}
                >
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-[0.05]"
                        style={{
                            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                            backgroundSize: '100px 100px'
                        }}
                    />

                    {/* Corner Indicators */}
                    <div className="absolute top-0 left-0 p-8 md:p-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-2 h-2 bg-brand-500" />
                            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">System Boot</span>
                        </motion.div>
                    </div>

                    <div className="absolute top-0 right-0 p-8 md:p-12">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="font-mono text-xs text-slate-500 uppercase tracking-widest"
                        >
                            Ver 2.0.4
                        </motion.div>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 md:p-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col gap-1"
                        >
                            <span className="font-mono text-xs text-slate-600 uppercase">Memory Check</span>
                            <span className="font-mono text-xs text-brand-500 uppercase">OK</span>
                        </motion.div>
                    </div>

                    <div className="absolute bottom-0 right-0 p-8 md:p-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-right"
                        >
                            <span className="font-mono text-xs text-slate-600 uppercase block mb-1">Status</span>
                            <div className="flex items-center gap-2 justify-end">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="font-mono text-xs text-white uppercase">Online</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Center Content */}
                    <div className="relative z-10 w-full max-w-2xl px-6">
                        {/* Main Counter */}
                        <div className="flex items-baseline justify-center mb-4 overflow-hidden">
                            <motion.span
                                className="text-[15vw] md:text-[12rem] font-display font-bold text-white leading-none tracking-tighter"
                            >
                                {Math.floor(count)}
                            </motion.span>
                            <span className="text-2xl md:text-4xl font-mono text-brand-500 ml-2 mb-4 md:mb-8">%</span>
                        </div>

                        {/* Progress Line */}
                        <div className="w-full h-px bg-slate-800 relative">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-brand-500"
                                style={{ width: `${count}%` }}
                            />
                        </div>

                        {/* Dynamic Loading Text */}
                        <div className="flex justify-between mt-2 font-mono text-xs uppercase tracking-wider text-slate-500 h-4">
                            <span>
                                {count < 30 ? 'Initializing core systems...' :
                                    count < 60 ? 'Loading narrative engine...' :
                                        count < 90 ? 'Establishing secure link...' :
                                            'Ready.'}
                            </span>
                            <span>{Math.floor(count).toString().padStart(3, '0')} / 100</span>
                        </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
