'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { 
    Bell, 
    User, 
    CreditCard, 
    ShieldCheck, 
    LogOut, 
    ChevronRight, 
    Settings, 
    Headset,
    Menu, 
    Sun, 
    Moon,
    Wallet,
    Cpu,
    Target,
    ChevronDown,
    Globe
} from 'lucide-react';
import { useCurrency, CurrencyCode } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { profile, signOut } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications();
    const { format, currency, setCurrency } = useCurrency();
    const { t } = useLanguage();
    const router = useRouter();
    
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!profile) return;
        const timer = setTimeout(() => {
            try {
                if ((window as any).Tawk_API?.setAttributes) {
                    (window as any).Tawk_API.setAttributes({ 'name': profile.username || 'User', 'email': profile.email }, function(error: any) {});
                }
            } catch (err) {}
        }, 3000);
        return () => clearTimeout(timer);
    }, [profile]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-20 md:h-24 sticky top-0 z-50 flex items-center px-4 md:px-10 bg-[#0B0B1E]/80 backdrop-blur-2xl border-b border-white/5">
            <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-6">
                
                {/* Mobile Menu & Logo */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onMenuClick}
                        className="md:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-white shadow-xl active:scale-95 transition-all"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="md:hidden flex items-center gap-3">
                         <div className="w-9 h-9 rounded-xl bg-slate-950 border border-[#3DD6C8]/20 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(61,214,200,0.2)]">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_5px_rgba(61,214,200,0.5)]" />
                         </div>
                    </div>
                    {/* Desktop Status Indicators */}
                    <div className="hidden md:flex items-center gap-6">
                         <div className="flex items-center gap-3 px-4 py-2 bg-[#3DD6C8]/5 border border-[#3DD6C8]/10 rounded-2xl">
                             <div className="w-2 h-2 rounded-full bg-[#3DD6C8] animate-pulse shadow-[0_0_10px_rgba(61,214,200,1)]" />
                             <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.3em]">Network Active</span>
                         </div>
                         <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl opacity-40">
                             <Target size={12} className="text-white" />
                             <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Latency 14ms</span>
                         </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-5 ml-auto">
                    {/* ASSET PILL */}
                    <div className="flex items-center gap-4 md:gap-8 rounded-[24px] px-5 py-2.5 bg-black/40 border border-white/10 shadow-2xl group cursor-pointer active:scale-95 transition-all">
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.4em] leading-none mb-1">ASSET BALANCE</span>
                            <span className="text-sm md:text-xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-md">
                                {format(profile?.wallet_balance ?? 0)}
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 flex items-center justify-center text-[#3DD6C8] group-hover:scale-110 transition-transform">
                             <Wallet size={20} />
                        </div>
                    </div>

                    <div className="h-10 w-[1px] bg-white/10 hidden md:block mx-1" />

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Notifs */}
                        <div className="relative" ref={notifRef}>
                             <button 
                                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                                className={`p-3 rounded-2xl transition-all relative border ${isNotifOpen ? 'bg-[#3DD6C8]/10 border-[#3DD6C8]/30 text-[#3DD6C8]' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                             >
                                <Bell size={20} />
                                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#E34304] border-2 border-[#0B0B1E] animate-pulse" />}
                             </button>
                             {isNotifOpen && (
                                <div className="absolute top-full right-0 mt-4 w-80 bg-[#0B0B1E] border border-white/10 rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] p-6 animate-in slide-in-from-top-2 duration-300">
                                     <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Signal Logs</h3>
                                        <button onClick={markAllRead} className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-[0.2em]">{t('mark_all_read')}</button>
                                     </div>
                                     <div className="space-y-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="py-10 text-center"><span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No Signals Found</span></div>
                                        ) : notifications.slice(0, 5).map(node => (
                                            <div key={node.id} className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                                                 <p className="text-[11px] font-black text-white transition-colors group-hover:text-[#3DD6C8]">{node.title}</p>
                                                 <p className="text-[9px] text-white/40 mt-1 line-clamp-2">{node.message}</p>
                                                 <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mt-3 block">{new Date(node.created_at).toLocaleTimeString()}</span>
                                            </div>
                                        ))}
                                     </div>
                                </div>
                             )}
                        </div>

                        {/* Profile Hub */}
                        <div className="relative" ref={profileRef}>
                             <button 
                                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                                className={`p-3 rounded-2xl transition-all border ${isProfileOpen ? 'bg-[#3DD6C8]/10 border-[#3DD6C8]/30 text-[#3DD6C8]' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                             >
                                <User size={20} />
                             </button>
                             {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-4 w-64 bg-[#0B0B1E] border border-white/10 rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-top-2 duration-300">
                                     <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 flex items-center justify-center text-[#3DD6C8] font-black italic">
                                            {profile?.username?.[0].toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-white">{profile?.username}</span>
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Node Verified</span>
                                        </div>
                                     </div>
                                     <div className="p-3">
                                        {[
                                            { icon: Settings, label: 'Settings', href: '/profile/settings' },
                                            { icon: CreditCard, label: 'Assets', href: '/profile/wallet' },
                                            { icon: ShieldCheck, label: 'Security', href: '/profile/security' },
                                        ].map((link, i) => (
                                            <Link key={i} href={link.href} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all group">
                                                <link.icon size={16} className="group-hover:text-[#3DD6C8] transition-colors" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{link.label}</span>
                                            </Link>
                                        ))}
                                        <button onClick={() => { setIsProfileOpen(false); signOut(); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 transition-all mt-4 border border-rose-500/10">
                                            <LogOut size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Disconnect</span>
                                        </button>
                                     </div>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
