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
    X as XIcon,
    Download
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
        <header className="h-16 sm:h-20 lg:h-24 sticky top-0 z-50 flex items-center px-3 sm:px-6 lg:px-10 bg-[#0B0B1E]/90 backdrop-blur-2xl border-b border-white/5">
            <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-2 sm:gap-6">
                
                {/* Mobile & Tablet Menu & Logo */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <button 
                        onClick={onMenuClick}
                        className="lg:hidden w-10 h-10 rounded-xl bg-white/10 hover:bg-[#3DD6C8]/20 border border-white/15 hover:border-[#3DD6C8]/40 text-[#3DD6C8] shadow-lg active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                        aria-label="Toggle navigation drawer"
                    >
                        <Menu size={22} className="text-[#3DD6C8]" />
                    </button>
                    <div className="lg:hidden flex items-center gap-2 shrink-0">
                         <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-950 border border-[#3DD6C8]/30 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(61,214,200,0.25)] shrink-0">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_5px_rgba(61,214,200,0.5)]" />
                         </div>
                    </div>
                    {/* Desktop Status Indicators */}
                    <div className="hidden lg:flex items-center gap-6">
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

                <div className="flex items-center gap-1.5 sm:gap-3 md:gap-5 ml-auto shrink-0 min-w-0">
                    {/* ASSET PILL */}
                    <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 rounded-2xl sm:rounded-[24px] px-2.5 sm:px-5 py-1.5 sm:py-2.5 bg-black/50 border border-white/10 shadow-2xl group cursor-pointer active:scale-95 transition-all shrink-0">
                        <div className="flex flex-col">
                            <span className="text-[6.5px] sm:text-[7px] font-black text-white/40 uppercase tracking-[0.2em] sm:tracking-[0.4em] leading-none mb-0.5 sm:mb-1">BALANCE</span>
                            <span className="text-xs sm:text-sm lg:text-xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-md">
                                {format(profile?.wallet_balance ?? 0)}
                            </span>
                        </div>
                        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 flex items-center justify-center text-[#3DD6C8] group-hover:scale-110 transition-transform shrink-0">
                             <Wallet size={15} className="sm:hidden" />
                             <Wallet size={18} className="hidden sm:block" />
                        </div>
                    </div>

                    <div className="h-10 w-[1px] bg-white/10 hidden lg:block mx-1" />

                    {/* ACTIONS */}
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
                        {/* Mobile & Tablet Install App Trigger */}
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    window.dispatchEvent(new CustomEvent('open-pwa-install'));
                                }
                            }}
                            className="hidden sm:flex lg:hidden p-2.5 sm:p-3 rounded-2xl bg-[#3DD6C8]/10 hover:bg-[#3DD6C8]/20 border border-[#3DD6C8]/30 text-[#3DD6C8] shadow-lg active:scale-95 transition-all items-center gap-1.5 shrink-0"
                            title="Install App"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-wider">App</span>
                        </button>
                        {/* Notifs */}
                        <div className="relative shrink-0" ref={notifRef}>
                             <button 
                                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl transition-all relative border flex items-center justify-center shrink-0 ${isNotifOpen ? 'bg-[#3DD6C8]/10 border-[#3DD6C8]/30 text-[#3DD6C8]' : 'bg-white/5 border-white/5 text-white/50 hover:text-white hover:bg-white/10'}`}
                             >
                                <Bell size={18} />
                                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E34304] border-2 border-[#0B0B1E] animate-pulse" />}
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
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl transition-all border bg-white/5 border-white/5 text-white/50 hover:text-[#3DD6C8] hover:bg-white/10 hover:border-[#3DD6C8]/30 flex items-center justify-center shrink-0"
                            title="Profile"
                        >
                            <User size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
        </>
    );
}
