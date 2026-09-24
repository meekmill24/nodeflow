'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    CheckCircle2, 
    Clock, 
    Copy, 
    Check, 
    ExternalLink, 
    MessageSquare, 
    Send, 
    ShieldCheck, 
    ArrowRight, 
    Download,
    FileText,
    HelpCircle,
    Building2,
    Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '@/context/SettingsContext';

interface TransactionReceiptProps {
    type: 'withdrawal' | 'deposit';
    transactionId: string | number;
    amount: number;
    network: string;
    walletAddress?: string;
    username?: string;
    userId?: string;
    date?: string;
    proofUrl?: string | null;
    returnHref?: string;
    recordsHref?: string;
}

export default function TransactionReceipt({
    type,
    transactionId,
    amount,
    network,
    walletAddress,
    username,
    userId,
    date,
    proofUrl,
    returnHref = '/home',
    recordsHref
}: TransactionReceiptProps) {
    const settings = useSiteSettings() as any;
    const [copied, setCopied] = useState(false);
    const [txIdCopied, setTxIdCopied] = useState(false);

    const formattedDate = date || new Date().toUTCString();
    const cleanTxId = String(transactionId).startsWith('TXN-') 
        ? String(transactionId) 
        : `TXN-${String(transactionId).padStart(6, '0')}`;
    const cleanUserId = userId ? (userId.length > 12 ? userId.slice(0, 8).toUpperCase() : userId) : 'USER';
    const isWithdrawal = type === 'withdrawal';
    const resolvedRecordsHref = recordsHref || (isWithdrawal ? '/record/withdraw' : '/record/deposit');

    // Build the pre-filled verification message for customer service
    const verificationMessage = `[${isWithdrawal ? 'WITHDRAWAL' : 'DEPOSIT'} VERIFICATION REQUEST]
• Transaction ID: #${cleanTxId}
• User Account: ${username || 'Agent'} (ID: ${cleanUserId})
• Type: ${isWithdrawal ? 'Withdrawal Request' : 'Deposit Submission'}
• Amount: $${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
• Network: ${network}
${walletAddress ? `• ${isWithdrawal ? 'Destination Wallet' : 'Receiver Address (Platform Deposit Vault)'}: ${walletAddress}\n` : ''}• Date: ${formattedDate}
• Status: Pending CS Verification

Please verify and process my transaction. Thank you.`;

    const handleCopyReceipt = () => {
        navigator.clipboard.writeText(verificationMessage);
        setCopied(true);
        toast.success('Receipt copied to clipboard! Paste in Live Chat.');
        setTimeout(() => setCopied(false), 3000);
    };

    const handleCopyTxId = () => {
        navigator.clipboard.writeText(cleanTxId);
        setTxIdCopied(true);
        toast.success('Transaction ID copied!');
        setTimeout(() => setTxIdCopied(false), 3000);
    };

    const handleOpenLiveChat = () => {
        // Copy receipt text to clipboard first so user can easily paste
        navigator.clipboard.writeText(verificationMessage);
        toast.success('Receipt details copied! Opening Customer Support...');

        // Try maximizing Tawk.to
        const tawk = (window as any).Tawk_API;
        if (tawk && typeof tawk.maximize === 'function') {
            try {
                tawk.showWidget?.();
                tawk.maximize();
                return;
            } catch (err) {
                console.error('Tawk open error:', err);
            }
        }

        // Fallback: Redirect to /service page
        window.location.href = '/service';
    };

    const handleOpenWhatsApp = () => {
        navigator.clipboard.writeText(verificationMessage);
        const whatsappRaw = settings?.whatsapp_url || settings?.whatsapp_link || '';
        const cleanNumber = whatsappRaw.replace(/[^0-9]/g, '');
        const url = cleanNumber 
            ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(verificationMessage)}`
            : `https://wa.me/?text=${encodeURIComponent(verificationMessage)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="w-full max-w-xl mx-auto py-4 md:py-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Main Receipt Container */}
            <div className="bg-[#0B0B1E] border border-white/10 rounded-[36px] shadow-2xl relative overflow-hidden backdrop-blur-xl">
                
                {/* Decorative Background Top Accent */}
                <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${isWithdrawal ? 'from-amber-400 via-[#3DD6C8] to-indigo-500' : 'from-emerald-400 via-[#3DD6C8] to-cyan-500'}`} />
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#3DD6C8]/10 blur-[100px] pointer-events-none rounded-full" />

                {/* Receipt Header */}
                <div className="p-6 md:p-8 border-b border-white/5 relative z-10 text-center space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-left">
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Building2 size={16} className="text-[#3DD6C8]" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-white uppercase tracking-wider block leading-none">SmartBugMedia<span className="text-[#3DD6C8]">.</span></span>
                                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest block mt-0.5">Settlement Protocol</span>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[9px] font-black uppercase tracking-widest shadow-inner">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                            Pending CS Verification
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            <Clock size={28} className="text-amber-400 animate-pulse" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                            {isWithdrawal ? 'Withdrawal Request Submitted' : 'Deposit Submission Received'}
                        </h2>
                        <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mt-1">
                            Official Settlement Transaction Voucher
                        </p>
                    </div>

                    {/* Prominent Amount Box */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 inline-flex flex-col items-center justify-center min-w-[240px]">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">
                            {isWithdrawal ? 'Amount To Settle' : 'Submitted Amount'}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight">
                                ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-xs font-black text-[#3DD6C8] uppercase tracking-wider">USDT</span>
                        </div>
                    </div>
                </div>

                {/* Receipt Details Breakdown */}
                <div className="p-6 md:p-8 space-y-3.5 relative z-10 text-xs">
                    
                    {/* Transaction Reference */}
                    <div className="flex items-center justify-between py-1">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Transaction ID</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white tracking-wider">#{cleanTxId}</span>
                            <button
                                type="button"
                                onClick={handleCopyTxId}
                                className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                                title="Copy Transaction ID"
                            >
                                {txIdCopied ? <Check size={12} className="text-[#3DD6C8]" /> : <Copy size={12} />}
                            </button>
                        </div>
                    </div>

                    {/* User Account & User ID */}
                    <div className="flex items-center justify-between py-1">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">User Account</span>
                        <div className="text-right">
                            <span className="font-bold text-white uppercase">{username || 'Agent'}</span>
                            <span className="text-[9px] font-mono text-white/40 block">ID: #{cleanUserId}</span>
                        </div>
                    </div>

                    {/* Network Protocol */}
                    <div className="flex items-center justify-between py-1">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Network Protocol</span>
                        <span className="font-mono font-bold text-[#3DD6C8] uppercase">{network}</span>
                    </div>

                    {/* Wallet Address (Destination for withdrawal, receiver address for deposit) */}
                    {walletAddress && (
                        <div className={`flex flex-col gap-2 p-3.5 rounded-2xl border transition-all ${
                            isWithdrawal 
                                ? 'bg-rose-500/5 border-rose-500/20' 
                                : 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.06)]'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck size={13} className={isWithdrawal ? 'text-rose-400' : 'text-emerald-400'} />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-white/80">
                                        {isWithdrawal ? 'Destination Beneficiary Wallet' : 'Receiver Address (Official Deposit Vault)'}
                                    </span>
                                </div>
                                <span className={`text-[8px] font-black font-mono uppercase px-2 py-0.5 rounded-full border ${
                                    isWithdrawal 
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                    {isWithdrawal ? 'Target Node' : 'Verified Receiver'}
                                </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 font-mono text-[11px] text-white break-all select-all flex items-center justify-between gap-2">
                                <span className="tracking-tight">{walletAddress}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(walletAddress);
                                        toast.success(`${isWithdrawal ? 'Destination' : 'Receiver'} address copied!`);
                                    }}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 shrink-0 text-white/70 hover:text-white transition-all flex items-center gap-1 text-[9px] font-mono"
                                    title="Copy Address"
                                >
                                    <Copy size={12} />
                                    <span className="hidden sm:inline">Copy</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Proof Attachment indicator for deposits */}
                    {proofUrl && (
                        <div className="flex items-center justify-between py-1">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Proof of Transfer</span>
                            <a
                                href={proofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-black text-[#3DD6C8] hover:underline inline-flex items-center gap-1 uppercase tracking-wider"
                            >
                                Attached <ExternalLink size={11} />
                            </a>
                        </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center justify-between py-1 border-t border-white/5 pt-3">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Submission Timestamp</span>
                        <span className="font-mono text-[10px] text-white/60">{formattedDate}</span>
                    </div>
                </div>

                {/* Action Required Box */}
                <div className="mx-6 md:mx-8 mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-amber-400 shrink-0" />
                        <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
                            Customer Service Verification Required
                        </span>
                    </div>
                    <p className="text-[10px] font-medium text-white/70 leading-relaxed">
                        To protect network liquidity and account safety, all {isWithdrawal ? 'withdrawals' : 'deposits'} must be verified by official support. Please submit your <strong>Transaction ID (#{cleanTxId})</strong> to Customer Support below to expedite approval.
                    </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="p-6 md:p-8 pt-0 space-y-3 relative z-10">
                    
                    {/* Send to Live Chat */}
                    <button
                        type="button"
                        onClick={handleOpenLiveChat}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#3DD6C8] to-cyan-400 text-[#0B0B1E] font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(61,214,200,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                    >
                        <MessageSquare size={16} />
                        Send to Live Support (Instant Verification)
                    </button>

                    {/* WhatsApp Option (if configured) or Copy Receipt */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={handleOpenWhatsApp}
                            className="py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={13} />
                            WhatsApp Support
                        </button>

                        <button
                            type="button"
                            onClick={handleCopyReceipt}
                            className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                            {copied ? <Check size={13} className="text-[#3DD6C8]" /> : <Copy size={13} />}
                            {copied ? 'Copied!' : 'Copy Receipt'}
                        </button>
                    </div>

                    {/* Return Navigation Links */}
                    <div className="flex items-center justify-between pt-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <Link 
                            href={returnHref} 
                            className="hover:text-white transition-colors"
                        >
                            ← Return to Dashboard
                        </Link>
                        <Link 
                            href={resolvedRecordsHref} 
                            className="hover:text-[#3DD6C8] transition-colors flex items-center gap-1"
                        >
                            View in Records <ArrowRight size={11} />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
