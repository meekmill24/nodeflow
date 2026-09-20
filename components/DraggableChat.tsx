'use client';

import { motion, useDragControls } from 'framer-motion';
import { Headset } from 'lucide-react';
import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

export default function DraggableChat() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();
    
    useEffect(() => {
        // Delay visibility to ensure Tawk is loaded
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const toggleChat = () => {
        const tawk = (window as any).Tawk_API;
        if (tawk && typeof tawk.maximize === 'function') {
            if (typeof tawk.isChatMaximized === 'function' && tawk.isChatMaximized()) {
                tawk.minimize?.();
                tawk.hideWidget?.();
            } else {
                tawk.showWidget?.();
                tawk.maximize?.();
            }
        } else {
            window.location.href = '/service';
        }
    };

    if (!isVisible || pathname?.startsWith('/admin')) return null;

    return (
        <motion.div
            drag
            dragMomentum={false}
            className="fixed bottom-24 right-6 z-[9999] cursor-grab active:cursor-grabbing md:bottom-10 md:right-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="relative group">
                {/* Curved "We Are Here!" Text */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                    <div className="relative">
                        <svg viewBox="0 0 100 40" className="w-24 h-10 overflow-visible">
                            <path id="curve" d="M 0 30 Q 50 0 100 30" fill="transparent" />
                            <text className="fill-blue-400 text-[10px] font-black uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(37,99,235,0.7)]">
                                <textPath href="#curve" startOffset="50%" textAnchor="middle">
                                    We Are Here!
                                </textPath>
                            </text>
                        </svg>
                    </div>
                </div>

                {/* The Chat Bubble */}
                <button
                    onClick={toggleChat}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 border-2 border-blue-300/40 shadow-[0_10px_40px_rgba(37,99,235,0.6)] flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300 overflow-hidden"
                >
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-blue-400/25 animate-pulse-slow" />
                    
                    {/* Reflective Shine */}
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/20 rotate-45 transform pointer-events-none" />

                    <Headset size={30} className="text-white relative z-10 drop-shadow-md" />

                    {/* Online Pulse Indicator */}
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 bg-emerald-400 rounded-full">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                    </div>

                    {/* Notification Badge */}
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-400 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-lg">
                        <span className="text-[10px] font-black text-slate-950">1</span>
                    </div>
                </button>

                {/* Subtext Background Indicator */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md px-3 py-0.5 rounded-full border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">Support Online</span>
                </div>
            </div>
        </motion.div>
    );
}
