'use client';


import { useEffect, useState } from 'react';
import Link from 'next/link';


import { supabase } from '@/lib/supabase/index';
import type { Level } from '@/lib/types';


import { useAuth } from '@/context/AuthContext';


import { 
    ChevronLeft, 
    Star, 
    Crown, 
    Trophy, 
    Gem, 
    Sparkles, 
    Check, 
    Lock,
    Zap,
    TrendingUp,
    ShieldCheck,
    CheckCircle,
    Diamond,
    CircleDollarSign
} from 'lucide-react';


const levelIcons = [Star, Crown, Trophy, Gem, Sparkles, Diamond];
const levelColors = [
    'from-[#3DD6C8] to-[#1a1a2e]',
    'from-[#E34304] to-[#1a1a2e]',
    'from-amber-400 to-orange-500',
    'from-rose-500 to-red-600',
    'from-emerald-500 to-teal-600',
    'from-blue-600 to-indigo-700'
];

export default function LevelsPage() {
    const { profile } = useAuth();
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLevels = async () => {
            const { data } = await supabase
                .from('levels')
                .select('*')
                .order('price', { ascending: true });
            if (data && data.length > 0) {
                setLevels(data);
            } else {
                setLevels([
                    { id: 1, name: 'LV1', price: 100, commission_rate: 0.0045, tasks_per_set: 40, description: 'Entry level.', badge_color: '#06b6d4' },
                    { id: 2, name: 'LV2', price: 500, commission_rate: 0.0050, tasks_per_set: 50, description: 'Moderate investment.', badge_color: '#8b5cf6' },
                    { id: 3, name: 'LV3', price: 2000, commission_rate: 0.0080, tasks_per_set: 60, description: 'Premium tier.', badge_color: '#f59e0b' },
                    { id: 4, name: 'LV4', price: 5000, commission_rate: 0.0100, tasks_per_set: 70, description: 'Elite tier.', badge_color: '#ef4444' },
                    { id: 5, name: 'LV5', price: 10000, commission_rate: 0.0120, tasks_per_set: 80, description: 'Institutional.', badge_color: '#10b981' },
                    { id: 6, name: 'LV6', price: 30000, commission_rate: 0.0150, tasks_per_set: 100, description: 'Ultimate.', badge_color: '#3b82f6' },
                ] as Level[]);
            }
            setLoading(false);
        };
        fetchLevels();
    }, []);

    const currentLevelId = profile?.level_id || 1;

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in space-y-8">
            

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-text-primary dark:text-white uppercase tracking-tight">VIP Experience</h1>
                    <p className="text-text-secondary text-xs mt-1 font-bold uppercase tracking-widest font-mono opacity-60">Tier Management Hub</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <Link href="/salary" className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl hover:bg-primary/30 transition-all group">
                        <CircleDollarSign size={16} className="text-primary-light group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-primary-light uppercase tracking-widest">View Salary Benefits</span>
                    </Link>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Current Status</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-black text-primary-light">LV{currentLevelId} Verified</span>
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_var(--color-success)]" />
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-[400px] glass-card animate-pulse" />
                    ))
                ) : (
                    levels.map((level, idx) => {
                        const Icon = levelIcons[idx % levelIcons.length];
                        const colorClass = levelColors[idx % levelColors.length];
                        const currentLevelId = profile?.level_id || 1;
                        const isCurrentLevel = currentLevelId === level.id;
                        const isLocked = level.id > currentLevelId;
                        const isCompleted = level.id < currentLevelId;

                        return (
                            <div
                                key={level.id}
                                className={`group glass-card p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500
                                    ${isCurrentLevel ? 'border-primary ring-1 ring-primary/40 shadow-[0_20px_40px_rgba(157,80,187,0.2)] scale-[1.02]' : 'border-black/5 dark:border-white/5 hover:border-black/10 hover:dark:border-white/20'}
                                    ${isLocked ? 'opacity-60 scale-95 grayscale-[0.3]' : ''}
                                    ${isCompleted ? 'border-success/30 bg-success/[0.02]' : ''}
                                `}
                            >
                                {/* Level Accent Glow */}
                                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-10 rounded-full blur-[40px] group-hover:opacity-30 transition-opacity`} />
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-xl shadow-black/40 group-hover:scale-110 transition-transform`}>
                                            <Icon size={28} className="text-white" />
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-2">
                                            {isCurrentLevel && (
                                                <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 flex items-center gap-1.5 animate-pulse">
                                                    <Sparkles size={12} className="text-primary-light" />
                                                    <span className="text-xs font-black text-primary-light uppercase tracking-widest">Active Tier</span>
                                                </div>
                                            )}
                                            {isCompleted && (
                                                <div className="px-3 py-1 rounded-full bg-success/20 border border-success/30 flex items-center gap-1.5">
                                                    <CheckCircle size={12} className="text-success" />
                                                    <span className="text-xs font-black text-success uppercase tracking-widest">Completed</span>
                                                </div>
                                            )}
                                            {isLocked && (
                                                <div className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-1.5 opacity-60">
                                                    <Lock size={12} className="text-text-secondary" />
                                                    <span className="text-xs font-black text-text-secondary uppercase tracking-widest">Locked</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-3xl font-black text-text-primary dark:text-white uppercase tracking-tight leading-none mb-2 group-hover:text-primary transition-colors">{level.name}</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-sm font-black text-text-secondary dark:text-white/40 uppercase tracking-widest font-mono">Cost</span>
                                            <span className="text-2xl font-black text-text-primary dark:text-white">${level.price.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-text-secondary flex items-center gap-2 font-bold"><Zap size={10} className="text-primary-light" /> Comm. Rate</span>
                                            <span className="text-text-primary dark:text-white font-black">{(level.commission_rate * 100).toFixed(2)}%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-text-secondary flex items-center gap-2 font-bold"><TrendingUp size={10} className="text-success" /> Task Limit</span>
                                            <span className="text-text-primary dark:text-white font-black">{level.tasks_per_set} TASKS</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-text-secondary flex items-center gap-2 font-bold"><Zap size={10} className="text-yellow-500" /> Max Sets</span>
                                            <span className="text-text-primary dark:text-white font-black">{level.sets_per_day} Sets</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-text-secondary flex items-center gap-2 font-bold"><ShieldCheck size={10} className="text-accent" /> Intelligence</span>
                                            <span className="text-text-primary dark:text-white font-black">Escrow+</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 relative z-10">
                                    {isCurrentLevel ? (
                                        <button disabled className="w-full py-4 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black text-primary-light uppercase tracking-widest">
                                            Currently Active
                                        </button>
                                    ) : isCompleted ? (
                                        <button disabled className="w-full py-4 rounded-xl bg-success/10 border border-success/20 text-[10px] font-black text-success uppercase tracking-widest">
                                            Tier Completed
                                        </button>
                                    ) : (
                                        <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all
                                            ${isLocked ? 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-text-secondary dark:text-white/40 hover:bg-black/10 hover:dark:bg-white/10 hover:text-text-primary hover:dark:text-white' : 'bg-primary text-white shadow-lg shadow-primary/25 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]'}
                                        `}>
                                            {isLocked ? 'Upgrade Required' : 'Activate Level'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-black/5 dark:border-white/5">
                <div className="glass-card p-8 space-y-4">
                    <h3 className="text-sm font-black text-text-primary dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <Sparkles size={16} className="text-primary" />
                        VIP Upgrade Policy
                    </h3>
                    <p className="text-xs font-bold text-text-secondary leading-relaxed uppercase tracking-widest opacity-60">
                        Tier advancement is calculated based on cumulative deposit history and contribution metrics. Higher tiers unlock premium asset optimization algorithms and priority financial clearance.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-black/5 dark:bg-white/[0.02] rounded-2xl border border-black/5 dark:border-white/5">
                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest block mb-1 opacity-50">Avg. ROI</span>
                            <span className="text-lg font-black text-success">+340% / Mo</span>
                        </div>
                        <div className="p-4 bg-black/5 dark:bg-white/[0.02] rounded-2xl border border-black/5 dark:border-white/5">
                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest block mb-1 opacity-50">Liquidity</span>
                            <span className="text-lg font-black text-primary">99.9% T-0</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-6 lg:pl-8">
                    <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                            <Crown size={18} className="text-primary-light" />
                        </div>
                        <p className="text-[10px] font-black text-text-secondary leading-relaxed uppercase tracking-[0.15em]">
                            LV5 and above accounts receive dedicated financial concierge services and customized asset allocation slots.
                        </p>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
                            <Check size={18} className="text-success" />
                        </div>
                        <p className="text-[10px] font-black text-text-secondary leading-relaxed uppercase tracking-[0.15em]">
                            Rewards and commission structures are audited monthly to ensure maximum profitability for all NodeFlow. partners.
                        </p>
                    </div>
                    <button 
                        onClick={() => window.print()}
                        className="w-fit px-8 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-black text-text-primary dark:text-white uppercase tracking-widest hover:bg-black/10 hover:dark:bg-white/10 transition-colors"
                    >
                        Download VIP Charter (PDF)
                    </button>
                </div>
            </div>

        </div>
    );
}
