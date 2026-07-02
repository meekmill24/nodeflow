'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Testimonials } from '@/components/landing/testimonials';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  TrendingUp,
  Lock,
  ArrowUpRight,
  Trophy,
  Menu,
  X,
  Play,
  Layers,
  Activity,
  Cpu,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  Wallet,
  Users,
  Clock,
  Phone,
  Eye,
  Banknote,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentNotification, setCurrentNotification] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sandbox Simulator State
  const [sandboxState, setSandboxState] = useState<'idle' | 'running' | 'success' | 'complete'>('idle');
  const [sandboxBalance, setSandboxBalance] = useState<number>(0.00);
  const [sandboxTasks, setSandboxTasks] = useState<number>(0);
  const [sandboxProgress, setSandboxProgress] = useState<number>(0);
  const [sandboxLog, setSandboxLog] = useState<string>('SYSTEM PORTAL: STANDBY');

  const runSandboxTask = () => {
    if (sandboxState === 'running' || sandboxState === 'complete') return;
    setSandboxState('running');
    setSandboxProgress(0);

    const logs = [
      'Establishing secure node handshake...',
      'Mapping cloud product API endpoints...',
      'Optimizing query latency and rating logs...',
      'Executing task verification signature...',
      'Writing yield block to ledger matrix...'
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      setSandboxProgress(prev => {
        const nextProgress = prev + 5;
        if (nextProgress % 20 === 0 && currentStep < logs.length) {
          setSandboxLog(logs[currentStep]);
          currentStep++;
        }
        if (nextProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            const nextTasks = sandboxTasks + 1;
            const nextBal = sandboxBalance + 0.75;
            setSandboxBalance(nextBal);
            setSandboxTasks(nextTasks);
            if (nextTasks >= 3) {
              setSandboxState('complete');
              setSandboxLog('SANDBOX SIMULATION COMPLETE - TOTAL YIELD: $2.25');
            } else {
              setSandboxState('success');
              setSandboxLog(`Task #${nextTasks} complete. Yield: +$0.75 generated.`);
            }
          }, 400);
          return 100;
        }
        return nextProgress;
      });
    }, 100);
  };

  const resetSandbox = () => {
    setSandboxState('idle');
    setSandboxBalance(0);
    setSandboxTasks(0);
    setSandboxProgress(0);
    setSandboxLog('SYSTEM PORTAL: STANDBY');
  };

  const mockNotifications = [
    { name: 'Sandra K.', action: 'withdrew', amount: '$340.00', coin: 'USDT', time: 'Just now' },
    { name: 'Zara M.', action: 'earned commission', amount: 'LV3 tier', coin: '+$45.20', time: '1m ago' },
    { name: 'Kweku A.', action: 'withdrew', amount: '$1,200.00', coin: 'ETH', time: '3m ago' },
    { name: 'Marcus T.', action: 'completed tasks', amount: 'LV5 tier', coin: '+$180.50', time: '4m ago' },
    { name: 'Priya S.', action: 'registered new agent', amount: 'welcome bonus', coin: '+$25.00', time: '5m ago' },
  ];

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    const interval = setInterval(() => {
      setCurrentNotification(prev => (prev + 1) % mockNotifications.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-title-part', {
        y: 80,
        opacity: 0,
        rotateX: -20,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.15,
      });
      gsap.from('.hero-sub', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out',
      });
      gsap.from('.hero-cta', {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        ease: 'back.out(1.7)',
      });
      gsap.from('.float-card', {
        y: 40,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.hero-section', start: 'top 60%' },
      });
      gsap.utils.toArray('.section-header').forEach((header: any) => {
        gsap.from(header, {
          y: 40,
          opacity: 0,
          duration: 1,
          scrollTrigger: { trigger: header, start: 'top 85%' },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  const stats = [
    { label: 'ACTIVE AGENTS', value: '124K+', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', border: 'hover:border-blue-500/30' },
    { label: 'LIQUIDITY DEPLOYED', value: '$920M+', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', border: 'hover:border-emerald-500/30' },
    { label: 'DAILY YIELD RATE', value: '+1.0%', icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', border: 'hover:border-violet-500/30' },
    { label: 'PAYOUT TIME', value: '<30min', icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', border: 'hover:border-cyan-500/30' },
  ];

  const operationalSteps = [
    {
      id: '01',
      title: 'Register & Verify',
      desc: 'Create your agent account in under 2 minutes. No KYC required. Connect directly to the SmartBugMedia global matrix.',
      icon: Lock,
      color: 'blue',
      accent: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      id: '02',
      title: 'Fund & Activate',
      desc: 'Deposit USDT, ETH, or BTC to activate your node tier. Minimum deposit of just $30 to get started instantly.',
      icon: Zap,
      color: 'cyan',
      accent: 'from-cyan-500/20 to-indigo-500/20',
    },
    {
      id: '03',
      title: 'Execute & Earn',
      desc: 'Run daily optimization tasks. Commissions credit to your wallet immediately. Withdraw anytime, 24/7.',
      icon: Trophy,
      color: 'violet',
      accent: 'from-indigo-500/20 to-violet-500/20',
    },
  ];

  const tiers = [
    { name: 'JUNIOR AGENT', price: '100', yield: '0.4%', tasks: '40', daily: '$0.40', features: ['Standard Node Access', 'Daily Optimization Cycle', 'Basic Referral Tier'] },
    { name: 'INTERMEDIATE AGENT', price: '500', yield: '0.6%', tasks: '45', daily: '$3.00', features: ['Priority Node Access', 'Extended Audit Logs', 'Enhanced Referral Rate'] },
    { name: 'SENIOR AGENT', price: '1,500', yield: '0.8%', tasks: '50', daily: '$12.00', features: ['Multi-Node Sharding', 'Institutional Vault Access', 'VIP Commission Boost'], popular: true },
    { name: 'MASTER AGENT', price: '5,000', yield: '1.0%', tasks: '55', daily: '$50.00', features: ['Unlimited Node Scaling', 'Quantum Settlement Security', 'Governance Access'] },
  ];

  const whyCards = [
    {
      icon: Zap,
      emoji: '⚡',
      title: 'Instant Payouts',
      desc: 'No waiting 3-5 business days. Finish a task, see it in your wallet. Withdraw when you want — not when we feel like it.',
      accent: 'from-cyan-500/20 to-blue-500/20',
      border: 'hover:border-cyan-500/30',
      tag: 'Most loved feature',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      size: 'col-span-1 md:col-span-2 lg:col-span-2',
      featured: true,
    },
    {
      icon: Lock,
      emoji: '🔒',
      title: 'Your Money, Your Rules',
      desc: 'No hidden fees, no surprise deductions. What you earn is what you keep. Period.',
      accent: 'from-indigo-500/20 to-violet-500/20',
      border: 'hover:border-indigo-500/30',
      size: 'col-span-1',
    },
    {
      icon: Phone,
      emoji: '📱',
      title: 'Works on Any Device',
      desc: 'Lightweight and fast — even on budget phones with slow connections.',
      accent: 'from-emerald-500/20 to-cyan-500/20',
      border: 'hover:border-emerald-500/30',
      size: 'col-span-1',
    },
    {
      icon: Users,
      emoji: '🤝',
      title: 'Real Support, Real People',
      desc: 'Got a question at 2am? Someone is actually there. Not a bot. A person who knows what they\'re doing.',
      accent: 'from-amber-500/20 to-orange-500/20',
      border: 'hover:border-amber-500/30',
      size: 'col-span-1',
    },
    {
      icon: TrendingUp,
      emoji: '📈',
      title: 'Earn While You Sleep',
      desc: 'Your referrals keep earning for you. Every task they complete puts a commission in your pocket — automatically, forever.',
      accent: 'from-violet-500/20 to-pink-500/20',
      border: 'hover:border-violet-500/30',
      tag: '20% referral rate',
      tagColor: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
      size: 'col-span-1 md:col-span-2 lg:col-span-2',
      featured: true,
    },
    {
      icon: Eye,
      emoji: '🛡️',
      title: 'Transparent from Day One',
      desc: 'Every transaction logged. Every bonus calculated in the open. You can see exactly where every cent goes.',
      accent: 'from-blue-500/20 to-indigo-500/20',
      border: 'hover:border-blue-500/30',
      size: 'col-span-1',
    },
  ];

  const faqs = [
    {
      q: 'How do I start earning?',
      a: 'Simply register an account, log in, and top up your secure balance using USDT, ETH, or BTC. Once funded, access the agent terminal to run optimization tasks. Daily earnings are added to your wallet immediately.',
    },
    {
      q: 'What are the minimum deposit and withdrawal amounts?',
      a: 'You can start with a minimum deposit of just $30. The minimum withdrawal is only $10. Withdrawals are processed immediately and usually hit your external crypto wallet within 5 to 30 minutes.',
    },
    {
      q: 'How does the referral commission model work?',
      a: 'Instead of a simple one-off signup bonus, you earn commissions from every single task or bundle completed by anyone you invite. The commission rate defaults to 20% of their task reward and is paid directly to your balance, forever.',
    },
    {
      q: 'Can I upgrade my agent VIP level at any time?',
      a: 'Yes! Meeting the deposit requirement automatically upgrades your status level. Higher VIP tiers grant access to more lucrative tasks, higher daily task limits, and accelerated payout velocities.',
    },
    {
      q: 'Are there any secret fees or platform charges?',
      a: 'None. We value clean transparency. There are no registration fees, platform rental charges, or maintenance deductions. The yield you make is entirely yours to keep.',
    },
    {
      q: 'How quickly can I withdraw my earnings?',
      a: 'Withdrawals are available 24/7 with a minimum of $10. Once submitted, funds typically arrive in your external crypto wallet within 5 to 30 minutes — no queues, no business-day restrictions.',
    },
  ];

  if (!mounted) return null;

  return (
    <main
      className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/40 selection:text-cyan-100 overflow-x-hidden"
      ref={containerRef}
    >
      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03]" />
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-blue-600/10 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 blur-[180px] rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyan-600/[0.03] blur-[200px] rounded-full" />
      </div>

      <div className="relative z-10">

        {/* ══════════════════════════════════════════
            NAV — Glassmorphism sticky
        ══════════════════════════════════════════ */}
        <nav className="sticky top-0 z-50 px-6 py-4 lg:px-12 backdrop-blur-xl border-b border-white/5 bg-slate-950/60">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center p-1.5 shadow-lg shadow-cyan-500/20 overflow-hidden transition-transform group-hover:scale-110">
                <Image src="/logo.png" alt="SmartBugMedia Logo" width={24} height={24} />
              </div>
              <span className="text-2xl font-black tracking-tight text-white italic">
                SmartBugMedia<span className="text-cyan-500">.</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {['Protocol', 'Ecosystem', 'Nodes', 'Members', 'FAQ'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-500 transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="hidden sm:block">
                <button className="px-6 py-2.5 rounded-xl border border-white/10 text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/sign-up">
                <button className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all">
                  Access Hub
                </button>
              </Link>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[65px] z-40 bg-slate-950/95 backdrop-blur-xl border-b border-white/5 px-6 py-8">
            <div className="flex flex-col gap-6">
              {['Protocol', 'Ecosystem', 'Nodes', 'Members', 'FAQ'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-300 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
                >
                  {item}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-2" />
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-6 py-3 rounded-xl border border-white/10 text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-slate-300">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/sign-up" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 text-sm font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all">
                  Access Hub
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            HERO — Ultra Premium
        ══════════════════════════════════════════ */}
        <section className="hero-section relative pt-20 pb-32 lg:pt-32 lg:pb-48 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20 relative z-10">
            {/* Left — Copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="hero-sub inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.15)] text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                </span>
                Institutional Node Protocol v2.5 — Live
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8 drop-shadow-2xl">
                <div className="hero-title-part text-white">STRATEGIC</div>
                <div className="hero-title-part text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">DYNAMIC</div>
                <div className="hero-title-part text-white flex items-center justify-center lg:justify-start gap-3">
                  NODES
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-cyan-500 rounded-full mt-2 lg:mt-4 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                </div>
              </h1>

              <p className="hero-sub max-w-xl mx-auto lg:mx-0 text-slate-300 text-lg font-medium mb-10 leading-relaxed border-l-[3px] border-indigo-500/50 pl-6">
                The definitive institutional distribution matrix. Synchronize your liquidity across high-fidelity nodes for optimized daily returns — withdraw in under 30 minutes.
              </p>

              <div className="hero-cta flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start mb-10">
                <Link href="/auth/sign-up" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-4 bg-cyan-500 text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3">
                    Start Earning Now <ArrowUpRight size={16} />
                  </button>
                </Link>
                <Link href="/home" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 border border-white/15 rounded-2xl font-bold text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3">
                    <Play size={14} fill="currentColor" /> View Dashboard
                  </button>
                </Link>
              </div>

              {/* Social proof row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-[#020617] bg-slate-800 overflow-hidden shadow-lg">
                        <img src={`https://i.pravatar.cc/100?u=ag${i}`} alt="agent" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">124K+ Active Agents</p>
                    <p className="text-slate-500 text-xs">across 40+ countries</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block" />
                <div className="text-left">
                  <p className="text-white font-bold text-sm">$920M+ Deployed</p>
                  <p className="text-slate-500 text-xs">in active liquidity</p>
                </div>
              </div>
            </div>

            {/* Right — Dashboard Preview */}
            <div className="flex-1 relative w-full max-w-xl mt-12 lg:mt-0">
              <div className="relative rounded-[32px] border border-white/15 border-b-white/5 bg-slate-900/60 backdrop-blur-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.7)] p-6">
                {/* Window chrome */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase">agent_dashboard_v2.5</span>
                  <div className="ml-auto flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Balance card */}
                  <div className="float-card p-5 rounded-2xl bg-gradient-to-r from-cyan-600/20 to-indigo-600/20 border border-cyan-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Wallet Balance</p>
                      <p className="text-3xl font-black text-white tracking-tight">$14,280<span className="text-slate-500 text-lg">.00</span></p>
                      <p className="text-[11px] text-emerald-400 font-bold mt-1">↑ +$168.00 today</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Wallet size={28} />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="float-card grid grid-cols-3 gap-3">
                    {[
                      { label: 'Tasks Done', value: '42/50', color: 'text-white' },
                      { label: 'Today Yield', value: '+$12.50', color: 'text-emerald-400' },
                      { label: 'Referrals', value: '14 active', color: 'text-cyan-400' },
                    ].map((s, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-center">
                        <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Node status */}
                  <div className="float-card flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/20 flex items-center justify-center text-violet-400">
                        <Activity size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">NODE_X_774 — SENIOR</p>
                        <p className="text-[10px] text-slate-500">Optimization cycle active</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-black text-sm">0.8%</p>
                      <p className="text-[9px] text-slate-600 uppercase tracking-widest">Daily yield</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="float-card px-4 py-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest">
                      <span>Daily Tasks Progress</span>
                      <span className="text-white">42 / 50</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[84%] bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-slate-900 border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">Payout Sent</p>
                  <p className="text-white font-bold text-sm">+$340.00 USDT</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TICKER — Scrolling trust bar
        ══════════════════════════════════════════ */}
        <div className="border-y border-white/5 bg-slate-950/50 overflow-hidden py-4 relative">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none" />
          <div className="flex w-max gap-12 animate-[ticker_30s_linear_infinite] whitespace-nowrap">
            {[...Array(3)].map((_, r) =>
              ['⚡ Instant Withdrawals', '🌍 124,000+ Active Agents', '🔒 Zero Platform Fees', '💰 Earn Up To 1.0% Daily', '🚀 Withdraw in Under 30 Minutes', '🤝 20% Referral Commissions', '📱 Works on Any Device', '✅ Transparent & Verified'].map((item, i) => (
                <span key={`${r}-${i}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {item}
                </span>
              ))
            )}
          </div>
          <style jsx>{`
            @keyframes ticker {
              from { transform: translateX(0); }
              to { transform: translateX(-33.333%); }
            }
          `}</style>
        </div>

        {/* ══════════════════════════════════════════
            STATS — 4-column metrics grid
        ══════════════════════════════════════════ */}
        <section id="protocol" className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className={cn('group relative p-6 lg:p-8 rounded-[28px] bg-slate-900/40 border border-white/5 overflow-hidden transition-all hover:scale-[1.02]', stat.border)}>
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <stat.icon size={80} />
                </div>
                <div className={cn('inline-flex p-2.5 rounded-xl border mb-4', stat.bg, stat.color)}>
                  <stat.icon size={20} />
                </div>
                <h3 className="text-3xl lg:text-4xl font-black italic tracking-tighter mb-1">{stat.value}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            WHY CHOOSE — Bento Grid
        ══════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 py-24 max-w-7xl mx-auto border-t border-white/5">
          <div className="section-header text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Built Different
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4 text-white">
              Why people choose<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">SmartBugMedia</span>
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              We&apos;re not the first platform out there. But there&apos;s a reason people stay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {whyCards.map((card, i) => (
              <div
                key={i}
                className={cn(
                  'group relative p-7 rounded-[28px] bg-slate-900/40 border border-white/5 transition-all duration-300 flex flex-col',
                  card.border,
                  card.size
                )}
              >
                <div className={cn('absolute inset-0 rounded-[28px] bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none', card.accent)} />
                <div className="relative z-10 flex flex-col h-full">
                  {card.tag && (
                    <span className={cn('inline-flex self-start items-center px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest mb-4', card.tagColor)}>
                      {card.tag}
                    </span>
                  )}
                  <div className="text-4xl mb-4">{card.emoji}</div>
                  <h3 className={cn('font-black text-white mb-2 tracking-tight', card.featured ? 'text-2xl' : 'text-xl')}>
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS — 3 Steps
        ══════════════════════════════════════════ */}
        <section id="ecosystem" className="px-6 lg:px-12 py-28 max-w-7xl mx-auto border-t border-white/5">
          <div className="section-header text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Simple System Protocol
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">HOW IT WORKS</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-[80px] left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            {operationalSteps.map((step, i) => (
              <div key={i} className="group relative flex flex-col items-center text-center">
                {/* Icon circle */}
                <div className="relative mb-8">
                  <div className={cn(
                    'w-28 h-28 rounded-[36px] bg-slate-900 border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(6,182,212,0.15)]',
                  )}>
                    <step.icon
                      size={44}
                      className={step.color === 'blue' ? 'text-blue-400' : step.color === 'cyan' ? 'text-cyan-400' : 'text-violet-400'}
                    />
                  </div>
                  <span className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black italic text-slate-500 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
                    {step.id}
                  </span>
                </div>

                {/* Content */}
                <div className={cn(
                  'w-full p-7 rounded-[28px] border border-white/5 bg-gradient-to-b transition-all group-hover:border-white/10',
                  step.accent,
                )}>
                  <h4 className="text-xl font-black italic tracking-tight uppercase mb-3 text-white">{step.title}</h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SANDBOX SIMULATOR
        ══════════════════════════════════════════ */}
        <section id="sandbox" className="px-6 lg:px-12 py-24 max-w-5xl mx-auto border-t border-white/5 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

          <div className="section-header text-center mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Interactive Demo
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight text-white mb-3">
              TEST DRIVE THE TERMINAL
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Experience how easy it is to optimize datasets and collect commissions. Run the simulated task node below.
            </p>
          </div>

          <div className="relative z-10 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 md:p-10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full pointer-events-none" />

            {/* Console header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase">AGENT_SANDBOX_SHELL v1.0.4</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  TASKS: <span className="text-cyan-400">{sandboxTasks}/3</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  YIELD: <span className="text-emerald-400 font-mono">${sandboxBalance.toFixed(2)}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Console body */}
              <div className="md:col-span-2 flex flex-col justify-between bg-slate-950/80 border border-white/5 rounded-2xl p-6 min-h-[240px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex gap-2 text-slate-500"><span>›</span><span>INITIALIZE guest_session_probe...</span></div>
                  <div className="flex gap-2 text-slate-500"><span>›</span><span>BIND host_network to SmartBugMedia grid...</span></div>
                  <div className="flex gap-2 text-cyan-400 font-bold animate-pulse">
                    <span>›</span><span>STATUS: {sandboxState.toUpperCase()}</span>
                  </div>
                  <div className="flex gap-2 text-slate-300 border-l-2 border-cyan-500/30 pl-3 py-1 my-2">
                    <span className="text-cyan-400 animate-pulse">■</span>
                    <span className="italic">{sandboxLog}</span>
                  </div>
                  {sandboxState === 'running' && (
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>OPTIMIZING DATASET BUNDLE...</span>
                        <span>{sandboxProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                          style={{ width: `${sandboxProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                  {sandboxState === 'complete' ? (
                    <button
                      onClick={resetSandbox}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider text-slate-400"
                    >
                      Reset Sandbox
                    </button>
                  ) : (
                    <button
                      onClick={runSandboxTask}
                      disabled={sandboxState === 'running'}
                      className={cn(
                        'w-full sm:w-auto px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2',
                        sandboxState === 'running'
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-cyan-500 text-slate-950 shadow-cyan-500/20 hover:scale-105 active:scale-95'
                      )}
                    >
                      {sandboxState === 'running' ? (
                        <><RefreshCw className="animate-spin" size={14} /> Running Node...</>
                      ) : (
                        <><Cpu size={14} />{sandboxTasks === 0 ? 'Initialize Demo Task' : 'Run Next Demo Task'}</>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Rewards info panel */}
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl rounded-full pointer-events-none" />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Node Rewards</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-5">
                    Each task generates <strong className="text-emerald-400">$0.75 USDT</strong> in demo yield.
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: 'Node Pool', value: 'DEMO_POOL_ALPHA', valueClass: 'text-white' },
                      { label: 'Per Task', value: '$0.75 USDT', valueClass: 'text-emerald-400' },
                      { label: 'Uptime', value: '100% SECURE', valueClass: 'text-cyan-400' },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{row.label}</span>
                        <span className={cn('text-xs font-bold', row.valueClass)}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/5">
                  {sandboxState === 'complete' ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">Sandbox Complete</p>
                      <p className="text-[9px] text-slate-400 leading-snug">Sign up to deploy real nodes.</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      <span>Ready for agent input...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Completion overlay */}
            {sandboxState === 'complete' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-[32px]"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
                  <Trophy size={32} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase mb-2">
                  CONGRATULATIONS AGENT!
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
                  You executed all 3 optimization cycles and generated <strong className="text-emerald-400">$2.25 USDT</strong> in demo commissions.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                  <Link href="/auth/sign-up" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 bg-cyan-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all">
                      Claim Real Earnings
                    </button>
                  </Link>
                  <button
                    onClick={resetSandbox}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TIER GRID — Node Plans
        ══════════════════════════════════════════ */}
        <section id="nodes" className="px-6 lg:px-12 py-28 bg-slate-950/40 relative border-t border-white/5">
          <div className="absolute inset-0 bg-[url('/dots.svg')] opacity-[0.04]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="section-header flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  Node Tiers
                </div>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-3 leading-none">VERIFIED NODES</h2>
                <p className="text-cyan-500 text-xs font-black uppercase tracking-[0.4em]">DISTRIBUTION TIERS & YIELD MATRIX</p>
              </div>
              <p className="max-w-md text-slate-500 text-sm italic font-medium">
                Select your institutional tier. Higher frequency nodes offer accelerated distribution cycles and premium audit features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier, i) => (
                <div
                  key={i}
                  className={cn(
                    'relative flex flex-col p-8 rounded-[40px] border transition-all hover:scale-[1.02] duration-500',
                    tier.popular
                      ? 'bg-slate-900 border-indigo-500/40 shadow-2xl shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-white/5 hover:border-white/10'
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-indigo-500 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30">
                      Most Active
                    </div>
                  )}

                  <h5 className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-600 mb-2">{tier.name}</h5>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black italic tracking-tighter">${tier.price}</span>
                    <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest ml-1">deposit</span>
                  </div>
                  <p className="text-emerald-400 text-xs font-bold mb-6">~${tier.daily}/day at {tier.yield} daily</p>

                  <div className="space-y-3 mb-8 pb-7 border-b border-white/5">
                    {[
                      { k: 'Daily Yield', v: tier.yield, vc: 'text-cyan-400' },
                      { k: 'Daily Limit', v: `${tier.tasks} Tasks`, vc: 'text-white' },
                    ].map(row => (
                      <div key={row.k} className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{row.k}</span>
                        <span className={cn('font-black italic text-sm', row.vc)}>{row.v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-10 flex-1">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-center gap-2.5 text-slate-400 text-[11px] font-medium">
                        <CheckCircle2 size={12} className="text-emerald-500/70 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <Link href="/home">
                    <button className={cn(
                      'w-full py-4 rounded-[20px] font-black text-[11px] uppercase tracking-[0.25em] transition-all',
                      tier.popular
                        ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    )}>
                      Initialize Node
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECURITY — Quantum Shield
        ══════════════════════════════════════════ */}
        <section id="security" className="px-6 lg:px-12 py-32 max-w-7xl mx-auto overflow-hidden border-t border-white/5">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-[56px] border border-white/5 p-10 lg:p-20 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Security Infrastructure
                </div>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85] mb-10">
                  QUANTUM <br />
                  <span className="text-cyan-500">SECURITY</span>
                </h2>
                <p className="text-slate-400 text-base font-medium mb-10 leading-relaxed">
                  SmartBugMedia uses a multi-layered verification consensus to ensure all agent distribution remains synchronized and secure across global gateways.
                </p>

                <div className="space-y-8">
                  {[
                    { title: 'Ledger Consensus', desc: 'Immutable distribution logging for 100% transparency.', icon: Layers },
                    { title: 'Multi-Sig Vaults', desc: 'Deep liquidity storage protected by institutional encryption.', icon: Lock },
                    { title: 'Neural Auditing', desc: 'Real-time AI monitoring for task optimization efficiency.', icon: Cpu },
                  ].map((f, i) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
                        <f.icon size={20} />
                      </div>
                      <div>
                        <h5 className="text-base font-black italic uppercase tracking-tight text-white mb-1">{f.title}</h5>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="aspect-square relative w-full max-w-sm rounded-[48px] bg-slate-950 border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                  </div>
                  <div className="w-4/5 h-4/5 rounded-full border border-dashed border-cyan-500/20 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-full border border-indigo-500/20 animate-[spin_12s_linear_infinite_reverse]" />
                  </div>
                  <ShieldCheck className="absolute text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]" size={100} strokeWidth={1.2} />

                  {/* Corner badges */}
                  {['256-bit AES', 'TLS 1.3', 'Zero-Knowledge', 'Multi-Sig'].map((label, i) => {
                    const positions = ['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'];
                    return (
                      <div key={i} className={`absolute ${positions[i]} px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-[9px] font-black uppercase tracking-wider text-slate-400`}>
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════ */}
        <div id="members" className="border-t border-white/5">
          <Testimonials />
        </div>

        {/* ══════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════ */}
        <section id="faq" className="px-6 lg:px-12 py-28 max-w-4xl mx-auto border-t border-white/5">
          <div className="section-header text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Frequently Asked
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">Got Questions?</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Everything you need to know about SmartBugMedia — the node network and how to secure your daily yields.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-white text-base focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className={`text-cyan-400 transition-transform duration-300 ml-4 shrink-0 ${activeFaq === idx ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                <div className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === idx ? 'max-h-64 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FINAL CTA — White block
        ══════════════════════════════════════════ */}
        <section className="px-6 lg:px-12 pb-28 max-w-7xl mx-auto">
          <div className="relative rounded-[64px] bg-white p-14 lg:p-28 text-center text-slate-950 overflow-hidden">
            {/* Subtle texture */}
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

            <div className="relative z-10 space-y-8">
              <div className="inline-flex px-5 py-2 rounded-full bg-slate-950/5 border border-slate-950/10 text-[10px] font-black uppercase tracking-[0.4em]">
                Ready to synchronize?
              </div>

              <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold italic tracking-tighter uppercase leading-[0.85]">
                JOIN THE <br />
                <span className="text-indigo-600">NODE MATRIX</span>
              </h2>

              <p className="max-w-xl mx-auto text-slate-600 text-base md:text-lg font-medium italic">
                Start your institutional agent journey today. Deploy liquidity, optimize nodes, and harvest verified global returns — starting at just $30.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
                <Link href="/auth/sign-up" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-14 py-5 bg-slate-950 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 hover:shadow-slate-950/30 transition-all">
                    Get Started — It&apos;s Free
                  </button>
                </Link>
                <Link href="/home" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-5 bg-slate-950/5 border-2 border-slate-950/10 rounded-3xl font-black text-[11px] uppercase tracking-[0.35em] hover:bg-slate-950 hover:text-white transition-all">
                    View Dashboard
                  </button>
                </Link>
              </div>

              {/* Mini proof bar */}
              <div className="flex items-center justify-center gap-8 pt-4 flex-wrap">
                {['No registration fees', 'Withdraw in 30 min', '124K+ agents earning'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <Footer />
      </div>

      {/* ══════════════════════════════════════════
          FLOATING LIVE ACTIVITY FEED
      ══════════════════════════════════════════ */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-none max-w-xs md:max-w-sm w-full">
        <AnimatePresence mode="wait">
          {mockNotifications.map((notif, idx) => {
            if (idx !== currentNotification) return null;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-sm font-bold shrink-0">
                  {notif.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white truncate">{notif.name}</p>
                    <span className="text-[9px] text-slate-500 shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {notif.action} <span className="text-emerald-400 font-bold">{notif.amount}</span>
                  </p>
                </div>
                <div className="text-[9px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-slate-400 shrink-0 uppercase tracking-widest font-semibold">
                  {notif.coin}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </main>
  );
}
