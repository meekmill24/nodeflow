'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { 
    ArrowDownLeft, 
    ArrowUpRight, 
    Wallet as WalletIcon, 
    ShieldCheck, 
    History,
    ChevronRight,
    TrendingUp,
    CreditCard,
    Zap,
    Lock,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function WalletPage() {
    const { profile } = useAuth();
    const { t } = useLanguage();
    const { format } = useCurrency();
    
    const containerRef = useRef<HTMLDivElement>(null);
    const balanceRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Initial states
            gsap.set('.reveal-up', { y: 100, opacity: 0 });
            gsap.set('.reveal-scale', { scale: 0.8, opacity: 0 });
            gsap.set('.reveal-left', { x: -50, opacity: 0 });
            gsap.set('.reveal-right', { x: 50, opacity: 0 });

            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            tl.to('.reveal-up', { 
                y: 0, 
                opacity: 1, 
                duration: 1.2, 
                stagger: 0.1
            })
            .to('.reveal-scale', { 
                scale: 1, 
                opacity: 1, 
                duration: 1, 
                stagger: 0.2,
                at: "-=0.8"
            })
            .to(['.reveal-left', '.reveal-right'], { 
                x: 0, 
                opacity: 1, 
                duration: 1, 
                stagger: 0.1,
                at: "-=0.5"
            });

            // Continuous Floating for main balance card
            gsap.to('.balance-card', {
                y: -10,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // Particle drift in background
            gsap.to('.bg-particle', {
                y: "random(-20, 20)",
                x: "random(-20, 20)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.2
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="space-y-10 pb-10">
            {/* Header section with Balance Overview */}
            <div className="relative group reveal-scale balance-card">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full animate-pulse pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 blur-[60px] rounded-full animate-pulse-slow pointer-events-none" />
                
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 rounded-[40px] blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-1000"></div>
                
                <div className="relative glass-card-strong p-8 md:p-14 min-h-[260px] flex flex-col justify-center overflow-hidden border border-white/20 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.3)]">
                    {/* Animated grid mesh background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <WalletIcon size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-xl md:text-2xl font-black text-text-primary dark:text-white uppercase tracking-tighter leading-none">{t('wallet_overview')}</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">System Core Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] opacity-50 ml-1">
                                    {t('total_assets')}
                                </p>
                                <div className="flex items-baseline gap-4">
                                    <h2 className="text-5xl md:text-8xl font-black text-text-primary tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                                        {format(profile?.wallet_balance || 0).split('.')[0]}
                                        <span className="text-3xl md:text-5xl opacity-30">.{format(profile?.wallet_balance || 0).split('.')[1] || '00'}</span>
                                    </h2>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-primary-light uppercase tracking-widest animate-shimmer bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent italic">USDT</span>
                                        <TrendingUp size={16} className="text-success mt-1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4 w-full md:min-w-[340px]">
                                <div className="glass-card-strong p-6 flex flex-col items-center justify-center gap-1 border border-white/5 rounded-[28px] hover:bg-white/10 transition-colors group/stat">
                                    <RefreshCw size={14} className="text-accent mb-2 group-hover/stat:rotate-180 transition-transform duration-700" />
                                    <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-40">{t('today_profit')}</p>
                                    <p className="text-2xl font-black text-accent tabular-nums">+{format(profile?.profit || 0)}</p>
                                </div>
                                <div className="glass-card-strong p-6 flex flex-col items-center justify-center gap-1 border border-white/5 rounded-[28px] hover:bg-white/10 transition-colors group/stat">
                                    <Zap size={14} className="text-success mb-2 animate-bounce-slow" />
                                    <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-40">{t('referral_bonus')}</p>
                                    <p className="text-2xl font-black text-success tabular-nums">+{format(profile?.referral_earned || 0)}</p>
                                </div>
                            </div>
                            <div className="glass-card-strong px-8 py-5 flex items-center justify-between border border-white/5 rounded-[28px] hover:bg-white/10 transition-colors">
                                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40">{t('completed')} Tasks</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-primary-light">{profile?.completed_count || 0}</span>
                                    <span className="text-[10px] font-bold text-text-secondary opacity-20">BATCH</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Hub: TWO MAIN CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Deposit Card */}
                <Link href="/deposit" className="group reveal-left">
                    <div className="glass-card-strong p-10 relative overflow-hidden transition-all duration-700 hover:scale-[1.03] border border-white/10 h-full flex flex-col justify-between cursor-pointer rounded-[40px] shadow-2xl hover:shadow-primary/30 active:scale-[0.98]">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-colors" />
                        
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-1000 group-hover:rotate-12 translate-x-4 -translate-y-4">
                            <ArrowDownLeft size={160} className="text-primary-light" />
                        </div>
                        
                        <div className="space-y-8 relative z-10">
                            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-primary/10 to-primary/30 border border-primary/20 flex items-center justify-center text-primary-light group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shadow-2xl shadow-primary/20">
                                <ArrowDownLeft size={32} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-text-primary dark:text-white uppercase tracking-tighter leading-tight italic">Inject<br/>Funds</h3>
                                <p className="text-text-secondary text-sm font-medium leading-relaxed max-w-[240px] opacity-60 group-hover:opacity-100 transition-opacity">
                                    {t('deposit_description')}
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 flex items-center justify-between relative z-10 border-t border-white/5 pt-8">
                            <span className="text-[11px] font-black text-primary-light uppercase tracking-[0.4em] group-hover:opacity-100 transition-opacity flex items-center gap-3">
                                ACCESS NODE <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Withdrawal Card */}
                <Link href="/withdraw" className="group reveal-right">
                    <div className="glass-card-strong p-10 relative overflow-hidden transition-all duration-700 hover:scale-[1.03] border border-white/10 h-full flex flex-col justify-between cursor-pointer rounded-[40px] shadow-2xl hover:shadow-accent/30 active:scale-[0.98]">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-[40px] group-hover:bg-accent/20 transition-colors" />

                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-1000 group-hover:-rotate-12 translate-x-4 -translate-y-4">
                            <ArrowUpRight size={160} className="text-accent" />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-accent/10 to-accent/30 border border-accent/20 flex items-center justify-center text-accent group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform shadow-2xl shadow-accent/20">
                                <ArrowUpRight size={32} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-text-primary dark:text-white uppercase tracking-tighter leading-tight italic">Initiate<br/>Payout</h3>
                                <p className="text-text-secondary text-sm font-medium leading-relaxed max-w-[240px] opacity-60 group-hover:opacity-100 transition-opacity">
                                    {t('withdraw_description')}
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 flex items-center justify-between relative z-10 border-t border-white/5 pt-8">
                            <span className="text-[11px] font-black text-accent uppercase tracking-[0.4em] group-hover:opacity-100 transition-opacity flex items-center gap-3">
                                SECURE ESCROW <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                            </span>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                                <Lock size={12} className="text-accent" />
                                <span className="text-[8px] font-black text-accent uppercase tracking-widest">TLS 1.3</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Quick Stats / History Secondary Menu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-up">
                {[
                    { icon: History, label: 'History Logs', desc: 'Audit clearance records', href: '/record' },
                    { icon: CreditCard, label: 'Payment Node', desc: 'Secure payout endpoint', href: '/profile/wallet' },
                    { icon: ShieldCheck, label: 'Asset Protection', desc: 'Biometric security layer', href: '/profile/security' }
                ].map((item, i) => (
                    <Link key={i} href={item.href} className="group">
                        <div className="glass-card-strong p-8 flex flex-col gap-6 hover:bg-white/5 transition-all border border-white/5 rounded-[32px] group-hover:-translate-y-2 group-hover:border-white/10 shadow-xl">
                            <div className="w-14 h-14 rounded-[20px] bg-surface/80 flex items-center justify-center text-text-secondary group-hover:text-primary transition-all group-hover:shadow-[0_0_30px_rgba(157,80,187,0.2)]">
                                <item.icon size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-text-primary dark:text-white text-sm uppercase tracking-[0.1em]">{item.label}</h4>
                                <p className="text-[10px] text-text-secondary tracking-widest uppercase font-black opacity-30 group-hover:opacity-60 transition-opacity">{item.desc}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function ArrowRight({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
