'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function HeroInteractive() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    // Mouse position for parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const springConfig = { damping: 20, stiffness: 100 };
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-600, 600], [-5, 5]), springConfig);

    return (
        <motion.div
            ref={containerRef}
            className="relative w-full aspect-[16/9] bg-slate-950/80 backdrop-blur-xl border border-white/10 overflow-hidden group"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                mouseX.set(0);
                mouseY.set(0);
            }}
            style={{
                perspective: 1000
            }}
        >
            {/* Dynamic Grid Background */}
            <div className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    backgroundPosition: 'center',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
                }}
            />

            {/* Inner Floating Container (The "Machine") */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center p-8 lg:p-12"
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            >
                {/* Layer 1: Base Glass Plate */}
                <div className="relative w-full h-full border border-white/5 bg-white/5 backdrop-blur-sm shadow-2xl flex items-center justify-center">

                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-brand-500/50" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand-500/50" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-brand-500/50" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-brand-500/50" />

                    {/* Center Core */}
                    <div className="relative w-1/3 h-1/3 border border-brand-500/20 bg-brand-500/5 flex items-center justify-center">
                        <div className="absolute inset-0 bg-brand-500/10 animate-pulse" />

                        {/* Spinning Rings */}
                        <motion.div
                            className="absolute w-[120%] h-[120%] border border-dashed border-brand-500/30 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute w-[80%] h-[80%] border border-white/20 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Core Text */}
                        <div className="font-mono text-xs text-brand-500 tracking-widest z-10">
                            SYSTEM ACTIVE
                        </div>
                    </div>

                    {/* Scanning Beams */}
                    <motion.div
                        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>

            {/* Foreground UI Overlay (Static "HUD") */}
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="font-mono text-[10px] lg:text-xs text-slate-400 uppercase tracking-widest">Connected: Salesforce Data Cloud</span>
                    </div>
                    <span className="font-mono text-[10px] lg:text-xs text-brand-500/50">T-800.912</span>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4].map(i => (
                                <motion.div
                                    key={i}
                                    className="w-1 h-3 bg-brand-500/40"
                                    animate={{ opacity: [0.4, 1, 0.4], height: ['12px', '24px', '12px'] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                        <span className="font-mono text-[10px] lg:text-xs text-slate-500 uppercase tracking-widest">Neural Activity</span>
                    </div>
                    <div className="text-right">
                        <span className="block font-display font-bold text-2xl text-white/90">98.2<span className="text-base text-slate-500">%</span></span>
                        <span className="font-mono text-[10px] lg:text-xs text-slate-400 uppercase tracking-widest">Precision Score</span>
                    </div>
                </div>
            </div>

            {/* Glass Reflection Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        </motion.div>
    );
}
