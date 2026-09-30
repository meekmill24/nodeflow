'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/index';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { LiveActivityMap } from '@/components/landing/LiveActivityMap';
import { 
    ArrowUpRight, 
    ArrowDownLeft, 
    Building2, 
    FileText, 
    ChevronRight, 
    Play, 
    TrendingUp, 
    ShieldCheck, 
    Clock, 
    ArrowRight,
    LogOut,
    Sparkles,
    Users,
    Award,
    Lock,
    Headset,
    Activity,
    Cpu,
    Zap,
    Network,
    Wallet,
    HelpCircle,
    ShieldAlert,
    Copy,
    Map,
    ExternalLink,
    Star,
    Share2,
    Check,
    BarChart3,
    Layers,
    Link2
} from 'lucide-react';
import { toast } from 'sonner';

export default function HomePage() {
    const { profile, signOut } = useAuth();
    const { t } = useLanguage();
    const { format } = useCurrency();
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
    });
    const [referralStats, setReferralStats] = useState({
        totalReferrals: 0,
        commissionEarned: 0
    });
    const [referralCopied, setReferralCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [levels, setLevels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [referralRate, setReferralRate] = useState('20');
    const [hubFilter, setHubFilter] = useState<'all' | 'finance' | 'protocol' | 'support'>('all');

    const handleCopyCode = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!profile?.referral_code) return;
        navigator.clipboard.writeText(profile.referral_code);
        setReferralCopied(true);
        toast.success('Referral code copied to clipboard!');
        setTimeout(() => setReferralCopied(false), 2000);
    };

    const handleCopyLink = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const link = typeof window !== 'undefined' && profile?.referral_code
            ? `${window.location.origin}/auth/sign-up?ref=${profile.referral_code}`
            : '';
        if (!link) return;
        navigator.clipboard.writeText(link);
        setLinkCopied(true);
        toast.success('Invite link copied to clipboard!');
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleShareLink = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const link = typeof window !== 'undefined' && profile?.referral_code
            ? `${window.location.origin}/auth/sign-up?ref=${profile.referral_code}`
            : '';
        if (typeof navigator !== 'undefined' && navigator.share && link) {
            try {
                await navigator.share({
                    title: 'Join NodeFlow Network',
                    text: `Join NodeFlow using my referral code ${profile?.referral_code || ''} to start earning task rewards:`,
                    url: link,
                });
            } catch (err) {
                handleCopyLink();
            }
        } else {
            handleCopyLink();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!profile) return;
            setLoading(true);
            try {
                const [allRes, levelsResult, referralRes, settingsRes] = await Promise.all([
                    supabase.from('user_tasks').select('*', { count: 'exact', head: true }).eq('user_id', profile.id),
                    supabase.from('levels').select('*').order('price', { ascending: true }).limit(4),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('referred_by', profile.id),
                    supabase.from('site_settings').select('key, value').eq('key', 'referral_commission_l1')
                ]);
                if (settingsRes.data?.[0]?.value) setReferralRate(settingsRes.data[0].value);
                setStats({
                    totalTasks: allRes.count || 0,
                    completedTasks: profile.completed_count || 0,
                    pendingTasks: Math.max(0, (allRes.count || 0) - (profile.completed_count || 0))
                });
                setReferralStats({
                    totalReferrals: referralRes.count || 0,
                    commissionEarned: profile.referral_earned || 0
                });
                if (levelsResult.data) setLevels(levelsResult.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [profile]);

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            
            {/* TERMINAL HEADER */}
            <div className="relative group perspective-1000 overflow-hidden rounded-[36px] md:rounded-[48px] bg-slate-900 shadow-2xl border border-white/5">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#3DD6C8] to-transparent opacity-30 blur-sm" />
                <div className="relative p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl sm:rounded-3xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(61,214,200,0.15)] overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#3DD6C8]/20 to-transparent animate-pulse" />
                                <Cpu className="text-[#3DD6C8] relative z-10" size={28} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white italic uppercase tracking-tight leading-tight break-words">
                                    {t('welcome_back')},{' '}
                                    <span className="text-[#3DD6C8] drop-shadow-[0_0_20px_rgba(61,214,200,0.25)]">
                                        {profile?.display_name || profile?.username || 'Node'}
                                    </span>
                                    <span className="text-[#E34304] scale-125 inline-block ml-1">.</span>
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">{t('neural_active')}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/25 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                                        <Layers size={11} className="text-purple-400" />
                                        <span className="text-[9px] font-black text-purple-300 uppercase tracking-widest">SET {profile?.current_set || 1}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] italic">Verified Account</span>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full group/ref cursor-pointer hover:bg-white/10 transition-all" onClick={() => {
                                        navigator.clipboard.writeText(profile?.referral_code || '');
                                        toast.success('Referral Protocol Copied');
                                    }}>
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Referral Code:</span>
                                        <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-widest">{profile?.referral_code || '---'}</span>
                                        <Copy size={10} className="text-white/20 group-hover/ref:text-[#3DD6C8] transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center justify-between sm:justify-end gap-6 lg:gap-8 lg:border-l border-white/10 lg:pl-8 pt-4 lg:pt-0 border-t border-white/5 lg:border-t-0">
                         <div className="flex flex-col text-left sm:text-right whitespace-nowrap">
                             <span className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-1">NETWORK LATENCY</span>
                             <span className="text-lg sm:text-xl font-mono font-black text-[#3DD6C8]">1.24ms</span>
                         </div>
                         <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full border border-white/10 flex items-center justify-center p-1.5 relative overflow-hidden group/logo">
                            <div className="absolute inset-0 bg-[#3DD6C8]/5 opacity-0 group-hover/logo:opacity-100 transition-opacity" />
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                         </div>
                    </div>
                </div>
            </div>

            {/* FINANCIAL SNAPSHOT MATRIX */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3 lg:col-span-1 bg-[#0B0B1E] border border-white/5 p-8 rounded-[40px] shadow-2xl backdrop-blur-3xl relative overflow-hidden group hover:border-white/10 transition-all duration-700">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet size={120} />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl bg-[#3DD6C8]/10 text-[#3DD6C8] transition-all duration-500 group-hover:scale-110">
                            <Wallet size={20} />
                        </div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{t('available_balance')}</span>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {format(profile?.wallet_balance || 0)}
                        </h2>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{t('tether_holdings')}</p>
                    </div>
                    <div className="pt-6 flex items-center gap-3 max-w-md">
                        <Link 
                            href="/deposit"
                            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-95 transition-all text-center"
                        >
                            <ArrowDownLeft size={15} /> {t('deposit')}
                        </Link>
                        <Link 
                            href="/withdraw"
                            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-95 transition-all text-center"
                        >
                            <ArrowUpRight size={15} /> {t('withdraw')}
                        </Link>
                    </div>
                </div>

                <div className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[40px] shadow-2xl backdrop-blur-3xl relative overflow-hidden group hover:border-white/10 transition-all duration-700">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={120} />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl bg-amber-400/10 text-amber-400 transition-all duration-500 group-hover:scale-110">
                            <Zap size={20} />
                        </div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{t('today_profit')}</span>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-5xl md:text-6xl font-black text-amber-400 tracking-tighter italic uppercase drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                            {format(profile?.profit || 0)}
                        </h2>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{t('secured_rebates')}</p>
                    </div>
                </div>

                <div className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[40px] shadow-2xl backdrop-blur-3xl relative overflow-hidden group hover:border-white/10 transition-all duration-700">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Network size={120} />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl bg-indigo-400/10 text-indigo-400 transition-all duration-500 group-hover:scale-110">
                            <Network size={20} />
                        </div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{t('referral_bonus')}</span>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-5xl md:text-6xl font-black text-indigo-400 tracking-tighter italic uppercase drop-shadow-[0_0_15px_rgba(129,140,248,0.2)]">
                            {format(profile?.referral_earned || 0)}
                        </h2>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{t('network_yield')}</p>
                    </div>
                </div>
            </div>

            {/* LIVE OPERATIONS & HUB — Enhanced PC-Style Command Center */}
            <div className="grid grid-cols-1 gap-12">
                {/* System Hub & Actions */}
                <div className="space-y-4 sm:space-y-5">
                    {/* Header + Category Filter Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 sm:px-2">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-[#3DD6C8] animate-pulse shadow-[0_0_10px_rgba(61,214,200,0.8)]" />
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">QUICK HUB SELECT</h3>
                        </div>

                        {/* PC Terminal Style Filter Tabs */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-white/5 self-start sm:self-auto overflow-x-auto max-w-full">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'finance', label: 'Finance' },
                                { id: 'protocol', label: 'Protocol' },
                                { id: 'support', label: 'Support' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setHubFilter(tab.id as any)}
                                    className={`px-3 py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                        hubFilter === tab.id
                                            ? 'bg-[#3DD6C8] text-slate-950 shadow-[0_0_15px_rgba(61,214,200,0.4)] scale-[1.02]'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* PC-Style Compact Multi-Column Grid (3 cols on mobile, 4 on tablet, 6 on desktop) */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4">
                        {[
                            { icon: ArrowDownLeft, label: t('deposit'), href: '/deposit', color: 'text-[#3DD6C8]', bg: 'bg-[#3DD6C8]/10', border: 'border-[#3DD6C8]/20', category: 'finance', badge: 'Instant' },
                            { icon: ArrowUpRight, label: t('withdraw'), href: '/withdraw', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', category: 'finance', badge: '24/7' },
                            { icon: TrendingUp, label: 'Salary Structure', href: '/salary', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', category: 'finance', badge: 'Tiers' },
                            { icon: Map, label: 'VIP Map & Rewards', href: '/levels', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20', category: 'finance', badge: 'VIP' },
                            { icon: Headset, label: 'Live Support', href: '/service', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', category: 'support', badge: 'Active' },
                            { icon: HelpCircle, label: 'FAQ', href: '/faq', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', category: 'support', badge: 'Guide' },
                            { icon: Building2, label: t('company'), href: '/company', color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20', category: 'protocol', badge: 'HQ' },
                            { icon: FileText, label: 'Certificate', href: '/certificate', color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20', category: 'protocol', badge: 'Audit' },
                            { icon: ShieldCheck, label: 'Security Compliance', href: '/compliance', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', category: 'protocol', badge: 'SSL' },
                            { icon: FileText, label: 'Operating Protocol', href: '/protocol', color: 'text-[#3DD6C8]', bg: 'bg-[#3DD6C8]/10', border: 'border-[#3DD6C8]/20', category: 'protocol', badge: 'Rules' },
                            { icon: ShieldCheck, label: 'Terms & Conditions', href: '/rules', color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-400/20', category: 'protocol', badge: 'Legal' },
                            { icon: ShieldAlert, label: 'Privacy Policy', href: '/privacy', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', category: 'protocol', badge: 'Encrypted' },
                        ]
                            .filter(item => hubFilter === 'all' || item.category === hubFilter)
                            .map((hub, i) => (
                                <Link 
                                    key={i} 
                                    href={hub.href} 
                                    className="group relative p-3 sm:p-4 lg:p-5 rounded-2xl sm:rounded-[28px] lg:rounded-[32px] bg-[#0B0B1E]/90 border border-white/5 hover:border-[#3DD6C8]/40 flex flex-col items-center justify-between text-center gap-2 sm:gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] active:scale-95 overflow-hidden"
                                >
                                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#3DD6C8]/50 transition-colors" />
                                    
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${hub.bg} border ${hub.border} flex items-center justify-center ${hub.color} group-hover:scale-110 transition-transform duration-500 shadow-inner shrink-0`}>
                                        <hub.icon size={20} className="sm:hidden" />
                                        <hub.icon size={22} className="hidden sm:block" />
                                    </div>
                                    <span className="text-[8.5px] sm:text-[9.5px] lg:text-[10px] font-black text-white/70 group-hover:text-white uppercase tracking-wider text-center leading-tight line-clamp-2 transition-colors">
                                        {hub.label}
                                    </span>
                                </Link>
                            ))}

                        {/* WFP External Link — Shown when All or Support filter active */}
                        {(hubFilter === 'all' || hubFilter === 'support') && (
                            <a 
                                href="https://www.wfp.org" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="group relative p-3 sm:p-4 lg:p-5 rounded-2xl sm:rounded-[28px] lg:rounded-[32px] bg-[#0B0B1E]/90 border border-white/5 hover:border-blue-500/40 flex flex-col items-center justify-between text-center gap-2 sm:gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] active:scale-95 overflow-hidden"
                            >
                                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-blue-500/50 transition-colors" />
                                
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 p-2 shadow-inner shrink-0">
                                    <img src="/wfp-logo.svg" alt="World Food Programme" className="w-6 h-6 sm:w-7 sm:h-7 object-contain filter drop-shadow-[0_0_8px_rgba(82,137,195,0.5)]" />
                                </div>
                                <span className="text-[8.5px] sm:text-[9.5px] lg:text-[10px] font-black text-white/70 group-hover:text-white uppercase tracking-wider text-center leading-tight line-clamp-2 transition-colors">
                                    WFP
                                </span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* ADVERTISING BANNER PROTOCOL — Network Expansion Program */}
            <div className="relative group overflow-hidden rounded-3xl sm:rounded-[36px] md:rounded-[48px] bg-gradient-to-br from-slate-900 via-[#0B0B1E] to-slate-950 border border-white/10 shadow-2xl">
                {/* Cyber ambient glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#3DD6C8]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#3DD6C8]/15 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#3DD6C8]/40 to-transparent" />

                <div className="relative p-6 sm:p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 md:gap-10">
                    <div className="max-w-xl space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#3DD6C8]/10 flex items-center justify-center text-[#3DD6C8] border border-[#3DD6C8]/25 shadow-[0_0_15px_rgba(61,214,200,0.2)]">
                                <Sparkles size={18} className="animate-pulse" />
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                                Network Expansion Program
                            </span>
                        </div>

                        <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight sm:leading-none">
                            Accelerate your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3DD6C8] via-teal-300 to-indigo-300">
                                Wealth Optimization.
                            </span>
                        </h3>

                        <p className="text-[10px] sm:text-xs font-bold text-slate-300/80 uppercase tracking-wider leading-relaxed max-w-lg">
                            Establish agent nodes and earn up to <span className="text-[#3DD6C8] font-black">{referralRate}% automated commissions</span> on daily task volume across your multi-tier network.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                        <Link 
                            href="/invite" 
                            className="flex items-center justify-center gap-3 py-3.5 sm:py-5 px-6 sm:px-8 bg-gradient-to-r from-[#3DD6C8] to-teal-400 text-slate-950 rounded-xl sm:rounded-2xl font-black uppercase tracking-wider text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(61,214,200,0.35)] hover:shadow-[0_0_50px_rgba(61,214,200,0.55)]"
                        >
                            <span>Establish Node</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* REFERRAL SPOTLIGHT */}
            <div className="relative group overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[44px] bg-[#090C1E] border border-white/5 shadow-2xl">
                {/* Animated glow orbs - Brand aligned with Cyber Teal and Emerald */}
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#3DD6C8]/10 rounded-full blur-[90px] group-hover:bg-[#3DD6C8]/15 transition-all duration-1000 pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] group-hover:bg-emerald-500/15 transition-all duration-1000 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3DD6C8]/50 to-transparent" />

                <div className="relative p-5 sm:p-8 md:p-10 lg:p-12 space-y-6 sm:space-y-8">
                    {/* Section header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 sm:gap-4">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl sm:rounded-3xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/25 flex items-center justify-center shadow-[0_0_24px_rgba(61,214,200,0.2)] shrink-0">
                                <Star className="text-[#3DD6C8]" size={22} fill="rgba(61,214,200,0.3)" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base sm:text-lg font-black text-white italic uppercase tracking-tight leading-none">Referral Spotlight</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 text-[9px] font-mono font-black text-[#3DD6C8] uppercase tracking-wider">
                                        3-Tier Matrix
                                    </span>
                                </div>
                                <p className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mt-1">
                                    Network Performance &amp; Passive Commissions
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-center">
                            <Link href="/invite" className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.2em] hover:tracking-[0.25em] transition-all flex items-center gap-1.5 group/lnk">
                                View Full Network <ArrowRight size={13} className="group-hover/lnk:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {/* Total Referrals */}
                        <div className="relative p-5 sm:p-6 rounded-[24px] sm:rounded-[30px] bg-white/[0.03] border border-white/5 overflow-hidden group/card hover:border-[#3DD6C8]/25 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-5 opacity-5">
                                <Users size={64} />
                            </div>
                            <p className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-2 sm:mb-3">
                                Total Recruits
                            </p>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                                {referralStats.totalReferrals}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Direct Downline</span>
                            </div>
                        </div>

                        {/* Commission Earned */}
                        <div className="relative p-5 sm:p-6 rounded-[24px] sm:rounded-[30px] bg-white/[0.03] border border-white/5 overflow-hidden group/card hover:border-[#3DD6C8]/25 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-5 opacity-5">
                                <TrendingUp size={64} />
                            </div>
                            <p className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-2 sm:mb-3">
                                Commission Yield
                            </p>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-[#3DD6C8] italic tracking-tighter drop-shadow-[0_0_20px_rgba(61,214,200,0.3)] truncate">
                                {format(referralStats.commissionEarned)}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] animate-pulse shadow-[0_0_8px_rgba(61,214,200,0.8)]" />
                                <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-widest">{referralRate}% L1 Direct Yield</span>
                            </div>
                        </div>

                        {/* Referral Code & Dual Copy Actions */}
                        <div className="relative p-5 sm:p-6 rounded-[24px] sm:rounded-[30px] bg-white/[0.03] border border-white/5 overflow-hidden group/card hover:border-[#3DD6C8]/25 transition-all duration-500 flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-5 opacity-5">
                                <Share2 size={64} />
                            </div>
                            <div>
                                <p className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-2 sm:mb-3">
                                    Your Referral Code
                                </p>
                                <div
                                    onClick={handleCopyCode}
                                    className="flex items-center justify-between gap-3 cursor-pointer group/code py-1"
                                    title="Click to copy code"
                                >
                                    <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-mono tracking-tight group-hover/code:text-[#3DD6C8] transition-colors truncate">
                                        {profile?.referral_code || '---'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleCopyCode}
                                        className="w-8 h-8 rounded-xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/25 flex items-center justify-center shrink-0 group-hover/code:scale-110 active:scale-95 transition-all cursor-pointer"
                                    >
                                        {referralCopied ? <Check size={14} className="text-[#3DD6C8]" /> : <Copy size={14} className="text-[#3DD6C8]" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] animate-pulse shadow-[0_0_8px_rgba(61,214,200,0.8)]" />
                                    <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-widest">
                                        {referralCopied ? 'Code Copied!' : 'Tap to Copy Code'}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className="text-[9px] font-bold text-white/60 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                    <Link2 size={11} className="text-[#3DD6C8]" />
                                    {linkCopied ? 'Link Copied!' : 'Copy Link'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CTA & Commission Matrix Explainer */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                        <div className="space-y-1.5 max-w-xl">
                            <p className="text-[11px] font-bold text-white/70 leading-relaxed">
                                Earn <span className="text-[#3DD6C8] font-black">{referralRate}% direct commission</span> on Tier 1 recruits, plus passive <span className="text-white font-black">10% (L2)</span> and <span className="text-white font-black">5% (L3)</span> network yields.
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono text-white/40">
                                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#3DD6C8] font-bold">L1: {referralRate}%</span>
                                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70 font-bold">L2: 10%</span>
                                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70 font-bold">L3: 5%</span>
                                <span>• Daily settlements</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                            <button
                                type="button"
                                onClick={handleShareLink}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] active:scale-95 transition-all cursor-pointer"
                            >
                                <Share2 size={14} className="text-[#3DD6C8]" />
                                {linkCopied ? 'Link Copied' : 'Share Link'}
                            </button>
                            <Link
                                href="/invite"
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#3DD6C8] to-teal-500 hover:from-[#34c4b7] hover:to-teal-400 text-[#070714] rounded-2xl font-black uppercase tracking-[0.18em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(61,214,200,0.3)] shrink-0"
                            >
                                <span>Invite &amp; Earn</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* VERIFIED MEMBER TESTIMONIALS */}
            <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Star className="text-amber-400 fill-amber-400" size={14} />
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">Verified Worker Community</span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">
                            Optimization Specialist <span className="text-[#3DD6C8]">Testimonials</span>
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">99.4% Payout Satisfaction</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            name: 'Marcus Vance',
                            role: 'Senior Agent',
                            location: 'Chicago, IL',
                            payout: '$2,450.00 Settled',
                            avatar: '/landing-asset-1.jpg',
                            quote: 'The daily task optimization sets are completely seamless. Once I hit my 40/40 milestone, my salary bonus was credited directly to my wallet. Withdrawal was verified and approved in under 20 minutes.'
                        },
                        {
                            name: 'Elena Rostova',
                            role: 'Mentor Agent',
                            location: 'Austin, TX',
                            payout: '$3,800.00 Settled',
                            avatar: '/landing-asset-4.jpg',
                            quote: 'Working across the US Central hours fits my schedule perfectly. The Super Order combo packages give huge rebate multipliers and customer support is always active whenever I need a node reset.'
                        },
                        {
                            name: 'David K. Chen',
                            role: 'Intermediate Agent',
                            location: 'Toronto, ON',
                            payout: '$1,260.00 Settled',
                            avatar: '/landing-asset-6.jpg',
                            quote: 'The security compliance rules and operating protocol keep everything crystal clear. Transparent calculations, fast crypto deposits, and genuine daily earnings. Highly recommended.'
                        }
                    ].map((testi, idx) => (
                        <div 
                            key={idx} 
                            className="p-8 rounded-[36px] bg-[#0B0B1E] border border-white/5 hover:border-[#3DD6C8]/30 transition-all duration-700 flex flex-col justify-between gap-6 group hover:-translate-y-1 shadow-xl"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, s) => (
                                            <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                                        {testi.payout}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-white/60 uppercase tracking-wider leading-relaxed">
                                    "{testi.quote}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                <img 
                                    src={testi.avatar} 
                                    alt={testi.name} 
                                    className="w-11 h-11 rounded-2xl object-cover border border-white/10 group-hover:border-[#3DD6C8]/50 transition-colors"
                                />
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-black text-white uppercase tracking-tight">{testi.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-widest">{testi.role}</span>
                                        <span className="text-white/20 text-[9px]">•</span>
                                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{testi.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 1. LIVE GLOBAL ACTIVITY MAP */}
            <div className="pt-8">
                <LiveActivityMap />
            </div>

            {/* 2. INSTITUTIONAL COMMERCE ALLIANCE & LIQUIDITY PROVIDERS */}
            <div className="space-y-6 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] animate-pulse shadow-[0_0_8px_rgba(61,214,200,0.8)]" />
                            <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.3em]">Institutional Commerce Alliance</span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">
                            Verified Merchant <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3DD6C8] to-emerald-400">Order Routing</span>
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Tier-1 Enterprise Liquidity</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { name: 'Amazon Global', cat: 'Tier-1 Commerce', desc: 'Enterprise Retail Engine', icon: 'AMZ', tag: 'Direct Route', color: 'from-amber-500/10 to-orange-500/5', border: 'hover:border-amber-500/30' },
                        { name: 'Shopify Plus', cat: 'Merchant Cloud', desc: 'High-Volume Gateway', icon: 'SHOP', tag: 'Active Settle', color: 'from-emerald-500/10 to-teal-500/5', border: 'hover:border-emerald-500/30' },
                        { name: 'Walmart Hub', cat: 'Retail Protocol', desc: 'Omni-Channel Liquidity', icon: 'WMT', tag: 'Fast-Track', color: 'from-blue-500/10 to-cyan-500/5', border: 'hover:border-blue-500/30' },
                        { name: 'Rakuten Corp', cat: 'Affiliate Network', desc: 'Cashback Rebate Node', icon: 'RAK', tag: 'Multi-Asset', color: 'from-rose-500/10 to-pink-500/5', border: 'hover:border-rose-500/30' },
                        { name: 'eBay Enterprise', cat: 'Marketplace Node', desc: 'Global Inventory Pool', icon: 'EBAY', tag: 'Verified Yield', color: 'from-yellow-500/10 to-amber-500/5', border: 'hover:border-yellow-500/30' },
                        { name: 'TikTok Shop', cat: 'Creator Commerce', desc: 'Viral Product Routing', icon: 'TTS', tag: 'High Velocity', color: 'from-cyan-500/10 to-blue-500/5', border: 'hover:border-cyan-500/30' },
                        { name: 'Mercado Libre', cat: 'LATAM Alliance', desc: 'Cross-Border Cluster', icon: 'MELI', tag: 'Zero-Lag', color: 'from-indigo-500/10 to-purple-500/5', border: 'hover:border-indigo-500/30' },
                        { name: 'Target Supply', cat: 'Direct Sourcing', desc: 'Automated Clearance', icon: 'TGT', tag: 'Institutional', color: 'from-red-500/10 to-rose-500/5', border: 'hover:border-red-500/30' },
                    ].map((brand, i) => (
                        <div 
                            key={i} 
                            className={`p-5 rounded-[28px] bg-gradient-to-br ${brand.color} bg-[#0B0B1E] border border-white/5 ${brand.border} transition-all duration-500 flex flex-col justify-between gap-4 group hover:-translate-y-1 shadow-lg`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black text-white/60 tracking-wider uppercase font-mono">
                                    {brand.icon}
                                </span>
                                <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                    {brand.tag}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#3DD6C8] transition-colors">{brand.name}</h4>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">{brand.cat}</p>
                                <p className="text-[9px] text-slate-500 font-medium mt-1 leading-snug">{brand.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. INSTITUTIONAL SECURITY & MULTI-SIG COMPLIANCE */}
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-b from-[#0f111a] to-[#08090f] border border-white/5 p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#3DD6C8]/5 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-400" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Operational Security Standard</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tight">
                                Institutional Trust & <span className="text-[#3DD6C8]">Asset Protection</span>
                            </h3>
                        </div>
                        <Link 
                            href="/compliance" 
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-wider transition-all self-start md:self-auto"
                        >
                            Audit Reports <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: 'SOC-2 Type II Certified',
                                desc: 'Continuous 24/7 telemetry monitoring across all cloud execution nodes and data centers.',
                                icon: Cpu,
                                color: 'text-cyan-400',
                                badge: 'Verified Protocol'
                            },
                            {
                                title: 'Cold Storage Multi-Sig',
                                desc: '100% of user balances and merchant rebates are secured in segregated multi-signature vaults.',
                                icon: Wallet,
                                color: 'text-amber-400',
                                badge: '1:1 Reserve Backing'
                            },
                            {
                                title: '256-Bit SSL Encryption',
                                desc: 'End-to-end cryptographic hashing on every task rating, commission settlement, and deposit.',
                                icon: Lock,
                                color: 'text-emerald-400',
                                badge: 'Military-Grade'
                            },
                            {
                                title: '24/7 Specialist Support',
                                desc: 'Dedicated operational managers and live resolution desk online for sequence calibrations.',
                                icon: Headset,
                                color: 'text-purple-400',
                                badge: 'Active Desk'
                            },
                        ].map((sec, idx) => (
                            <div key={idx} className="p-6 rounded-[28px] bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2.5 rounded-xl bg-white/5 ${sec.color}`}>
                                        <sec.icon size={20} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40 font-mono">
                                        {sec.badge}
                                    </span>
                                </div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{sec.title}</h4>
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{sec.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
