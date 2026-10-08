'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, LogIn } from 'lucide-react';

function SignUpSuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [welcomeBonus, setWelcomeBonus] = useState<string>('25');

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const bonus = data.find((s: any) => s.key === 'signup_bonus' || s.key === 'welcome_bonus')?.value;
          if (bonus) setWelcomeBonus(String(bonus));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#0F0F23] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#3DD6C8]/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#E34304]/10 rounded-full blur-[140px] animate-pulse delay-700" />

      <div className="max-w-md w-full relative z-10 text-center space-y-8">
        <div className="bg-[#12122A]/80 backdrop-blur-2xl rounded-[44px] p-8 sm:p-10 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] space-y-6">
          
          {/* Animated Envelope Icon */}
          <div className="w-24 h-24 rounded-3xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 mx-auto flex items-center justify-center relative shadow-[0_0_35px_rgba(61,214,200,0.2)]">
            <Mail className="text-[#3DD6C8] animate-bounce" size={42} />
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
              ✓
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/25 text-[#3DD6C8] text-[9px] font-black uppercase tracking-[0.25em]">
              <ShieldCheck size={12} />
              Activation Link Dispatched
            </div>
            
            <h1 className="text-3xl font-black italic uppercase tracking-tight text-white leading-tight">
              Check Your Inbox
            </h1>

            {email && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-teal-300 font-bold break-all">
                {email}
              </div>
            )}

            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              We have dispatched a secure verification link to your email. Click the link in the message to activate your node and unlock your account.
            </p>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
              🎉 ${welcomeBonus}.00 First User Signup Bonus Reserved
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] text-slate-500 font-medium leading-relaxed text-left space-y-1.5">
            <div className="font-bold text-slate-400 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#3DD6C8]" />
              Quick Instructions:
            </div>
            <p>1. Open your email inbox and look for the confirmation message.</p>
            <p>2. Click the verification button to confirm your identity.</p>
            <p>3. If you don't see it within a minute, please check your spam or junk folder.</p>
          </div>

          <div className="space-y-3 pt-2">
            <Link 
              href="/auth/login"
              className="w-full bg-[#3DD6C8] hover:bg-[#34b7ab] text-slate-950 py-4 rounded-2xl font-black uppercase tracking-[0.25em] text-xs shadow-[0_0_30px_rgba(61,214,200,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <LogIn size={15} />
              <span>Go to Login</span>
            </Link>

            <Link 
              href="/"
              className="w-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white py-3 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] border border-white/10 transition-all flex items-center justify-center"
            >
              Back to Home
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function SignUpSuccess() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0F0F23] flex items-center justify-center p-6 text-white">
        <Mail className="text-[#3DD6C8] animate-pulse" size={40} />
      </main>
    }>
      <SignUpSuccessContent />
    </Suspense>
  );
}
