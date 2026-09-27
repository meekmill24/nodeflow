'use client';

import Link from 'next/link';
import { Headset, ArrowUpRight, ShieldCheck, Activity, Terminal } from 'lucide-react';

export default function Footer() {
    const handleContactClick = (e: React.MouseEvent) => {
        if (typeof window !== 'undefined' && (window as any).Tawk_API?.maximize) {
            e.preventDefault();
            (window as any).Tawk_API.maximize();
        }
    };

    const footerColumns = [
        {
            title: 'Optimization Hub',
            tag: 'CORE',
            links: [
                { label: 'Start Optimization', href: '/start' },
                { label: 'Record History', href: '/record' },
                { label: 'VIP Tier Matrix', href: '/levels' },
                { label: 'Salary Structure', href: '/salary' },
            ]
        },
        {
            title: 'Financial Treasury',
            tag: 'VAULT',
            links: [
                { label: 'Crypto Deposit', href: '/deposit' },
                { label: 'Withdrawal Request', href: '/withdraw' },
                { label: 'Treasury Wallet', href: '/wallet' },
                { label: 'Security PIN', href: '/profile/security' },
            ]
        },
        {
            title: 'Regulatory & Rules',
            tag: 'POLICY',
            links: [
                { label: 'Terms of Service', href: '/rules' },
                { label: 'Operating Protocol', href: '/protocol' },
                { label: 'Compliance Shield', href: '/compliance' },
                { label: 'Knowledge Base / FAQ', href: '/faq' },
            ]
        },
        {
            title: 'Corporate Legal',
            tag: 'ENTITY',
            links: [
                { label: 'About SmartBugMedia', href: '/company' },
                { label: 'Accreditation Cert', href: '/certificate' },
                { label: 'Privacy Charter', href: '/privacy' },
                { label: 'Affiliate Contract', href: '/invite' },
            ]
        },
    ];

    return (
        <footer className="mt-16 sm:mt-24 pt-10 pb-32 lg:pb-12 border-t border-white/[0.08] relative z-20">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 left-1/4 w-96 h-32 bg-[#3DD6C8]/5 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-12 px-2 sm:px-4">
                
                {/* 1. TOP HEADER: Brand + Status Pill + Contact Desk */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
                    
                    {/* Brand & Mission Shard */}
                    <div className="space-y-3 max-w-xl">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-[#3DD6C8]/30 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(61,214,200,0.15)] overflow-hidden shrink-0">
                                <img 
                                    src="/logo.png" 
                                    alt="SmartBugMedia" 
                                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(61,214,200,0.6)]" 
                                />
                            </div>
                            <div className="flex items-baseline gap-2.5 flex-wrap">
                                <span className="text-xl sm:text-2xl font-black tracking-tight italic text-white uppercase flex items-baseline">
                                    SmartBugMedia<span className="text-[#3DD6C8]">.</span>
                                </span>
                                <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 uppercase tracking-wider">
                                    v4.8 Enterprise
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-lg">
                            SmartBugMedia Institutional Digital Optimization Protocol. Powering daily global commerce routing, product ratings, and verifiable affiliate liquidity.
                        </p>
                    </div>

                    {/* Operational Status & Action Buttons */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Live Nodes Badge */}
                        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                            </span>
                            <span>All 14 Operational Nodes Online</span>
                        </div>

                        {/* Contact Desk Button */}
                        <a 
                            href="/service"
                            onClick={handleContactClick}
                            className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-[#3DD6C8]/15 to-[#3DD6C8]/5 hover:from-[#3DD6C8]/25 hover:to-[#3DD6C8]/15 border border-[#3DD6C8]/30 hover:border-[#3DD6C8]/60 text-[#3DD6C8] text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(61,214,200,0.15)] active:scale-95 group"
                        >
                            <Headset size={14} className="group-hover:scale-110 transition-transform" />
                            <span>Contact Desk</span>
                        </a>
                    </div>
                </div>

                {/* 2. FOUR NAVIGATION COLUMNS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
                    {footerColumns.map((col) => (
                        <div key={col.title} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-3 rounded-full bg-[#3DD6C8]" />
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.18em]">
                                    {col.title}
                                </h4>
                            </div>

                            <ul className="space-y-2.5 text-xs">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link 
                                            href={link.href}
                                            className="text-slate-400 hover:text-white hover:text-[#3DD6C8] font-medium transition-all inline-flex items-center gap-1.5 group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                                                {link.label}
                                            </span>
                                            <ArrowUpRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#3DD6C8]" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* 3. BOTTOM COPYRIGHT & TELEMETRY STREAM */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06] text-[10px] text-slate-500 font-medium">
                    <p className="tracking-wide">
                        © 2026 <strong className="text-slate-400 font-bold">SmartBugMedia Inc.</strong> All rights reserved. Global Digital Optimization Protocol.
                    </p>

                    <div className="flex items-center gap-3 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1 text-[#3DD6C8]/80">
                            <Terminal size={11} /> US-EAST-1
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">ENCRYPTED TELEMETRY STREAM</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
