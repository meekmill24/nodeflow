'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/index';
import { 
    ChevronLeft, 
    Wallet, 
    AlertCircle, 
    CheckCircle2, 
    Loader2, 
    Clock, 
    ShieldCheck, 
    Info,
    ArrowUpFromLine,
    CreditCard,
    Zap,
    Headphones,
    X,
    Sparkles,
    ArrowRight,
    Lock,
    Copy,
    Check,
    AlertTriangle,
    Coins,
    Ban as BanIcon
} from 'lucide-react';
import Link from 'next/link';
import TransactionReceipt from '@/components/TransactionReceipt';
import { toast } from 'sonner';

// Max limits per level id: Junior (1) = 1500, Intermediate (2) = 2500, Senior (3) = 5000, Mentor (4) = 5000
const LEVEL_MAX_WITHDRAWAL: Record<number, number> = {
    1: 1500, // Junior Agent
    2: 2500, // Intermediate Agent
    3: 5000, // Senior Agent
    4: 5000  // Mentor Agent
};

type WithdrawNetwork = 'TRX' | 'BEP20' | 'ERC20' | 'ETH' | 'BTC' | 'USDC' | 'BNB' | 'PAYPALUSD';

interface NetworkOption {
    id: WithdrawNetwork;
    label: string;
    sublabel: string;
    icon: string;
    placeholder: string;
    note: string;
}

const NETWORKS: NetworkOption[] = [
    { 
        id: 'TRX', 
        label: 'USDT (TRC-20)', 
        sublabel: 'Tron Network', 
        icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png',
        placeholder: 'T... (Tron TRC-20 Address)',
        note: 'Fastest settlement (~3-5 mins). Low network latency.'
    },
    { 
        id: 'BEP20', 
        label: 'USDT (BEP-20)', 
        sublabel: 'BNB Smart Chain', 
        icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png',
        placeholder: '0x... (BNB Chain BEP-20 Address)',
        note: 'Low gas fee, processed via Binance Smart Chain.'
    },
    { 
        id: 'ERC20', 
        label: 'USDT (ERC-20)', 
        sublabel: 'Ethereum Network', 
        icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png',
        placeholder: '0x... (Ethereum ERC-20 Address)',
        note: 'Institutional Ethereum settlement channel.'
    },
    { 
        id: 'ETH', 
        label: 'Ethereum (ETH)', 
        sublabel: 'Native Ether', 
        icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png',
        placeholder: '0x... (Native Ethereum Address)',
        note: 'Direct ETH transfer to cold or exchange wallet.'
    },
    { 
        id: 'BTC', 
        label: 'Bitcoin (BTC)', 
        sublabel: 'Native Bitcoin', 
        icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png',
        placeholder: '1..., 3..., or bc1... (Bitcoin Address)',
        note: 'Secured on the Bitcoin ledger network.'
    },
    { 
        id: 'USDC', 
        label: 'USD Coin (USDC)', 
        sublabel: 'ERC20 / BEP20', 
        icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png',
        placeholder: '0x... (USDC Destination Address)',
        note: '1:1 fully backed USD digital currency.'
    },
    { 
        id: 'BNB', 
        label: 'BNB Chain', 
        sublabel: 'Binance Coin', 
        icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png',
        placeholder: '0x... (BNB Destination Address)',
        note: 'Native BNB Smart Chain token settlement.'
    },
    { 
        id: 'PAYPALUSD', 
        label: 'PayPal USD', 
        sublabel: 'PYUSD', 
        icon: '/pyusd.png',
        placeholder: '0x... or PayPal USD Address',
        note: 'Regulated digital dollar by PayPal & Paxos.'
    }
];

