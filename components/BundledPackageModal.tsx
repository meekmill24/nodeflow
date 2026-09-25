'use client';

import React from 'react';
import { CheckCircle, Zap, TrendingUp, ShieldCheck, Sparkles, AlertCircle, ArrowRight, X, Layers, Wallet, Lock } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import Portal from './Portal';
import Link from 'next/link';

export interface BundleTaskItem {
    title: string;
    image_url: string;
    category?: string;
    price?: number;
}

export interface BundlePackage {
    id: string;
    name: string;
    description: string;
    shortageAmount: number;
    totalAmount: number;
    bonusAmount: number;
    rate?: number;
    expiresIn: number;
    targetIndex?: number;
    taskItem?: BundleTaskItem;
    taskItems?: BundleTaskItem[];
}

interface BundledPackageModalProps {
    isOpen: boolean;
    bundle: BundlePackage | null;
    walletBalance: number;
    onAccept: (bundle: BundlePackage) => Promise<void>;
    onClose?: () => void;
}

export default function BundledPackageModal({
    isOpen,
    bundle,
    walletBalance,
    onAccept,
    onClose
}: BundledPackageModalProps) {
    const { format } = useCurrency();

    if (!isOpen || !bundle) return null;

    const shortage = Math.max(0, bundle.totalAmount - walletBalance);
    const hasShortage = shortage > 0;
    const effectiveRate = bundle.rate && bundle.rate > 0
        ? (bundle.rate > 1 ? bundle.rate : bundle.rate * 100)
        : (bundle.totalAmount > 0 ? (bundle.bonusAmount / bundle.totalAmount) * 100 : 0);

    // Collect all items to display (supports multi-item combo packages like SimpleMoneys / Captiv8)
    const itemsToDisplay: BundleTaskItem[] = 
        bundle.taskItems && bundle.taskItems.length > 0 
            ? bundle.taskItems 
            : bundle.taskItem 
                ? [bundle.taskItem] 
                : [{
                    title: 'Institutional High-Yield Cloud Optimization Asset',
                    image_url: '/items/premium/studio-microphone-setup-stockcake-001.jpg',
                    category: 'Institutional Asset'
                }];

    return (
        <Portal>
            <div 
                className="fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl md:pl-72 overflow-y-auto animate-fade-in"
                onClick={onClose}
            >
                <div
                    className="bg-[#0B0B1E] border border-amber-500/40 w-full max-w-md rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-[0_30px_120px_rgba(0,0,0,0.95)] relative flex flex-col max-h-[90vh] my-auto animate-scale-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Glowing Top Accent Bar */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.8)] z-10" />
                    
                    {/* Ambient Gold Glow Backdrop */}
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                    {/* Close button */}
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
                            title="Close modal"
                        >
                            <X size={16} />
                        </button>
                    )}

                    {/* Scrollable Body */}
                    <div className="overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6">
                        {/* Header Badge & Icon */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-5 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
                                <Zap size={36} className="text-amber-400 fill-amber-400/20 animate-pulse" />
                            </div>

                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-black text-amber-400 uppercase tracking-[0.25em] mb-3">
                                <Sparkles size={12} className="text-amber-400 animate-spin" />
                                Combination Super Order
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-black text-white italic tracking-tight uppercase leading-tight">
                                {bundle.name || "Exclusive Super Order"}
                            </h3>

                            <p className="text-xs text-white/70 leading-relaxed font-medium mt-2 px-2">
                                {bundle.description || "You have intercepted an exclusive high-yield Super Order sequence from institutional merchants."}
                            </p>
                        </div>

                        {/* Allocated Combo Assets (SimpleMoneys & Captiv8 style) */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.25em] flex items-center gap-1.5">
                                    <Layers size={11} /> Combo Order Assets ({itemsToDisplay.length})
                                </span>
                                {bundle.targetIndex && (
                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                        Sequence #{bundle.targetIndex}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                {itemsToDisplay.map((item, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3.5 hover:border-amber-500/30 transition-all"
                                    >
                                        {item.image_url ? (
                                            <img 
                                                src={item.image_url} 
                                                alt={item.title} 
                                                className="w-14 h-14 rounded-xl object-cover bg-black/40 border border-white/10 shrink-0" 
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                                                <Zap size={20} />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[8px] font-black uppercase tracking-wider">
                                                    Item {idx + 1}
                                                </span>
                                                <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider truncate">
                                                    {item.category || 'Institutional Sequence'}
                                                </span>
                                            </div>
                                            <h4 className="text-xs font-bold text-white truncate leading-snug">
                                                {item.title}
                                            </h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Ledger Breakdown & Formula */}
                        <div className="space-y-3">
                            {/* 3-Column KPI Grid: Value | Rate | Profit */}
                            <div className="grid grid-cols-3 gap-0.5 p-4 rounded-2xl bg-black/60 border border-amber-500/20 shadow-[inset_0_4px_25px_rgba(0,0,0,0.7)]">
                                <div className="flex flex-col items-center">
                                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5">Order Value</span>
                                    <span className="text-sm font-black text-white tracking-tight italic tabular-nums">{format(bundle.totalAmount)}</span>
                                    <span className="text-[7px] font-bold text-white/30 uppercase mt-1">PRINCIPAL</span>
                                </div>
                                <div className="flex flex-col items-center border-x border-white/10 px-2">
                                    <span className="text-[8px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1.5">Rate</span>
                                    <span className="text-sm font-black text-amber-400 tracking-tight italic tabular-nums">{effectiveRate.toFixed(2)}%</span>
                                    <span className="text-[7px] font-black text-amber-400/70 uppercase mt-1">REBATE</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1.5">Total Profit</span>
                                    <span className="text-sm font-black text-emerald-400 tracking-tight italic tabular-nums">+{format(bundle.bonusAmount)}</span>
                                    <span className="text-[7px] font-bold text-emerald-400/60 uppercase mt-1">NET YIELD</span>
                                </div>
                            </div>

                            {/* Explicit Formula & Profit Explanation Card (SimpleMoneys & Captiv8 style) */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white/[0.02] to-emerald-500/10 border border-amber-500/30 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.25em] flex items-center gap-1.5">
                                        <Sparkles size={11} /> Profit Calculation
                                    </span>
                                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
                                        Formula: Value × Rate = Profit
                                    </span>
                                </div>

                                {/* Value × Rate = Profit Equation */}
                                <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm font-black">
                                    <span className="text-white">{format(bundle.totalAmount)}</span>
                                    <span className="text-amber-400 font-bold">×</span>
                                    <span className="text-amber-400 font-bold">{effectiveRate.toFixed(2)}%</span>
                                    <span className="text-white/40">=</span>
                                    <span className="text-emerald-400 font-bold">+{format(bundle.bonusAmount)}</span>
                                </div>

                                <p className="text-[10px] text-white/70 leading-relaxed font-medium">
                                    <strong className="text-white">Explanation:</strong> Order Value of <strong className="text-white">{format(bundle.totalAmount)}</strong> multiplied by the <strong className="text-amber-400">{effectiveRate.toFixed(2)}%</strong> reward rate yields <strong className="text-emerald-400">+{format(bundle.bonusAmount)}</strong> in profit. Upon completion, both the order principal and your profit yield will settle into your available balance.
                                </p>
                            </div>

                            {/* Wallet Balance */}
                            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                        <Wallet size={15} />
                                    </div>
                                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Available Balance</span>
                                </div>
                                <span className={`text-base font-black italic tabular-nums ${hasShortage ? 'text-rose-400' : 'text-white'}`}>
                                    {format(walletBalance)}
                                </span>
                            </div>

                            {/* Shortage Warning (If Balance is Insufficient) */}
                            {hasShortage && (
                                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 text-rose-400">
                                            <AlertCircle size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deposit Required</span>
                                        </div>
                                        <span className="text-base font-black text-rose-400 italic tabular-nums">
                                            -{format(shortage)}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-rose-300/80 leading-relaxed font-medium">
                                        Your account balance is insufficient for this sequence. Deposit the shortage of <strong className="text-white font-bold">{format(shortage)}</strong> to complete the order.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 space-y-2.5">
                            {hasShortage ? (
                                <>
                                    <Link
                                        href={`/deposit?amount=${Math.ceil(shortage)}`}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Deposit {format(shortage)} to Continue <ArrowRight size={16} />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all cursor-pointer"
                                    >
                                        Save Sequence & Return Later
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => onAccept(bundle)}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-[#0B0B1E] font-black uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-2.5 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                                    >
                                        <ShieldCheck size={18} /> SUBMIT & COMPLETE SUPER ORDER
                                    </button>
                                    <p className="text-[9px] text-center text-white/40 font-bold uppercase tracking-[0.2em] px-4 leading-relaxed">
                                        Principal & yield bonus will be credited directly to your available balance upon clearance.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
