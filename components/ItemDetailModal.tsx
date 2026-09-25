'use client';

import React from 'react';
import { ArrowRight, CheckCircle, Loader2, Sparkles, X } from 'lucide-react';
import Portal from './Portal';

interface ItemDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: {
        id: string | number;
        title: string;
        image_url: string;
        description: string;
        category: string;
    } | null;
    onSubmit: (item: any, displayValue: number) => Promise<void>;
    balance: number;
    commissionRate: number;
    format: (val: number) => string;
    isSubmitting: boolean;
}

export default function ItemDetailModal({
    isOpen,
    onClose,
    item,
    onSubmit,
    balance,
    commissionRate,
    format,
    isSubmitting
}: ItemDetailModalProps) {
    if (!isOpen || !item) return null;

    // Randomize product value between 40% and 85% of balance to ensure uniqueness
    const displayProductValue = React.useMemo(() => {
        if (!balance || balance <= 0) return 0;
        const min = 0.40;
        const max = 0.85;
        const randomFactor = Math.random() * (max - min) + min;
        return Math.floor(balance * randomFactor);
    }, [balance, item?.id]);

    const profitAmount = displayProductValue * commissionRate;
    const ratePercentage = (commissionRate * 100).toFixed(2);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        try {
            await onSubmit(item, displayProductValue);
        } catch (err) {
            console.error("Local Submit Error:", err);
        }
    };

    return (
        <Portal>
            <div
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md md:pl-72 overflow-y-auto animate-fade-in transition-all duration-300"
                onClick={onClose}
            >
                <div
                    className="bg-[#0B0B1E] border border-white/10 w-full max-w-sm rounded-[32px] overflow-hidden shadow-[0_30px_120px_rgba(0,0,0,0.95)] animate-scale-in relative flex flex-col max-h-[90vh] my-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Area */}
                    <div className="p-5 border-b border-white/5 flex items-center justify-between relative">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#3DD6C8] animate-pulse" />
                            <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.2em]">Processing Task</span>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="overflow-y-auto custom-scrollbar p-6 space-y-5">
                        {/* Item Card */}
                        <div className="flex gap-4 items-start">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-2 shrink-0 shadow-inner">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 pt-0.5 flex-1 min-w-0">
                                <h3 className="text-sm font-black text-white leading-tight uppercase tracking-tight line-clamp-2">
                                    {item.title}
                                </h3>
                                <div className="flex gap-1.5 mt-1">
                                    <span className="px-2.5 py-0.5 rounded-lg bg-[#3DD6C8]/15 text-[8px] font-black text-[#3DD6C8] uppercase tracking-wider border border-[#3DD6C8]/20">Active</span>
                                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-[8px] font-black text-emerald-400 uppercase tracking-wider border border-emerald-500/20">Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* KPI 3-Column Display */}
                        <div className="grid grid-cols-3 gap-0.5 p-4 rounded-2xl bg-black/60 border border-white/5 shadow-[inset_0_4px_25px_rgba(0,0,0,0.7)]">
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5">Value</span>
                                <span className="text-sm font-black text-white tracking-tight italic tabular-nums">{format(displayProductValue)}</span>
                                <span className="text-[7px] font-bold text-white/30 uppercase mt-1">USDT</span>
                            </div>
                            <div className="flex flex-col items-center border-x border-white/10 px-2">
                                <span className="text-[8px] font-black text-[#3DD6C8] uppercase tracking-[0.2em] mb-1.5">Rate</span>
                                <span className="text-sm font-black text-[#3DD6C8] tracking-tight italic tabular-nums">{ratePercentage}%</span>
                                <span className="text-[7px] font-black text-[#3DD6C8]/70 uppercase mt-1">REBATE</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1.5">Profit</span>
                                <span className="text-sm font-black text-emerald-400 tracking-tight italic tabular-nums">+{format(profitAmount)}</span>
                                <span className="text-[7px] font-bold text-emerald-400/60 uppercase mt-1">YIELD</span>
                            </div>
                        </div>

                        {/* Explicit Formula & Profit Explanation Card (SimpleMoneys & Captiv8 style) */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#3DD6C8]/10 via-white/[0.02] to-emerald-500/10 border border-[#3DD6C8]/20 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-[#3DD6C8] uppercase tracking-[0.2em] flex items-center gap-1.5">
                                    <Sparkles size={11} /> Profit Calculation
                                </span>
                                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
                                    Value × Rate = Profit
                                </span>
                            </div>

                            {/* Value × Rate = Profit Equation */}
                            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center gap-2 font-mono text-xs font-black">
                                <span className="text-white">{format(displayProductValue)}</span>
                                <span className="text-[#3DD6C8] font-bold">×</span>
                                <span className="text-[#3DD6C8] font-bold">{ratePercentage}%</span>
                                <span className="text-white/40">=</span>
                                <span className="text-emerald-400 font-bold">+{format(profitAmount)}</span>
                            </div>

                            <p className="text-[9px] text-white/60 leading-relaxed font-medium">
                                <strong className="text-white">Explanation:</strong> Order Value of <strong className="text-white">{format(displayProductValue)}</strong> multiplied by the <strong className="text-[#3DD6C8]">{ratePercentage}%</strong> commission rate yields <strong className="text-emerald-400">+{format(profitAmount)}</strong> in profit upon submission.
                            </p>
                        </div>
                    </div>

                    {/* Fixed Footer Button */}
                    <div className="p-6 pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3DD6C8] to-teal-500 text-[#0B0B1E] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(61,214,200,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} /> Processing...
                                </>
                            ) : (
                                <>
                                    SUBMIT TASK <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                        <p className="text-[8px] text-center text-white/30 font-black mt-3 uppercase tracking-[0.3em] flex items-center justify-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Clearance Node Protected
                        </p>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
