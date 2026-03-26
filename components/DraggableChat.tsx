'use client';

import { motion, useDragControls } from 'framer-motion';
import { Headset } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DraggableChat() {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Delay visibility to ensure Tawk is loaded
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const toggleChat = () => {
        const tawk = (window as any).Tawk_API;
        if (tawk) {
            if (typeof tawk.isChatMaximized === 'function' && tawk.isChatMaximized()) {
                tawk.minimize?.();
            } else {
                tawk.showWidget?.();
                tawk.maximize?.();
            }
        }
    };

    if (!isVisible) return null;

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
                            <text className="fill-primary-light text-[10px] font-black uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
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
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary-dark to-surface-light border-2 border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300 overflow-hidden"
                >
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-primary/20 animate-pulse-slow" />
                    
                    {/* Reflective Shine */}
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rotate-45 transform pointer-events-none" />

                    <Headset size={30} className="text-white relative z-10 drop-shadow-md" />

                    {/* Online Pulse Indicator */}
                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-success rounded-full">
                        <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-75" />
                    </div>

                    {/* Notification Badge */}
                    <div className="absolute top-2 right-2 w-5 h-5 bg-success rounded-full border-2 border-[#1a1421] flex items-center justify-center shadow-lg">
                        <span className="text-[10px] font-black text-white">1</span>
                    </div>
                </button>

                {/* Subtext Background Indicator (Optional, like the screenshot) */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-surface/80 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black text-primary-light uppercase tracking-tighter">Support Online</span>
                </div>
            </div>
        </motion.div>
    );
}
