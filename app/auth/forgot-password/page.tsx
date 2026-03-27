'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const supabase = createClient();
            
            // 1. Tell Supabase to generate the reset link
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (resetError) throw resetError;

            // Note: If you want to use RESEND for this exact email, 
            // you would typically capture the event in a Supabase Hook or 
            // handle it via a custom API if you have a way to generate the token.
            // For now, we'll assume standard flow but with NodeFlow branding.

            setMessage('Identity verification sequence initiated. Please check your inbox for override instructions.');
        } catch (err: any) {
            setError(err.message || 'Failed to initiate recovery protocol.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a1a] py-12">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E34304]/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3DD6C8]/5 rounded-full blur-[120px] animate-pulse delay-700" />

            <div className="w-full max-w-md px-6 z-10">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl mb-4 overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl">
                            <NextImage src="/logo.png" alt="Logo" width={80} height={80} className="object-cover" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white">NodeFlow<span className="text-[#3DD6C8]">.</span></h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/60">Recovery Protocol Activated</p>
                    </div>

                    <Card className="shadow-2xl rounded-[40px] overflow-hidden border-white/5 bg-slate-900/40 backdrop-blur-2xl">
                        <CardHeader className="pt-10 pb-6 text-center">
                            <CardTitle className="text-2xl font-black tracking-tighter text-white uppercase italic">Lost Access?</CardTitle>
                            <CardDescription className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                                Enter your registered email to receive an override token
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-10">
                            {message ? (
                                <div className="p-6 bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 rounded-3xl text-center space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-[#3DD6C8]/20 flex items-center justify-center mx-auto">
                                        <Mail className="text-[#3DD6C8]" size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-white leading-relaxed uppercase tracking-wide">
                                        {message}
                                    </p>
                                    <Link href="/auth/login" className="block text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity pt-2">
                                        Return to Vault
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleResetRequest} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Target Node Email</Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-[#3DD6C8]" />
                                                <Input 
                                                    id="email" 
                                                    type="email" 
                                                    placeholder="agent@nodeflow.io" 
                                                    required 
                                                    className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold placeholder:text-slate-700 focus:border-[#3DD6C8]/50 transition-all"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
                                            <ShieldAlert className="text-red-500 shrink-0" size={16} />
                                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
                                        </div>
                                    )}

                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full h-14 bg-white text-black hover:bg-[#3DD6C8] hover:text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-white/5 active:scale-95"
                                    >
                                        {isLoading ? 'INITIATING...' : 'Request Security Override'}
                                    </Button>

                                    <Link href="/auth/login" className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                                        <ArrowLeft size={14} />
                                        Abort and Return
                                    </Link>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
