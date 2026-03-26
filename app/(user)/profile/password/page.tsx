'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, KeyRound, CheckCircle, AlertCircle, Loader2, Save, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SetPasswordPage() {
    const { profile } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            
            setMessage({ type: 'success', text: 'Password updated successfully! You can now use this password for future logins.' });
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update password.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen -mx-4 -mt-4 px-4 pt-4 pb-8 overflow-hidden bg-background">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-8 max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between animate-slide-up">
                    <Link href="/profile/info" className="p-2 -ml-2 hover:bg-white/5 rounded-2xl transition-all group">
                        <ArrowLeft className="text-text-primary group-hover:text-primary-light transition-colors" />
                    </Link>
                    <h1 className="text-xl font-black text-white uppercase tracking-tight">Account Security</h1>
                    <div className="w-10" />
                </div>

                {/* Status Card */}
                <div className="glass-card-glow p-8 animate-slide-up" style={{ animationDelay: '0.05s' }}>
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 rounded-[28px] bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary-light rotate-3 shadow-lg shadow-primary/20">
                            <KeyRound size={36} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-white text-center mb-2 uppercase tracking-tight">Set Password</h2>
                    <p className="text-xs text-text-secondary text-center mb-10 uppercase tracking-widest font-bold opacity-60">
                        Create a strong password to enable secure login via email or username.
                    </p>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="relative group">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 block opacity-40">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <KeyRound size={18} className="text-text-secondary group-focus-within:text-primary-light transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white placeholder-text-secondary/30 focus:border-primary-light focus:bg-white/10 transition-all outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 block opacity-40">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <ShieldCheck size={18} className="text-text-secondary group-focus-within:text-primary-light transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white placeholder-text-secondary/30 focus:border-primary-light focus:bg-white/10 transition-all outline-none font-mono"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`p-5 rounded-2xl flex items-start gap-4 animate-scale-in ${message.type === 'success' ? 'bg-success/10 border border-success/20 text-success' : 'bg-danger/10 border border-danger/20 text-danger'}`}>
                                {message.type === 'success' ? <CheckCircle size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                                <p className="text-sm font-bold leading-relaxed uppercase tracking-wide">{message.text}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !password || password !== confirmPassword}
                            className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:grayscale cursor-pointer"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Update Password
                                    <Save size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Security Advice */}
                <div className="glass-card p-6 animate-slide-up border-transparent hover:border-primary/10 transition-all" style={{ animationDelay: '0.1s' }}>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                            <AlertCircle className="text-accent-light" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Privacy Protocol</p>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider leading-relaxed opacity-60">
                                Use a mix of letters, numbers, and symbols. Never reuse passwords from other platforms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
