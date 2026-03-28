'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/index';
import type { Level } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { 
    Star, 
    Crown, 
    Trophy, 
    Gem, 
    Sparkles, 
    CheckCircle, 
    Lock,
    Zap,
    TrendingUp,
    ShieldCheck,
    Diamond,
    CircleDollarSign,
    Cpu,
    Target,
    Activity,
    Network,
    ArrowRight
} from 'lucide-react';

const levelIcons = [Star, Crown, Trophy, Gem, Sparkles, Diamond];
const levelColors = [
    'from-[#3DD6C8] to-transparent',
    'from-amber-400 to-transparent',
    'from-indigo-400 to-transparent',
    'from-rose-500 to-transparent',
    'from-emerald-400 to-transparent',
    'from-sky-400 to-transparent'
];

export default function LevelsPage() {
    const { profile } = useAuth();
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLevels = async () => {
            const { data } = await supabase.from('levels').select('*').order('price', { ascending: true });
            if (data && data.length > 0) setLevels(data);
            setLoading(false);
        };
        fetchLevels();
    }, []);

    const currentLevelId = profile?.level_id || 1;

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            
            {/* VIP STATUS HEADER */}
            <div className="bg-[#0B0B1E] border border-white/5 p-10 md:p-14 rounded-[48px] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-[#3DD6C8]/5 blur-[120px] rounded-full pointer-events-none" />
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[24px] bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 flex items-center justify-center relative overflow-hidden">
                            <Crown className="text-[#3DD6C8] z-10" size={32} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3DD6C8]/20 to-transparent animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">
                                VIP Evolution <span className="text-[#3DD6C8]">Map.</span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border border-white/10 italic">Tier Governance Hub</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_rgba(61,214,200,1)] animate-pulse" />
                                    <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-[0.4em]">Current Access: LV.{currentLevelId} Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link href="/salary" className="flex items-center gap-4 px-8 py-5 bg-white/5 border border-white/10 rounded-[20px] hover:bg-[#3DD6C8]/10 hover:border-[#3DD6C8]/30 transition-all group">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1 leading-none">REBATE CENTER</span>
                            <span className="text-[11px] font-black text-white uppercase tracking-widest">Employee Benefits</span>
                        </div>
                        <ArrowRight size={20} className="text-[#3DD6C8] group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
            </div>

            {/* LEVEL GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => <div key={i} className="h-96 bg-slate-900/50 rounded-[40px] animate-pulse border border-white/5" />)
                ) : (
                    levels.map((level, idx) => {
                        const Icon = levelIcons[idx % levelIcons.length];
                        const colorClass = levelColors[idx % levelColors.length];
                        const isCurrentLevel = currentLevelId === level.id;
                        const isLocked = level.id > currentLevelId;
                        const isCompleted = level.id < currentLevelId;

                        return (
                            <div key={level.id} className={`bg-[#0B0B1E] border p-8 rounded-[48px] shadow-xl relative overflow-hidden transition-all duration-700 flex flex-col justify-between h-full group ${isCurrentLevel ? 'border-[#3DD6C8] scale-[1.02] shadow-[0_20px_60px_rgba(61,214,200,0.1)]' : 'border-white/5 hover:border-white/10'} ${isLocked ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                                <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${colorClass} opacity-5 group-hover:opacity-20 transition-opacity rounded-full blur-[60px]`} />
                                
                                <div className="space-y-8 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon size={28} className={isCurrentLevel ? 'text-[#3DD6C8]' : 'text-white/60'} />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {isCurrentLevel && (
                                                <div className="px-3 py-1 bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 rounded-full flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] animate-pulse" />
                                                    <span className="text-[8px] font-black text-[#3DD6C8] uppercase tracking-widest">Active Tier</span>
                                                </div>
                                            )}
                                            {isLocked && <Lock size={16} className="text-white/20" />}
                                            {isCompleted && <CheckCircle size={16} className="text-emerald-400" />}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{level.name || `ELITE LV.${level.id}`}</h3>
                                        <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] font-mono">Cost: <span className="text-white">${level.price.toLocaleString()}</span></p>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-white/5">
                                        {[
                                            { label: 'REBATE RATE', value: `${(level.commission_rate * 100).toFixed(2)}%`, icon: Zap, color: 'text-[#3DD6C8]' },
                                            { label: 'TASK LIMIT', value: level.tasks_per_set, icon: Target, color: 'text-amber-400' },
                                            { label: 'DAILY SETS', value: level.sets_per_day, icon: Activity, color: 'text-indigo-400' },
                                            { label: 'NETWORK SECURITY', value: 'ECC LEVEL 5', icon: ShieldCheck, color: 'text-emerald-400' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center">
                                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
                                                    <item.icon size={10} className={item.color} /> {item.label}
                                                </span>
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-10 relative z-10">
                                    {isCurrentLevel ? (
                                        <div className="w-full py-5 bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 rounded-[20px] text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.3em] text-center">
                                            SECURE NODE ACTIVE
                                        </div>
                                    ) : isLocked ? (
                                        <button className="w-full py-5 bg-white/5 border border-white/10 rounded-[20px] text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all">
                                            UPGRADE REQUIRED
                                        </button>
                                    ) : (
                                        <button className="w-full py-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[20px] text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">
                                            TIER DEPLETED
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* UPGRADE DETAILS */}
            <div className="bg-[#0B0B1E] border border-white/5 p-10 md:p-14 rounded-[48px] shadow-2xl relative overflow-hidden group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_rgba(61,214,200,0.8)]" />
                            <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">TIER UPGRADE PROTOCOL</h3>
                        </div>
                        <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                            Node evolution is governed by liquidity contribution and network stability metrics. Tier LV.5 and above grant access to Private Financial Clusters and accelerated clearance protocols.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] block mb-1">NETWORK UPTIME</span>
                                <span className="text-xl font-black text-white italic">99.98%</span>
                            </div>
                            <div className="p-6 bg-[#3DD6C8]/5 border border-[#3DD6C8]/10 rounded-3xl">
                                <span className="text-[8px] font-black text-[#3DD6C8] uppercase tracking-[0.3em] block mb-1">YIELD VELOCITY</span>
                                <span className="text-xl font-black text-[#3DD6C8] italic">T+0.02ms</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-6 lg:pl-10 lg:border-l border-white/5">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 shrink-0">
                                <Network size={20} />
                            </div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                                Elite nodes LV.6 receive dedicated institutional support and customized asset rebate structures.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                                All tier upgrades are irreversible once the liquidity shard is established within the central matrix.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
