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
    ArrowLeft,
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

const TIER_SPECS: Record<string, { depositRange: string; commPercent: string; sets: number; tasksPerSet: number; totalMaintenance: number }> = {
    'Junior Agent': { depositRange: '$100 to $499', commPercent: '0.4%', sets: 3, tasksPerSet: 40, totalMaintenance: 120 },
    'Intermediate Agent': { depositRange: '$500 to $1,499', commPercent: '0.6%', sets: 4, tasksPerSet: 45, totalMaintenance: 180 },
    'Senior Agent': { depositRange: '$1,500 to $4,999', commPercent: '0.8%', sets: 5, tasksPerSet: 50, totalMaintenance: 250 },
    'Mentor Agent': { depositRange: '$5,000 upwards', commPercent: '1.0%', sets: 6, tasksPerSet: 55, totalMaintenance: 330 }
};

export default function LevelsPage() {
    const { profile } = useAuth();
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);
    const [referralRate, setReferralRate] = useState('20');

    useEffect(() => {
        const fetchLevels = async () => {
            const { data } = await supabase
                .from('levels')
                .select('*')
                .order('price', { ascending: true });
            if (data) setLevels(data);
            setLoading(false);
        };
        fetchLevels();
    }, []);

    const currentLevelId = profile?.level_id || profile?.level?.id || 1;
    const completedCount = profile?.completed_count || 0;

    return (
        <div className="space-y-10 animate-in fade-in duration-1000 pb-20 max-w-7xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link 
                    href="/home" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest">
                    <Trophy size={14} /> Tier Governance
                </div>
            </div>
            
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
                                VIP Map & <span className="text-[#3DD6C8]">Reward Structure</span>
                            </h1>
                        </div>
                    </div>
                    <Link href="/salary" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] hover:bg-white/10 hover:border-[#3DD6C8]/50 transition-all flex items-center gap-3">
                        Salary Structure <ArrowRight size={14} className="text-[#3DD6C8]" />
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
                        const userLevel = levels.find(l => l.id === currentLevelId) || levels.find(l => Number(l.price) === 100) || levels[0];
                        const isCurrentLevel = userLevel ? userLevel.id === level.id : idx === 0;
                        const isLocked = userLevel ? Number(level.price) > Number(userLevel.price) : idx > 0;
                        const isCompleted = userLevel ? Number(level.price) < Number(userLevel.price) : false;

                        const specs = TIER_SPECS[level.name] || {
                            depositRange: `$${level.price} to $${level.price * 3}`,
                            commPercent: `${(level.commission_rate * 100).toFixed(1)}%`,
                            sets: level.sets_per_day || 3,
                            tasksPerSet: level.tasks_per_set || 40,
                            totalMaintenance: (level.sets_per_day || 3) * (level.tasks_per_set || 40)
                        };

                        const setsCount = level.sets_per_day || specs.sets;
                        const tasksPerSet = level.tasks_per_set || specs.tasksPerSet;
                        const totalMaintenance = setsCount * tasksPerSet;

                        const currentTasks = completedCount % tasksPerSet;
                        const progressPercent = Math.min(100, Math.round((currentTasks / tasksPerSet) * 100));
                        const levelProgress = isCurrentLevel ? progressPercent : (isCompleted ? 100 : 0);

                        return (
                            <div key={level.id} className={`bg-[#0B0B1E] border p-7 rounded-[32px] relative overflow-hidden transition-all duration-700 flex flex-col justify-between h-full group ${isCurrentLevel ? 'border-[#3DD6C8] shadow-[0_30px_70px_rgba(0,0,0,0.6)] z-20' : 'border-white/5 hover:border-white/10'}`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                                
                                <div className="relative z-10 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#3DD6C8]/10 group-hover:border-[#3DD6C8]/30 transition-all duration-500`}>
                                            <Icon size={22} className={isCurrentLevel ? 'text-[#3DD6C8]' : 'text-white/40'} />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {isCurrentLevel ? (
                                                <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-[0.2em] px-2.5 py-0.5 bg-[#3DD6C8]/10 rounded-full border border-[#3DD6C8]/30">Active</span>
                                            ) : isLocked ? (
                                                <Lock size={12} className="text-white/20" />
                                            ) : (
                                                <CheckCircle size={14} className="text-[#3DD6C8]" />
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-3 group-hover:text-[#3DD6C8] transition-colors">{level.name}</h3>
                                        
                                        {/* Specification Table */}
                                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">In:</span>
                                                <span className="text-[11px] font-black text-amber-400 font-mono">{specs.depositRange}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">Commission rate:</span>
                                                <span className="text-[11px] font-black text-[#3DD6C8] font-mono">{specs.commPercent}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">Sets of tasks:</span>
                                                <span className="text-[11px] font-black text-white font-mono">{setsCount} sets</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">Products per task:</span>
                                                <span className="text-[11px] font-black text-white font-mono">{tasksPerSet} products</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                <span className="text-[9px] font-black text-white/50 uppercase tracking-wider">Total maintenance:</span>
                                                <span className="text-[11px] font-black text-emerald-400 font-mono">{totalMaintenance} products</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PROGRESS ENGINE */}
                                    <div className="pt-2 border-t border-white/5 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Task Progress</span>
                                            <span className="text-[9px] font-mono text-white/70">{levelProgress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full bg-[#3DD6C8] transition-all duration-1000 ${isCurrentLevel ? 'opacity-100 shadow-[0_0_10px_rgba(61,214,200,0.5)]' : 'opacity-20'}`} 
                                                style={{ width: `${levelProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 relative z-10">
                                    {isCurrentLevel ? (
                                        <div className="w-full py-3 bg-gradient-to-r from-[#3DD6C8]/10 to-transparent border border-[#3DD6C8]/20 rounded-xl text-[9px] font-black text-[#3DD6C8] uppercase tracking-[0.3em] text-center shadow-lg shadow-[#3DD6C8]/5">
                                            ACTIVE LEVEL
                                        </div>
                                    ) : isLocked ? (
                                        <button className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black text-white/30 uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all group-hover:border-white/20">
                                            LOCKED
                                        </button>
                                    ) : (
                                        <div className="w-full py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.3em] text-center">
                                            UNLOCKED
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            {/* REWARD STRUCTURE SECTION - PLACED DIRECTLY BELOW VIP GRID */}
            <div className="space-y-8 pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">Official Bonus Program</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight leading-none">
                                Reward Structure & Activation Bonuses
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/rewards/first-deposit" className="px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all">
                            First Deposit Hub
                        </Link>
                        <Link href="/invite" className="px-5 py-2.5 rounded-xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 text-[#3DD6C8] text-[10px] font-black uppercase tracking-widest hover:bg-[#3DD6C8]/20 transition-all flex items-center gap-2">
                            Invite Friends <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Deposit Tier Bonus Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                    {[
                        { deposit: 500, bonus: 30, tag: 'Tier 1' },
                        { deposit: 1000, bonus: 60, tag: 'Tier 2' },
                        { deposit: 2000, bonus: 200, tag: 'Tier 3' },
                        { deposit: 3000, bonus: 500, tag: 'Tier 4' },
                        { deposit: 5000, bonus: 1000, tag: 'Tier 5' },
                        { deposit: 10000, bonus: 2000, tag: 'Tier 6' },
                    ].map((tier, idx) => (
                        <div 
                            key={idx}
                            className="bg-[#0B0B1E] border border-white/5 hover:border-amber-400/30 p-5 rounded-[26px] text-center relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] font-black text-amber-400/80 uppercase tracking-widest block mb-1.5">{tier.tag}</span>
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Deposit ${tier.deposit.toLocaleString()}</span>
                            <div className="text-2xl font-black text-amber-400 tracking-tight leading-none mb-1">
                                +${tier.bonus.toLocaleString()}
                            </div>
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Bonus Credit</span>
                        </div>
                    ))}
                </div>

                {/* Referral & Team Commission Structure */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[36px] relative overflow-hidden group hover:border-[#3DD6C8]/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#3DD6C8]/5 blur-3xl rounded-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.25em]">Direct Tier 1</span>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-[#3DD6C8]/10 text-[#3DD6C8] font-bold">{referralRate}% Yield</span>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Direct Referrals</h3>
                        <p className="text-xs font-bold text-white/50 leading-relaxed uppercase tracking-wider mb-6">
                            Earn an instant {referralRate}% perpetual rebate commission from every task cycle completed by your direct invites.
                        </p>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Settlement</span>
                            <span className="text-xs font-mono font-bold text-white">Instant Credit</span>
                        </div>
                    </div>

                    <div className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[36px] relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em]">Team Tier 2</span>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-bold">10% Yield</span>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Secondary Network</h3>
                        <p className="text-xs font-bold text-white/50 leading-relaxed uppercase tracking-wider mb-6">
                            Receive a secondary 10% reward tier from indirect participants invited by your direct team members.
                        </p>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Settlement</span>
                            <span className="text-xs font-mono font-bold text-white">Automated</span>
                        </div>
                    </div>

                    <div className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[36px] relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.25em]">Network Tier 3</span>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">5% Yield</span>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Extended Community</h3>
                        <p className="text-xs font-bold text-white/50 leading-relaxed uppercase tracking-wider mb-6">
                            Scale your passive earnings with a 5% tertiary tier from third-level participant activity.
                        </p>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Settlement</span>
                            <span className="text-xs font-mono font-bold text-white">Real-Time</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* OPTIMIZATION INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[32px] flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <TrendingUp className="text-amber-500" size={24} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Higher Level Benefits</h4>
                        <p className="text-[11px] font-black text-white/60 uppercase tracking-widest leading-relaxed">
                            Higher VIP levels unlock better commission rates and priority processing on all tasks.
                        </p>
                    </div>
                </div>
                <div className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[32px] flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="text-indigo-500" size={24} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Your Funds Are Secure</h4>
                        <p className="text-[11px] font-black text-white/60 uppercase tracking-widest leading-relaxed">
                            All level upgrades and account transitions are verified by our customer support team.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
