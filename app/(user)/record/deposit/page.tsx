'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ArrowDownToLine, Loader2, Calendar, MessageCircle, ChevronRight, Share2, X } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
    id: number;
    amount: number;
    description: string;
    created_at: string;
    status: string;
    proof_url?: string;
}

const TransactionDetailModal = ({ tx, onClose }: { tx: Transaction; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface border border-white/10 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-scale-in">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-black text-white uppercase tracking-widest text-sm">Transaction Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-text-secondary" />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center mx-auto mb-4">
                            <ArrowDownToLine size={32} className="text-success" />
                        </div>
                        <p className="text-3xl font-black text-white">${tx.amount.toFixed(2)}</p>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                            tx.status === 'approved' ? 'bg-success/20 text-success' :
                            tx.status === 'pending' ? 'bg-warning/20 text-warning' :
                            'bg-danger/20 text-danger'
                        }`}>
                            {tx.status}
                        </span>
                    </div>

                    <div className="space-y-4 pt-4 text-left">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-text-secondary">Type</span>
                            <span className="text-white font-black">USDT Deposit</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-text-secondary">Date</span>
                            <span className="text-white font-black">{new Date(tx.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-text-secondary">Description</span>
                            <span className="text-white font-black">{tx.description}</span>
                        </div>
                    </div>

                    {tx.proof_url && (
                        <div className="pt-4 space-y-2 text-left">
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Payment Proof</p>
                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                                <img src={tx.proof_url} alt="Proof" className="w-full h-40 object-cover" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-6 bg-white/[0.02]">
                    <button 
                        onClick={() => { (window as any).Tawk_API?.maximize(); onClose(); }}
                        className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <MessageCircle size={16} />
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
                                <div key={tx.id} className="glass-card p-4 space-y-4 animate-slide-up border-white/5" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
                                                <ArrowDownToLine size={18} className="text-success" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-text-primary text-sm line-clamp-1">{tx.description || 'USDT Deposit'}</p>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider shrink-0 ${
                                                        tx.status === 'approved' ? 'bg-success/20 text-success' :
                                                        tx.status === 'pending' ? 'bg-warning/20 text-warning animate-pulse' :
                                                        'bg-danger/20 text-danger'
                                                    }`}>
                                                        {tx.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                    <Calendar size={12} />
                                                    {new Date(tx.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-4">
                                            <p className="font-black text-success tracking-tight">+${tx.amount.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <button 
                                            onClick={() => (window as any).Tawk_API?.maximize()}
                                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-text-secondary uppercase tracking-widest hover:bg-success/10 hover:text-success hover:border-success/20 transition-all"
                                        >
                                            <MessageCircle size={14} />
                                            Chat Support
                                        </button>
                                        <button 
                                            onClick={() => setSelectedTx(tx)}
                                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-text-secondary uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                        >
                                            <Share2 size={14} />
                                            View Details
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
