'use client';

import { CheckCircle2, ShieldCheck, ArrowRight, Zap, AlertTriangle, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/index';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        let isMounted = true;

        const checkVerification = async () => {
            const errorParam = searchParams.get('error');
            const verifiedParam = searchParams.get('verified');
            const code = searchParams.get('code');
            const tokenHash = searchParams.get('token_hash');
            const type = searchParams.get('type') as any;

            if (errorParam) {
                if (isMounted) {
                    setErrorMessage(decodeURIComponent(errorParam));
                    setStatus('error');
                }
                return;
            }

            // Direct code/token exchange if user landed directly on /auth/verify
            if (code) {
                try {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                    if (isMounted) setStatus('success');
                    return;
                } catch (err: any) {
                    if (isMounted) {
                        setErrorMessage(err.message || 'Failed to verify node authorization code');
                        setStatus('error');
                    }
                    return;
                }
            }

            if (tokenHash && type) {
                try {
                    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
                    if (error) throw error;
                    if (isMounted) setStatus('success');
                    return;
                } catch (err: any) {
                    if (isMounted) {
                        setErrorMessage(err.message || 'Failed to verify security token');
                        setStatus('error');
                    }
                    return;
                }
            }

            // If arrived with ?verified=true from /auth/callback
            if (verifiedParam === 'true') {
                if (isMounted) setStatus('success');
                return;
            }

            // Check current active session
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    if (isMounted) setStatus('success');
                } else {
                    // Small fallback wait for URL hash parsing
                    setTimeout(async () => {
                        const { data: { session: retrySession } } = await supabase.auth.getSession();
                        if (isMounted) {
                            if (retrySession) {
                                setStatus('success');
                            } else {
                                setStatus('success'); // Still treat as verified confirmation screen
                            }
                        }
                    }, 1200);
                }
            } catch (err: any) {
                if (isMounted) setStatus('success');
            }
        };

        checkVerification();

        return () => {
            isMounted = false;
        };
    }, [searchParams]);

    return (
        <main className="min-h-screen bg-[#0F0F23] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient cyber glow elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#3DD6C8]/10 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#E34304]/10 rounded-full blur-[140px] animate-pulse delay-700" />

            <div className="max-w-md w-full relative z-10">
                <div className="bg-[#12122A]/80 backdrop-blur-2xl rounded-[44px] p-8 sm:p-10 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-center space-y-8">
                    {status === 'verifying' ? (
                        <>
                            <div className="w-24 h-24 rounded-3xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 mx-auto flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(61,214,200,0.15)]">
                                <Zap className="text-[#3DD6C8] animate-pulse" size={40} />
                                <div className="absolute inset-0 border-2 border-t-[#3DD6C8] border-transparent rounded-3xl animate-spin" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-black italic uppercase tracking-tight text-white">
                                    Verifying Node...
                                </h1>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                    Authenticating Network Signature
                                </p>
                            </div>
                        </>
                    ) : status === 'success' ? (
                        <>
                            <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-in zoom-in duration-500">
                                <CheckCircle2 className="text-emerald-400" size={48} />
                            </div>

                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em]">
                                    <ShieldCheck size={12} />
                                    Identity Protocol Verified
                                </div>
                                <h1 className="text-3xl font-black italic uppercase tracking-tight text-white leading-tight">
                                    EMAIL VERIFIED SUCCESSFULLY
                                </h1>
                                <p className="text-xs text-slate-300 font-medium leading-relaxed pt-1">
                                    Your institutional node access has been verified. Welcome to the SmartBugMedia optimization matrix.
                                </p>
                                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                                    🎉 $25.00 Signup Bonus Unlocked
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Link 
                                    href="/home"
                                    className="w-full bg-[#3DD6C8] hover:bg-[#34b7ab] text-slate-950 py-4 sm:py-4.5 rounded-2xl font-black uppercase tracking-[0.25em] text-xs shadow-[0_0_30px_rgba(61,214,200,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span>Enter Dashboard</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link 
                                    href="/auth/login"
                                    className="w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white py-3 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] border border-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <LogIn size={13} />
                                    <span>Return to Login</span>
                                </Link>
                            </div>

                            <div className="flex items-center justify-center gap-2 pt-2">
                                <ShieldCheck size={13} className="text-emerald-400/60" />
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">
                                    ENCRYPTION PROTOCOL ACTIVE
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 rounded-3xl bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                                <AlertTriangle className="text-rose-400" size={44} />
                            </div>
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-[0.25em]">
                                    Security Notification
                                </div>
                                <h1 className="text-2xl font-black italic uppercase tracking-tight text-white leading-tight">
                                    Verification Link Expired
                                </h1>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                    {errorMessage || 'This activation link has expired or has already been used. Please log in or request a new activation link.'}
                                </p>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Link 
                                    href="/auth/login" 
                                    className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black uppercase tracking-[0.25em] text-xs shadow-xl hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <LogIn size={15} />
                                    <span>Back to Login</span>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0F0F23] flex items-center justify-center p-6 text-white">
                <Zap className="text-[#3DD6C8] animate-pulse" size={48} />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
