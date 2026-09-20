'use client';

import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { 
    ChevronLeft, 
    CircleDollarSign, 
    Calendar, 
    Award, 
    Clock, 
    ShieldCheck, 
    Info,
    CheckCircle2,
    Lock,
    Zap,
    Trophy,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/index';

const salaryData = [
    { level: 1, name: 'Junior', rewards: [100, 300, 800, 1500, 4000], total: 6700 },
    { level: 2, name: 'Intermediate', rewards: [200, 500, 1500, 3000, 6000], total: 11200 },
    { level: 3, name: 'Senior', rewards: [300, 700, 2500, 5000, 10000], total: 18000 },
    { level: 4, name: 'Mentor', rewards: [400, 900, 3500, 6000, 12000], total: 22800 },
];

const days = [2, 4, 7, 15, 30];

export default function SalaryPage() {
    const { profile } = useAuth();
    const { format } = useCurrency();
    const [claiming, setClaiming] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const currentDays = (profile as any)?.salary_days_count || 0;
    const currentLevel = profile?.level_id || 1;

    const handleClaim = async () => {
        setClaiming(true);
        setMessage(null);
        try {
            const { data, error } = await supabase.rpc('claim_salary_bonus');
            if (error) throw error;
            
            if (data.success) {
                setMessage({ type: 'success', text: `Successfully claimed $${data.amount} for Day ${data.day}!` });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to claim salary.' });
        } finally {
            setClaiming(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/home" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-black uppercase tracking-wider transition-all">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Salary Structure</h1>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">Monthly Compensation Model</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="px-3.5 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center gap-2 shadow-sm">
                        <Clock size={14} className="text-amber-400 animate-pulse" />
                        <span className="text-xs font-black text-amber-300 uppercase tracking-widest">10:00 AM – 7:00 PM CT</span>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
                        <Calendar size={14} className="text-primary-light" />
                        <span className="text-xs font-black text-primary-light uppercase tracking-widest">{currentDays} Consecutive Days</span>
                    </div>
                </div>
            </div>

            {/* Salary Progress Card */}
            <div className="glass-card p-8 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 border-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-light">
                                <Award size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tighter">Your Progress</h2>
                        </div>
                        <p className="text-text-secondary text-sm font-medium leading-relaxed max-w-md opacity-80 uppercase tracking-wide">
                            Complete your task sets daily to increase your consecutive work day count and unlock high-value base salary rewards.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full border-[6px] border-primary/20 border-t-primary flex items-center justify-center relative">
                            <span className="text-2xl font-black text-white">{currentDays}</span>
                            <div className="absolute -bottom-2 px-2 py-0.5 bg-primary rounded text-[8px] font-black text-white uppercase tracking-tighter shadow-lg shadow-primary/40">DAYS</div>
                        </div>
                        <button 
                            onClick={handleClaim}
                            disabled={claiming}
                            className="btn-primary px-8 py-3 text-[10px] tracking-[0.2em] font-black group relative overflow-hidden"
                        >
                            {claiming ? 'PROCESSING...' : 'CLAIM SALARY BONUS'}
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`mt-6 p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center animate-bounce-slow
                        ${message.type === 'success' ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'}
                    `}>
                        {message.text}
                    </div>
                )}
            </div>

            {/* Salary Table */}
            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-black/5 dark:border-white/5 bg-black/20">
                    <div className="flex items-center gap-2">
                        <Trophy size={16} className="text-yellow-500" />
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Salary Structure Table</h3>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/40 text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">
                                <th className="p-4 pl-6">Level</th>
                                {days.map(day => (
                                    <th key={day} className="p-4 text-center">Day {day}</th>
                                ))}
                                <th className="p-4 pr-6 text-right">Total Salary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {salaryData.map((row, i) => (
                                <tr key={row.level} className={`group hover:bg-white/[0.02] transition-colors ${currentLevel === row.level ? 'bg-primary/5' : ''}`}>
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-lg bg-gradient-to-br ${
                                                i === 0 ? 'from-[#3DD6C8] to-[#1a1a2e]' :
                                                i === 1 ? 'from-[#E34304] to-[#1a1a2e]' :
                                                i === 2 ? 'from-amber-400 to-orange-500' :
                                                'from-rose-500 to-red-600'
                                            }`}>
                                                {row.level}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-white uppercase tracking-tight">{row.name}</span>
                                                <span className="text-[8px] font-bold text-text-secondary uppercase tracking-widest opacity-40">Tier {row.level}</span>
                                            </div>
                                        </div>
                                    </td>
                                    {row.rewards.map((reward, j) => (
                                        <td key={j} className="p-4 text-center">
                                            <div className={`text-xs font-black tracking-tighter ${currentDays >= days[j] && currentLevel === row.level ? 'text-success' : 'text-white'}`}>
                                                ${reward.toLocaleString()}
                                            </div>
                                            {currentDays >= days[j] && currentLevel === row.level && (
                                                <div className="text-[8px] font-black text-success uppercase tracking-tighter">Unlocked</div>
                                            )}
                                        </td>
                                    ))}
                                    <td className="p-4 pr-6 text-right">
                                        <div className="text-sm font-black text-primary-light tracking-tighter">
                                            ${row.total.toLocaleString()}
                                        </div>
                                        <div className="text-[7px] font-black text-text-secondary uppercase tracking-tighter opacity-40">30 Day Cycle</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rules & Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 space-y-6">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                        <Info size={16} className="text-primary" />
                        Important Notes
                    </h3>
                    <ul className="space-y-4">
                        {[
                            'Minimum salary is $6,700 for 30 consecutive days of work.',
                            'Salary increases with higher employee grades (VIP Levels).',
                            'Pay periods available every 2, 4, 7, 15, and 30 days.',
                            'Official working hours: US Central Time 10:00 AM – 7:00 PM (11:00 AM – 8:00 PM Eastern Time), Monday to Sunday.',
                            'Daily operational commitment: ~30 to 60 minutes to complete designated task sets during working hours.',
                            'Missed or interrupted workdays will reset the daily cycle accrual.'
                        ].map((note, idx) => (
                            <li key={idx} className="flex gap-3 items-start group">
                                <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary transition-colors">
                                    <CheckCircle2 size={10} className="text-primary-light group-hover:text-white" />
                                </div>
                                <p className="text-[10px] font-black text-text-secondary leading-relaxed uppercase tracking-widest opacity-60">
                                    {note}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glass-card p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 rounded-tl-full" />
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                        <ShieldCheck size={16} className="text-success" />
                        Compliance & Working Schedule
                    </h3>
                    <div className="space-y-4 relative z-10">
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
                            <div className="flex items-center gap-2 text-amber-400">
                                <Clock size={14} />
                                <h4 className="text-[9px] font-black uppercase tracking-widest">Working Hours Window</h4>
                            </div>
                            <p className="text-[10px] text-text-secondary leading-relaxed font-bold uppercase tracking-widest opacity-70">
                                10:00 AM – 7:00 PM CT (11:00 AM – 8:00 PM ET) • 7 Days a Week (Mon–Sun). Payouts and claims are validated in real-time by customer support.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <h4 className="text-[9px] font-black text-primary-light uppercase tracking-widest mb-2">Claim Window</h4>
                            <p className="text-[10px] text-text-secondary leading-relaxed font-bold uppercase tracking-widest opacity-60">
                                Claims must be processed after all daily task sets are finalized. Manual verification may be required for high-tier claims.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 p-4 rounded-xl bg-black/20 border border-white/5">
                                <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest block mb-1">Status Tracking</span>
                                <span className="text-xs font-black text-success">Verified Hub</span>
                            </div>
                            <div className="flex-1 p-4 rounded-xl bg-black/20 border border-white/5">
                                <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest block mb-1">Audited By</span>
                                <span className="text-xs font-black text-white">TLS 1.3</span>
                            </div>
                        </div>
                        <Link href="/service" className="block text-center p-3 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                            Contact Customer Service for Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
