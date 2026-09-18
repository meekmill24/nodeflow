'use client'
 
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import NextImage from 'next/image'
import { ArrowRight, Sparkles, User, Mail, Lock, UserCheck, ShieldCheck, Share2, Phone, AtSign, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

function SignUpForm() {
    const searchParams = useSearchParams()
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [referral, setReferral] = useState('')
    
    // Step 2 Info
    const [username, setUsername] = useState('')
    const [phone, setPhone] = useState('')
    const [withdrawalPassword, setWithdrawalPassword] = useState('')
    const [confirmWithdrawalPassword, setConfirmWithdrawalPassword] = useState('')
    
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
 
    useEffect(() => {
        const refLink = searchParams.get('ref') || searchParams.get('code')
        if (refLink) {
            setReferral(refLink.toUpperCase())
        }
    }, [searchParams])
 
    const handleNextStep = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (password !== repeatPassword) {
            setError('Passwords do not match')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        // If email is empty (fast-track username sign up), referral code is mandatory
        if (!email.trim()) {
            if (!referral.trim()) {
                setError('Invitation code is required for username-based fast-track registration.')
                return
            }
        }

        // Validate invitation code via server endpoint if entered
        if (referral.trim()) {
            setIsLoading(true)
            try {
                const res = await fetch('/api/auth/verify-referral', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: referral.trim() })
                });
                const data = await res.json();
                if (!res.ok || !data.valid) {
                    setError(data.error || 'Invalid invitation code. Connection refused.');
                    setIsLoading(false);
                    return;
                }
            } catch (err: any) {
                console.error('Referral check error:', err);
                setError('Failed to verify invitation code. Please try again.');
                setIsLoading(false);
                return;
            } finally {
                setIsLoading(false);
            }
        }

        setError(null)
        setStep(2)
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        if (!username.trim()) {
            setError('Username is required')
            setIsLoading(false)
            return
        }
        if (!phone.trim()) {
            setError('Phone number is required')
            setIsLoading(false)
            return
        }
        if (!withdrawalPassword) {
            setError('Withdrawal PIN is required')
            setIsLoading(false)
            return
        }
        if (withdrawalPassword.length !== 6 || !/^\d+$/.test(withdrawalPassword)) {
            setError('Withdrawal PIN must be exactly 6 digits')
            setIsLoading(false)
            return
        }
        if (withdrawalPassword !== confirmWithdrawalPassword) {
            setError('Withdrawal PINs do not match')
            setIsLoading(false)
            return
        }

        try {
            if (!email) {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, phone, withdrawalPassword, referral })
                });
                const apiData = await res.json();
                if (!res.ok) throw new Error(apiData.error || 'Registration failed');

                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: apiData.fakeEmail,
                    password
                });
                if (signInError) throw signInError;

                await fetch('/api/auth/welcome-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: apiData.fakeEmail, username: username || apiData.fakeEmail })
                }).catch(e => console.error('Silent Email Error:', e));
                
                router.push('/home')
            } else {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: email,
                    password,
                    options: {
                        data: {
                            username: username,
                            display_name: username,
                            phone_number: phone,
                            withdrawal_password: withdrawalPassword,
                            referral_code_used: referral
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                })
                if (signUpError) throw signUpError
                
                if (data.user) {
                    await fetch('/api/profile', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, display_name: username, phone_number: phone }),
                    })
                    await fetch('/api/auth/welcome-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email, username: username || email })
                    }).catch(e => console.error('Silent Email Error:', e));
                }
                router.push('/auth/sign-up-success')
            }
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#fafafa] py-12">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#007CBA]/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#007CBA]/5 rounded-full blur-[120px] animate-pulse delay-700" />
            
            <div className="w-full max-w-md px-6 z-10">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-2 overflow-hidden border-2 border-slate-200/50" style={{background: '#0F172A'}}>
                            <NextImage src="/logo.png" alt="Logo" width={64} height={64} className="object-cover" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">SmartBugMedia<span className="text-[#3DD6C8]">.</span></h1>
                        <p className="text-muted-foreground text-sm font-medium tracking-wide">Institutional Distribution Protocol</p>
                    </div>

                    <Card className="glass border-white/40 shadow-2xl rounded-3xl overflow-hidden">
                        <CardHeader className="pt-8 pb-4 text-center">
                            <div className="flex justify-center gap-2 mb-4">
                                <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 1 ? 'bg-[#007CBA]' : 'bg-slate-200'}`} />
                                <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 2 ? 'bg-[#007CBA]' : 'bg-slate-200'}`} />
                            </div>
                            <CardTitle className="text-2xl font-bold text-[#003d5c]">
                                {step === 1 ? 'Step 1: Security' : 'Step 2: Profile'}
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-medium">
                                {step === 1 ? 'Configure your access credentials' : 'Tell us a bit about yourself'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8 overflow-hidden relative">
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 30 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <form onSubmit={handleNextStep} className="space-y-5">
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address (Optional)</Label>
                                                    <div className="relative mt-1.5">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            value={email}
                                                            onChange={(e) => {
                                                                setEmail(e.target.value);
                                                                if (error) setError(null);
                                                            }}
                                                            className={cn(
                                                                "pl-10 h-11 bg-white/50 border-white/50 focus:border-[#007CBA] transition-all rounded-xl text-slate-900 placeholder:text-slate-400",
                                                                email.trim() && (email.includes('@') && email.length >= 5 ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20" : "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20")
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            
                                                <div className="grid gap-2">
                                                    <Label htmlFor="password" title="password-label" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            required
                                                            value={password}
                                                            onChange={(e) => {
                                                                setPassword(e.target.value);
                                                                if (error) setError(null);
                                                            }}
                                                            className={cn(
                                                                "pl-10 h-11 bg-white/50 border-white/50 focus:border-[#007CBA] transition-all rounded-xl text-slate-900",
                                                                password.trim() && (password.length >= 6 ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20" : "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20")
                                                            )}
                                                        />
                                                    </div>
                                                </div>
 
                                                <div className="grid gap-2">
                                                    <Label htmlFor="repeat-password" title="repeat-password-label" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Confirm Password</Label>
                                                    <div className="relative">
                                                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="repeat-password"
                                                            type="password"
                                                            required
                                                            value={repeatPassword}
                                                            onChange={(e) => {
                                                                setRepeatPassword(e.target.value);
                                                                if (error) setError(null);
                                                            }}
                                                            className={cn(
                                                                "pl-10 h-11 bg-white/50 border-white/50 focus:border-[#007CBA] transition-all rounded-xl text-slate-900",
                                                                repeatPassword.trim() && (repeatPassword === password ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20" : "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20")
                                                            )}
                                                        />
                                                    </div>
                                                </div>
 
                                                <div className="grid gap-2">
                                                    <Label htmlFor="referral" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Invitation Code {!email.trim() && <span className="text-rose-500 font-bold">(Required)</span>}</Label>
                                                    <div className="relative">
                                                        <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            id="referral"
                                                            type="text"
                                                            placeholder="Enter invitation code"
                                                            maxLength={8}
                                                            value={referral}
                                                            onChange={(e) => {
                                                                setReferral(e.target.value.toUpperCase());
                                                                if (error) setError(null);
                                                            }}
                                                            className={cn(
                                                                "pl-10 h-11 bg-white/50 border-white/50 focus:border-[#007CBA] transition-all rounded-xl text-slate-900 placeholder:text-slate-400 font-mono",
                                                                referral.trim() ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20" : (!email.trim() ? "border-rose-300/60 focus:border-rose-500" : "")
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
 
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2"
                                                >
                                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                                    <span>{error}</span>
                                                </motion.div>
                                            )}
 
                                            <Button type="submit" className="w-full h-11 premium-gradient text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98] mt-2" disabled={isLoading}>
                                                {isLoading ? <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying invitation...</div> : <div className="flex items-center justify-center gap-2">Continue to Profile <ArrowRight className="w-4 h-4 ml-2" /></div>}
                                            </Button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <form onSubmit={handleSignUp} className="space-y-5">
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Username</Label>
                                                        <div className="relative">
                                                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                            <Input
                                                                id="username"
                                                                type="text"
                                                                placeholder="johndoe"
                                                                required
                                                                value={username}
                                                                onChange={(e) => {
                                                                    setUsername(e.target.value);
                                                                    if (error) setError(null);
                                                                }}
                                                                className={cn(
                                                                    "pl-10 h-11 bg-white/50 border-white/50 focus:border-[#007CBA] transition-all rounded-xl text-slate-900",
                                                                    username.trim() && (username.length >= 3 ? "border-emerald-500/50 focus:border-emerald-500" : "border-rose-500/50 focus:border-rose-500")
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Phone</Label>
                                                        <div className="relative">
                                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                            <Input
                                                                id="phone"
                                                                type="tel"
                                                                placeholder="+1..."
                                                                required
                                                                value={phone}
                                                                onChange={(e) => {
                                                                    setPhone(e.target.value);
                                                                    if (error) setError(null);
                                                                }}
                                                                className={cn(
                                                                    "pl-10 h-11 bg-white/50 border-white/50 focus:border-[#007CBA] transition-all rounded-xl text-slate-900",
                                                                    phone.trim() && (phone.length >= 6 ? "border-emerald-500/50 focus:border-emerald-500" : "border-rose-500/50 focus:border-rose-500")
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="withdrawal-password" title="withdrawal-password-label" className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Withdrawal PIN (6-digit)</Label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                            <Input
                                                                id="withdrawal-password"
                                                                type="password"
                                                                required
                                                                placeholder="6-digit"
                                                                maxLength={6}
                                                                value={withdrawalPassword}
                                                                onChange={(e) => {
                                                                    setWithdrawalPassword(e.target.value);
                                                                    if (error) setError(null);
                                                                }}
                                                                className={cn(
                                                                    "pl-10 h-11 bg-white/50 border-white/50 focus:border-[#007CBA] transition-all rounded-xl text-slate-900",
                                                                    withdrawalPassword.trim() && (withdrawalPassword.length === 6 && /^\d+$/.test(withdrawalPassword) ? "border-emerald-500/50 focus:border-emerald-500" : "border-rose-500/50 focus:border-rose-500")
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="confirm-withdrawal" title="confirm-withdrawal-label" className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Confirm PIN</Label>
                                                        <div className="relative">
                                                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                            <Input
                                                                id="confirm-withdrawal"
                                                                type="password"
                                                                required
                                                                value={confirmWithdrawalPassword}
                                                                onChange={(e) => {
                                                                    setConfirmWithdrawalPassword(e.target.value);
                                                                    if (error) setError(null);
                                                                }}
                                                                className={cn(
                                                                    "pl-10 h-11 bg-white/50 border-white/50 focus:border-[#007CBA] transition-all rounded-xl text-slate-900",
                                                                    confirmWithdrawalPassword.trim() && (confirmWithdrawalPassword === withdrawalPassword ? "border-emerald-500/50 focus:border-emerald-500" : "border-rose-500/50 focus:border-rose-500")
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
 
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2"
                                                >
                                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                                    <span>{error}</span>
                                                </motion.div>
                                            )}
 
                                            <div className="flex gap-3">
                                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl font-bold border-slate-200" disabled={isLoading}>
                                                    Back
                                                </Button>
                                                <Button type="submit" title="signup-button" className="flex-[2] h-11 premium-gradient text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]" disabled={isLoading}>
                                                    {isLoading ? <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Finalizing...</div> : <div className="flex items-center justify-center gap-2">Complete Setup <UserCheck className="w-4 h-4" /></div>}
                                                </Button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <div className="mt-8 text-center">
                                <p className="text-sm text-slate-500 font-medium">Already have an account? <Link href="/auth/login" className="text-[#007CBA] font-bold hover:underline">Log in here</Link></p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div className="text-center pt-4">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 SmartBugMedia. Platform</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafafa]"><div className="w-8 h-8 border-4 border-[#007CBA] border-t-transparent rounded-full animate-spin" /></div>}>
            <SignUpForm />
        </Suspense>
    )
}
