'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/index';
import { 
    ChevronLeft, 
    Wallet, 
    AlertCircle, 
    CheckCircle, 
    Loader2, 
    Clock, 
    ShieldCheck, 
    Info,
    ArrowUpFromLine,
    CreditCard,
    Zap
} from 'lucide-react';
import Link from 'next/link';

// Default preset withdrawal tiers
const QUICK_WITHDRAW_PRESETS = [100, 300, 500, 1000, 2000, 5000];

export default function WithdrawPage() {
    const { profile, refreshProfile } = useAuth();
    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState(profile?.wallet_address || '');
    type WithdrawNetwork = 'TRX' | 'BEP20' | 'ERC20' | 'ETH' | 'BTC' | 'USDC' | 'BNB' | 'PAYPALUSD';
    const [network, setNetwork] = useState<WithdrawNetwork>('TRX');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [minWithdrawal, setMinWithdrawal] = useState(100);
    const [levelName, setLevelName] = useState('Level 1');
    const [levelIndex, setLevelIndex] = useState(1);

    const balance = profile?.wallet_balance || 0;

    useEffect(() => {
        const fetchSettings = async () => {
            // Fetch global min_withdrawal from site_settings
            const { data: siteData } = await supabase
                .from('site_settings')
                .select('key, value')
                .eq('key', 'min_withdrawal')
                .maybeSingle();
            const globalMin = siteData ? parseFloat(siteData.value || '100') : 100;

            if (!profile?.level_id) {
                setMinWithdrawal(globalMin);
                return;
            }
            // Level-specific min_withdrawal overrides global if set
            const { data } = await supabase
                .from('levels')
                .select('name, min_withdrawal')
                .eq('id', profile.level_id)
                .single();
            if (data) {
                setLevelName(data.name);
                const lvNum = data.name.match(/\d+/)?.[0] ? parseInt(data.name.match(/\d+/)![0]) : 1;
                setLevelIndex(lvNum);
                // Use level-specific value if set, otherwise global site setting
                setMinWithdrawal(data.min_withdrawal || globalMin);
            } else {
                setMinWithdrawal(globalMin);
            }
        };
        fetchSettings();
    }, [profile?.level_id]);

    const quickAmounts = Array.from(new Set([minWithdrawal, ...QUICK_WITHDRAW_PRESETS])).filter(v => v <= balance && v >= minWithdrawal);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const amt = parseFloat(amount);
        if (!amt || amt < minWithdrawal) {
            setError(`Minimum withdrawal for ${levelName} is $${minWithdrawal.toFixed(2)}.`);
            return;
        }
        if (amt > balance) {
            setError('Insufficient wallet balance.');
            return;
        }
        if (!walletAddress.trim()) {
            setError(network === 'PAYPALUSD' ? 'Please enter your PayPal USD (PYUSD) destination address.' : `Please enter your ${network} destination address.`);
            return;
        }

        setLoading(true);
        try {
            const { error: updateErr } = await supabase
                .from('profiles')
                .update({ 
                    wallet_balance: balance - amt, 
                    freeze_balance: (profile?.freeze_balance || 0) + amt 
                })
                .eq('id', profile!.id);

            if (updateErr) throw updateErr;

            await supabase.from('transactions').insert({
                user_id: profile!.id,
                type: 'withdrawal',
                amount: amt,
                status: 'pending',
                wallet_address: walletAddress,
                description: `Withdrawal (${network}) to ${walletAddress.substring(0, 10)}... (${levelName})`,
            });

            await refreshProfile();
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Withdrawal failed.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center shadow-[0_0_30px_var(--color-success)]">
                    <CheckCircle size={40} className="text-success" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-text-primary dark:text-white uppercase tracking-tight">Withdrawal request submitted</h2>
                    <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
                        Your request for <span className="text-text-primary dark:text-white font-bold">${amount}</span> is under review. <br />
                        <span className="text-warning font-bold mt-2 inline-block italic">
                            Withdrawal requests are processed during working hours (US Central Time 10:00 AM – 7:00 PM, Mon–Sun) after verification and approval by customer service.
                        </span>
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link href="/home" className="px-8 py-3 bg-white/5 text-text-secondary font-black text-xs uppercase tracking-widest rounded-full border border-white/10 hover:bg-white/10 transition-all">
                        Return to Dashboard
                    </Link>
                    <Link href="/record/withdraw" className="px-8 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-primary/25 hover:bg-primary-light transition-all">
                        View Withdrawal Records
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            
            <div className="flex flex-col items-center justify-center mb-4 text-center">
                <h2 className="text-3xl font-black text-text-primary dark:text-white uppercase tracking-tight">Withdrawal</h2>
            </div>

            {/* Available Funds Banner - Enhanced Premium Card */}
            <div className="bg-gradient-to-b from-[#0e1428]/95 via-[#090d1c]/95 to-[#060812] border border-[#3DD6C8]/25 p-10 sm:p-14 md:p-16 rounded-[44px] shadow-[0_25px_80px_-15px_rgba(61,214,200,0.22)] flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-700 hover:border-[#3DD6C8]/40">
                {/* Glow & Highlight effects */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3DD6C8] to-transparent opacity-80" />
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-[#3DD6C8]/15 rounded-full blur-[110px] pointer-events-none" />
                <div className="absolute -bottom-24 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute -bottom-24 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />
                
                {/* Status Badge in Banner */}
                <div className="mb-6 px-5 py-2 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-xl flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] group-hover:border-[#3DD6C8]/40 transition-all">
                    <ShieldCheck size={16} className="text-[#3DD6C8]" />
                    <span className="text-[11px] sm:text-xs font-black text-white uppercase tracking-[0.25em]">
                        {levelName} Verified Status
                    </span>
                </div>

                {/* Subtitle */}
                <span className="text-xs sm:text-sm font-black text-white/50 uppercase tracking-[0.35em] mb-3">
                    Available Funds for Payout
                </span>

                {/* Amount */}
                <div className="flex flex-wrap items-baseline justify-center gap-3 my-2">
                    <span className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none drop-shadow-[0_10px_35px_rgba(61,214,200,0.25)]">
                        ${balance.toFixed(2)}
                    </span>
                    <span className="text-sm sm:text-base font-black text-[#3DD6C8] uppercase tracking-widest px-3.5 py-1.5 rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/25 shadow-[0_0_15px_rgba(61,214,200,0.15)]">
                        {network === 'ERC20' ? 'ETH' : network === 'BTC' ? 'BTC' : network === 'PAYPALUSD' ? 'PYUSD' : 'USDT'}
                    </span>
                </div>
                
                {/* Bottom Badge */}
                <div className="mt-7 flex items-center gap-2.5 px-5 py-2 rounded-full bg-amber-400/[0.08] border border-amber-400/25 backdrop-blur-xl shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                    <Zap size={14} className="text-amber-400 animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-black text-amber-300 uppercase tracking-[0.22em]">
                        Escrow Control Active
                    </span>
                </div>
            </div>

            <hr className="border-t border-white/5 my-4" />

            <div className="flex flex-col items-center space-y-10">
                {/* Withdrawal Form: Positioned Center */}
                <div className="w-full max-w-xl space-y-6">
                    <div className="text-center space-y-2">
                        <h3 className="text-sm font-black text-text-primary dark:text-white uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                            <CreditCard size={18} className="text-accent" />
                            Secure Claim Portal
                        </h3>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Instant settlement to verified assets</p>
                    </div>

                    <form onSubmit={handleSubmit} className="glass-card-glow p-10 space-y-8 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        
                        {/* Amount Field */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] block">Withdraw Amount</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-2xl">$</div>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[24px] py-6 pl-14 pr-6 text-3xl font-black text-text-primary dark:text-white placeholder:text-text-secondary/10 focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-text-secondary text-xs font-black uppercase tracking-widest opacity-40">
                                    {network === 'ERC20' ? 'ETH' : network === 'BTC' ? 'BTC' : 'USDT'}
                                </div>
                            </div>
                            
                            {/* Quick Chips */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {quickAmounts.map(val => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(String(val))}
                                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-black text-white uppercase flex items-center gap-2 hover:bg-primary/20 hover:border-primary/30 transition-all shadow-sm"
                                    >
                                        <span>${val.toLocaleString()}</span>
                                        <img 
                                            src={
                                                network === 'ERC20' ? "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png" : 
                                                network === 'BTC' ? "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png" : 
                                                "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png"
                                            } 
                                            className="w-3.5 h-3.5 object-contain opacity-70" 
                                            alt=""
                                        />
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setAmount(String(balance))}
                                    className="px-5 py-3 rounded-xl bg-primary/10 border border-primary/20 text-[11px] font-black text-primary-light uppercase tracking-tighter hover:bg-primary/20 transition-all"
                                >
                                    MAX ALL
                                </button>
                            </div>
                        </div>

                        {/* Network Switcher */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] block">Target Network</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2 bg-black/40 rounded-[24px] border border-white/5">
                                {[
                                    { id: 'TRX', label: 'USDT-TRC20', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png' },
                                    { id: 'BEP20', label: 'USDT-BEP20', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png' },
                                    { id: 'ERC20', label: 'USDT-ERC20', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png' },
                                    { id: 'ETH', label: 'Ethereum', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png' },
                                    { id: 'BTC', label: 'Bitcoin', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png' },
                                    { id: 'USDC', label: 'USDC', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png' },
                                    { id: 'BNB', label: 'BNB Chain', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png' },
                                    { id: 'PAYPALUSD', label: 'PayPal USD', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png' }
                                ].map(net => (
                                    <button
                                        key={net.id}
                                        type="button"
                                        onClick={() => setNetwork(net.id as any)}
                                        className={`py-3.5 px-2 rounded-xl flex flex-col items-center gap-1.5 transition-all ${network === net.id 
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02] border border-primary-light/30' 
                                            : 'text-text-secondary hover:bg-white/5 hover:text-white border border-transparent'}`}
                                    >
                                        <img src={net.icon} alt="" className="w-5 h-5 object-contain" />
                                        <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-full">{net.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Wallet Field */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] block">
                                {network === 'ETH' ? 'Ethereum (ETH) Address (0x...)' : 
                                 network === 'ERC20' ? 'USDT ERC-20 Address (0x...)' : 
                                 network === 'BTC' ? 'Bitcoin (BTC) Address' : 
                                 network === 'USDC' ? 'USDC Destination Address' : 
                                 network === 'BNB' ? 'BNB Chain Address (BEP-20)' : 
                                 network === 'PAYPALUSD' ? 'PayPal USD (PYUSD) Address' : 
                                 network === 'BEP20' ? 'USDT BEP-20 Address' : 'USDT TRC-20 Address'}
                            </label>
                            <div className="relative group">
                                <Wallet size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-light transition-all group-focus-within:scale-110" />
                                <input
                                    type="text"
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                    placeholder={
                                        network === 'ETH' || network === 'ERC20' ? 'Enter 0x... Ethereum address' :
                                        network === 'BTC' ? 'Enter Bitcoin destination address' :
                                        `Enter ${network} Destination Address`
                                    }
                                    className="w-full bg-black/40 border border-white/10 rounded-[24px] py-6 pl-14 pr-6 text-base md:text-lg font-black font-mono text-white placeholder:text-text-secondary/10 focus:border-primary/50 focus:bg-primary/5 transition-all outline-none tracking-tight"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-5 bg-danger/10 border border-danger/20 rounded-2xl text-xs font-bold text-danger flex gap-4 animate-shake">
                                <AlertCircle size={16} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={loading || balance < minWithdrawal}
                                className="w-full bg-danger text-white py-6 rounded-[24px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-danger/30 hover:bg-rose-500 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:translate-y-0"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>Initiate Payout <ArrowUpFromLine size={18} /></>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-3 text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40 pt-2">
                                <ShieldCheck size={14} className="text-success" />
                                Guaranteed Escrow Settlement
                            </div>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    );
}
