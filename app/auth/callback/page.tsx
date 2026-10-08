'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/index';
import { Zap, ShieldCheck } from 'lucide-react';

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        let isMounted = true;

        const processAuth = async () => {
            const code = searchParams.get('code');
            const tokenHash = searchParams.get('token_hash');
            const type = searchParams.get('type') as any;
            const errorParam = searchParams.get('error_description') || searchParams.get('error');

            if (errorParam) {
                console.error('Auth verification error:', errorParam);
                if (isMounted) {
                    router.replace(`/auth/verify?error=${encodeURIComponent(errorParam)}`);
                }
                return;
            }

            try {
                // 1. If PKCE code is provided
                if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                } 
                // 2. If token_hash and type are provided (standard email confirmation link)
                else if (tokenHash && type) {
                    const { error } = await supabase.auth.verifyOtp({
                        token_hash: tokenHash,
                        type: type || 'signup',
                    });
                    if (error) throw error;
                } 
                // 3. If hash parameters (#access_token=...) were provided, wait a tick for supabase client to capture it
                else {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session && typeof window !== 'undefined' && window.location.hash) {
                        await new Promise(res => setTimeout(res, 800));
                    }
                }

                if (isMounted) {
                    router.replace('/auth/verify?verified=true');
                }
            } catch (err: any) {
                console.error('Auth callback exception:', err);
                if (isMounted) {
                    router.replace(`/auth/verify?error=${encodeURIComponent(err.message || 'Verification link expired or invalid')}`);
                }
            }
        };

        processAuth();

        return () => {
            isMounted = false;
        };
    }, [router, searchParams]);

    return (
        <main className="min-h-screen bg-[#0F0F23] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient cyber glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#3DD6C8]/10 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#E34304]/10 rounded-full blur-[140px] animate-pulse delay-700" />

            <div className="max-w-md w-full relative z-10 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 mx-auto flex items-center justify-center relative shadow-[0_0_40px_rgba(61,214,200,0.2)]">
                    <Zap className="text-[#3DD6C8] animate-pulse" size={36} />
                    <div className="absolute inset-0 border-2 border-t-[#3DD6C8] border-transparent rounded-3xl animate-spin" />
                </div>
                <div>
                    <h1 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">
                        Authenticating Node...
                    </h1>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        Validating Cryptographic Handshake
                    </p>
                </div>
            </div>
        </main>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#0F0F23] flex items-center justify-center p-6 text-white">
                <Zap className="text-[#3DD6C8] animate-pulse" size={40} />
            </main>
        }>
            <CallbackHandler />
        </Suspense>
    );
}
