'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import Link from 'next/link';

export default function BindEmailPage() {
    const { user, profile } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user]);

    const handleBind = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({ email: email });
            if (error) throw error;
            
            setMessage({ type: 'success', text: 'Success! A confirmation link has been sent to your new email. Please verify it to complete the binding.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update email.' });
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
                    <Link href="/profile" className="p-2 -ml-2 hover:bg-white/5 rounded-2xl transition-all group">
                        <ArrowLeft className="text-text-primary group-hover:text-primary-light transition-colors" />
                    </Link>
                    <h1 className="text-xl font-black text-white uppercase tracking-tight">Account Security</h1>
                    <div className="w-10" />
                </div>

                {/* Status Card */}
                <div className="glass-card-glow p-8 animate-slide-up" style={{ animationDelay: '0.05s' }}>
                    <div className="flex justify-center mb-8">
                        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center border-2 rotate-3 shadow-lg ${user?.email ? 'bg-success/20 border-success/30 text-success shadow-success/20' : 'bg-primary/20 border-primary/30 text-primary-light shadow-primary/20'}`}>
                            <Mail size={36} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-white text-center mb-2 uppercase tracking-tight">Bind E-mail</h2>
                    <p className="text-xs text-text-secondary text-center mb-10 uppercase tracking-widest font-bold opacity-60">
                        {user?.email 
                            ? "Your account is currently linked. You can update your verification email below." 
                            : "Link your email address to receive important updates and secure your account."}
                    </p>

                    <form onSubmit={handleBind} className="space-y-8">
                        <div className="relative group">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 block opacity-40">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-text-secondary group-focus-within:text-primary-light transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white placeholder-text-secondary/30 focus:border-primary-light focus:bg-white/10 transition-all outline-none font-bold"
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
                            disabled={isLoading || !email || email === user?.email}
                            className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:grayscale cursor-pointer"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    {user?.email ? 'Update Email' : 'Bind Account'}
                                    <Send size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Verification Tip */}
                <div className="glass-card p-6 animate-slide-up border-transparent hover:border-primary/10 transition-all" style={{ animationDelay: '0.1s' }}>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                            <AlertCircle className="text-accent-light" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Security Protocol</p>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider leading-relaxed opacity-60">
                                Binding an email is required for advanced security features and priority customer support. 
                                Make sure you have access to the inbox.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