const normalizeToWithdrawNetwork = (net?: string): WithdrawNetwork => {
    if (!net) return 'TRX';
    const n = net.toUpperCase().replace(/[-_]/g, '');
    if (n === 'USDTTRC20' || n === 'TRC20' || n === 'TRON' || n === 'TRX') return 'TRX';
    if (n === 'USDTBEP20' || n === 'BEP20' || n === 'BSC') return 'BEP20';
    if (n === 'USDTERC20' || n === 'ERC20') return 'ERC20';
    if (n === 'ETH' || n === 'ETHEREUM') return 'ETH';
    if (n === 'BTC' || n === 'BITCOIN') return 'BTC';
    if (n === 'USDC') return 'USDC';
    if (n === 'BNB') return 'BNB';
    if (n === 'PAYPALUSD' || n === 'PYUSD') return 'PAYPALUSD';
    return 'TRX';
};

export default function WithdrawPage() {
    const { profile, refreshProfile } = useAuth();
    const [amount, setAmount] = useState('30');
    const [walletAddress, setWalletAddress] = useState(profile?.wallet_address || '');
    const [network, setNetwork] = useState<WithdrawNetwork>(normalizeToWithdrawNetwork(profile?.wallet_network));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [minWithdrawal, setMinWithdrawal] = useState(30);
    const [levelName, setLevelName] = useState('Junior Agent');
    const [tasksPerSet, setTasksPerSet] = useState(40);
    const [withdrawalPermission, setWithdrawalPermission] = useState<'allow' | 'block' | 'require_tasks'>('require_tasks');
    const [requireTasksGlobal, setRequireTasksGlobal] = useState(true);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [submittedTx, setSubmittedTx] = useState<{ id: string | number; amount: number; network: string; walletAddress: string; date: string } | null>(null);

    const balance = profile?.wallet_balance || 0;
    const maxWithdrawal = profile?.level_id ? (LEVEL_MAX_WITHDRAWAL[profile.level_id] || 1500) : 1500;

    useEffect(() => {
        const fetchSettings = async () => {
            // Fetch global min_withdrawal and permissions
            const { data: siteData } = await supabase
                .from('site_settings')
                .select('key, value')
                .in('key', ['min_withdrawal', 'require_task_completion_to_withdraw', 'user_withdrawal_permissions']);

            let globalMin = 30;
            siteData?.forEach(s => {
                if (s.key === 'min_withdrawal') globalMin = parseFloat(s.value || '30');
                if (s.key === 'require_task_completion_to_withdraw') setRequireTasksGlobal(s.value === 'true');
                if (s.key === 'user_withdrawal_permissions' && profile?.id) {
                    try {
                        const permMap = JSON.parse(s.value || '{}');
                        if (permMap[profile.id]) {
                            setWithdrawalPermission(permMap[profile.id]);
                        }
                    } catch {
                        // fallback default
                    }
                }
            });

            if (!profile?.level_id) {
                setMinWithdrawal(globalMin);
                setAmount(String(globalMin));
                return;
            }
            // Level-specific min_withdrawal & tasks_per_set
            const { data } = await supabase
                .from('levels')
                .select('name, min_withdrawal, tasks_per_set')
                .eq('id', profile.level_id)
                .single();
            if (data) {
                setLevelName(data.name);
                if (data.tasks_per_set) setTasksPerSet(data.tasks_per_set);
                const effectiveMin = data.min_withdrawal || globalMin;
                setMinWithdrawal(effectiveMin);
                setAmount(String(effectiveMin));
            } else {
                setMinWithdrawal(globalMin);
                setAmount(String(globalMin));
            }
        };
        fetchSettings();
    }, [profile?.level_id, profile?.id]);

    useEffect(() => {
        if (profile?.wallet_address) {
            setWalletAddress(profile.wallet_address);
        }
        if (profile?.wallet_network) {
            setNetwork(normalizeToWithdrawNetwork(profile.wallet_network));
        }
    }, [profile?.wallet_address, profile?.wallet_network]);

    const parsedAmount = parseFloat(amount) || 0;
    const isLessThanMin = parsedAmount > 0 && parsedAmount < minWithdrawal;
    const isExceedingBalance = parsedAmount > balance;
    const isExceedingMax = parsedAmount > maxWithdrawal;
    const isBalanceBelowMin = balance < minWithdrawal;

    const effectiveTasksPerSet = profile?.tasks_per_set_override || tasksPerSet || 40;
    const completedCount = Number(profile?.completed_count || 0);
    const tasksInCurrentSet = completedCount % effectiveTasksPerSet;
    const isSetCompleted = completedCount > 0 && tasksInCurrentSet === 0;

    const isFrozen = !!profile?.is_frozen;
    const isBlockedByAdmin = withdrawalPermission === 'block' || isFrozen;
    const isForceAllowed = withdrawalPermission === 'allow';

    // Must satisfy task completion unless admin explicitly force-allowed it or global rule is disabled
    const isTaskRequirementMet = isForceAllowed || (!requireTasksGlobal || isSetCompleted);
    const canWithdraw = !isBlockedByAdmin && isTaskRequirementMet;

    const handleSelectPreset = (preset: 'MIN' | 'MAX') => {
        setError('');
        if (preset === 'MIN') {
            setAmount(String(minWithdrawal));
            return;
        }
        if (preset === 'MAX') {
            const fullBalance = Math.max(0, balance);
            setAmount(fullBalance.toFixed(2));
            return;
        }
    };

    const handlePasteAddress = async () => {
        try {
            if (navigator?.clipboard?.readText) {
                const text = await navigator.clipboard.readText();
                if (text && text.trim()) {
                    setWalletAddress(text.trim());
                    setError('');
                    toast.success('Address pasted from clipboard');
                }
            }
        } catch {
            toast.error('Clipboard access not granted. Please paste manually.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Admin block check
        if (isBlockedByAdmin) {
            const msg = isFrozen
                ? 'Your account is suspended. Withdrawals cannot be initiated. Please contact customer support.'
                : 'Withdrawals on your account are currently restricted by administration. Please contact customer support.';
            setError(msg);
            toast.error(msg);
            return;
        }

        // Task Set completion check
        if (!isTaskRequirementMet) {
            const msg = `Task Set Incomplete: You must complete all ${effectiveTasksPerSet} tasks in your current set before withdrawing (${tasksInCurrentSet}/${effectiveTasksPerSet} completed).`;
            setError(msg);
            toast.error(msg);
            return;
        }

        const amt = parseFloat(amount);

        // 1. Validate empty or invalid number
        if (isNaN(amt) || amt <= 0) {
            const msg = 'Please enter a valid withdrawal amount.';
            setError(msg);
            toast.error(msg);
            return;
        }

        // 2. Validate amount is less than min (Crucial requirement)
        if (amt < minWithdrawal) {
            const msg = `Amount is less than the minimum withdrawal amount of $${minWithdrawal.toFixed(2)}.`;
            setError(msg);
            toast.error(msg);
            return;
        }

        // 3. Validate user has enough balance
        if (amt > balance) {
            const msg = `Insufficient wallet balance. You have $${balance.toFixed(2)} available.`;
            setError(msg);
            toast.error(msg);
            return;
        }

        // 4. Validate tier max
        if (amt > maxWithdrawal) {
            setShowLimitModal(true);
            return;
        }

        // 5. Validate destination address
        if (!walletAddress.trim()) {
            const msg = network === 'PAYPALUSD' 
                ? 'Please enter your PayPal USD (PYUSD) destination address.' 
                : `Please enter your ${network} destination address.`;
            setError(msg);
            toast.error(msg);
            return;
        }

        setLoading(true);
        try {
            const currentSelectedNet = NETWORKS.find(n => n.id === network);
            const resolvedNetworkName = currentSelectedNet?.label || network;

            // Call secure server withdrawal API
            const res = await fetch('/api/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: profile!.id,
                    amount: amt,
                    network: network,
                    walletAddress: walletAddress.trim()
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Withdrawal processing encountered an issue.');
            }

            const cleanTxId = data.cleanTxId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

            setSubmittedTx({
                id: cleanTxId,
                amount: amt,
                network: resolvedNetworkName,
                walletAddress: walletAddress.trim(),
                date: new Date().toUTCString()
            });

            toast.success('Withdrawal request initiated successfully!');
            await refreshProfile();
            setSuccess(true);
        } catch (err: any) {
            console.error('Withdrawal execution error:', err);
            const errMsg = err?.message || 'Withdrawal processing encountered an issue. Please contact concierge.';
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    if (success && submittedTx) {
        return (
            <TransactionReceipt
                type="withdrawal"
                transactionId={submittedTx.id}
                amount={submittedTx.amount}
                network={submittedTx.network}
                walletAddress={submittedTx.walletAddress}
                username={profile?.username || 'Agent'}
                userId={profile?.id}
                date={submittedTx.date}
            />
        );
    }

    const currentNetworkConfig = NETWORKS.find(n => n.id === network) || NETWORKS[0];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link 
                    href="/home" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm"
                >
                    <ChevronLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <ShieldCheck size={14} /> Settlement Channel Active
                </div>
            </div>

            {/* Page Header Title */}
            <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/25 text-[#3DD6C8] text-[10px] font-black uppercase tracking-[0.25em]">
                    <Sparkles size={12} /> Institutional Financial Portal
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                    Account Payout
                </h1>
                <p className="text-xs sm:text-sm font-medium text-white/50 max-w-md">
                    Execute real-time cryptocurrency payouts to your verified destination wallet.
                </p>
            </div>

            {/* Available Funds Banner - Ultra Premium Card */}
            <div className="bg-gradient-to-b from-[#0f172a] via-[#090d1f] to-[#04060d] border border-[#3DD6C8]/30 p-8 sm:p-12 md:p-14 rounded-[40px] shadow-[0_30px_90px_-20px_rgba(61,214,200,0.22)] flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-700 hover:border-[#3DD6C8]/50">
                {/* Glow & Highlight effects */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3DD6C8] to-transparent opacity-90" />
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[540px] h-[540px] bg-[#3DD6C8]/15 rounded-full blur-[130px] pointer-events-none" />
                <div className="absolute -bottom-24 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
                
                {/* Status Badge in Banner */}
                <div className="mb-5 px-5 py-2 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-xl flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] group-hover:border-[#3DD6C8]/40 transition-all">
                    <ShieldCheck size={16} className="text-[#3DD6C8]" />
                    <span className="text-[11px] sm:text-xs font-black text-white uppercase tracking-[0.25em]">
                        {levelName} Tier Verified
                    </span>
                </div>

                {/* Subtitle */}
                <span className="text-xs sm:text-sm font-black text-white/50 uppercase tracking-[0.35em] mb-2">
                    Available Funds For Payout
                </span>

                {/* Amount */}
                <div className="flex flex-wrap items-baseline justify-center gap-3 my-2">
                    <span className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none drop-shadow-[0_10px_40px_rgba(61,214,200,0.3)] font-mono">
                        ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-[#3DD6C8] uppercase tracking-widest px-3.5 py-1.5 rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/25 shadow-[0_0_15px_rgba(61,214,200,0.15)]">
                        USD / USDT
                    </span>
                </div>

                {/* Metrics Bar */}
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
                    <div className="px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-left">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Min Payout</span>
                        <span className="text-xs font-black text-[#3DD6C8] font-mono">${minWithdrawal.toFixed(2)}</span>
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-left">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Tier Limit</span>
                        <span className="text-xs font-black text-white font-mono">${maxWithdrawal.toLocaleString()}</span>
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-left">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Processing Fee</span>
                        <span className="text-xs font-black text-emerald-400">0.00% FREE</span>
                    </div>
                </div>
            </div>

            {/* Low Balance Alert Notice (if balance is below minimum withdrawal) */}
            {isBalanceBelowMin && (
                <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest">
                                Minimum Balance Notice
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Your balance of <span className="font-bold text-white font-mono">${balance.toFixed(2)}</span> is less than the required minimum withdrawal of <span className="font-bold text-amber-300 font-mono">${minWithdrawal.toFixed(2)}</span>.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
                        <Link
                            href="/deposit"
                            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[10px] tracking-widest transition-all text-center flex-1 sm:flex-initial shadow-lg shadow-amber-500/20"
                        >
                            Top Up Balance
                        </Link>
                        <Link
                            href="/tasks"
                            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest transition-all text-center flex-1 sm:flex-initial"
                        >
                            Earn via Tasks
                        </Link>
                    </div>
                </div>
            )}

            {/* Admin Blocked Notice */}
            {isBlockedByAdmin && (
                <div className="p-6 bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent border border-rose-500/35 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-[0_10px_40px_rgba(244,63,94,0.15)]">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                            <BanIcon size={24} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                                Withdrawal Gateway Restricted
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed">
                                {isFrozen 
                                    ? 'Your account has been frozen by administration. All payouts and settlement dispatches are suspended.'
                                    : 'Withdrawals on this account are currently restricted by compliance. Please consult your VIP account manager or customer support.'}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/service"
                        className="px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black uppercase text-[10px] tracking-widest transition-all text-center shrink-0 shadow-lg shadow-rose-500/25"
                    >
                        Contact Support
                    </Link>
                </div>
            )}

            {/* Task Set Incomplete Notice */}
            {!isTaskRequirementMet && !isBlockedByAdmin && (
                <div className="p-6 sm:p-7 bg-gradient-to-r from-amber-500/15 via-indigo-950/40 to-slate-900 border border-amber-500/35 rounded-3xl backdrop-blur-xl relative overflow-hidden shadow-[0_15px_45px_rgba(245,158,11,0.15)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                                <Lock size={22} className="animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[9px] font-black uppercase tracking-widest">
                                        Task Set Requirement
                                    </span>
                                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                                        Protocol Policy
                                    </span>
                                </div>
                                <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                                    Active Task Set Incomplete ({tasksInCurrentSet} / {effectiveTasksPerSet} Finished)
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                                    Platform rules require completing all <span className="font-black text-white">{effectiveTasksPerSet} optimization tasks</span> in your active set before initiating a withdrawal. You have finished <span className="font-black text-amber-300 font-mono">{tasksInCurrentSet}</span> tasks ({effectiveTasksPerSet - tasksInCurrentSet} remaining).
                                </p>
                                
                                {/* Progress Bar */}
                                <div className="pt-2 max-w-md space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        <span>Current Set Progress</span>
                                        <span className="text-amber-300 font-mono">{Math.round((tasksInCurrentSet / effectiveTasksPerSet) * 100)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                                        <div 
                                            className="h-full bg-gradient-to-r from-amber-500 to-[#3DD6C8] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]" 
                                            style={{ width: `${Math.min(100, Math.max(5, (tasksInCurrentSet / effectiveTasksPerSet) * 100))}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <Link
                            href="/start"
                            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase text-[11px] tracking-widest transition-all text-center shrink-0 shadow-xl shadow-amber-500/20 flex items-center gap-2 group self-stretch sm:self-auto justify-center"
                        >
                            <span>Complete Set ({effectiveTasksPerSet - tasksInCurrentSet} Left)</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Task Set Complete & Authorized Badge */}
            {canWithdraw && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        <span className="text-xs font-black text-emerald-300 uppercase tracking-widest">
                            {isForceAllowed ? 'VIP Payout Authorized (Admin Clearance Active)' : 'Task Set 100% Completed — Payout Protocol Authorized'}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                        Ready for Instant Dispatch
                    </span>
                </div>
            )}

            {/* Withdrawal Form Container */}
            <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl space-y-6">
                    <div className="text-center space-y-1">
                        <h3 className="text-xs font-black text-white/70 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                            <CreditCard size={16} className="text-[#3DD6C8]" />
                            Secure Claim Settlement
                        </h3>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            Direct automated dispatch to verified crypto network
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-[#0B0F1F]/90 border border-white/10 p-8 sm:p-10 rounded-[36px] space-y-8 relative overflow-hidden backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#3DD6C8]/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                        {/* 1. AMOUNT SELECTION & INPUT SECTION */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] block">
                                    Withdrawal Amount (USD)
                                </label>
                                <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-wider font-mono">
                                    Available: ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>

                            {/* Active Amount Input Card */}
                            <div className={`p-5 sm:p-6 bg-black/40 border rounded-[28px] transition-all relative overflow-hidden shadow-inner ${
                                isLessThanMin 
                                    ? 'border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.15)]' 
                                    : isExceedingBalance 
                                    ? 'border-amber-500/60' 
                                    : 'border-[#3DD6C8]/30 focus-within:border-[#3DD6C8] focus-within:shadow-[0_0_25px_rgba(61,214,200,0.15)]'
                            }`}>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white/50 select-none">
                                            $
                                        </span>
                                        <input
                                            type="number"
                                            step="any"
                                            min="0"
                                            value={amount}
                                            onChange={(e) => {
                                                setAmount(e.target.value);
                                                setError('');
                                            }}
                                            placeholder={minWithdrawal.toString()}
                                            className="w-full bg-transparent text-3xl sm:text-4xl md:text-5xl font-black text-white font-mono tracking-tight outline-none placeholder:text-white/20"
                                        />
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-xs font-black text-[#3DD6C8] uppercase tracking-widest block">
                                            {network === 'ERC20' ? 'USDT' : network === 'ETH' ? 'ETH' : network === 'BTC' ? 'BTC' : network === 'PAYPALUSD' ? 'PYUSD' : 'USDT'}
                                        </span>
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                                            0% Fee
                                        </span>
                                    </div>
                                </div>

                                {/* Dynamic inline status pill */}
                                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                                    {isLessThanMin ? (
                                        <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-wider animate-pulse">
                                            <AlertCircle size={14} />
                                            Amount is less than minimum withdrawal (${minWithdrawal.toFixed(2)})
                                        </div>
                                    ) : isExceedingBalance ? (
                                        <div className="flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                                            <AlertCircle size={14} />
                                            Amount exceeds available balance (${balance.toFixed(2)})
                                        </div>
                                    ) : isExceedingMax ? (
                                        <div className="flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                                            <AlertCircle size={14} />
                                            Exceeds single payout quota (${maxWithdrawal.toLocaleString()})
                                        </div>
                                    ) : parsedAmount >= minWithdrawal ? (
                                        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                                            <CheckCircle2 size={14} />
                                            Amount meets settlement clearance
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-white/40 font-mono">
                                            Min: ${minWithdrawal.toFixed(2)} • Max: ${maxWithdrawal.toLocaleString()}
                                        </span>
                                    )}
                                    <span className="text-[9px] font-mono text-white/30 hidden sm:inline-block">
                                        Verified Tier: {levelName}
                                    </span>
                                </div>
                            </div>

                            {/* Preset Buttons (MIN and MAX Only) */}
                            <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Select Preset Amount:</span>
                                    <span className="text-[9px] font-mono text-white/40">Min: ${minWithdrawal} • Account: ${balance.toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectPreset('MIN')}
                                        className={`py-3.5 px-4 rounded-2xl border text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                                            parsedAmount === minWithdrawal 
                                                ? 'bg-[#3DD6C8] text-[#0B0B1E] border-[#3DD6C8] shadow-[0_0_20px_rgba(61,214,200,0.35)] scale-[1.02]' 
                                                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="text-[8px] font-black uppercase tracking-wider opacity-60">Minimum Payout</span>
                                            <span className="text-sm font-mono font-black">${minWithdrawal}</span>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10">MIN</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSelectPreset('MAX')}
                                        className={`py-3.5 px-4 rounded-2xl border text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                                            parsedAmount === balance && balance > 0
                                                ? 'bg-emerald-400 text-[#0B0B1E] border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)] scale-[1.02]' 
                                                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="text-[8px] font-black uppercase tracking-wider text-emerald-400/80">Account Balance</span>
                                            <span className="text-sm font-mono font-black text-emerald-400">${balance.toFixed(2)}</span>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">MAX</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. TARGET SETTLEMENT NETWORK SWITCHER */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] block">
                                    Target Settlement Protocol
                                </label>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    {currentNetworkConfig.label}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 bg-black/40 rounded-[26px] border border-white/5">
                                {NETWORKS.map(net => {
                                    const isSelected = network === net.id;
                                    return (
                                        <button
                                            key={net.id}
                                            type="button"
                                            onClick={() => {
                                                setNetwork(net.id);
                                                setError('');
                                            }}
                                            className={`p-3 rounded-2xl flex flex-col items-center text-center gap-2 transition-all relative ${
                                                isSelected 
                                                    ? 'bg-gradient-to-b from-[#3DD6C8]/20 to-[#3DD6C8]/5 border border-[#3DD6C8] text-white shadow-[0_0_25px_rgba(61,214,200,0.25)] scale-[1.02]' 
                                                    : 'bg-white/[0.02] hover:bg-white/5 text-white/60 hover:text-white border border-transparent'
                                            }`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center p-1.5 shrink-0">
                                                <img src={net.icon} alt={net.label} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-black uppercase tracking-wider block truncate max-w-full">
                                                    {net.label}
                                                </span>
                                                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest block">
                                                    {net.sublabel}
                                                </span>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_#3DD6C8]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="text-[10px] text-white/40 pl-1 flex items-center gap-1.5">
                                <Info size={12} className="text-[#3DD6C8] shrink-0" />
                                {currentNetworkConfig.note}
                            </p>
                        </div>

                        {/* 3. DESTINATION WALLET ADDRESS FIELD */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] block">
                                        Recipient {currentNetworkConfig.label} Address
                                    </label>
                                    {profile?.wallet_address && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                                            <CheckCircle size={10} /> Bound Wallet Auto-Loaded
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {profile?.wallet_address && walletAddress !== profile.wallet_address && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setWalletAddress(profile.wallet_address);
                                                setError('');
                                            }}
                                            className="text-[10px] font-black text-amber-400 hover:text-amber-300 uppercase tracking-widest underline cursor-pointer"
                                        >
                                            Use Bound
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handlePasteAddress}
                                        className="text-[10px] font-black text-[#3DD6C8] hover:text-[#3DD6C8]/80 uppercase tracking-widest flex items-center gap-1 transition-colors"
                                    >
                                        <Copy size={12} /> Paste Clipboard
                                    </button>
                                </div>
                            </div>

                            <div className="relative group">
                                <Wallet size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3DD6C8] transition-all group-focus-within:scale-110" />
                                <input
                                    type="text"
                                    value={walletAddress}
                                    onChange={(e) => {
                                        setWalletAddress(e.target.value);
                                        setError('');
                                    }}
                                    placeholder={currentNetworkConfig.placeholder}
                                    className="w-full bg-black/40 border border-white/10 rounded-[24px] py-5 pl-13 pr-5 text-sm sm:text-base font-black font-mono text-white placeholder:text-white/20 focus:border-[#3DD6C8]/60 focus:bg-[#3DD6C8]/5 transition-all outline-none tracking-tight shadow-inner"
                                />
                            </div>
                        </div>

                        {/* 4. SETTLEMENT SUMMARY BREAKDOWN */}
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-white/50 font-bold uppercase tracking-wider text-[10px]">Requested Payout</span>
                                <span className="font-mono font-black text-white">${parsedAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-white/50 font-bold uppercase tracking-wider text-[10px]">Network Gas Fee</span>
                                <span className="font-mono font-black text-emerald-400">FREE ($0.00)</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-white/50 font-bold uppercase tracking-wider text-[10px]">Est. Processing Window</span>
                                <span className="font-bold text-white/80">10 – 30 Minutes</span>
                            </div>
                            <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[#3DD6C8] font-black uppercase tracking-wider text-[11px]">Net Credited Settlement</span>
                                <span className="font-mono font-black text-lg text-white text-emerald-300">
                                    ${parsedAmount.toFixed(2)} {network === 'ERC20' ? 'USDT' : network}
                                </span>
                            </div>
                        </div>

                        {/* 5. ERROR BANNER */}
                        {error && (
                            <div className="p-5 bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent border border-rose-500/30 rounded-2xl text-xs font-bold text-rose-300 flex items-start gap-3.5 animate-shake shadow-lg shadow-rose-500/10">
                                <AlertCircle size={18} className="shrink-0 text-rose-400 mt-0.5" />
                                <div className="space-y-1">
                                    <span className="font-black uppercase tracking-wider text-[10px] block text-rose-400">Withdrawal Validation Notice</span>
                                    <p className="leading-relaxed">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* 6. SUBMISSION CTA */}
                        <div className="space-y-4 pt-2">
                            <button
                                type="submit"
                                disabled={loading || !canWithdraw}
                                className={`w-full py-5 sm:py-6 rounded-[24px] font-black uppercase tracking-[0.25em] text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-3 ${
                                    !canWithdraw
                                        ? 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 text-white shadow-[0_15px_40px_rgba(244,63,94,0.35)] hover:shadow-[0_20px_50px_rgba(244,63,94,0.5)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                                } disabled:opacity-50 disabled:translate-y-0`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Securing Settlement...</span>
                                    </>
                                ) : isBlockedByAdmin ? (
                                    <>
                                        <BanIcon size={18} className="text-rose-400" />
                                        <span>Withdrawals Restricted By Admin</span>
                                    </>
                                ) : !isTaskRequirementMet ? (
                                    <>
                                        <Lock size={18} className="text-amber-400" />
                                        <span>Complete Set Tasks to Withdraw ({tasksInCurrentSet}/{effectiveTasksPerSet})</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Initiate Payout</span>
                                        <ArrowUpFromLine size={18} />
                                    </>
                                )}
                            </button>

                            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-widest pt-2">
                                <div className="flex items-center gap-1.5">
                                    <Lock size={12} className="text-[#3DD6C8]" />
                                    256-Bit Escrow Vault
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck size={12} className="text-emerald-400" />
                                    Instant Node Clearance
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Limit Reached Customer Service Modal */}
            {showLimitModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#0B0F22] border border-amber-500/35 w-full max-w-md rounded-[36px] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.95)] relative overflow-hidden text-center space-y-6 animate-scale-in">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                            <Headphones size={36} className="animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">Institutional Verification</span>
                            <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Withdrawal Limit Notice</h3>
                            <p className="text-xs text-white/60 leading-relaxed pt-2">
                                You have reached or exceeded the single-transaction withdrawal quota for <strong className="text-white">{levelName}</strong> (${maxWithdrawal.toLocaleString()} max).
                            </p>
                            <p className="text-[11px] text-amber-400/90 font-bold leading-relaxed">
                                To unlock higher clearance or finalize this payout, please contact your dedicated Customer Service agent.
                            </p>
                        </div>
                        <div className="space-y-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowLimitModal(false);
                                    if ((window as any).Tawk_API?.maximize) {
                                        (window as any).Tawk_API.maximize();
                                    } else {
                                        window.location.href = '/concierge';
                                    }
                                }}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-[#0B0B1E] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-all"
                            >
                                <Headphones size={16} /> Contact Customer Service
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowLimitModal(false)}
                                className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
