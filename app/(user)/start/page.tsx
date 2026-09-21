'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/index';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import type { TaskItem } from '@/lib/types';
import ItemDetailModal from '@/components/ItemDetailModal';
import BundledPackageModal from '@/components/BundledPackageModal';
import type { BundlePackage } from '@/components/BundledPackageModal';
import Portal from '@/components/Portal';
import {
    Wallet,
    AlertTriangle,
    ArrowRight,
    Zap,
    CheckCircle,
    X,
    Activity,
    TrendingUp,
    Sparkles,
    Pointer,
    Trophy,
    Star,
    MessageCircle,
    Cpu,
    Target,
    Zap as ZapIcon,
    ArrowDownLeft,
    ArrowUpRight,
    Lock,
    Copy,
    Clock,
    ShieldCheck,
    Headphones,
    Award,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function StartPage() {
    const { profile, refreshProfile } = useAuth();
    const { t } = useLanguage();
    const { format } = useCurrency();
    const router = useRouter();
    const [items, setItems] = useState<TaskItem[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<TaskItem | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [profitAdded, setProfitAdded] = useState<number | null>(null);
    const [recentlyUsedIdsState, setRecentlyUsedIdsState] = useState<Set<number>>(new Set());

    const [matchingStatus, setMatchingStatus] = useState<string>(t('ready_to_match'));
    const [bundleModal, setBundleModal] = useState(false);
    const [activeBundle, setActiveBundle] = useState<BundlePackage | null>(null);
    const [pendingTaskItem, setPendingTaskItem] = useState<TaskItem | null>(null);
    const [showPendingWarning, setShowPendingWarning] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalSeen, setModalSeen] = useState(false);
    const [lockMessage, setLockMessage] = useState<string | null>(null);
    const [showMinBalanceModal, setShowMinBalanceModal] = useState(false);
    const [showBundleSuccessToast, setShowBundleSuccessToast] = useState(false);
    const [hasPendingTask, setHasPendingTask] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [tasksPerSet, setTasksPerSet] = useState(40);
    const [setsPerDay, setSetsPerDay] = useState(3);
    const [taskBaseOffset, setTaskBaseOffset] = useState(0);
    const [commissionRate, setCommissionRate] = useState(0.0045);
    const [minTaskBalance, setMinTaskBalance] = useState(60);
    const [isLoadingData, setIsLoadingData] = useState(true);
    
    const [dbCompletedCount, setDbCompletedCount] = useState(0);
    const completedCount = dbCompletedCount || profile?.completed_count || 0;
    const currentSet = profile?.current_set || 1;
    const isProfileIncomplete = !profile?.phone || profile?.phone === '';

    const tasksInCurrentSet = (completedCount % tasksPerSet === 0 && completedCount > 0) ? tasksPerSet : (completedCount % tasksPerSet);
    const isLocked = tasksInCurrentSet >= tasksPerSet;
    const isAllSetsDone = currentSet >= setsPerDay && isLocked;
    const totalTasks = tasksPerSet;

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadPageData = async () => {
            if (!profile?.level_id || !profile?.id) return;
            setIsLoadingData(true);
            try {
                const filterDate = profile.last_reset_at ? new Date(profile.last_reset_at).toISOString() : new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                const [levelsRes, pastTasksRes, itemsRes, settingsRes] = await Promise.all([
                    supabase.from('levels').select('id, tasks_per_set, sets_per_day, commission_rate').order('price', { ascending: true }),
                    supabase.from('user_tasks').select('task_item_id, status, completed_at').eq('user_id', profile.id).neq('status', 'cancelled').gt('completed_at', filterDate),
                    supabase.from('task_items').select('*').eq('is_active', true).eq('level_id', profile.level_id).order('created_at', { ascending: false }).limit(300),
                    supabase.from('site_settings').select('key, value').in('key', ['min_task_balance'])
                ]);

                if (pastTasksRes.data) {
                    setHasPendingTask((pastTasksRes.data as any[]).some(t => t.status === 'pending'));
                    setDbCompletedCount((pastTasksRes.data as any[]).filter(t => t.status === 'completed').length);
                }
                if (settingsRes.data) {
                    const minBal = settingsRes.data.find((s: any) => s.key === 'min_task_balance')?.value;
                    if (minBal) setMinTaskBalance(parseFloat(minBal));
                }
                if (levelsRes.data) {
                    const currentLevel = levelsRes.data.find(l => l.id === profile.level_id);
                    if (currentLevel) {
                        setTasksPerSet(currentLevel.tasks_per_set);
                        setSetsPerDay(currentLevel.sets_per_day || 3);
                        setCommissionRate(Number(currentLevel.commission_rate) || 0.0045);
                        let offset = 0;
                        for (const level of levelsRes.data) {
                            if (level.id === profile.level_id) break;
                            offset += (level.sets_per_day || 3) * (level.tasks_per_set || 40);
                        }
                        setTaskBaseOffset((profile.completed_count || 0) < offset ? 0 : offset);
                    }
                }

                const lastResetDate = profile.last_reset_at ? new Date(profile.last_reset_at) : new Date(Date.now() - 24 * 60 * 60 * 1000);
                const recentIds = new Set(((pastTasksRes.data || []) as any[]).filter(t => t.completed_at && new Date(t.completed_at) > lastResetDate).map(t => t.task_item_id));
                setRecentlyUsedIdsState(recentIds);

                const allItemsFromDb = itemsRes.data || [];
                const poolByImage = new Map();
                allItemsFromDb.forEach(item => { if (!poolByImage.has(item.image_url) && !recentIds.has(item.id)) poolByImage.set(item.image_url, item); });
                let availableItems = Array.from(poolByImage.values());
                if (availableItems.length < 24 && allItemsFromDb.length > 0) availableItems = allItemsFromDb;
                const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
                setItems(shuffled.slice(0, 24));
                if (itemsRes.data) (window as any)._allPoolItems = itemsRes.data;
            } catch (err) { console.error(err); } finally { setIsLoadingData(false); }
        };
        loadPageData();
    }, [profile?.level_id, profile?.id]);

    useEffect(() => {
        let spinInterval: NodeJS.Timeout;
        if (isSpinning) {
            spinInterval = setInterval(() => {
                setHighlightedIndex(prev => {
                    const next = Math.floor(Math.random() * items.length);
                    return next === prev && items.length > 1 ? (next + 1) % items.length : next;
                });
            }, 60);
        } else if (!selectedItem) {
            setHighlightedIndex(null);
        }
        return () => clearInterval(spinInterval);
    }, [isSpinning, items.length, selectedItem]);

    const handleStart = useCallback(async () => {
        if (isSpinning || items.length === 0) return;
        if (profile?.is_frozen) { return; }
        const walletBalance = profile?.wallet_balance || 0;
        if (walletBalance < minTaskBalance && walletBalance >= 0) { setShowMinBalanceModal(true); return; }
        if (isLocked) {
            if (!modalSeen) setShowCompletionModal(true);
            else setLockMessage(isAllSetsDone ? t('daily_limit_reached') : t('set_complete_contact_support').replace('{set}', String(currentSet)));
            return;
        }
        if (hasPendingTask) { router.push('/record'); return; }

        setIsSpinning(true);
        setSelectedItem(null);
        setMatchingStatus(t('connecting_to_cloud'));

        setTimeout(async () => {
            const { data: freshProfile } = await supabase.from('profiles').select('*').eq('id', profile?.id).single();
            const pb = (freshProfile as any)?.pending_bundle;
            const currentItemIndex = tasksInCurrentSet + 1;
            let finalIndex = Math.floor(Math.random() * items.length);
            let matchedItem = { ...items[finalIndex] };

            if (pb && Number(pb.targetIndex) === currentItemIndex) {
                matchedItem = { ...matchedItem, id: Number(pb.taskItemIds?.[0] || matchedItem.id), title: pb.taskItem.title, image_url: pb.taskItem.image_url };
                const newItems = [...items]; newItems[finalIndex] = matchedItem; setItems(newItems);
            }
            setHighlightedIndex(finalIndex);
            setIsSpinning(false);
            setMatchingStatus(t('match_found'));
            setTimeout(() => handleTaskSelection(matchedItem, pb, currentItemIndex), 100);
        }, 1200);
    }, [isSpinning, items, isLocked, profile, t, currentSet, isAllSetsDone, modalSeen]);

    const handleTaskSelection = async (item: TaskItem, pb?: any, currentItemIndex?: number) => {
        if (!profile || isLocked) return;
        let bundle = pb;
        if (!bundle) {
            const { data: freshProfile } = await supabase.from('profiles').select('*').eq('id', profile.id).single();
            bundle = (freshProfile as any)?.pending_bundle;
        }

        if (bundle && Number(bundle.targetIndex) === currentItemIndex) {
            setPendingTaskItem(item);
            setActiveBundle({ id: String(bundle.id), name: String(bundle.name), description: String(bundle.description), shortageAmount: Number(bundle.shortageAmount), totalAmount: Number(bundle.totalAmount), bonusAmount: Number(bundle.bonusAmount), expiresIn: Number(bundle.expiresIn), taskItem: { title: item.title, image_url: item.image_url, category: item.category ?? '' } });
            setBundleModal(true);
            const remainingIds = (Array.isArray(bundle.taskItemIds) ? bundle.taskItemIds : []).filter((id: number) => id !== item.id);
            if (remainingIds.length === 0) await supabase.from('profiles').update({ pending_bundle: null }).eq('id', profile.id);
            else await supabase.from('profiles').update({ pending_bundle: { ...bundle, taskItemIds: remainingIds } }).eq('id', profile.id);
            await refreshProfile();
            return;
        }
        setSelectedItem({ ...item }); setModalOpen(true);
    };

    const handleSubmitTask = async (item: TaskItem, providedCost?: number) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const costAmount = providedCost || (profile?.wallet_balance || 0) * 0.98;
        try {
            // Restored full logic compatible with the Core Restoration protocol
            const { data, error } = await supabase.rpc('complete_user_task', { 
                p_task_item_id: Number(item.id),
                p_cost_amount: costAmount
            });
            if (error) throw error;
            if (data?.is_bundle) {
                setShowBundleSuccessToast(true); setTimeout(() => setShowBundleSuccessToast(false), 5000);
            } else {
                setModalOpen(false); 
                const profit = Number(data?.earned_amount) || 0;
                setProfitAdded(profit); 
                toast.success(`Optimization Synchronized! Cloud Yield: ${format(profit)} credited to your account.`);
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                await refreshProfile();
                setTimeout(() => setProfitAdded(null), 3000);
                setIsRefreshing(true);
                setTimeout(() => {
                    const pool = (window as any)._allPoolItems || [];
                    const updatedRecent = new Set(recentlyUsedIdsState).add(item.id);
                    setRecentlyUsedIdsState(updatedRecent);
                    const poolByImage = new Map();
                    pool.forEach((p: any) => { if (!poolByImage.has(p.image_url) && !updatedRecent.has(p.id)) poolByImage.set(p.image_url, p); });
                    let freshPool = Array.from(poolByImage.values()); if (freshPool.length < 24) freshPool = pool;
                    setItems([...freshPool].sort(() => 0.5 - Math.random()).slice(0, 24));
                    setIsRefreshing(false);
                }, 800);
                if (tasksInCurrentSet + 1 >= tasksPerSet) { setModalSeen(false); setTimeout(() => setShowCompletionModal(true), 1500); }
            }
            await refreshProfile();
        } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
    };

    const handleConfirmSettlement = async () => {
        setModalSeen(true); setShowCompletionModal(false);
        if ((window as any).Tawk_API?.maximize) (window as any).Tawk_API.maximize(); else router.push('/service');
    };

    const handleBundleAccept = async (bundle: BundlePackage) => {
        if (!profile) return;
        const newBalance = profile.wallet_balance - bundle.totalAmount;
        const newFrozen = profile.freeze_balance + bundle.totalAmount + bundle.bonusAmount;
        await supabase.from('profiles').update({ wallet_balance: newBalance, freeze_balance: newFrozen, completed_count: (profile.completed_count || 0) + 1 }).eq('id', profile.id);
        if (pendingTaskItem) await supabase.from('user_tasks').insert({ user_id: profile.id, task_item_id: pendingTaskItem.id, status: 'pending', earned_amount: bundle.bonusAmount, cost_amount: bundle.totalAmount, is_bundle: true });
        setBundleModal(false); await refreshProfile(); router.push('/record');
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* FROZEN ACCOUNT OVERLAY */}
            {profile?.is_frozen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
                    <div className="bg-[#0f0f12] border border-red-500/20 rounded-[48px] w-full max-w-md p-12 text-center space-y-8 shadow-[0_0_80px_rgba(239,68,68,0.15)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
                        <div className="relative z-10 flex flex-col items-center gap-8">
                            <div className="w-24 h-24 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-3">Account Suspended</h2>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">Your account has been temporarily frozen by the system administrator. Please contact customer support to resolve this issue.</p>
                            </div>
                            <a
                                href="https://wa.me/1234567890"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-[#3DD6C8] text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] text-center hover:bg-[#3DD6C8]/90 transition-all shadow-xl shadow-[#3DD6C8]/20 active:scale-95"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            )}
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link 
                    href="/home" 
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 text-[#3DD6C8] text-[10px] font-black uppercase tracking-widest">
                    <Activity size={14} /> Optimization Node
                </div>
            </div>

            {/* ACTIVE HUB BANNER */}
            <div className="bg-[#0B0B1E] border border-white/5 p-10 md:p-14 rounded-[48px] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-[#3DD6C8]/5 blur-[120px] rounded-full pointer-events-none" />
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[24px] bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                            <Cpu className="text-[#3DD6C8] z-10" size={32} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3DD6C8]/20 to-transparent animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">
                                OPTIMIZATION COMMAND CENTER
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border border-white/10 italic">Module: Start.exe</span>
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full group/ref cursor-pointer hover:bg-white/10 transition-all" onClick={() => {
                                    navigator.clipboard.writeText(profile?.referral_code || '');
                                    toast.success('Referral Protocol Copied');
                                }}>
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Referral Code:</span>
                                    <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-widest">{profile?.referral_code || '---'}</span>
                                    <Copy size={10} className="text-white/20 group-hover/ref:text-[#3DD6C8] transition-colors" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_rgba(61,214,200,1)] animate-pulse" />
                                    <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-[0.4em]">{matchingStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* LIVE OPERATIONS & HUB */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-10 border-t border-white/5">
                    {[
                        { label: t('wallet_balance'), value: format(profile?.wallet_balance || 0), icon: Wallet, color: 'text-white' },
                        { label: t('daily_profits'), value: format(profile?.profit || 0), icon: TrendingUp, color: 'text-amber-400' },
                        { label: t('frozen_asset'), value: format(profile?.freeze_balance || 0), icon: Lock, color: 'text-rose-500' },
                        { label: t('set_progress'), value: `${tasksInCurrentSet}/${totalTasks}`, icon: Activity, color: 'text-[#3DD6C8]' },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] flex items-center gap-2">
                                <stat.icon size={10} /> {stat.label}
                            </span>
                            <span className={`text-xl font-black italic uppercase ${stat.color}`}>{stat.value}</span>
                        </div>
                    ))}
                 </div>
            </div>

            {/* OPTIMIZATION GRID ENGINE */}
            <div className="relative flex flex-col items-center justify-center py-10">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-[600px] bg-[#3DD6C8]/5 rounded-full blur-[160px] transition-opacity duration-1000 ${isSpinning ? 'opacity-100' : 'opacity-40'}`} />

                <div className="w-full max-w-3xl mx-auto grid grid-cols-5 gap-1.5 md:gap-4 z-10 px-1.5 md:px-4 relative">
                    {Array.from({ length: 25 }).map((_, idx) => {
                        if (idx === 12) {
                            return (
                                <motion.div 
                                    key="center" 
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', damping: 15, delay: 0.3 }}
                                    className="aspect-square flex items-center justify-center"
                                >
                                    <button
                                        onClick={handleStart}
                                        disabled={isSpinning || isLocked || hasPendingTask}
                                        className={`
                                            w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden group
                                            ${isSpinning ? 'scale-95 bg-slate-800 ring-4 ring-[#3DD6C8]/20' : 'hover:scale-105 active:scale-95 bg-[#3DD6C8] shadow-[0_0_40px_rgba(61,214,200,0.3)]'}
                                            ${(isLocked || hasPendingTask) ? 'bg-slate-950 opacity-20 grayscale cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <span className={`text-base md:text-xl font-black italic uppercase tracking-tighter ${isSpinning ? 'text-[#3DD6C8]' : 'text-[#0B0B1E]'}`}>
                                                {isLocked ? 'DONE' : (isSpinning ? 'SYNC' : 'START')}
                                            </span>
                                            {!isSpinning && !isLocked && !hasPendingTask && <Pointer size={14} className="text-[#0B0B1E] animate-bounce mt-1" />}
                                            {isSpinning && <div className="w-5 h-5 border-2 border-[#3DD6C8]/30 border-t-[#3DD6C8] rounded-full animate-spin mt-2" />}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent group-hover:opacity-100 opacity-0 transition-opacity" />
                                    </button>
                                </motion.div>
                            );
                        }
                        const itemIdx = idx > 12 ? idx - 1 : idx;
                        const active = highlightedIndex === itemIdx;
                        return (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: idx * 0.02, duration: 0.5 }}
                                className={`aspect-square bg-slate-900 border p-1 border-white/5 transition-all duration-500 rounded-[20px] relative overflow-hidden ${active ? 'ring-2 ring-[#3DD6C8] shadow-[0_0_30px_rgba(61,214,200,0.3)] z-10' : 'opacity-100'}`}
                            >
                                {items[itemIdx] ? (
                                    <img src={items[itemIdx].image_url} className="w-full h-full object-cover rounded-[16px]" alt="" />
                                ) : (
                                    <div className="w-full h-full bg-white/5 animate-pulse rounded-[16px]" />
                                )}
                                {active && <div className="absolute inset-0 bg-[#3DD6C8]/10 animate-pulse" />}
                            </motion.div>
                        );
                    })}
                </div>

                {/* IMPORTANT NOTICE */}
                <div className="w-full max-w-3xl mx-auto mt-6 z-10 px-1.5 md:px-4">
                    <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-br from-[#0e0e26] via-[#0B0B1E] to-[#12122b] border border-[#3DD6C8]/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden group">
                        {/* Glow backdrop */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3DD6C8]/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-[#3DD6C8]/15 border border-[#3DD6C8]/30 text-[#3DD6C8] shadow-[0_0_20px_rgba(61,214,200,0.2)] shrink-0">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.25em]">Authorized Deployment Policy</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] animate-ping" />
                                        </div>
                                        <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight italic">
                                            IMPORTANT NOTICE
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <CheckCircle size={13} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Company Subsidized</span>
                                </div>
                            </div>

                            {/* Core Announcement Text */}
                            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
                                The company will cover the initial deposit, first-task expenses, and applicable training commission through the authorized Customer Support team.
                            </p>

                            {/* Information Submission Section */}
                            <div className="p-5 md:p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                                <p className="text-xs md:text-sm font-semibold text-white/90">
                                    To facilitate verification and processing, each worker is required to provide the following information to Customer Support:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Work ID */}
                                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col justify-between gap-2">
                                        <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">Work ID</span>
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="text-sm font-mono font-bold text-[#3DD6C8] truncate">
                                                {profile?.referral_code || profile?.id?.slice(0, 8).toUpperCase() || 'SB-VERIFIED'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const val = profile?.referral_code || profile?.id?.slice(0, 8).toUpperCase() || 'SB-VERIFIED';
                                                    navigator.clipboard.writeText(val);
                                                    toast.success('Work ID copied to clipboard');
                                                }}
                                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                                title="Copy Work ID"
                                            >
                                                <Copy size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mentor ID */}
                                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col justify-between gap-2">
                                        <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">Mentor ID</span>
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="text-sm font-mono font-bold text-teal-300 truncate">
                                                {profile?.referred_by || 'Assigned Mentor'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const val = profile?.referred_by || 'Assigned Mentor';
                                                    navigator.clipboard.writeText(val);
                                                    toast.success('Mentor ID copied to clipboard');
                                                }}
                                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                                title="Copy Mentor ID"
                                            >
                                                <Copy size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Commission Amount */}
                                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col justify-between gap-2">
                                        <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">Commission Amount</span>
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="text-sm font-bold text-amber-400 truncate">
                                                {(commissionRate * 100).toFixed(1)}% Rate Tier
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const val = `${(commissionRate * 100).toFixed(1)}%`;
                                                    navigator.clipboard.writeText(val);
                                                    toast.success('Commission rate copied to clipboard');
                                                }}
                                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                                title="Copy Commission Amount"
                                            >
                                                <Copy size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                                    Please ensure that all information submitted is accurate and complete. These details will be used to verify your work assignment and facilitate the appropriate payment and task-processing procedures.
                                </p>
                            </div>

                            {/* Security Caution & CTA */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                                <div className="flex items-start gap-3 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl">
                                    <Lock size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                    <p className="leading-relaxed">
                                        <strong className="text-amber-300">Security Protocol:</strong> Workers should communicate only through officially authorized Customer Support channels and should not disclose passwords, verification codes, or other account credentials.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const workId = profile?.referral_code || profile?.id?.slice(0, 8).toUpperCase() || 'SB-VERIFIED';
                                            const mentorId = profile?.referred_by || 'Assigned Mentor';
                                            const comm = `${(commissionRate * 100).toFixed(1)}%`;
                                            const text = `Work ID: ${workId}\nMentor ID: ${mentorId}\nCommission Amount: ${comm}`;
                                            navigator.clipboard.writeText(text);
                                            toast.success('Verification details copied! Paste in Customer Support.');
                                        }}
                                        className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
                                    >
                                        <Copy size={14} /> Copy Details
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if ((window as any).Tawk_API?.maximize) (window as any).Tawk_API.maximize();
                                            else router.push('/service');
                                        }}
                                        className="px-5 py-3 rounded-2xl bg-[#3DD6C8] hover:bg-[#34c4b6] text-[#0B0B1E] font-black uppercase text-xs tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(61,214,200,0.3)] transition-all active:scale-95"
                                    >
                                        <Headphones size={15} /> Contact Support
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WORKING TIME DIRECTIVE */}
                <div className="w-full max-w-3xl mx-auto mt-6 z-10 px-1.5 md:px-4">
                    <div className="p-6 md:p-8 rounded-[32px] bg-[#0B0B1E]/90 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3DD6C8]/5 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3.5 rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 text-[#3DD6C8] shadow-[0_0_20px_rgba(61,214,200,0.15)] shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.3em]">Operational Schedule</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    </div>
                                    <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tight italic">
                                        US Central Time: 10:00 AM – 7:00 PM
                                    </h3>
                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                        Monday through Sunday • Daily Active Cloud Settlements
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:items-end justify-center gap-1.5 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                    <ShieldCheck size={14} className="text-[#3DD6C8]" />
                                    <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">CS Verified Protocol</span>
                                </div>
                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider text-right">
                                    Submissions & payouts verified by CS during working hours
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ItemDetailModal item={selectedItem} isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmitTask} balance={profile?.wallet_balance || 0} commissionRate={commissionRate} format={format} isSubmitting={isSubmitting} />
            <BundledPackageModal isOpen={bundleModal} bundle={activeBundle} walletBalance={profile?.wallet_balance ?? 0} onAccept={handleBundleAccept} />

            {/* TASK SET COMPLETION MODAL */}
            {showCompletionModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#0B0B1E] border border-[#3DD6C8]/40 w-full max-w-md rounded-[40px] p-8 md:p-10 shadow-[0_30px_120px_rgba(0,0,0,0.95)] relative overflow-hidden text-center space-y-6 animate-scale-in">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#3DD6C8] to-transparent" />
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#3DD6C8]/15 rounded-full blur-3xl pointer-events-none" />

                        <div className="w-24 h-24 mx-auto rounded-[32px] bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 flex items-center justify-center text-[#3DD6C8] shadow-[0_0_40px_rgba(61,214,200,0.3)]">
                            <Award size={48} className="animate-bounce" />
                        </div>

                        <div className="space-y-3">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400 inline-block">
                                Optimization Set Complete
                            </span>
                            <h3 className="text-3xl font-black text-white italic tracking-tight uppercase leading-none">
                                Congratulations!
                            </h3>
                            <p className="text-sm text-white/80 leading-relaxed font-medium">
                                You have successfully accomplished all <strong className="text-[#3DD6C8]">{tasksPerSet}</strong> optimization tasks for Set {currentSet}.
                            </p>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                <p className="text-xs text-amber-300 font-bold leading-relaxed">
                                    Account requires clearance reset from Customer Service to continue next optimization set or process immediate payouts.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <button
                                type="button"
                                onClick={handleConfirmSettlement}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3DD6C8] to-teal-500 text-[#0B0B1E] font-black uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(61,214,200,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Headphones size={18} /> Contact Customer Service
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setModalSeen(true);
                                    setShowCompletionModal(false);
                                }}
                                className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors"
                            >
                                Review Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MINIMUM TASK BALANCE MODAL */}
            {showMinBalanceModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#0B0B1E] border border-rose-500/30 w-full max-w-sm rounded-[36px] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.9)] text-center space-y-6 animate-scale-in">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                            <Wallet size={36} />
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">Balance Requirement</span>
                            <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Minimum Influx Required</h3>
                            <p className="text-xs text-white/60 leading-relaxed pt-2">
                                Your account requires a minimum balance of <strong className="text-white">${minTaskBalance.toFixed(2)}</strong> to initiate task optimization sequences.
                            </p>
                        </div>
                        <div className="space-y-3 pt-2">
                            <Link
                                href="/deposit"
                                className="w-full py-4 rounded-2xl bg-rose-500 text-white font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,63,94,0.3)] hover:bg-rose-600 transition-all"
                            >
                                Top Up Account
                            </Link>
                            <button
                                type="button"
                                onClick={() => setShowMinBalanceModal(false)}
                                className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
