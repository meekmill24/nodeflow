

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/index';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import type { UserTask, TaskItem } from '@/lib/types';
import { Clock, CheckCircle, XCircle, Search, Filter, ChevronRight, Zap, Headset, Loader2, TrendingUp, ArrowLeft, Sparkles, AlertCircle, ArrowRight, Wallet, Layers } from 'lucide-react';
import Portal from '@/components/Portal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BundledPackageModal, { BundlePackage } from '@/components/BundledPackageModal';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

function parsePendingBundle(pb: any): any | null {
    if (!pb) return null;
    let obj = pb;
    if (typeof pb === 'string') {
        try {
            obj = JSON.parse(pb);
        } catch {
            return null;
        }
    }
    if (Array.isArray(obj)) {
        if (obj.length === 0) return null;
        obj = obj[0];
    }
    if (typeof obj !== 'object' || obj === null) return null;
    return obj;
}

export default function RecordPage() {
    const router = useRouter();
    const { profile, refreshProfile } = useAuth();
    const { t, language } = useLanguage();
    const { format } = useCurrency();
    const [tasks, setTasks] = useState<(UserTask & { task_item: TaskItem })[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profitAdded, setProfitAdded] = useState<number | null>(null);
    const [showBundleSuccessToast, setShowBundleSuccessToast] = useState(false);
    const [submittingTaskId, setSubmittingTaskId] = useState<number | null>(null);
    const [bundleModalOpen, setBundleModalOpen] = useState(false);
    const [activeBundle, setActiveBundle] = useState<BundlePackage | null>(null);
    const [associatedTaskId, setAssociatedTaskId] = useState<number | null>(null);

    const fetchTasks = async () => {
        if (!profile) return;
        const { data } = await supabase
            .from('user_tasks')
            .select('id, status, created_at, completed_at, earned_amount, cost_amount, is_bundle, task_item_id, task_item:task_items(id, title, image_url, category)')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(500);

        if (data) {
            setTasks(data as any);
        }
        setLoading(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchTasks();
    }, [profile]);

    const handleSubmitPending = async (taskItemId: number) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setSubmittingTaskId(taskItemId);

        try {
            const { data, error } = await supabase.rpc('complete_user_task', {
                p_task_item_id: taskItemId
            });

            if (error) throw error;

            if (data?.is_bundle) {
                setShowBundleSuccessToast(true);
                setTimeout(() => setShowBundleSuccessToast(false), 5000);
            } else {
                setProfitAdded(data?.earned_amount || 0);
                setTimeout(() => setProfitAdded(null), 3000);
            }

            await Promise.all([
                refreshProfile(),
                fetchTasks()
            ]);
        } catch (err: any) {
            console.error("Submission error:", err);
            alert(err.message || "Failed to submit optimization.");
        } finally {
            setIsSubmitting(false);
            setSubmittingTaskId(null);
        }
    };

    // Pending bundle detection & derivation (SimpleMoneys & Captiv8 style)
    const parsedPb = parsePendingBundle((profile as any)?.pending_bundle);
    const pendingTaskInDb = tasks.find(t => t.is_bundle && t.status === 'pending');

    let currentPendingBundle: BundlePackage | null = null;
    if (parsedPb) {
        const currentWallet = Number(profile?.wallet_balance || 0);
        const bundleTotal = Number(parsedPb.totalAmount || parsedPb.cost || (pendingTaskInDb?.cost_amount ?? 0));
        const bundleBonus = Number(parsedPb.bonusAmount || parsedPb.profit || (pendingTaskInDb?.earned_amount ?? (bundleTotal * 0.15)));
        const shortage = Math.max(0, bundleTotal - currentWallet);

        currentPendingBundle = {
            id: String(parsedPb.id || pendingTaskInDb?.id || `pending-bundle-${profile?.id}`),
            name: String(parsedPb.name || "Super Order Package"),
            description: String(parsedPb.description || "Exclusive high-yield institutional Super Order sequence ready for settlement."),
            shortageAmount: shortage,
            totalAmount: bundleTotal,
            bonusAmount: bundleBonus,
            rate: Number(parsedPb.rate || (bundleTotal > 0 ? (bundleBonus / bundleTotal) * 100 : 0)),
            expiresIn: Number(parsedPb.expiresIn || 86400),
            targetIndex: Number(parsedPb.targetIndex || 0),
            taskItem: parsedPb.taskItem || (pendingTaskInDb?.task_item ? {
                title: pendingTaskInDb.task_item.title,
                image_url: pendingTaskInDb.task_item.image_url,
                category: pendingTaskInDb.task_item.category
            } : undefined),
            taskItems: parsedPb.taskItems || (parsedPb.taskItem ? [parsedPb.taskItem] : (pendingTaskInDb?.task_item ? [{
                title: pendingTaskInDb.task_item.title,
                image_url: pendingTaskInDb.task_item.image_url,
                category: pendingTaskInDb.task_item.category
            }] : undefined))
        };
    } else if (pendingTaskInDb) {
        const currentWallet = Number(profile?.wallet_balance || 0);
        const bundleTotal = Number(pendingTaskInDb.cost_amount || 0);
        const bundleBonus = Number(pendingTaskInDb.earned_amount || (bundleTotal * 0.15));
        const shortage = Math.max(0, bundleTotal - currentWallet);

        currentPendingBundle = {
            id: String(pendingTaskInDb.id),
            name: pendingTaskInDb.task_item?.title || "Super Order Package",
            description: "Exclusive high-yield institutional Super Order sequence ready for settlement.",
            shortageAmount: shortage,
            totalAmount: bundleTotal,
            bonusAmount: bundleBonus,
            rate: bundleTotal > 0 ? (bundleBonus / bundleTotal) * 100 : 20,
            expiresIn: 86400,
            taskItem: pendingTaskInDb.task_item ? {
                title: pendingTaskInDb.task_item.title,
                image_url: pendingTaskInDb.task_item.image_url,
                category: pendingTaskInDb.task_item.category
            } : undefined,
            taskItems: pendingTaskInDb.task_item ? [{
                title: pendingTaskInDb.task_item.title,
                image_url: pendingTaskInDb.task_item.image_url,
                category: pendingTaskInDb.task_item.category
            }] : undefined
        };
    }

    const handleOpenSuperOrder = (taskRow?: any) => {
        if (taskRow?.id) {
            setAssociatedTaskId(taskRow.id);
        } else if (pendingTaskInDb?.id) {
            setAssociatedTaskId(pendingTaskInDb.id);
        } else {
            setAssociatedTaskId(null);
        }

        if (taskRow && !parsedPb) {
            const currentWallet = Number(profile?.wallet_balance || 0);
            const bundleTotal = Number(taskRow.cost_amount || 0);
            const bundleBonus = Number(taskRow.earned_amount || (bundleTotal * 0.15));
            const shortage = Math.max(0, bundleTotal - currentWallet);

            setActiveBundle({
                id: String(taskRow.id),
                name: taskRow.task_item?.title || "Super Order Package",
                description: "Exclusive high-yield institutional Super Order sequence ready for settlement.",
                shortageAmount: shortage,
                totalAmount: bundleTotal,
                bonusAmount: bundleBonus,
                rate: bundleTotal > 0 ? (bundleBonus / bundleTotal) * 100 : 20,
                expiresIn: 86400,
                taskItem: taskRow.task_item ? {
                    title: taskRow.task_item.title,
                    image_url: taskRow.task_item.image_url,
                    category: taskRow.task_item.category
                } : undefined,
                taskItems: taskRow.task_item ? [{
                    title: taskRow.task_item.title,
                    image_url: taskRow.task_item.image_url,
                    category: taskRow.task_item.category
                }] : undefined
            });
        } else if (currentPendingBundle) {
            setActiveBundle(currentPendingBundle);
        }
        setBundleModalOpen(true);
    };

    const handleBundleAccept = async (bundle: BundlePackage) => {
        if (!profile) return;
        setIsSubmitting(true);
        try {
            const profitEarned = Number(bundle.bonusAmount || 0);
            const bundleCost = Number(bundle.totalAmount || 0);
            const updatedWallet = Number(profile.wallet_balance || 0) + profitEarned;
            const updatedProfit = Number(profile.profit || 0) + profitEarned;
            const updatedTotalEarned = Number(profile.total_earned || 0) + profitEarned;
            const updatedCompletedCount = Number(profile.completed_count || 0) + 1;

            // 1. Update profile with profit credited, count incremented, pending_bundle cleared
            const { error: profileErr } = await supabase.from('profiles').update({
                wallet_balance: updatedWallet,
                profit: updatedProfit,
                total_earned: updatedTotalEarned,
                completed_count: updatedCompletedCount,
                pending_bundle: null
            }).eq('id', profile.id);

            if (profileErr) throw profileErr;

            // 2. Mark existing pending task in user_tasks as completed, or insert new completed task
            let targetTaskId = associatedTaskId;
            if (!targetTaskId) {
                const pendingInState = tasks.find(t => t.status === 'pending' && t.is_bundle);
                if (pendingInState) {
                    targetTaskId = pendingInState.id;
                }
            }

            if (targetTaskId) {
                await supabase.from('user_tasks').update({
                    status: 'completed',
                    earned_amount: profitEarned,
                    cost_amount: bundleCost,
                    completed_at: new Date().toISOString()
                }).eq('id', targetTaskId);
            } else {
                const taskItemId = Number(bundle.id.replace(/\D/g, '')) || 2171;
                await supabase.from('user_tasks').insert({
                    user_id: profile.id,
                    task_item_id: taskItemId,
                    status: 'completed',
                    earned_amount: profitEarned,
                    cost_amount: bundleCost,
                    is_bundle: true,
                    completed_at: new Date().toISOString()
                });
            }

            setBundleModalOpen(false);
            setActiveBundle(null);
            setAssociatedTaskId(null);
            setProfitAdded(profitEarned);
            confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
            toast.success(`Super Order Cleared! Profit: ${format(profitEarned)} credited to your account.`);

            await Promise.all([
                refreshProfile(),
                fetchTasks()
            ]);
            setTimeout(() => setProfitAdded(null), 3500);
        } catch (err: any) {
            console.error("Error accepting bundle:", err);
            toast.error(err.message || "Failed to process super order");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.task_item?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id.toString().includes(searchQuery);
        const matchesStatus = filter === 'all' || t.status === filter;

        // Date Filtering
        const taskDate = new Date(t.created_at);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = taskDate.toDateString() === today.toDateString();
        const isYesterday = taskDate.toDateString() === yesterday.toDateString();

        const matchesDate = dateFilter === 'all' || 
                           (dateFilter === 'today' && isToday) || 
                           (dateFilter === 'yesterday' && isYesterday);

        return matchesSearch && matchesStatus && matchesDate;
    });

    const statusBadge = (status: string) => {
        const statusLabel = t(status.toLowerCase());
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-success/10 text-success border border-success/20 tracking-wider">
                        <CheckCircle size={10} /> {statusLabel}
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-warning/10 text-warning border border-warning/20 tracking-wider">
                        <Clock size={10} /> {statusLabel}
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-danger/10 text-danger border border-danger/20 tracking-wider">
                        <XCircle size={10} /> {statusLabel}
                    </span>
                );
            default: return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-black/5 dark:bg-white/5 text-text-secondary border border-black/5 dark:border-white/5 tracking-wider">
                    {statusLabel}
                </span>
            );
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 space-y-4 animate-fade-in pb-12 font-record">
            {/* Top Navigation */}
            <div className="flex items-center justify-between pb-2">
                <Link 
                    href="/home" 
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                    <Clock size={14} /> Optimization Ledger
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Task Record</h2>
                    <p className="text-text-secondary text-xs mt-1 font-bold uppercase tracking-widest">{filteredTasks.length} total records found</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                        <input
                            type="text"
                            placeholder={t('search_tasks')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-xs text-text-primary focus:outline-none focus:border-primary/50 w-[200px]"
                        />
                    </div>
                    <button 
                        onClick={() => {
                            const next = dateFilter === 'all' ? 'today' : dateFilter === 'today' ? 'yesterday' : 'all';
                            setDateFilter(next);
                        }}
                        className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                            dateFilter !== 'all' 
                                ? 'bg-primary/20 border-primary text-primary-light shadow-sm' 
                                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-text-secondary hover:text-primary hover:border-primary/30'
                        }`}
                        title={`Current date scope: ${dateFilter}`}
                    >
                        <Filter size={16} />
                        {dateFilter !== 'all' && (
                            <span className="text-[9px] font-black uppercase tracking-wider">{dateFilter}</span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-black/5 dark:border-white/5 gap-2">
                <div className="flex relative">
                    {(['all', 'completed', 'pending'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 md:px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative z-10 ${filter === f ? 'text-primary-light' : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {t(f)}
                            {filter === f && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-primary-light to-primary shadow-[0_0_10px_var(--color-primary)] animate-fade-in" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex bg-black/10 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5 mb-2 mr-2 self-start md:self-center">
                    {(['all', 'today', 'yesterday'] as const).map(df => (
                        <button
                            key={df}
                            onClick={() => setDateFilter(df)}
                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all ${
                                dateFilter === df ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            {df === 'all' ? 'All Time' : t(df) || df}
                        </button>
                    ))}
                </div>
            </div>

            {/* PENDING SUPER ORDER BANNER (SimpleMoneys & Captiv8 Style) */}
            {(filter === 'all' || filter === 'pending') && currentPendingBundle && (
                <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-[#0d0d1e]/90 to-amber-900/10 p-5 md:p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] backdrop-blur-xl animate-fade-in">
                    {/* Glow accent */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        {/* Left info */}
                        <div className="flex items-start gap-4">
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                    <Sparkles size={28} className="animate-pulse" />
                                </div>
                                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-[#0d0d1e]"></span>
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        SPECIAL TASK • SUPER ORDER
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                        HIGH-YIELD COMBO
                                    </span>
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-white tracking-tight uppercase">
                                    {currentPendingBundle.name || "Super Order Package"}
                                </h3>
                                <p className="text-xs text-white/70 max-w-xl font-medium leading-relaxed">
                                    {currentPendingBundle.description || "You have an assigned institutional Super Order sequence ready for settlement."}
                                </p>
                            </div>
                        </div>

                        {/* Metrics & Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-6 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                            <div className="grid grid-cols-2 sm:flex sm:items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Order Value</span>
                                    <span className="text-sm md:text-base font-black text-white">
                                        {format(currentPendingBundle.totalAmount)}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/80">Profit Yield</span>
                                    <span className="text-sm md:text-base font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                                        +{format(currentPendingBundle.bonusAmount)}
                                    </span>
                                </div>
                            </div>

                            {/* Submit / Action Buttons */}
                            <div className="flex items-center gap-2">
                                {currentPendingBundle.shortageAmount > 0 || (profile && profile.wallet_balance < currentPendingBundle.totalAmount) ? (
                                    <>
                                        <Link
                                            href="/deposit"
                                            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <Wallet size={15} /> Deposit
                                        </Link>
                                        <button
                                            onClick={() => handleOpenSuperOrder()}
                                            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            Details <ChevronRight size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleOpenSuperOrder()}
                                        disabled={isSubmitting}
                                        className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group animate-pulse cursor-pointer"
                                    >
                                        <Sparkles size={16} className="text-black group-hover:rotate-12 transition-transform" />
                                        Submit Super Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Shortage warning if balance insufficient */}
                    {(currentPendingBundle.shortageAmount > 0 || (profile && profile.wallet_balance < currentPendingBundle.totalAmount)) && (
                        <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-semibold text-amber-300/90">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={15} className="text-amber-400 shrink-0" />
                                <span>
                                    Account deficit: <strong className="text-amber-200">{format(Math.max(currentPendingBundle.shortageAmount, currentPendingBundle.totalAmount - (profile?.wallet_balance || 0)))}</strong> required to complete order.
                                </span>
                            </div>
                            <Link href="/service" className="text-[11px] underline uppercase tracking-wider text-amber-400 hover:text-amber-200">
                                Need assistance? Contact Manager
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <div className="glass-card overflow-hidden border border-white/5 bg-surface/50">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-5 bg-black/10 dark:bg-white/5 border-b border-white/5 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                    <span className="px-6 py-4 border-r border-white/5">{t('timestamp')}</span>
                    <span className="px-6 py-4 border-r border-white/5">Details</span>
                    <span className="px-6 py-4 border-r border-white/5">Capital</span>
                    <span className="px-6 py-4 border-r border-white/5">Profit</span>
                    <span className="px-6 py-4 text-right">{t('status')}</span>
                </div>

                <div className="divide-y divide-black/5 dark:divide-white/5">
                    {loading ? (
                        <div className="flex items-center justify-center h-[200px]">
                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-center px-6">
                            <Clock size={40} className="text-text-secondary/20 mb-4" />
                            <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">{t('no_records_found')}</p>
                        </div>
                    ) : (
                        filteredTasks.map((task, idx) => (
                            <div key={task.id} className={`flex flex-col md:grid md:grid-cols-5 items-stretch hover:bg-white/[0.03] transition-all group border-b border-white/[0.05] last:border-0 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-black/[0.01] dark:bg-white/[0.01]'}`}>
                                {/* Mobile Header / Desktop Time */}
                                <div className="px-4 md:px-6 py-4 md:py-5 border-r md:border-white/5 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-2">
                                    <div className="flex flex-col">
                                        <p className="text-[11px] text-text-primary font-bold">
                                            {new Date(task.status === 'completed' && task.completed_at ? task.completed_at : task.created_at).toLocaleDateString(
                                                language === 'English' ? 'en-US' :
                                                    language === 'Spanish' ? 'es-ES' :
                                                        language === 'French' ? 'fr-FR' :
                                                            language === 'German' ? 'de-DE' :
                                                                language === 'Chinese' ? 'zh-CN' :
                                                                    language === 'Japanese' ? 'ja-JP' : 'en-US',
                                                { month: 'short', day: 'numeric', year: 'numeric' }
                                            )}
                                        </p>
                                        <p className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">
                                            {new Date(task.status === 'completed' && task.completed_at ? task.completed_at : task.created_at).toLocaleTimeString(
                                                language === 'English' ? 'en-US' :
                                                    language === 'Spanish' ? 'es-ES' :
                                                        language === 'French' ? 'fr-FR' :
                                                            language === 'German' ? 'de-DE' :
                                                                language === 'Chinese' ? 'zh-CN' :
                                                                    language === 'Japanese' ? 'ja-JP' : 'en-US',
                                                { hour: '2-digit', minute: '2-digit' }
                                            )}
                                        </p>
                                    </div>
                                    <div className="md:hidden">
                                        {statusBadge(task.status)}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-col px-4 md:px-6 py-4 md:py-5 border-r md:border-white/5 justify-center bg-white/[0.02] md:bg-transparent">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light shrink-0">
                                            <Zap size={18} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[12px] font-black text-white uppercase tracking-tight truncate max-w-[200px] md:max-w-none">
                                                {task.task_item?.title || `${t('task')} #${task.task_item_id}`}
                                            </span>
                                            {task.is_bundle && (
                                                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5 animate-pulse">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                                    Lucky Bundle Detected
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Capital/Value */}
                                <div className="px-4 md:px-6 py-4 md:py-5 border-r md:border-white/5 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-t md:border-t-0 border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] opacity-30 uppercase tracking-[0.2em] font-black mb-0.5">Base Value</span>
                                        <span className="text-[13px] font-black text-text-primary tracking-tight">{format(task.cost_amount || 0)}</span>
                                    </div>
                                    {task.is_bundle && task.status === 'pending' && (
                                        <div className="flex flex-col border-l md:border-l-0 md:border-t border-white/10 pl-4 md:pl-0 md:pt-1.5">
                                            <span className="text-[9px] text-amber-500/80 uppercase tracking-widest font-black">
                                                {profile && (profile.wallet_balance < (task.cost_amount || 0) || profile.wallet_balance < 0) ? 'Deficit' : 'Hold Status'}
                                            </span>
                                            <span className={`text-[11px] font-black ${profile && (profile.wallet_balance < (task.cost_amount || 0) || profile.wallet_balance < 0) ? 'text-danger' : 'text-amber-500'}`}>
                                                {profile && profile.wallet_balance < (task.cost_amount || 0)
                                                    ? `-${format(Math.max(0, (task.cost_amount || 0) - profile.wallet_balance))}`
                                                    : format(profile?.wallet_balance || 0)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Profit */}
                                <div className="px-4 md:px-6 py-4 md:py-5 border-r md:border-white/5 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-t md:border-t-0 border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] opacity-30 uppercase tracking-[0.2em] font-black mb-0.5">Earnings</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-base font-black text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                                                +{format(task.earned_amount)}
                                            </span>
                                            <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="md:hidden">
                                        {task.status === 'pending' && (
                                            <div className="animate-pulse">
                                                <Zap size={14} className="text-primary-light" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Desktop Status / Actions */}
                                <div className="px-4 md:px-6 py-6 md:py-5 flex flex-col items-stretch md:items-end justify-center gap-3 bg-white/[0.01] md:bg-transparent border-t md:border-t-0 border-white/10">
                                    <div className="hidden md:block">
                                        {statusBadge(task.status)}
                                    </div>
                                    {task.status === 'pending' && (
                                        task.is_bundle ? (
                                            (profile && (profile.wallet_balance < (task.cost_amount || 0) || profile.wallet_balance < 0)) ? (
                                                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                                    <button
                                                        onClick={() => router.push('/deposit')}
                                                        className="w-full md:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                                                    >
                                                        <Wallet size={13} /> Deposit
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenSuperOrder(task)}
                                                        className="w-full md:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                    >
                                                        <Sparkles size={13} className="text-amber-400" /> Details
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleOpenSuperOrder(task)}
                                                    disabled={isSubmitting}
                                                    className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer font-black animate-pulse"
                                                >
                                                    <Sparkles size={14} className="text-black" />
                                                    Submit Super Order
                                                </button>
                                            )
                                        ) : (
                                            profile && profile.wallet_balance < 0 ? (
                                                <button
                                                    onClick={() => router.push('/service')}
                                                    className="w-full md:w-auto px-6 py-3 md:py-2 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                                                >
                                                    <Headset size={14} className="group-hover:rotate-12 transition-transform" />
                                                    Contact Manager
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleSubmitPending(task.task_item_id)}
                                                    disabled={isSubmitting}
                                                    className={`w-full md:w-auto px-6 py-3 md:py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2 group
                                                        ${isSubmitting && submittingTaskId === task.task_item_id ? 'opacity-50 cursor-wait' : 'hover:scale-[1.02] active:scale-95 cursor-pointer'}
                                                    `}
                                                >
                                                    {isSubmitting && submittingTaskId === task.task_item_id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Zap size={14} className="group-hover:animate-pulse" />
                                                    )}
                                                    {isSubmitting && submittingTaskId === task.task_item_id ? t('submitting') : t('submit_order')}
                                                </button>
                                            )
                                        )
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* TOAST ALIGNED CENTER - SLIGHTLY UNDER FEED */}
            <Portal>
                <div className="fixed top-[110px] left-1/2 -translate-x-1/2 z-[20000] flex justify-center pointer-events-none px-4 w-full md:w-auto">
                    <div className="w-full max-w-sm flex flex-col gap-3">
                        {profitAdded !== null && (
                            <div className="glass-card-strong px-5 py-4 rounded-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-success/30 flex items-center gap-4 animate-scale-in pointer-events-auto bg-surface/90">
                                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success shrink-0">
                                    <TrendingUp size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-white uppercase tracking-tighter">Profit Applied</span>
                                    <span className="text-sm font-black text-success">+{format(profitAdded)} USDT</span>
                                </div>
                                <div className="ml-auto pl-3 border-l border-white/5 flex flex-col items-center">
                                    <Zap size={14} className="text-success animate-pulse" />
                                    <span className="text-[7px] font-mono text-success/40">ADDED</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Portal>

            {/* Huge Profit Toast */}
            {showBundleSuccessToast && (
                <Portal>
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[20000] w-full max-w-sm px-4">
                        <div className="glass-card-strong bg-gradient-to-br from-primary/20 via-primary-light/10 to-accent/20 text-white px-8 py-8 rounded-[32px] shadow-[0_50px_140px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-6 border border-white/30 animate-scale-in">
                            <div className="w-20 h-20 rounded-[28px] bg-white/10 flex items-center justify-center shrink-0 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                <Zap className="text-white animate-pulse" size={40} fill="currentColor" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-primary-light">Premium Success</span>
                                <h3 className="text-2xl font-black tracking-tight italic">Lucky Bundle!</h3>
                                <p className="text-xs font-bold text-white/60 leading-relaxed">
                                    You have secured a massive profit optimization! You can now continue your task sequence.
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowBundleSuccessToast(false)}
                                className="mt-2 w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Continue Path
                            </button>
                        </div>
                    </div>
                </Portal>
            )}

            {/* Bundled Package Modal */}
            <BundledPackageModal
                isOpen={bundleModalOpen}
                bundle={activeBundle}
                walletBalance={profile?.wallet_balance || 0}
                onAccept={handleBundleAccept}
                onClose={() => {
                    setBundleModalOpen(false);
                    setActiveBundle(null);
                    setAssociatedTaskId(null);
                }}
            />
        </div>
    );
}
