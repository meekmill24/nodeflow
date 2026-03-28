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
        <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden pb-safe">
            {/* ULTRA GLASS DOCKSIDE */}
            <div className="absolute inset-0 bg-[#0B0B1E]/90 backdrop-blur-3xl border-t border-white/5 shadow-[0_-20px_60px_rgba(0,0,0,0.8)]" />
            
            <div className="relative grid grid-cols-5 w-full h-20 items-center px-2">
                {tabs.map((item) => {
                    const { icon: Icon, label, href, isCenter } = item;
                    const isActive = pathname === href;
                    const translatedLabel = t(label);

                    if (isCenter) {
                        return (
                            <div key={href} className="flex flex-col items-center justify-center h-full relative">
                                <Link
                                    href={href}
                                    className="flex flex-col items-center group -mt-10"
                                >
                                    <div className="relative">
                                        <div className={`absolute inset-0 rounded-[28px] blur-2xl transition-all duration-700 ${isActive ? 'bg-[#3DD6C8]/60 opacity-100 scale-125' : 'bg-[#3DD6C8]/20 opacity-0 group-hover:opacity-40'}`} />
                                        
                                        <div
                                            className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 relative z-10 border
                                                ${isActive
                                                    ? 'bg-[#3DD6C8] border-[#3DD6C8] shadow-[0_10px_40px_rgba(61,214,200,0.5)] rotate-[5deg] scale-110'
                                                    : 'bg-slate-900 border-white/10 shadow-2xl hover:scale-105 active:scale-95'
                                                }`}
                                        >
                                            <Icon 
                                                size={32} 
                                                className={`transition-all duration-500 ${isActive ? 'text-[#0B0B1E]' : 'text-[#3DD6C8] group-hover:scale-110'}`} 
                                                fill={isActive ? "currentColor" : "none"}
                                            />
                                        </div>
                                    </div>
                                    <span
                                        className={`text-[8px] mt-2 font-black transition-all duration-500 uppercase tracking-[0.2em] italic 
                                            ${isActive ? 'text-[#3DD6C8]' : 'text-white/20'}`}
                                    >
                                        {translatedLabel}
                                    </span>
                                </Link>
                            </div>
                        );
                    }

                    const Content = (
                        <div className="flex flex-col items-center justify-center gap-1.5 group">
                            <div className="relative">
                                <Icon
                                    size={22}
                                    className={`transition-all duration-500 group-active:scale-90 ${isActive ? 'text-[#3DD6C8]' : 'text-white/20 group-hover:text-white'}`}
                                />
                                {isActive && (
                                    <div className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 bg-[#3DD6C8] rounded-full animate-pulse shadow-[0_0_10px_rgba(61,214,200,1)]" />
                                )}
                            </div>
                            <span
                                className={`text-[8px] font-black transition-all duration-500 uppercase tracking-widest 
                                    ${isActive ? 'text-[#3DD6C8]' : 'text-white/20'}`}
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
