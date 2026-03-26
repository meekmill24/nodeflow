'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ShieldCheck, KeyRound, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SecurityCenterPage() {
    const { profile, refreshProfile } = useAuth();
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [hasPin, setHasPin] = useState(false);

    useEffect(() => {
        if (profile?.security_pin) {
            setHasPin(true);
        }
    }, [profile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (pin.length !== 6 || !/^\d+$/.test(pin)) {
            setMessage({ type: 'error', text: 'Security PIN must be exactly 6 digits' });
            return;
        }

        if (pin !== confirmPin) {
            setMessage({ type: 'error', text: 'PINs do not match' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ security_pin: pin })
                .eq('id', profile?.id);

            if (error) throw error;

            await refreshProfile();
            setHasPin(true);
            setPin('');
            setConfirmPin('');
            setMessage({ type: 'success', text: 'Security PIN set successfully' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to set Security PIN' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-80px)] -mx-4 -mt-4 px-4 pt-4 pb-8 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-accent/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-md mx-auto">
                <div className="flex items-center justify-between animate-slide-up">
                    <Link href="/profile" className="p-2 -ml-2 hover:bg-text-primary/10 rounded-full transition-colors group">
                        <ArrowLeft className="text-text-primary group-hover:text-primary-light transition-colors" />
                    </Link>
                    <h1 className="text-xl font-bold text-text-primary tracking-wide">Security Center</h1>
                    <div className="w-10" />
                </div>

                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
                    <div className="flex justify-center mb-6">
                        <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 shadow-[0_0_30px_rgba(var(--accent),0.3)] ${hasPin ? 'bg-success/20 border-success/30 text-success' : 'bg-accent/20 border-accent/30 text-accent-light'}`}>
                            <ShieldCheck size={32} />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-text-primary text-center mb-2">Fund Password</h2>
                    <p className="text-sm text-text-secondary text-center mb-8">
                        {hasPin
                            ? "Your account is secured. You can update your 6-digit withdrawal PIN below."
                            : "Set a 6-digit Security PIN to protect your withdrawals."}
                    </p>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 block">
                                    {hasPin ? 'New Security PIN' : 'Security PIN'}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyRound size={18} className="text-text-secondary group-focus-within:text-accent-light transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        maxLength={6}
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                        placeholder="6-digit PIN"
                                        className="w-full bg-text-primary/5 border border-text-primary/10 rounded-xl py-4 pl-12 pr-4 text-text-primary placeholder-text-primary/30 focus:border-accent-light focus:bg-text-primary/10 transition-all outline-none tracking-[0.5em] font-mono"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2 block">
                                    Confirm PIN
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <ShieldCheck size={18} className="text-text-secondary group-focus-within:text-accent-light transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        maxLength={6}
                                        value={confirmPin}
                                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                                        placeholder="Confirm 6-digit PIN"
                                        className="w-full bg-text-primary/5 border border-text-primary/10 rounded-xl py-4 pl-12 pr-4 text-text-primary placeholder-text-primary/30 focus:border-accent-light focus:bg-text-primary/10 transition-all outline-none tracking-[0.5em] font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl flex items-start gap-3 animate-fade-in ${message.type === 'success' ? 'bg-success/10 border border-success/20 text-success' : 'bg-danger/10 border border-danger/20 text-danger'
                                }`}>
                                {message.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || pin.length !== 6 || confirmPin.length !== 6}
                            className="btn-accent w-full py-4 text-lg font-bold flex justify-center items-center shadow-[0_0_20px_rgba(var(--accent),0.4)] hover:shadow-[0_0_30px_rgba(var(--accent),0.6)] disabled:opacity-50 disabled:grayscale transition-all"
                        >
                            {isLoading ? <Loader2 size={24} className="animate-spin text-text-primary" /> : (hasPin ? 'Update PIN' : 'Set Security PIN')}
                        </button>
                    </form>
                </div>

                <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex gap-3">
                        <AlertCircle className="text-accent-light shrink-0 mt-0.5" size={18} />
                        <div className="text-xs text-text-secondary leading-relaxed">
                            <p className="font-semibold text-text-primary mb-1">Security Advice</p>
                            <p>Do not share your Security PIN with anyone. The Concierge Desk will never ask for your PIN.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
