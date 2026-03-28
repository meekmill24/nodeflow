'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/index';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
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
    Network
} from 'lucide-react';

export default function HomePage() {
    const { profile, signOut } = useAuth();
    const { t } = useLanguage();
    const { format } = useCurrency();
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
    });
    const [levels, setLevels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!profile) return;
            setLoading(true);
            try {
                const [allRes, levelsResult] = await Promise.all([
                    supabase.from('user_tasks').select('*', { count: 'exact', head: true }).eq('user_id', profile.id),
                    supabase.from('levels').select('*').order('price', { ascending: true }).limit(2)
                ]);
                setStats({
                    totalTasks: allRes.count || 0,
                    completedTasks: profile.completed_count || 0,
                    pendingTasks: Math.max(0, (allRes.count || 0) - (profile.completed_count || 0))
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
            <div className="relative group perspective-1000 overflow-hidden rounded-[48px] bg-slate-900 shadow-2xl border border-white/5">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#3DD6C8] to-transparent opacity-30 blur-sm" />
                <div className="relative p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-3xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(61,214,200,0.15)] overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#3DD6C8]/20 to-transparent animate-pulse" />
                                <Cpu className="text-[#3DD6C8] relative z-10" size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none flex items-baseline gap-2">
                                    {t('welcome_back')}, <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">{profile?.username || 'Node'}</span>
                                    <span className="text-[#E34304] scale-150 ml-0.5">.</span>
                                </h1>
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">{t('neural_active')}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] italic">Identity Shard Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8 md:border-l border-white/10 md:pl-10">
                         <div className="flex flex-col text-right">
                             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">NETWORK LATENCY</span>
                             <span className="text-xl font-mono font-black text-[#3DD6C8]">1.24ms</span>
                         </div>
                         <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center p-1 relative overflow-hidden group/logo">
                            <div className="absolute inset-0 bg-[#3DD6C8]/5 opacity-0 group-hover/logo:opacity-100 transition-opacity" />
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                         </div>
                    </div>
                </div>
            </div>

            {/* FINANCIAL SNAPSHOT MATRIX */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: t('available_balance'), value: format(profile?.wallet_balance || 0), desc: t('tether_holdings'), icon: Wallet, color: 'text-[#3DD6C8]', bg: 'bg-[#3DD6C8]/10' },
                    { label: t('today_profit'), value: format(profile?.profit || 0), desc: t('secured_rebates'), icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    { label: t('referral_bonus'), value: format(profile?.referral_earned || 0), desc: t('network_yield'), icon: Network, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[40px] shadow-2xl backdrop-blur-3xl relative overflow-hidden group hover:border-white/10 transition-all duration-700">
                        <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
                            <stat.icon size={120} />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-all duration-500 group-hover:scale-110`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{stat.label}</span>
                        </div>
                        <div className="space-y-1">
                            <h2 className={`text-4xl md:text-5xl font-black ${i === 0 ? 'text-white' : stat.color} tracking-tighter italic uppercase`}>
                                {stat.value}
                            </h2>
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* LIVE OPERATIONS & HUB */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* VIP Evolution Module */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_rgba(61,214,200,0.8)]" />
                            <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">{t('vip_evolution')}</h3>
                        </div>
                        <Link href="/levels" className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all flex items-center gap-2 group">
                             {t('view_all_nodes')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            [...Array(2)].map((_, i) => <div key={i} className="h-44 bg-slate-900/50 rounded-[32px] animate-pulse border border-white/5" />)
                        ) : levels.map((level, i) => {
                            const isUnlocked = profile?.level_id ? profile.level_id >= level.id : i === 0;
                            const currentCount = profile?.completed_count || 0;
                            const tasksPerSet = level.tasks_per_set || 40;
                            const progressPercent = Math.min(100, Math.round(((currentCount % tasksPerSet) / tasksPerSet) * 100));

                            return (
                                <div key={level.id} className={`p-8 rounded-[36px] bg-[#0B0B1E] border border-white/5 relative overflow-hidden group transition-all duration-700 ${!isUnlocked ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-white/10'}`}>
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#3DD6C8]/5 blur-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center p-3 text-white transition-all group-hover:border-[#3DD6C8]/30">
                                                <Award size={24} className={isUnlocked ? 'text-[#3DD6C8]' : 'text-slate-700'} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">{level.name || `NODE LV.${i + 1}`}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">{t('rebate_power')}</span>
                                                    <span className="text-[10px] font-black text-[#3DD6C8]">{(level.commission_rate * 100).toFixed(2)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-white italic">${level.price}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 relative z-10">
                                        <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                                            <span>{t('task_optimization_progress')}</span>
                                            <span className="text-white/40">{progressPercent}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                                            <div className="h-full bg-gradient-to-r from-[#3DD6C8]/40 via-[#3DD6C8] to-[#3DD6C8]/40 rounded-full shadow-[0_0_15px_rgba(61,214,200,0.5)] transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* System Hub & Actions */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">QUICK HUB SELECT</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: ArrowDownLeft, label: t('deposit'), href: '/deposit', color: 'text-[#3DD6C8]', bg: 'bg-[#3DD6C8]/5' },
                            { icon: ArrowUpRight, label: t('withdraw'), href: '/withdraw', color: 'text-amber-500', bg: 'bg-amber-500/5' },
                            { icon: Building2, label: t('company'), href: '/company', color: 'text-indigo-400', bg: 'bg-indigo-400/5' },
                            { icon: FileText, label: 'Certificate', href: '/certificate', color: 'text-pink-500', bg: 'bg-pink-500/5' },
                        ].map((hub, i) => (
                            <Link key={i} href={hub.href} className="group p-8 rounded-[36px] bg-[#0B0B1E] border border-white/5 flex flex-col items-center gap-5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
                                <div className={`w-14 h-14 rounded-3xl ${hub.bg} border border-white/5 flex items-center justify-center ${hub.color} group-hover:scale-110 transition-transform duration-700`}>
                                    <hub.icon size={26} />
                                </div>
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">{hub.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ADVERTISING BANNER PROTOCOL */}
            <div className="relative group overflow-hidden rounded-[48px] bg-slate-900 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3DD6C8]/20 to-transparent opacity-40 mix-blend-overlay" />
                <div className="relative p-12 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="max-w-xl space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#3DD6C8]/10 flex items-center justify-center text-[#3DD6C8] border border-[#3DD6C8]/20">
                                <Sparkles size={20} />
                            </div>
                            <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.5em]">Network Expansion Program</span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                            Accelerate your <br />
                            <span className="text-white/40 group-hover:text-white transition-all duration-700">Wealth Extraction.</span>
                        </h3>
                        <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                            Share your identity shard with friends. Each successful node established grants a perpetual 20% yield optimization on their daily productivity.
                        </p>
                    </div>
                    
                    <Link href="/invite" className="flex items-center gap-6 px-12 py-7 bg-[#3DD6C8] text-[#0B0B1E] rounded-[24px] font-black uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(61,214,200,0.3)] group-hover:shadow-[0_0_70px_rgba(61,214,200,0.5)]">
                        Establish Connection <ArrowRight size={20} />
                    </Link>
                </div>
            </div>

            {/* SYSTEM NODES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: Play, label: t('start_tasks_label'), desc: t('optimize_now'), href: '/start', color: 'text-[#3DD6C8]' },
                    { icon: Clock, label: t('activity_records_label'), desc: t('settlements'), href: '/record', color: 'text-amber-400' },
                    { icon: Headset, label: 'Concierge Hub', desc: 'Active Protocol', href: '/concierge', color: 'text-indigo-400' },
                    { icon: ShieldCheck, label: t('legal_governance_label'), desc: 'Compliance', href: '/rules', color: 'text-emerald-400' }
                ].map((node, i) => (
                    <Link key={i} href={node.href} className="group p-8 rounded-[40px] bg-[#0B0B1E] border border-white/5 flex flex-col items-center text-center gap-6 hover:border-white/10 transition-all duration-700 hover:-translate-y-1">
                        <div className={`w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center ${node.color} group-hover:scale-110 transition-transform`}>
                            <node.icon size={26} />
                        </div>
                        <div className="space-y-1">
                             <h4 className="text-[11px] font-black text-white uppercase tracking-widest leading-none">{node.label}</h4>
                             <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{node.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
