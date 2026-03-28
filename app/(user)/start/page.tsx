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
    Lock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    const [isLoadingData, setIsLoadingData] = useState(true);
    
    const completedCount = profile?.completed_count || 0;
    const currentSet = profile?.current_set || 1;
    const isProfileIncomplete = !profile?.phone || profile?.phone === '';

    const tasksInCurrentSet = Math.max(0, Math.min(completedCount - taskBaseOffset - ((currentSet - 1) * tasksPerSet), tasksPerSet));
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
                const [levelsRes, pastTasksRes, itemsRes] = await Promise.all([
                    supabase.from('levels').select('id, tasks_per_set, sets_per_day, commission_rate').order('price', { ascending: true }),
                    supabase.from('user_tasks').select('task_item_id, status, completed_at').eq('user_id', profile.id).neq('status', 'cancelled').gt('completed_at', filterDate),
                    supabase.from('task_items').select('*').eq('is_active', true).eq('level_id', profile.level_id).order('created_at', { ascending: false }).limit(300)
                ]);

                if (pastTasksRes.data) {
                    setHasPendingTask((pastTasksRes.data as any[]).some(t => t.status === 'pending'));
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
        const walletBalance = profile?.wallet_balance || 0;
        if (walletBalance < 65 && walletBalance >= 0) { setShowMinBalanceModal(true); return; }
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

    const handleSubmitTask = async (item: TaskItem, costAmount?: number) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const { data, error } = await supabase.rpc('complete_user_task', { p_task_item_id: item.id, p_cost_amount: costAmount });
            if (error) throw error;
            if (data?.is_bundle) {
                setShowBundleSuccessToast(true); setTimeout(() => setShowBundleSuccessToast(false), 5000);
            } else {
                setModalOpen(false); setProfitAdded(Number(data?.earned_amount) || 0); setTimeout(() => setProfitAdded(null), 3000);
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
        const newFrozen = profile.frozen_amount + bundle.totalAmount + bundle.bonusAmount;
        await supabase.from('profiles').update({ wallet_balance: newBalance, frozen_amount: newFrozen, completed_count: (profile.completed_count || 0) + 1 }).eq('id', profile.id);
        if (pendingTaskItem) await supabase.from('user_tasks').insert({ user_id: profile.id, task_item_id: pendingTaskItem.id, status: 'pending', earned_amount: bundle.bonusAmount, cost_amount: bundle.totalAmount, is_bundle: true });
        setBundleModal(false); router.push('/record'); await refreshProfile();
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
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
                                {t('optimization_hub')}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border border-white/10 italic">Module: Start.exe</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_rgba(61,214,200,1)] animate-pulse" />
                                    <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-[0.4em]">{matchingStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* STAT MATRIX */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-10 border-t border-white/5">
                    {[
                        { label: t('wallet_balance'), value: format(profile?.wallet_balance || 0), icon: Wallet, color: 'text-white' },
                        { label: t('daily_profits'), value: format(profile?.profit || 0), icon: TrendingUp, color: 'text-amber-400' },
                        { label: t('frozen_asset'), value: format(profile?.frozen_amount || 0), icon: Lock, color: 'text-rose-500' },
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

                <div className="w-full max-w-3xl mx-auto grid grid-cols-5 gap-4 z-10 px-4 relative">
                    {Array.from({ length: 25 }).map((_, idx) => {
                        if (idx === 12) {
                            return (
                                <div key="center" className="aspect-square flex items-center justify-center">
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
                                </div>
                            );
                        }
                        const itemIdx = idx > 12 ? idx - 1 : idx;
                        const active = highlightedIndex === itemIdx;
                        return (
                            <div key={idx} className={`aspect-square bg-slate-950/40 border p-1 border-white/5 transition-all duration-500 rounded-[20px] relative overflow-hidden ${active ? 'ring-2 ring-[#3DD6C8] shadow-[0_0_30px_rgba(61,214,200,0.3)] z-10' : 'opacity-40 scale-95'}`}>
                                {items[itemIdx] ? (
                                    <img src={items[itemIdx].image_url} className="w-full h-full object-cover rounded-[16px]" alt="" />
                                ) : (
                                    <div className="w-full h-full bg-white/5 animate-pulse rounded-[16px]" />
                                )}
                                {active && <div className="absolute inset-0 bg-[#3DD6C8]/10 animate-pulse" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            <ItemDetailModal item={selectedItem} isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmitTask} balance={profile?.wallet_balance || 0} commissionRate={commissionRate} format={format} isSubmitting={isSubmitting} />
            <BundledPackageModal isOpen={bundleModal} bundle={activeBundle} onAccept={handleBundleAccept} />
        </div>
    );
}
