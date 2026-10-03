'use client';

import { Home, Zap, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const tabs = [
    { icon: Home, label: 'home', href: '/home' },
    { icon: Zap, label: 'start', href: '/start', isCenter: true },
    { icon: FileText, label: 'record', href: '/record' },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const getDisplayLabel = (lbl: string, raw: string) => {
        if (lbl === 'record' && raw.toLowerCase().includes('task record')) return 'Records';
        return raw;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden pointer-events-none md:bottom-5 md:px-6">
            {/* Tablet & Mobile Dock Shell */}
            <div className="pointer-events-auto relative w-full md:max-w-md md:mx-auto">
                {/* Background Glass Dock */}
                <div className="absolute inset-0 bg-[#0B0B1E]/95 backdrop-blur-3xl border-t md:border border-white/10 md:rounded-[32px] shadow-[0_-15px_40px_rgba(0,0,0,0.85)] md:shadow-[0_25px_60px_rgba(0,0,0,0.9)]" />

                {/* Subtle Neon Top Highlight */}
                <div className="absolute top-0 inset-x-6 md:inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-[#3DD6C8]/50 to-transparent pointer-events-none" />

                <div className="relative grid grid-cols-3 w-full h-[4.75rem] sm:h-20 items-center px-3 sm:px-6 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:pb-0">
                    {tabs.map((item) => {
                        const { icon: Icon, label, href, isCenter } = item;
                        const isActive = pathname === href || (href === '/start' && pathname.startsWith('/start'));
                        const rawLabel = t(label);
                        const displayLabel = getDisplayLabel(label, rawLabel);

                        if (isCenter) {
                            return (
                                <div key={href} className="flex flex-col items-center justify-center h-full relative">
                                    <Link
                                        href={href}
                                        className="flex flex-col items-center group -translate-y-4 sm:-translate-y-5 focus:outline-none"
                                    >
                                        <div className="relative">
                                            {/* Center Button Ambient Aura Glow */}
                                            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#3DD6C8] to-teal-400 opacity-75 blur-md animate-pulse group-hover:opacity-100 transition-opacity" />

                                            {/* Center Action Button */}
                                            <div
                                                className={`w-[3.75rem] h-[3.75rem] sm:w-16 sm:h-16 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ring-4 ring-[#0B0B1E] border border-white/40
                                                    ${isActive
                                                        ? 'bg-gradient-to-tr from-[#169387] via-[#3DD6C8] to-[#7ef1e4] shadow-[0_10px_35px_rgba(61,214,200,0.6)] scale-105'
                                                        : 'bg-gradient-to-tr from-[#198b80] via-[#3DD6C8] to-[#5eead4] shadow-[0_8px_30px_rgba(61,214,200,0.45)] group-hover:scale-105 active:scale-95'
                                                    }`}
                                            >
                                                <Icon 
                                                    size={27} 
                                                    className="text-[#0B0B1E] transition-transform duration-300 group-hover:scale-110" 
                                                    fill="currentColor"
                                                />
                                            </div>
                                        </div>
                                        <span className="text-[9.5px] sm:text-[10px] mt-1 font-black transition-all duration-300 uppercase tracking-widest italic text-[#3DD6C8] drop-shadow-[0_0_8px_rgba(61,214,200,0.7)]">
                                            {displayLabel}
                                        </span>
                                    </Link>
                                </div>
                            );
                        }

                        const Content = (
                            <div className="flex flex-col items-center justify-center gap-0.5 group py-1">
                                <div className={`relative px-4 py-1.5 rounded-2xl transition-all duration-300 ${
                                    isActive ? 'bg-[#3DD6C8]/15 border border-[#3DD6C8]/30 shadow-[0_0_15px_rgba(61,214,200,0.25)]' : 'bg-transparent border border-transparent'
                                }`}>
                                    <Icon
                                        size={23}
                                        className={`transition-all duration-300 group-active:scale-90 ${
                                            isActive ? 'text-[#3DD6C8]' : 'text-white/40 group-hover:text-white/80'
                                        }`}
                                    />
                                </div>
                                <span
                                    className={`text-[10.5px] sm:text-[11px] font-black transition-all duration-300 uppercase tracking-wider text-center line-clamp-1 ${
                                        isActive ? 'text-[#3DD6C8] drop-shadow-[0_0_6px_rgba(61,214,200,0.5)]' : 'text-white/40 group-hover:text-white/70'
                                    }`}
                                >
                                    {displayLabel}
                                </span>
                                {/* Active Bottom Indicator Pill */}
                                {isActive && (
                                    <div className="w-4 h-0.5 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_rgba(61,214,200,1)] animate-pulse" />
                                )}
                            </div>
                        );

                        return (
                            <div key={label} className="flex items-center justify-center h-full">
                                <Link
                                    href={href}
                                    className="w-full h-full flex items-center justify-center transition-all duration-200 active:scale-95"
                                >
                                    {Content}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
