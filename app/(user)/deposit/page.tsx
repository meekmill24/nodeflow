'use client';

import { useState, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase/index';
import { useAuth } from '@/context/AuthContext';
import { useSiteSettings } from '@/context/SettingsContext';
import { 
    ChevronLeft, 
    Copy, 
    CheckCircle, 
    AlertCircle, 
    Loader2, 
    QrCode,
    Smartphone,
    ShieldCheck,
    Flashlight,
    Upload,
    Image as ImageIcon,
    X,
    Gift
} from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import TransactionReceipt from '@/components/TransactionReceipt';

// Pre-set amounts matching $60 minimum task balance through Tier 6 ($10,000 + $5,000 bonus)
const PRESET_AMOUNTS = [60, 100, 300, 500, 1000, 2500, 5000, 10000];

export default function DepositPage() {
    const { profile } = useAuth();
    const [amount, setAmount] = useState('60');
    const [customAmount, setCustomAmount] = useState('');
    const [txHash, setTxHash] = useState('');
    type DepositNetwork = 'TRX' | 'BEP20' | 'ERC20' | 'ETH' | 'BTC' | 'USDC' | 'BNB' | 'PAYPALUSD';
    const [network, setNetwork] = useState<DepositNetwork>('TRX');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [submittedTx, setSubmittedTx] = useState<{ id: string | number; amount: number; network: string; walletAddress: string; proofUrl?: string | null; date: string } | null>(null);

    const settings = useSiteSettings() as any;
    
    const depositAddress = useMemo(() => {
        if (network === 'BTC') return settings?.wallet_btc || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
        if (network === 'ETH') return settings?.wallet_eth || settings?.wallet_erc20 || '0x0000000000000000000000000000000000000000';
        if (network === 'ERC20') return settings?.wallet_erc20 || '0x0000000000000000000000000000000000000000';
        if (network === 'BEP20') return settings?.wallet_bep20 || '0x0000000000000000000000000000000000000000';
        if (network === 'USDC') return settings?.wallet_usdc || settings?.wallet_erc20 || '0x0000000000000000000000000000000000000000';
        if (network === 'BNB') return settings?.wallet_bnb || settings?.wallet_bep20 || '0x0000000000000000000000000000000000000000';
        if (network === 'PAYPALUSD') return settings?.wallet_paypalusd || settings?.wallet_erc20 || '0x0000000000000000000000000000000000000000';
        return settings?.wallet_trc20 || 'TRx9mK2pQbN7cVh3dJwXeGfLkAoYsUP5rI8';
    }, [network, settings]);

    const finalAmount = customAmount || amount;

    const copyAddress = () => {
        navigator.clipboard.writeText(depositAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProofFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = () => {
        setProofFile(null);
        setProofPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmitDeposit = async () => {
        if (!profile || !finalAmount) return;
        if (!proofFile) {
            alert('Please upload a proof of payment screenshot.');
            return;
        }
        
        setLoading(true);

        try {
            // Submit through server API route using Service Role to bypass Storage RLS policies
            const formData = new FormData();
            formData.append('file', proofFile);
            formData.append('amount', finalAmount);
            formData.append('network', network);
            formData.append('address', depositAddress);
            formData.append('userId', profile.id);
            if (txHash.trim()) {
                formData.append('txHash', txHash.trim());
            }

            const res = await fetch('/api/deposit', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit deposit');
            }

            const resolvedNetworkName = network === 'TRX' ? 'USDT (TRC-20)' : network === 'BEP20' ? 'USDT (BEP-20)' : network === 'ERC20' ? 'USDT (ERC-20)' : network;
            const cleanId = data.txId || (data.transaction?.id ? `TXN-${String(data.transaction.id).padStart(6, '0')}` : `TXN-${Math.floor(100000 + Math.random() * 900000)}`);

            setSubmittedTx({
                id: cleanId,
                amount: parseFloat(finalAmount),
                network: resolvedNetworkName,
                walletAddress: depositAddress,
                proofUrl: data.proofUrl || proofPreview,
                date: new Date().toUTCString()
            });
            
            setSubmitted(true);
        } catch (err: any) {
            console.error('Failed to submit deposit:', err);
            alert(`Failed to submit: ${err.message || 'Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    if (submitted && submittedTx) {
        return (
            <TransactionReceipt
                type="deposit"
                transactionId={submittedTx.id}
                amount={submittedTx.amount}
                network={submittedTx.network}
                walletAddress={submittedTx.walletAddress}
                proofUrl={submittedTx.proofUrl}
                username={profile?.username || 'Agent'}
                userId={profile?.id}
                date={submittedTx.date}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link 
                    href="/home" 
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                    <ChevronLeft size={16} /> Back to Home
                </Link>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={14} /> Escrow Deposit
                </div>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-text-primary dark:text-white uppercase tracking-tight">Add Funds</h2>
                    <p className="text-text-secondary text-xs mt-1 font-bold uppercase tracking-widest">
                        Deposit via {network === 'ETH' ? 'Ethereum (ETH)' : network === 'BTC' ? 'Bitcoin (BTC)' : network === 'BNB' ? 'BNB Chain' : network === 'USDC' ? 'USD Coin (USDC)' : network === 'PAYPALUSD' ? 'PayPal USD (PYUSD)' : `USDT (${network})`}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 px-4 py-2 rounded-xl">
                    <img 
                        src={
                            network === 'ETH' ? "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png" : 
                            network === 'BTC' ? "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png" : 
                            network === 'BNB' ? "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png" : 
                            network === 'PAYPALUSD' ? "/pyusd.png" :
                            network === 'USDC' ? "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png" : 
                            "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png"
                        } 
                        alt={network} 
                        className="w-8 h-8 object-contain" 
                    />
                    <span className="text-sm font-black text-text-primary dark:text-white uppercase tracking-tighter">
                        {network === 'ETH' ? 'ETH' : network === 'BTC' ? 'BTC' : network === 'BNB' ? 'BNB' : network === 'USDC' ? 'USDC' : network === 'PAYPALUSD' ? 'PYUSD' : 'USDT'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Left Side: Amount & Proof */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                            <ShieldCheck size={16} className="text-primary" />
                            1. Network & Amount
                        </h3>

                        {/* Network Switcher */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2 bg-black/40 rounded-[24px] border border-white/5">
                            {[
                                { id: 'TRX', label: 'USDT-TRC20', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png' },
                                { id: 'BEP20', label: 'USDT-BEP20', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png' },
                                { id: 'ERC20', label: 'USDT-ERC20', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png' },
                                { id: 'ETH', label: 'Ethereum', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png' },
                                { id: 'BTC', label: 'Bitcoin', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png' },
                                { id: 'USDC', label: 'USDC', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png' },
                                { id: 'BNB', label: 'BNB Chain', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png' },
                                { id: 'PAYPALUSD', label: 'PayPal USD', icon: '/pyusd.png' }
                            ].map(net => (
                                <button
                                    key={net.id}
                                    type="button"
                                    onClick={() => setNetwork(net.id as any)}
                                    className={`py-3.5 px-2 rounded-xl flex flex-col items-center gap-1.5 transition-all ${network === net.id 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02] border border-primary-light/30' 
                                        : 'text-text-secondary hover:bg-white/5 hover:text-white border border-transparent'}`}
                                >
                                    <img src={net.icon} alt="" className="w-5 h-5 object-contain" />
                                    <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-full">{net.label}</span>
                                </button>
                            ))}
                        </div>
                        
                        {/* Deposit Bonus Tier Callout */}
                        <Link 
                            href="/rewards/first-deposit"
                            className="block p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-emerald-500/15 border border-amber-500/30 hover:border-amber-500/50 transition-all group relative overflow-hidden shadow-lg shadow-amber-500/5"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                        <Gift size={20} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase text-amber-400 tracking-[0.2em] block">
                                            Tier 6 Bonus Privilege
                                        </span>
                                        <p className="text-xs font-black text-white">
                                            Deposit $10,000 → Get <span className="text-emerald-400 font-extrabold">+$5,000 Bonus Credit</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                                    All Tiers →
                                </div>
                            </div>
                        </Link>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
                            {PRESET_AMOUNTS.map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => {
                                        setAmount(String(val));
                                        setCustomAmount('');
                                    }}
                                    className={`p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                                        amount === String(val) && !customAmount
                                        ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(157,80,187,0.15)]' 
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xl font-black transition-colors ${amount === String(val) && !customAmount ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>
                                                ${val}
                                            </span>
                                            <img 
                                                src={
                                                    network === 'ETH' ? "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png" : 
                                                    network === 'BTC' ? "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png" : 
                                                    network === 'BNB' ? "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png" : 
                                                    network === 'PAYPALUSD' ? "/pyusd.png" :
                                                    network === 'USDC' ? "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png" : 
                                                    "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png"
                                                } 
                                                className="w-4 h-4 object-contain opacity-60" 
                                                alt=""
                                            />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">
                                            {network === 'ETH' ? 'ETH' : network === 'BTC' ? 'BTC' : network === 'BNB' ? 'BNB' : network === 'USDC' ? 'USDC' : network === 'PAYPALUSD' ? 'PYUSD' : 'USDT'}
                                        </span>
                                    </div>
                                    {amount === String(val) && !customAmount && (
                                        <div className="absolute top-1 right-1">
                                            <CheckCircle size={14} className="text-primary" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Custom Amount Input */}
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-xl">$</div>
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => {
                                    setCustomAmount(e.target.value);
                                    setAmount('');
                                }}
                                placeholder={`Enter amount in ${network === 'ERC20' ? 'ETH' : network === 'BTC' ? 'BTC' : 'USDT'}`}
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[20px] py-6 pl-12 pr-6 text-xl font-black text-text-primary dark:text-white placeholder:text-text-secondary/20 focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                            <Upload size={16} className="text-success" />
                            2. Upload Payment Proof
                        </h3>

                        {!proofPreview ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                            >
                                <div className="p-4 rounded-2xl bg-white/5 text-text-secondary group-hover:text-primary transition-colors">
                                    <ImageIcon size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Click to upload screenshot</p>
                                    <p className="text-[10px] text-text-secondary mt-1 uppercase font-bold opacity-60 font-mono tracking-tighter">JPG, PNG, WEBP (MAX 5MB)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative glass-card p-2 border border-white/10 group animate-scale-in">
                                <img src={proofPreview} alt="Proof" className="w-full h-48 object-cover rounded-2xl" />
                                <button 
                                    onClick={removeFile}
                                    className="absolute top-4 right-4 p-2 bg-danger text-white rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                                >
                                    <X size={16} />
                                </button>
                                <div className="p-4 flex items-center gap-3">
                                    <CheckCircle size={16} className="text-success" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest truncate">{proofFile?.name}</span>
                                </div>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />

                        {/* Optional Transaction Hash / TXID input */}
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                                    Transaction Hash / TXID
                                </label>
                                <span className="text-[9px] font-mono text-white/40 uppercase">Optional</span>
                            </div>
                            <input 
                                type="text"
                                value={txHash}
                                onChange={(e) => setTxHash(e.target.value)}
                                placeholder="Paste wallet / exchange transfer TXID or hash"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs font-mono text-white placeholder:text-white/20 focus:border-[#3DD6C8]/50 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: QR Code & Address */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <QrCode size={16} className="text-accent" />
                        3. Complete Transfer
                    </h3>

                    <div className="glass-card-glow p-8 flex flex-col items-center gap-6 border border-white/10">
                        <div className="bg-white p-6 rounded-[32px] shadow-2xl relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <QRCodeSVG
                                value={depositAddress}
                                size={200}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                            />
                        </div>

                        <div className="w-full space-y-4">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">
                                    {network === 'ETH' ? 'ETH Address (ERC-20)' : network === 'BTC' ? 'BTC Address' : network === 'USDC' ? 'USDC Address' : network === 'BNB' ? 'BNB Chain Address' : network === 'PAYPALUSD' ? 'PYUSD Address' : `${network} Address`}
                                </p>
                                <div className="glass-card px-4 py-4 border border-white/20 flex items-center justify-between group overflow-hidden bg-black/40">
                                    <span className="text-sm md:text-base font-black font-mono text-white truncate max-w-[220px] tracking-tight">{depositAddress}</span>
                                    <button 
                                        type="button"
                                        onClick={copyAddress}
                                        className="text-primary-light hover:text-white transition-all scale-125 ml-2 relative z-10"
                                    >
                                        {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                                    </button>
                                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                                </div>
                            </div>

                            <button
                                onClick={handleSubmitDeposit}
                                disabled={loading || !finalAmount || !proofFile}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/25 hover:bg-primary-light transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>{uploading ? 'UPLOADING PROOF...' : 'PROCESSING...'}</span>
                                    </div>
                                ) : (
                                    <>Submit Deposit ${finalAmount} <Smartphone size={16} /></>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl text-[10px] font-bold text-text-secondary leading-relaxed uppercase tracking-wider italic">
                        <AlertCircle size={14} className="shrink-0 text-warning" />
                        Only send {network === 'ETH' ? 'ETH' : network === 'BTC' ? 'BTC' : network === 'BNB' ? 'BNB' : network === 'USDC' ? 'USDC' : network === 'PAYPALUSD' ? 'PYUSD' : 'USDT'} ({network}) to this address. Other assets will be permanently lost and cannot be recovered.
                    </div>
                </div>

            </div>

        </div>
    );
}
