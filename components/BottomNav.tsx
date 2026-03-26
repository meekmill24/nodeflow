'use client';

import { Home, Zap, FileText, Headset, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const tabs = [
    { icon: Home, label: 'home', href: '/home' },
    { icon: FileText, label: 'record', href: '/record' },
    { icon: Zap, label: 'start', href: '/start', isCenter: true },
    { icon: Headset, label: 'support', href: '#', isSupport: true },
    { icon: User, label: 'profile', href: '/profile' },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden pb-safe transition-all duration-300">
            {/* GLASS BACKGROUND WITH BLUR */}
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-2xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]" />
            
            <div className="relative grid grid-cols-5 w-full h-16 items-center">
                {tabs.map((item) => {
                    const { icon: Icon, label, href, isCenter } = item;
                    const isActive = pathname === href;
                    const translatedLabel = t(label);

                    if (isCenter) {
                        return (
                            <div key={href} className="flex flex-col items-center justify-center h-full relative">
                                <Link
                                    href={href}
                                    className="flex flex-col items-center group -mt-8"
                                >
                                    <div className="relative">
                                        {/* RADIANT GLOW BEHIND CENTER BUTTON */}
                                        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 opacity-0 group-hover:opacity-60 ${isActive ? 'bg-primary/50 opacity-60 scale-125' : 'bg-primary/30'}`} />
                                        
                                        <div
                                            className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 relative z-10 
                                                ${isActive
                                                    ? 'bg-gradient-to-br from-primary via-primary-light to-accent shadow-[0_8px_30px_rgba(59,130,246,0.6)] scale-110 rotate-[5deg]'
                                                    : 'bg-gradient-to-br from-surface-light via-surface-lighter to-surface border border-white/10 shadow-2xl hover:scale-105 active:scale-95'
                                                }`}
                                        >
                                            <Icon 
                                                size={28} 
                                                className={`transition-all duration-500 ${isActive ? 'text-white' : 'text-primary/70 group-hover:text-primary'} ${isActive ? 'animate-pulse' : ''}`} 
                                                fill={isActive ? "currentColor" : "none"}
                                            />
                                        </div>
                                    </div>
                                    <span
                                        className={`text-[8px] mt-2.5 font-black transition-all duration-300 uppercase tracking-[0.2em] italic 
                                            ${isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-text-secondary opacity-40'}`}
                                    >
                                        {translatedLabel}
                                    </span>
                                </Link>
                            </div>
                        );
                    }

                    const Content = (
                        <div className="flex flex-col items-center justify-center gap-1 group">
                            <div className="relative">
                                <Icon
                                    size={20}
                                    className={`transition-all duration-300 group-active:scale-90 ${isActive ? 'text-primary' : 'text-text-secondary opacity-50'}`}
                                />
                                {isActive && (
                                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--color-primary)]" />
                                )}
                            </div>
                            <span
                                className={`text-[9px] font-black transition-all duration-300 uppercase tracking-widest 
                                    ${isActive ? 'text-primary scale-105' : 'text-text-secondary opacity-40'}`}
                            >
                                {translatedLabel}
                            </span>
                        </div>
                    );

                    return (
                        <div key={label} className="flex items-center justify-center h-full">
                            {item.isSupport ? (
                                <button
                                    onClick={() => (window as any).Tawk_API?.maximize()}
                                    className="w-full h-full flex items-center justify-center transition-all duration-300"
                                >
                                    {Content}
                                </button>
                            ) : (
                                <Link
                                    href={href}
                                    className="w-full h-full flex items-center justify-center transition-all duration-300"
                                >
                                    {Content}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
