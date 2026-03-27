'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, ShieldCheck, Zap } from 'lucide-react';
import NextImage from 'next/image';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Protocol conflict: Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            
            const { error: resetError } = await supabase.auth.updateUser({
                password: password
            });

            if (resetError) throw resetError;

            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update security credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a1a] py-12">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3DD6C8]/10 rounded-full blur-[120px] animate-pulse" />
            
            <div className="w-full max-w-md px-6 z-10">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl mb-4 overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl">
                            <NextImage src="/logo.png" alt="Logo" width={80} height={80} className="object-cover" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white">NodeFlow<span className="text-[#3DD6C8]">.</span></h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3DD6C8]/60">Identity Override Matrix</p>
                    </div>

                    <Card className="shadow-2xl rounded-[40px] overflow-hidden border-white/5 bg-slate-900/40 backdrop-blur-2xl">
                        <CardHeader className="pt-10 pb-6 text-center">
                            <CardTitle className="text-2xl font-black tracking-tighter text-white uppercase italic">Define New Credentials</CardTitle>
                            <CardDescription className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                                Choose a high-strength password to re-secure your node
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-10">
                            {success ? (
                                <div className="p-10 text-center space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 flex items-center justify-center mx-auto animate-bounce">
                                        <ShieldCheck className="text-[#3DD6C8]" size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Identity Re-Secured</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                        Security sequence completed. Forwarding to the authentication vault...
                                    </p>
                                    <div className="flex justify-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-[#3DD6C8] animate-ping" />
                                        <div className="w-2 h-2 rounded-full bg-[#3DD6C8] animate-ping delay-100" />
                                        <div className="w-2 h-2 rounded-full bg-[#3DD6C8] animate-ping delay-200" />
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleReset} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="pass" className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">New Password</Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-[#3DD6C8]" />
                                                <Input 
                                                    id="pass" 
                                                    type="password" 
                                                    placeholder="••••••••" 
                                                    required 
                                                    className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold placeholder:text-slate-700 focus:border-[#3DD6C8]/50 transition-all"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="cpass" className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Confirm Password</Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-[#3DD6C8]" />
                                                <Input 
                                                    id="cpass" 
                                                    type="password" 
                                                    placeholder="••••••••" 
                                                    required 
                                                    className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold placeholder:text-slate-700 focus:border-[#3DD6C8]/50 transition-all"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center">{error}</p>
                                        </div>
                                    )}

                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full h-14 bg-[#3DD6C8] text-[#0F172A] hover:bg-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#3DD6C8]/10 active:scale-95 flex gap-2 items-center justify-center"
                                    >
                                        {isLoading ? 'EXECUTING...' : (
                                            <>
                                                <Zap size={16} fill="currentColor" />
                                                Confirm Override
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
