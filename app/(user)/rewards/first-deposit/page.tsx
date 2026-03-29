'use client';

import { ArrowLeft, Gift, Zap, CheckCircle, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/index';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const DEFAULT_REWARDS = [
    { amount: 100, receive: 10 },
    { amount: 500, receive: 50 },
    { amount: 1000, receive: 120 },
    { amount: 3000, receive: 500 },
    { amount: 5000, receive: 1000 },
    { amount: 10000, receive: 2500 },
];

export default function FirstDepositRewardPage() {
    const router = useRouter();
    const { profile } = useAuth();
    const { format } = useCurrency();
    const [rewards, setRewards] = useState(DEFAULT_REWARDS);
    const [isClaiming, setIsClaiming] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('site_settings').select('key, value');
            if (data) {
                const dynamicRewards = [];
                for (let i = 1; i <= 6; i++) {
                    const setting = data.find(s => s.key === `reward_tier_${i}`);
                    if (setting?.value && setting.value.includes('/')) {
                        const [amount, receive] = setting.value.split('/').map(v => parseFloat(v));
                        if (!isNaN(amount) && !isNaN(receive)) {
                            dynamicRewards.push({ amount, receive });
                        }
                    }
                }
                if (dynamicRewards.length > 0) setRewards(dynamicRewards);
            }
        };
        fetchSettings();
    }, []);

    const handleClaim = async (tier: any) => {
        if (!profile?.id) {
            toast.error('Authentication required to ping concierge.');
            return;
        }
        setIsClaiming(true);
        try {
            // Fetch admins for notification
            const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
            
            if (admins && admins.length > 0) {
                const notifications = admins.map(admin => ({
                    user_id: admin.id,
                    title: 'Reward Settlement Required',
                    message: `User ${profile.username} (ID: ${profile.id.substring(0,6)}) is requesting manual verification for Tier Reward ($${tier.receive}).`,
                    type: 'warning',
                    is_read: false
                }));

                const { error } = await supabase.from('notifications').insert(notifications);
                if (error) throw error;
                
                toast.success('Pinging Concierge Desk... Verification in progress.');
            } else {
                toast.error('No administrative nodes active. Use Live Chat.');
            }
        } catch (err) {
            console.error('Claim Error:', err);
            toast.error('Sync failed. Please use Live Chat.');
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-slide-up">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => router.back()}
                    className="p-3 rounded-2xl bg-white/5 text-text-secondary hover:text-white transition-all border border-white/5"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">System Events</h1>
                    <p className="text-[10px] text-primary-light font-black uppercase tracking-[0.3em] opacity-60">Verified Activity Center</p>
                </div>
            </div>

            {/* Banner Area */}
            <div className="relative mb-12 rounded-[40px] overflow-hidden bg-[#1a1421] border border-white/5 group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9d50bb]/20 via-transparent to-[#6e48aa]/20 opacity-100" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                
                <div className="relative p-10 md:p-14 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent p-1 mb-8 shadow-[0_0_40px_rgba(157,80,187,0.4)]">
                        <div className="w-full h-full rounded-full bg-[#0a050f] flex items-center justify-center">
                            <Gift size={44} className="text-white drop-shadow-glow" />
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">First Deposit <br className="md:hidden" /> Rewards</h2>
                    <p className="text-sm text-text-secondary max-w-lg uppercase font-bold tracking-[0.1em] leading-relaxed opacity-60">
                        Join our optimization network today. High-yield bonuses for new partners on initial node synchronization.
                    </p>
                </div>
            </div>

            {/* Rewards Table */}
            <div className="glass-card mb-12 border-white/10">
                <div className="grid grid-cols-3 px-8 py-4 bg-white/5 border-b border-white/5">
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Transaction</span>
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] text-center">Amount</span>
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] text-right">Benefit</span>
                </div>

                <div className="divide-y divide-white/5">
                    {rewards.map((reward, idx) => (
                        <div key={idx} className="grid grid-cols-3 px-8 py-6 items-center hover:bg-white/[0.02] transition-colors group/row">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Zap size={14} className="text-primary-light" />
                                </div>
                                <span className="text-xs font-black text-white uppercase tracking-wider">Level {idx + 1}</span>
                            </div>
                            
                            <div className="text-sm font-black text-white text-center">
                                ${format(reward.amount)}
                            </div>

                            <div className="text-right flex flex-col items-end">
                                <div className="text-lg font-black text-success-light flex items-center gap-1.5 drop-shadow-glow-success">
                                    +${format(reward.receive)}
                                </div>
                                <button 
                                    onClick={() => handleClaim(reward)}
                                    disabled={isClaiming}
                                    className="mt-2 px-3 py-1 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 text-[8px] font-black text-[#3DD6C8] uppercase tracking-widest opacity-0 group-hover/row:opacity-100 hover:bg-[#3DD6C8] hover:text-[#0F172A] transition-all disabled:opacity-30"
                                >
                                    {isClaiming ? 'Pinging...' : 'Claim Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Support CTA */}
            <div className="glass-card-strong p-10 flex flex-col items-center text-center">
                <FileText size={40} className="text-accent-light mb-6 opacity-40" />
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Official Disclaimer</h3>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest leading-relaxed max-w-lg mb-10 opacity-60">
                    All rewards are subject to internal audit and account verification. To claim your bonus manually, please contact the SmartBugMedia. Concierge Desk.
                </p>
                <button 
                    onClick={() => (window as any).Tawk_API?.maximize()}
                    className="w-full max-w-sm py-5 rounded-3xl bg-primary text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Contact Live Concierge <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
