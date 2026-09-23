'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { supabase } from '@/lib/supabase/index';
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
    Globe,
    Megaphone,
    X as XIcon
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
    const [announcement, setAnnouncement] = useState('');
    const [showBanner, setShowBanner] = useState(false);
    
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
        supabase.from('site_settings').select('value').eq('key', 'announcement_banner').single()
            .then(({ data }) => {
                if (!data?.value) {
                    setShowBanner(false);
                    return;
                }

                let text = '';
                let isTargeted = false;
                let targetUserIds: string[] = [];

                try {
                    const parsed = JSON.parse(data.value);
                    if (parsed && typeof parsed === 'object' && parsed.text !== undefined) {
                        text = parsed.text || '';
                        isTargeted = parsed.target === 'specific';
                        targetUserIds = Array.isArray(parsed.targetUserIds) ? parsed.targetUserIds : [];
                    } else {
                        text = data.value;
                    }
                } catch {
                    text = data.value;
                }

                if (!text) {
                    setShowBanner(false);
                    return;
                }

                // If targeted to specific users, only show if current worker's ID is included
                if (isTargeted) {
                    if (!profile?.id || !targetUserIds.includes(profile.id)) {
                        setShowBanner(false);
                        return;
                    }
                }

                const dismissedKey = `banner_dismissed_${text.slice(0, 20)}`;
                if (!sessionStorage.getItem(dismissedKey)) {
                    setAnnouncement(text);
                    setShowBanner(true);
                } else {
                    setShowBanner(false);
                }
            });
    }, [profile?.id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
        {showBanner && announcement && (
            <div className="sticky top-0 z-[60] flex items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-amber-600/90 to-orange-600/90 backdrop-blur-xl border-b border-amber-500/30 shadow-lg shadow-amber-500/10">
                <div className="flex items-center gap-2.5 flex-1">
                    <Megaphone size={14} className="text-amber-100 shrink-0" />
                    <p className="text-amber-50 text-[11px] font-bold tracking-wide">{announcement}</p>
                </div>
                <button
                    onClick={() => { setShowBanner(false); sessionStorage.setItem(`banner_dismissed_${announcement.slice(0, 20)}`, '1'); }}
                    className="p-1 text-amber-200/60 hover:text-white transition-colors shrink-0"
                >
                    <XIcon size={14} />
                </button>
            </div>
        )}
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
                                <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-[#0B0B1E]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_30px_90px_rgba(0,0,0,0.9)] p-5 z-50 animate-in slide-in-from-top-2 duration-300">
                                     <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#3DD6C8] animate-pulse" />
                                            <h3 className="text-xs font-bold text-white tracking-wider uppercase">Signal Logs</h3>
                                        </div>
                                        {unreadCount > 0 && (
                                            <button 
                                                onClick={markAllRead} 
                                                className="text-xs font-semibold text-[#3DD6C8] hover:text-[#3DD6C8]/80 transition-colors"
                                            >
                                                {t('mark_all_read')}
                                            </button>
                                        )}
                                     </div>
                                     <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="py-12 text-center text-white/30 text-xs font-medium">No signals found</div>
                                        ) : notifications.slice(0, 10).map(node => (
                                            <div 
                                                key={node.id} 
                                                onClick={() => markAsRead(node.id)}
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                                                    !node.is_read 
                                                        ? 'bg-[#3DD6C8]/10 border-[#3DD6C8]/30 hover:border-[#3DD6C8]/50' 
                                                        : 'bg-white/[0.03] border-white/5 hover:border-white/15 hover:bg-white/[0.06]'
                                                }`}
                                            >
                                                 <div className="flex items-center justify-between gap-2">
                                                     <p className="text-sm font-semibold text-white group-hover:text-[#3DD6C8] transition-colors">{node.title}</p>
                                                     {!node.is_read && (
                                                         <span className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] shrink-0" />
                                                     )}
                                                 </div>
                                                 <p className="text-xs text-white/70 mt-1 line-clamp-3 leading-relaxed font-normal">{node.message}</p>
                                                 <span className="text-[10px] font-medium text-white/40 mt-2 block">{new Date(node.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                            </div>
                                        ))}
                                     </div>
                                </div>
                             )}
                        </div>

                        {/* Profile Hub */}
                        <Link 
                            href="/profile"
                            className="p-3 rounded-2xl transition-all border bg-white/5 border-white/5 text-white/40 hover:text-[#3DD6C8] hover:bg-white/10 hover:border-[#3DD6C8]/30 flex items-center justify-center"
                            title="Profile"
                        >
                            <User size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
        </>
    );
}
