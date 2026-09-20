'use client';

import React from 'react';
import { CheckCircle, Zap, TrendingUp, ShieldCheck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import Portal from './Portal';
import Link from 'next/link';

export interface BundlePackage {
    id: string;
    name: string;
    description: string;
    shortageAmount: number;
    totalAmount: number;
    bonusAmount: number;
    expiresIn: number;
    taskItem: {
        title: string;
        image_url: string;
        category: string;
    };
}

interface BundledPackageModalProps {
    isOpen: boolean;
    bundle: BundlePackage | null;
    walletBalance: number;
    onAccept: (bundle: BundlePackage) => Promise<void>;
}

export default function BundledPackageModal({
    isOpen,
    bundle,
    walletBalance,
    onAccept
}: BundledPackageModalProps) {
    const { format } = useCurrency();

    const shortage = bundle ? Math.max(0, bundle.totalAmount - walletBalance) : 0;
    const hasShortage = shortage > 0;

    if (!isOpen || !bundle) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
                <div
                    className="bg-surface dark:bg-[#0f0a15] w-full max-w-sm rounded-[32px] overflow-hidden shadow-[0_50px_140px_rgba(0,0,0,1)] border border-amber-500/30 animate-scale-in relative flex flex-col md:fixed md:left-[59%] md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Visual Top Bar */}
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

                    {/* Compact Body */}
                    <div className="p-8 pb-2">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-[32px] bg-amber-500/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(245,158,11,0.3)] border border-amber-500/20">
                                <Zap size={40} className="text-amber-500 fill-amber-500/20 animate-pulse" />
                            </div>

                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] mb-4">
                                    <Sparkles size={12} className="text-amber-400 animate-spin" />
                                    Super Order Package
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2 italic tracking-tight uppercase">
                                    {bundle.name || "Institutional Super Order"}
                                </h3>
                                <p className="text-xs text-text-secondary leading-relaxed opacity-80 px-2 font-medium">
                                    {bundle.description || "You have successfully intercepted an exclusive high-yield Super Order sequence from institutional merchants."}
                                </p>
                            </div>

                            {/* Product Item Preview if attached */}
                            {bundle.taskItem && (
                                <div className="w-full p-4 mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 text-left">
                                    {bundle.taskItem.image_url && (
                                        <img 
                                            src={bundle.taskItem.image_url} 
                                            alt="" 
                                            className="w-14 h-14 rounded-xl object-cover bg-black/40 border border-white/10 shrink-0" 
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[8px] font-black text-[#3DD6C8] uppercase tracking-widest block">Allocated Asset</span>
                                        <h4 className="text-xs font-black text-white truncate">{bundle.taskItem.title}</h4>
                                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">{bundle.taskItem.category || 'Institutional Order'}</span>
                                    </div>
                                </div>
                            )}

                            <div className="w-full space-y-3">
                                {/* Balance row */}
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                                            <TrendingUp size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">Wallet Balance</span>
                                            <span className={`text-base font-black ${hasShortage ? 'text-red-400' : 'text-white'}`}>{format(walletBalance)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Total cost row */}
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                                            <TrendingUp size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">Order Total</span>
                                            <span className="text-base font-black text-white">{format(bundle.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Shortage warning row (only shown when balance is insufficient) */}
                                {hasShortage && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
                                                <AlertCircle size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-red-400 uppercase tracking-[0.2em]">Balance Shortage</span>
                                                <span className="text-base font-black text-red-400">-{format(shortage)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Profit row */}
                                <div className="p-4 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-success/20 text-success">
                                            <CheckCircle size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-success uppercase tracking-[0.2em] opacity-60">Locked Profit</span>
                                            <span className="text-base font-black text-success">+{format(bundle.bonusAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="p-8 pt-4 flex flex-col gap-3">
                        {hasShortage ? (
                            <>
                                <Link
                                    href="/deposit"
                                    className="w-full py-4 rounded-[28px] bg-gradient-to-br from-red-500 to-rose-700 text-white font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-[0_16px_40px_rgba(239,68,68,0.35)] hover:scale-[1.03] active:scale-[0.97] transition-all"
                                >
                                    Top Up {format(shortage)} to Continue <ArrowRight size={18} />
                                </Link>
                                <p className="text-[9px] text-center text-red-400/60 font-bold uppercase tracking-[0.15em] px-4 leading-relaxed">
                                    Your balance is insufficient. Deposit the shortage amount to unlock this Super Order.
                                </p>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => onAccept(bundle)}
                                    className="w-full py-4 rounded-[28px] bg-gradient-to-br from-amber-500 to-amber-700 text-white font-black uppercase tracking-[0.25em] text-[11px] flex items-center justify-center gap-3 shadow-[0_16px_40px_rgba(245,158,11,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all"
                                >
                                    START SEQUENCE <ShieldCheck size={20} />
                                </button>
                                <p className="text-[9px] text-center text-text-secondary font-bold opacity-30 uppercase tracking-[0.2em] px-6 leading-relaxed">
                                    Funds remain in the secure clearance node until the full sequence is finalized.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    );
}
