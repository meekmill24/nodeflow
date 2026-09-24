'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/index';
import { ArrowLeft, ArrowDownToLine, Loader2, Calendar, MessageCircle, Share2, X, Copy, Check, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Transaction {
    id: number;
    amount: number;
    description?: string;
    network?: string;
    address?: string;
    created_at: string;
    status: string;
    proof_url?: string;
}

const TransactionDetailModal = ({ tx, onClose }: { tx: Transaction; onClose: () => void }) => {
    const [copied, setCopied] = useState(false);
    const cleanTxId = `TXN-${String(tx.id).padStart(6, '0')}`;

    const handleCopyTxId = () => {
        navigator.clipboard.writeText(cleanTxId);
        setCopied(true);
        toast.success(`Transaction ID #${cleanTxId} copied!`);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleCopyVerification = () => {
        const msg = `[DEPOSIT VERIFICATION REQUEST]
• Transaction ID: #${cleanTxId}
• Amount: $${tx.amount.toFixed(2)} USDT
• Network: ${tx.network || 'USDT'}
• Date: ${new Date(tx.created_at).toLocaleString()}
• Status: ${tx.status}

Please verify and credit my deposit.`;
        navigator.clipboard.writeText(msg);
        toast.success('Verification details copied for Customer Support!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0B0B1E] border border-white/10 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-scale-in">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-white uppercase tracking-widest text-sm">Deposit Voucher</h3>
                        <p className="text-[9px] font-mono text-[#3DD6C8] uppercase font-bold mt-0.5">#{cleanTxId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-text-secondary" />
                    </button>
                </div>
                <div className="p-6 md:p-8 space-y-5">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <ArrowDownToLine size={32} className="text-emerald-400" />
                        </div>
                        <p className="text-3xl font-black text-white font-mono tracking-tight">${tx.amount.toFixed(2)}</p>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest inline-block ${
                            tx.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                            tx.status === 'pending' ? 'bg-amber-500/20 text-amber-300 animate-pulse' :
                            'bg-rose-500/20 text-rose-400'
                        }`}>
                            {tx.status}
                        </span>
                    </div>

                    <div className="space-y-3 pt-2 text-left text-xs">
                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Transaction ID</span>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-mono font-black">#{cleanTxId}</span>
                                <button onClick={handleCopyTxId} className="p-1 rounded bg-white/5 hover:bg-white/10 text-[#3DD6C8]">
                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                            <span className="text-text-secondary">Network</span>
                            <span className="text-[#3DD6C8] font-black font-mono">{tx.network || 'USDT'}</span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                            <span className="text-text-secondary">Type</span>
                            <span className="text-white font-black">Crypto Deposit</span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                            <span className="text-text-secondary">Timestamp</span>
                            <span className="text-white font-black font-mono text-[9px]">{new Date(tx.created_at).toLocaleString()}</span>
                        </div>

                        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                    <ShieldCheck size={12} className="text-emerald-400" /> Receiver Address
                                </span>
                                <span className="text-[8px] font-mono text-emerald-400/80 uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Official Vault</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
                                <span className="text-[10px] font-mono text-white/90 font-bold break-all select-all leading-tight">
                                    {tx.address || 'SmartBugMedia Primary Vault Node'}
                                </span>
                                <button
                                    onClick={() => {
                                        if (tx.address) {
                                            navigator.clipboard.writeText(tx.address);
                                            toast.success('Receiver address copied!');
                                        }
                                    }}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all shrink-0"
                                    title="Copy Receiver Address"
                                >
                                    <Copy size={11} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {tx.proof_url && (
                        <div className="pt-2 space-y-2 text-left">
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Payment Proof</p>
                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                                <img src={tx.proof_url} alt="Proof" className="w-full h-36 object-cover" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-5 bg-white/[0.02] border-t border-white/5 space-y-2">
                    <button 
                        onClick={handleCopyVerification}
                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-2"
                    >
                        <Copy size={13} /> Copy Details for CS
                    </button>
                    <button 
                        onClick={() => { (window as any).Tawk_API?.maximize(); onClose(); }}
                        className="w-full py-3 rounded-xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <MessageCircle size={14} />
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function DepositRecordPage() {
    const { profile } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    useEffect(() => {
        const fetchDeposits = async () => {
            if (!profile?.id) return;
            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', profile.id)
                    .eq('type', 'deposit')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setTransactions(data || []);
            } catch (err) {
                console.error('Failed to fetch deposit record', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeposits();

        if (!profile?.id) return;
        const channel = supabase
            .channel(`transactions-deposit-${profile.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'transactions',
                filter: `user_id=eq.${profile.id}`
            }, () => {
                fetchDeposits();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [profile]);

    return (
        <div className="relative min-h-[calc(100vh-80px)] -mx-4 -mt-4 px-4 pt-4 pb-8 overflow-hidden">
            <div className="absolute top-0 right-[-20%] w-[300px] h-[300px] rounded-full bg-success/20 blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-md mx-auto">
                <div className="flex items-center justify-between animate-slide-up">
                    <Link href="/profile" className="p-2 -ml-2 hover:bg-text-primary/10 rounded-full transition-colors group">
                        <ArrowLeft className="text-text-primary group-hover:text-success transition-colors" />
                    </Link>
                    <h1 className="text-xl font-bold text-text-primary tracking-wide">Deposit Record</h1>
                    <div className="w-10" />
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-success animate-spin" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="glass-card p-12 flex flex-col items-center justify-center text-center animate-slide-up" style={{ animationDelay: '0.05s' }}>
                            <div className="w-16 h-16 rounded-full bg-text-primary/5 flex items-center justify-center mb-4">
                                <ArrowDownToLine size={24} className="text-text-secondary" />
                            </div>
                            <h3 className="text-text-primary font-medium mb-1">No Deposits Yet</h3>
                            <p className="text-sm text-text-secondary">Your deposit history will appear here.</p>
                        </div>
                    ) : (
                        transactions.map((tx, idx) => (
                            <div key={tx.id} className="glass-card p-5 space-y-3 animate-slide-up border-white/5" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                            <ArrowDownToLine size={18} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-mono text-xs font-black text-[#3DD6C8] tracking-wider">
                                                    #TXN-{String(tx.id).padStart(6, '0')}
                                                </span>
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 ${
                                                    tx.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    tx.status === 'pending' ? 'bg-amber-500/20 text-amber-300 animate-pulse' :
                                                    'bg-rose-500/20 text-rose-400'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-text-secondary font-mono">
                                                <span>{tx.network || 'USDT'}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    {new Date(tx.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                                                </span>
                                            </div>
                                            {tx.address && (
                                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/50 pt-1">
                                                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[8px]">Receiver:</span>
                                                    <span className="truncate max-w-[170px] select-all">{tx.address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-3">
                                        <p className="font-black text-emerald-400 text-base font-mono tracking-tight">+${tx.amount.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                                    <button 
                                        onClick={() => {
                                            const cleanId = `TXN-${String(tx.id).padStart(6, '0')}`;
                                            navigator.clipboard.writeText(cleanId);
                                            toast.success(`Transaction ID #${cleanId} copied!`);
                                        }}
                                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-text-secondary uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        <Copy size={12} />
                                        Copy ID
                                    </button>
                                    <button 
                                        onClick={() => setSelectedTx(tx)}
                                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-[#3DD6C8] uppercase tracking-widest hover:bg-[#3DD6C8]/10 hover:border-[#3DD6C8]/20 transition-all"
                                    >
                                        <Share2 size={12} />
                                        Voucher Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedTx && (
                <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
            )}
        </div>
    );
}
