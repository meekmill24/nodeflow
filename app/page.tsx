'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Globe, 
  ChevronRight, 
  Lock, 
  ArrowUpRight,
  MousePointer2,
  Users,
  Trophy,
  Menu,
  X,
  Play,
  Star,
  Quote,
  Layers,
  Activity,
  Cpu,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Hero Animations
      gsap.from(".hero-title-part", {
        y: 80,
        opacity: 0,
        rotateX: -20,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.15
      });

      gsap.from(".hero-sub", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out"
      });

      gsap.from(".hero-cta", {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        ease: "back.out(1.7)"
      });

      // Floating dashboard components
      gsap.from(".float-card", {
        y: 40,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top 60%",
        }
      });

      // Animated background nodes (matrix style)
      gsap.to(".matrix-node", {
        opacity: 0.8,
        scale: 1.1,
        repeat: -1,
        yoyo: true,
        duration: 3,
        stagger: {
          each: 0.5,
          from: "random"
        }
      });

      // Section Headers
      gsap.utils.toArray(".section-header").forEach((header: any) => {
        gsap.from(header, {
          y: 40,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: 'NETWORK NODES', value: '1.4M+', icon: Cpu, color: 'text-blue-400' },
    { label: 'LIQUIDITY VELOCITY', value: '$920M+', icon: RefreshCw, color: 'text-emerald-400' },
    { label: 'OPTIMIZED YIELD', value: '+18.4%', icon: TrendingUp, color: 'text-violet-400' },
  ];

  const operationalSteps = [
    { 
      id: '01', 
      title: 'Initialize Hub', 
      desc: 'Connect your agent terminal to the SmartBugMedia. global distribution matrix.', 
      icon: Lock,
      color: 'blue'
    },
    { 
      id: '02', 
      title: 'Deploy Liquidity', 
      desc: 'Allocate assets into specialized high-velocity task optimization nodes.', 
      icon: Zap,
      color: 'cyan'
    },
    { 
      id: '03', 
      title: 'Harvest Yield', 
      desc: 'Execute synchronized task audits and secure instantaneous returns.', 
      icon: Trophy,
      color: 'violet'
    }
  ];

  const tiers = [
    { name: 'JUNIOR AGENT', price: '100', yield: '1.2%', tasks: '40', features: ['Standard Support', 'Basic Audit Access', 'Daily Settlement'] },
    { name: 'SENIOR AGENT', price: '500', yield: '1.8%', tasks: '45', features: ['Priority Support', 'Full Audit Logs', 'Instant Settlement', 'Matrix Access'] },
    { name: 'EXECUTIVE NODE', price: '1,500', yield: '2.4%', tasks: '55', features: ['VIP Desk', 'Institutional Vault', 'Quantum Security', 'Multi-Node Access'], popular: true },
    { name: 'MASTER HUB', price: '5,000', yield: '3.0%', tasks: '65', features: ['Direct API Access', 'Custom Settlement', 'Unlimited Nodes', 'DAO Governance'] }
  ];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/40 selection:text-cyan-100 overflow-x-hidden" ref={containerRef}>
      {/* High-Fidelity Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Matrix Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03]" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 blur-[180px] rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyan-600/[0.03] blur-[200px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Navigation - Glassmorphism style */}
        <nav className="sticky top-0 z-50 px-6 py-4 lg:px-12 backdrop-blur-xl border-b border-white/5 bg-slate-950/60">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center p-1.5 shadow-lg shadow-cyan-500/20 overflow-hidden transition-transform group-hover:scale-110">
                  <Image src="/logo.png" alt="SmartBugMedia Logo" width={24} height={24} />
              </div>
              <span className="text-2xl font-black tracking-tight text-white italic">SmartBugMedia<span className="text-cyan-500">.</span></span>
            </Link>

            <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {['Protocol', 'Ecosystem', 'Nodes', 'Security'].map((item) => (
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

        {/* Hero Section - Hybrid Design */}
        <section className="hero-section relative pt-16 pb-32 lg:pt-32 lg:pb-48 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center lg:text-left">
              <div className="hero-sub inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Institutional Node Protocol v2.5
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-[110px] font-extrabold italic tracking-tighter leading-[0.85] mb-8">
                <div className="hero-title-part overflow-hidden">STRATEGIC</div>
                <div className="hero-title-part overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">DYNAMIC</div>
                <div className="hero-title-part overflow-hidden">NODES<span className="text-cyan-500">.</span></div>
              </h1>

              <p className="hero-sub max-w-xl mx-auto lg:mx-0 text-slate-400 text-lg md:text-xl font-medium mb-12 leading-relaxed border-l-4 border-indigo-500/30 pl-6 italic">
                The definitive institutional distribution matrix. Synchronize your liquidity across high-fidelity nodes for optimized daily returns.
              </p>

              <div className="hero-cta flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <Link href="/home" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-12 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                    Launch Hub <Play size={16} fill="currentColor" />
                  </button>
                </Link>
                <div className="flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-2">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=a${i}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span>Join 124K+ Active Agents</span>
                </div>
              </div>
            </div>

            {/* Floating Dashboards */}
            <div className="flex-1 relative w-full max-w-xl">
              <div className="relative aspect-[4/3] rounded-[40px] border border-white/10 bg-slate-900/40 backdrop-blur-3xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-indigo-500/5" />
                
                {/* Dashboard Previews */}
                <div className="absolute top-8 left-8 right-8 bottom-8 flex flex-col gap-6">
                  <div className="float-card flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Activity size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Node</p>
                        <p className="text-xl font-black italic tracking-tight">NODE_X_774</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-black text-lg">+2.4%</p>
                      <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Optimization</p>
                    </div>
                  </div>

                  <div className="float-card grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <BarChart3 className="text-violet-400 mb-4" size={20} />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Liquidity</p>
                      <p className="text-2xl font-black italic">$14.2K</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <RefreshCw className="text-blue-400 mb-4 animate-spin-slow" size={20} />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sync status</p>
                      <p className="text-2xl font-black italic">ULTRA</p>
                    </div>
                  </div>

                  <div className="float-card mt-auto flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Global Settlement</p>
                      <p className="text-lg font-black italic text-white">SUCCESSFULLY VERIFIED</p>
                    </div>
                    <ArrowUpRight className="ml-auto text-white/50" />
                  </div>
                </div>

                {/* Decorative Matrix Circles */}
                <div className="matrix-node absolute top-[-10%] right-[-10%] w-40 h-40 border border-cyan-500/20 rounded-full flex items-center justify-center">
                   <div className="w-20 h-20 border border-cyan-500/40 rounded-full animate-ping" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Grid */}
        <section id="protocol" className="px-6 lg:px-12 py-24 max-w-7xl mx-auto border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="group relative p-10 rounded-[32px] bg-slate-900/40 border border-white/5 overflow-hidden transition-all hover:border-cyan-500/30">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <stat.icon size={120} />
                </div>
                <div className={cn("inline-flex p-3 rounded-xl bg-slate-950 border border-white/10 mb-6", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <h3 className="text-5xl font-black italic tracking-tighter mb-2 group-hover:text-white transition-colors">{stat.value}</h3>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Operational Flow - Synchronized Steps */}
        <section id="ecosystem" className="px-6 lg:px-12 py-32 max-w-7xl mx-auto">
          <div className="section-header text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6">SYSTEM PROTOCOL</h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full mb-6" />
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em]">The high-performance agent workflow</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
            <div className="hidden lg:block absolute top-[100px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            
            {operationalSteps.map((step, i) => (
              <div key={i} className="group relative text-center flex flex-col items-center">
                <div className="w-32 h-32 rounded-[40px] bg-slate-900 border border-white/10 flex items-center justify-center mb-10 transition-all group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                  <step.icon size={48} className={step.color === 'blue' ? 'text-blue-400' : step.color === 'cyan' ? 'text-cyan-400' : 'text-violet-400'} />
                  <span className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black italic text-slate-600 group-hover:text-cyan-400 transition-colors">{step.id}</span>
                </div>
                <h4 className="text-2xl font-black italic tracking-tight uppercase mb-6">{step.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic px-8">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tier Grid - UX with Premium aesthetics */}
        <section id="nodes" className="px-6 lg:px-12 py-32 bg-slate-950/40 relative">
          <div className="absolute inset-0 bg-[url('/dots.svg')] opacity-[0.05]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="section-header flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
              <div>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4 leading-none">VERIFIED NODES</h2>
                <p className="text-cyan-500 text-xs font-black uppercase tracking-[0.4em]">DISTRIBUTION TIERS & YIELD MATRIX</p>
              </div>
              <p className="max-w-md text-slate-500 text-sm italic font-medium">
                Select your institutional tier level. Higher frequency nodes offer accelerated distribution cycles and premium audit features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tiers.map((tier, i) => (
                <div key={i} className={cn(
                  "relative flex flex-col p-10 rounded-[48px] border transition-all hover:scale-[1.03] duration-500",
                  tier.popular ? "bg-slate-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/10" : "bg-slate-950/60 border-white/5 hover:border-white/10"
                )}>
                  {tier.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-indigo-500 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30">
                      Most Active
                    </div>
                  )}

                  <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-2">{tier.name}</h5>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black italic tracking-tighter">${tier.price}</span>
                    <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest ml-2">Protocol Entry</span>
                  </div>

                  <div className="space-y-4 mb-10 pb-8 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Node Yield</span>
                      <span className="font-black italic text-cyan-400">{tier.yield}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Daily Limit</span>
                      <span className="font-black italic text-white">{tier.tasks} Tasks</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-12 flex-1">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-center gap-3 text-slate-400 text-[11px] font-medium italic">
                        <CheckCircle2 size={12} className="text-emerald-500/70" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <Link href="/home">
                    <button className={cn(
                      "w-full py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] transition-all",
                      tier.popular ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400" : "bg-white/5 border border-white/10 hover:bg-white/10"
                    )}>
                      Initialize Node
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Matrix Feature Section */}
        <section id="security" className="px-6 lg:px-12 py-40 max-w-7xl mx-auto overflow-hidden">
           <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-[64px] border border-white/5 p-12 lg:p-24 relative">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                 <div className="relative z-10">
                    <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-12">
                       QUANTUM <br />
                       <span className="text-cyan-500">SECURITY</span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 italic leading-relaxed">
                       SmartBugMedia. utilizes a multi-layered verification consensus to ensure all agent distribution remains synchronized and secure across global gateways.
                    </p>
                    
                    <div className="space-y-10">
                       {[
                         { title: 'Ledger Consensus', desc: 'Immutable distribution logging for 100% transparency.', icon: Layers },
                         { title: 'Multi-Sig Vaults', desc: 'Deep liquidity storage protected by institutional encryption.', icon: Lock },
                         { title: 'Neural Auditing', desc: 'Real-time AI monitoring for task optimization efficiency.', icon: Cpu },
                       ].map((f, i) => (
                         <div key={i} className="flex gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
                               <f.icon size={24} />
                            </div>
                            <div>
                               <h5 className="text-lg font-black italic uppercase tracking-tight text-white mb-2">{f.title}</h5>
                               <p className="text-sm font-medium text-slate-500 italic leading-relaxed">{f.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="relative">
                    <div className="aspect-square relative rounded-[56px] bg-slate-950 border border-white/10 p-16 flex items-center justify-center overflow-hidden">
                       <div className="absolute inset-0 opacity-10">
                          <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                       </div>
                       <div className="w-full h-full rounded-full border border-dashed border-cyan-500/20 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                          <div className="w-4/5 h-4/5 rounded-full border border-indigo-500/20 animate-[spin_12s_linear_infinite_reverse]" />
                       </div>
                       <ShieldCheck className="absolute text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]" size={120} strokeWidth={1} />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Final CTA - Layout Clarity */}
        <section className="px-6 lg:px-12 pb-32 max-w-7xl mx-auto">
           <div className="relative rounded-[80px] bg-white p-16 lg:p-32 text-center text-slate-950 overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              
              <div className="relative z-10 space-y-12">
                 <div className="inline-flex px-5 py-2 rounded-full bg-slate-950/5 border border-slate-950/10 text-[10px] font-black uppercase tracking-[0.4em]">Ready to synchronize?</div>
                 
                 <h2 className="text-6xl md:text-8xl font-extrabold italic tracking-tighter uppercase leading-[0.85]">
                    JOIN THE <br />
                    <span className="text-indigo-600">NODE MATRIX</span>
                 </h2>

                 <p className="max-w-2xl mx-auto text-slate-600 text-lg md:text-xl font-medium italic">
                    Start your institutional agent journey today. Deploy liquidity, optimize nodes, and harvest verified global returns.
                 </p>

                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/auth/sign-up" className="w-full sm:w-auto">
                       <button className="w-full sm:w-auto px-16 py-6 bg-slate-950 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all">
                          Get Started Now
                       </button>
                    </Link>
                    <Link href="/home" className="w-full sm:w-auto">
                       <button className="w-full sm:w-auto px-12 py-6 bg-slate-950/5 border border-slate-950/10 rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-950 hover:text-white transition-all">
                          Access Registry
                       </button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>

        {/* Institutional Footer */}
        <footer className="px-6 lg:px-12 py-24 border-t border-white/5 bg-slate-950/40">
           <div className="max-w-7xl mx-auto flex flex-col items-center">
              <div className="flex items-center gap-3 mb-10 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                 <Image src="/logo.png" alt="SmartBugMedia Logo" width={32} height={32} />
                 <span className="text-2xl font-black tracking-tight uppercase italic text-white">SmartBugMedia<span className="text-cyan-500">.</span></span>
              </div>
              
              <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-12">
                 <Link href="#" className="hover:text-white transition-colors">Compliance</Link>
                 <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                 <Link href="#" className="hover:text-white transition-colors">Audit</Link>
                 <Link href="#" className="hover:text-white transition-colors">Registry</Link>
              </div>

              <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.5em] text-center max-w-2xl">
                 © 2026 SMARTBUGMEDIA. GLOBAL DISTRIBUTION MATRIX. ALL RIGHTS RESERVED. <br />
                 CRYPTO-ASSET DEPLOYMENT INVOLVES RISK. VERIFY ALL NODES BEFORE SETTLEMENT.
              </p>
           </div>
        </footer>
      </div>
    </main>
  );
}
