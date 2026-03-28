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
    ArrowRight,
    Award
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
    const currentTasks = (profile?.completed_count || 0) % 40; // Default fallback
    const progressPercent = Math.min(100, Math.round((currentTasks / 40) * 100));

    return (
        <div className="space-y-10 animate-in fade-in duration-1000 pb-20 max-w-7xl mx-auto">
            
            {/* VIP STATUS HEADER - REDESIGNED */}
            <div className="bg-[#0B0B1E] border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3DD6C8]/5 blur-[140px] rounded-full pointer-events-none" />
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 flex items-center justify-center relative shadow-[0_0_20px_rgba(61,214,200,0.1)]">
                            <Network className="text-[#3DD6C8]" size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.4em]">Governance Protocol</span>
                                <div className="h-px w-12 bg-[#3DD6C8]/30" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                                VIP Evolution <span className="text-white/40">Map.</span>
                            </h1>
                        </div>
                    </div>
                    <Link href="/salary" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] hover:bg-white/10 hover:border-[#3DD6C8]/50 transition-all flex items-center gap-3">
                        View All Nodes <ArrowRight size={14} className="text-[#3DD6C8]" />
                    </Link>
                 </div>
            </div>

            {/* LEVEL GRID - REDESIGNED FOR DESKTOP EXCELLENCE */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => <div key={i} className="h-[420px] bg-slate-900/40 rounded-[32px] animate-pulse border border-white/5" />)
                ) : (
                    levels.slice(0, 4).map((level, idx) => {
                        const Icon = levelIcons[idx] || Zap;
                        const colorClass = levelColors[idx] || levelColors[0];
                        const isCurrentLevel = currentLevelId === level.id;
                        const isLocked = level.id > currentLevelId;
                        const isCompleted = level.id < currentLevelId;

                        const levelProgress = isCurrentLevel ? progressPercent : (isCompleted ? 100 : 0);

                        return (
                            <div key={level.id} className={`bg-[#0B0B1E] border p-7 rounded-[32px] relative overflow-hidden transition-all duration-700 flex flex-col justify-between h-full group ${isCurrentLevel ? 'border-[#3DD6C8] shadow-[0_30px_70px_rgba(0,0,0,0.6)] z-20' : 'border-white/5 hover:border-white/10'}`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                                
                                <div className="relative z-10 space-y-7">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#3DD6C8]/10 group-hover:border-[#3DD6C8]/30 transition-all duration-500`}>
                                            <Icon size={22} className={isCurrentLevel ? 'text-[#3DD6C8]' : 'text-white/40'} />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {isCurrentLevel ? (
                                                <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-[0.2em] px-2 py-0.5 bg-[#3DD6C8]/10 rounded-full border border-[#3DD6C8]/30">Active</span>
                                            ) : isLocked ? (
                                                <Lock size={12} className="text-white/10" />
                                            ) : (
                                                <CheckCircle size={14} className="text-[#3DD6C8]" />
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1 group-hover:text-[#3DD6C8] transition-colors">{level.name}</h3>
                                        <div className="flex items-center justify-between mt-3 mb-1">
                                            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Rebate Power</span>
                                            <span className="text-xs font-black text-[#3DD6C8]">{(level.commission_rate * 100).toFixed(2)}%</span>
                                        </div>
                                        <p className="text-[12px] font-black text-white tracking-tight">${level.price.toLocaleString()}</p>
                                    </div>

                                    {/* PROGRESS ENGINE */}
                                    <div className="pt-6 border-t border-white/5 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Task Optimization Progress</span>
                                            <span className="text-[9px] font-mono text-white/60">{levelProgress}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full bg-[#3DD6C8] transition-all duration-1000 ${isCurrentLevel ? 'opacity-100 shadow-[0_0_10px_rgba(61,214,200,0.5)]' : 'opacity-20'}`} 
                                                style={{ width: `${levelProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 relative z-10">
                                    {isCurrentLevel ? (
                                        <div className="w-full py-3.5 bg-gradient-to-r from-[#3DD6C8]/10 to-transparent border border-[#3DD6C8]/20 rounded-xl text-[9px] font-black text-[#3DD6C8] uppercase tracking-[0.3em] text-center shadow-lg shadow-[#3DD6C8]/5">
                                            SECURE NODE ONLINE
                                        </div>
                                    ) : isLocked ? (
                                        <button className="w-full py-3.5 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black text-white/30 uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all group-hover:border-white/20">
                                            PROTOCOL LOCKED
                                        </button>
                                    ) : (
                                        <div className="w-full py-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.3em] text-center">
                                            UPGRADE SUCCESS
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            {/* OPTIMIZATION INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[32px] flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <TrendingUp className="text-amber-500" size={24} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Network Yield Velocity</h4>
                        <p className="text-[11px] font-black text-white/60 uppercase tracking-widest leading-relaxed">
                            Master Agent nodes achieve the highest clearing priority on the decentralized matrix.
                        </p>
                    </div>
                </div>
                <div className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[32px] flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="text-indigo-500" size={24} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Asset Security Shard</h4>
                        <p className="text-[11px] font-black text-white/60 uppercase tracking-widest leading-relaxed">
                            All tier transitions are verified via multi-signature consensus across the node infrastructure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
