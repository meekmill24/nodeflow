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
    Download,
    Check,
    Trash2,
    Clock,
    ArrowRight
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

                const dismissedKey = `banner_dismissed_${profile?.id || 'guest'}_${encodeURIComponent(text.trim())}`;
                if (typeof window !== 'undefined' && !localStorage.getItem(dismissedKey)) {
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

    const getRelativeTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffSecs = Math.floor(diffMs / 1000);
            const diffMins = Math.floor(diffSecs / 60);

            if (diffSecs < 60) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            
            const isToday = date.toDateString() === now.toDateString();
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (isToday) return `Today, ${timeStr}`;

            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${timeStr}`;

            return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
        } catch {
            return dateStr;
        }
    };

    const getNotificationVisuals = (node: { title?: string; type?: string }) => {
        const title = (node.title || '').toLowerCase();
        const type = node.type || '';

        if (title.includes('deposit') || title.includes('credit') || title.includes('earn') || type === 'success') {
            return {
                icon: Wallet,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/15 border-emerald-500/30',
                badge: 'DEPOSIT'
            };
        }
        if (title.includes('withdraw') || title.includes('payout')) {
            return {
                icon: CreditCard,
                color: 'text-[#3DD6C8]',
                bg: 'bg-[#3DD6C8]/15 border-[#3DD6C8]/30',
                badge: 'PAYOUT'
            };
        }
        if (title.includes('hour') || title.includes('working') || title.includes('broadcast') || title.includes('notice') || title.includes('announc')) {
            return {
                icon: Megaphone,
                color: 'text-amber-400',
                bg: 'bg-amber-500/15 border-amber-500/30',
                badge: 'NOTICE'
            };
        }
        if (title.includes('security') || title.includes('password') || title.includes('shield') || type === 'danger') {
            return {
                icon: ShieldCheck,
                color: 'text-rose-400',
                bg: 'bg-rose-500/15 border-rose-500/30',
                badge: 'SECURITY'
            };
        }
        return {
            icon: Cpu,
            color: 'text-blue-400',
            bg: 'bg-blue-500/15 border-blue-500/30',
            badge: 'SIGNAL'
        };
    };

    return (
        <div className="sticky top-0 z-50">
        {showBanner && announcement && (
            <div className="flex items-center justify-between gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600/95 to-orange-600/95 backdrop-blur-xl border-b border-amber-500/30 shadow-lg shadow-amber-500/10">
                <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                    <Megaphone size={14} className="text-amber-100 shrink-0" />
                    <p className="text-amber-50 text-[10px] sm:text-[11px] font-bold tracking-wide leading-snug break-words truncate sm:whitespace-normal">{announcement}</p>
                </div>
                <button
                    onClick={() => { 
                        setShowBanner(false); 
                        if (typeof window !== 'undefined') {
                            localStorage.setItem(`banner_dismissed_${profile?.id || 'guest'}_${encodeURIComponent(announcement.trim())}`, '1'); 
                        }
                    }}
                    className="p-1 text-amber-200/80 hover:text-white transition-colors shrink-0 cursor-pointer"
                    aria-label="Dismiss banner"
                >
                    <XIcon size={14} />
                </button>
            </div>
        )}
        <header className="h-[4.25rem] sm:h-20 lg:h-24 flex items-center px-3.5 sm:px-6 lg:px-10 bg-[#0B0B1E]/90 backdrop-blur-2xl border-b border-white/5">
            <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-2.5 sm:gap-6">
                
                {/* Mobile & Tablet Menu & Logo */}
                <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                    <button 
                        onClick={onMenuClick}
                        className="lg:hidden w-10 h-10 rounded-2xl bg-white/10 hover:bg-[#3DD6C8]/20 border border-white/15 hover:border-[#3DD6C8]/40 text-[#3DD6C8] shadow-lg active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                        aria-label="Toggle navigation drawer"
                    >
                        <Menu size={22} className="text-[#3DD6C8]" />
                    </button>
                    <div className="lg:hidden flex items-center gap-2 shrink-0">
                         <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-950 border border-[#3DD6C8]/30 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(61,214,200,0.25)] shrink-0">
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

                <div className="flex items-center gap-2 sm:gap-3 md:gap-5 ml-auto shrink-0 min-w-0">
                    {/* ASSET PILL */}
                    <div className="flex items-center gap-2.5 sm:gap-4 lg:gap-8 rounded-2xl sm:rounded-[24px] px-3 sm:px-5 py-2 sm:py-2.5 bg-black/50 border border-white/10 shadow-2xl group cursor-pointer active:scale-95 transition-all shrink-0">
                        <div className="flex flex-col">
                            <span className="text-[7.5px] sm:text-[8px] font-black text-white/50 uppercase tracking-[0.25em] sm:tracking-[0.4em] leading-none mb-1">BALANCE</span>
                            <span className="text-xs sm:text-base lg:text-xl font-black text-white italic tracking-tight uppercase leading-none drop-shadow-md">
                                {format(profile?.wallet_balance ?? 0)}
                            </span>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 flex items-center justify-center text-[#3DD6C8] group-hover:scale-110 transition-transform shrink-0">
                             <Wallet size={16} className="sm:hidden" />
                             <Wallet size={18} className="hidden sm:block" />
                        </div>
                    </div>

                    <div className="h-10 w-[1px] bg-white/10 hidden lg:block mx-1" />

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 sm:gap-2 lg:gap-3 shrink-0">
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
                                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl transition-all relative border flex items-center justify-center shrink-0 ${isNotifOpen ? 'bg-[#3DD6C8]/10 border-[#3DD6C8]/30 text-[#3DD6C8]' : 'bg-white/5 border-white/5 text-white/50 hover:text-white hover:bg-white/10'}`}
                             >
                                <Bell size={19} />
                                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E34304] border-2 border-[#0B0B1E] animate-pulse" />}
                             </button>
                             {isNotifOpen && (
                                <>
                                    {/* Mobile backdrop overlay */}
                                    <div 
                                        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[65] sm:hidden animate-fade-in"
                                        onClick={() => setIsNotifOpen(false)}
                                    />
                                    <div 
                                        data-notif-panel="true"
                                        className="fixed inset-x-3 sm:inset-x-auto sm:right-0 sm:absolute top-[4.5rem] sm:top-full mt-1.5 sm:mt-3 w-auto sm:w-[410px] bg-[#0B0B1E]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_30px_90px_rgba(0,0,0,0.95)] p-4 sm:p-5 z-[70] animate-in slide-in-from-top-2 duration-300 max-h-[82vh] sm:max-h-[540px] flex flex-col"
                                    >
                                         <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/5 shrink-0">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#3DD6C8] animate-pulse shadow-[0_0_8px_rgba(61,214,200,0.8)]" />
                                                <h3 className="text-xs font-bold text-white tracking-wider uppercase">Signal Logs</h3>
                                                {unreadCount > 0 && (
                                                    <span className="px-1.5 py-0.5 rounded-full bg-[#E34304] text-[9px] font-black text-white leading-none">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {unreadCount > 0 && (
                                                    <button 
                                                        onClick={markAllRead} 
                                                        className="text-[11px] font-bold text-[#3DD6C8] hover:text-[#3DD6C8]/80 transition-colors cursor-pointer flex items-center gap-1"
                                                        title={t('mark_all_read')}
                                                    >
                                                        <Check size={13} /> {t('mark_all_read')}
                                                    </button>
                                                )}
                                                {notifications.length > 0 && (
                                                    <button
                                                        onClick={clearAll}
                                                        className="p-1 text-white/30 hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5"
                                                        title="Clear All Notifications"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setIsNotifOpen(false)}
                                                    className="sm:hidden p-1 text-white/40 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5 ml-1"
                                                    aria-label="Close notification panel"
                                                >
                                                    <XIcon size={14} />
                                                </button>
                                            </div>
                                         </div>

                                         <div className="space-y-2.5 overflow-y-auto pr-1 custom-scrollbar flex-1 min-h-0">
                                            {notifications.length === 0 ? (
                                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-1">
                                                        <Bell size={22} className="opacity-40" />
                                                    </div>
                                                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider">All Clear • No New Signals</p>
                                                    <p className="text-[10px] text-white/40 max-w-[200px]">System communications and ledger audits will be displayed here.</p>
                                                </div>
                                            ) : notifications.slice(0, 10).map(node => {
                                                const visual = getNotificationVisuals(node);
                                                const VisualIcon = visual.icon;
                                                return (
                                                    <div 
                                                        key={node.id} 
                                                        onClick={() => markAsRead(node.id)}
                                                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer group flex items-start gap-3 ${
                                                            !node.is_read 
                                                                ? 'bg-[#3DD6C8]/10 border-[#3DD6C8]/30 hover:border-[#3DD6C8]/50' 
                                                                : 'bg-white/[0.03] border-white/5 hover:border-white/15 hover:bg-white/[0.06]'
                                                        }`}
                                                    >
                                                         <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${visual.bg} ${visual.color}`}>
                                                             <VisualIcon size={15} />
                                                         </div>
                                                         <div className="flex-1 min-w-0">
                                                             <div className="flex items-center justify-between gap-2">
                                                                 <p className="text-xs sm:text-sm font-bold text-white group-hover:text-[#3DD6C8] transition-colors truncate">
                                                                     {node.title}
                                                                 </p>
                                                                 <div className="flex items-center gap-1.5 shrink-0">
                                                                     <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">
                                                                         {visual.badge}
                                                                     </span>
                                                                     {!node.is_read && (
                                                                         <span className="w-2 h-2 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_rgba(61,214,200,0.8)] shrink-0" />
                                                                     )}
                                                                 </div>
                                                             </div>
                                                             <p className="text-xs text-white/70 mt-1 line-clamp-3 leading-relaxed font-normal">{node.message}</p>
                                                             <div className="flex items-center gap-1 text-[10px] font-medium text-white/40 mt-2">
                                                                 <Clock size={11} className="opacity-60" />
                                                                 <span>{getRelativeTime(node.created_at)}</span>
                                                             </div>
                                                         </div>
                                                    </div>
                                                );
                                            })}
                                         </div>

                                         <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between shrink-0">
                                             <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                                 {notifications.length} {notifications.length === 1 ? 'Signal' : 'Signals'}
                                             </span>
                                             <Link
                                                 href="/notifications"
                                                 onClick={() => setIsNotifOpen(false)}
                                                 className="text-[11px] font-black text-[#3DD6C8] hover:text-[#3DD6C8]/80 flex items-center gap-1.5 uppercase tracking-wider group transition-colors cursor-pointer"
                                             >
                                                 Signal Archive <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                             </Link>
                                         </div>
                                    </div>
                                </>
                             )}
                        </div>

                        {/* Profile Hub */}
                        <Link 
                            href="/profile"
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl transition-all border bg-white/5 border-white/5 text-white/50 hover:text-[#3DD6C8] hover:bg-white/10 hover:border-[#3DD6C8]/30 flex items-center justify-center shrink-0"
                            title="Profile"
                        >
                            <User size={19} />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
        </div>
    );
}
