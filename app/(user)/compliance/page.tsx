'use client';

import Link from 'next/link';
import { 
    ArrowLeft, 
    ShieldCheck, 
    Lock, 
    KeyRound, 
    EyeOff, 
    Server, 
    UserCheck, 
    AlertTriangle, 
    Smartphone, 
    FileWarning, 
    HelpCircle, 
    Headphones,
    CheckCircle2
} from 'lucide-react';

export default function CompliancePage() {
    return (
        <div className="max-w-5xl mx-auto pb-24 animate-fade-in space-y-10">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link 
                    href="/home" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={14} /> Official Policy
                </div>
            </div>

            {/* Hero Header */}
            <div className="relative group overflow-hidden rounded-[36px] bg-slate-900/60 border border-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="relative z-10 space-y-4 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        SmartBug Media Compliance Directive
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight leading-tight">
                        Simple Worker <span className="text-emerald-400">Security Compliance</span>
                    </h1>
                    <p className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-wider leading-relaxed">
                        A worker handling company, client, CRM, advertising, or marketing data must follow these everyday baseline controls to maintain institutional integrity.
                    </p>
                </div>
            </div>

            {/* Simple Core Rule Highlight */}
            <div className="p-8 rounded-[32px] bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Lock size={28} />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Core Golden Rule</span>
                        <p className="text-sm md:text-base font-black text-white uppercase tracking-wide leading-relaxed">
                            Protect the account. Protect the device. Protect the client’s data. Verify unusual requests. Report security problems immediately to our customer support on the platform.
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    {
                        icon: KeyRound,
                        title: 'Protect your login',
                        desc: 'Use a strong, unique password and enable MFA/2FA wherever available across your assigned portals.'
                    },
                    {
                        icon: EyeOff,
                        title: 'Never share passwords',
                        desc: 'Do not send passwords, verification codes, recovery codes, or authentication links to anyone under any circumstances.'
                    },
                    {
                        icon: ShieldCheck,
                        title: 'Protect client data',
                        desc: 'Client names, emails, CRM records, campaign data, reports, credentials, and customer information must be treated as strictly confidential.'
                    },
                    {
                        icon: Server,
                        title: 'Use approved systems',
                        desc: 'Store and share company/client information only through approved company tools and accounts, not personal email, drives, or unauthorized apps.'
                    },
                    {
                        icon: UserCheck,
                        title: 'Check access before sharing',
                        desc: 'Make sure only authorized employees, clients, or contractors can access files, HubSpot records, advertising accounts, and reports.'
                    },
                    {
                        icon: AlertTriangle,
                        title: 'Watch for phishing',
                        desc: 'Verify unusual emails, login requests, payment instructions, password-reset messages, and requests to change banking or wallet information.'
                    },
                    {
                        icon: Smartphone,
                        title: 'Secure your device',
                        desc: 'Keep your computer updated, use screen locking, approved security software, and avoid leaving work devices unattended in public spaces.'
                    },
                    {
                        icon: FileWarning,
                        title: 'Follow privacy rules',
                        desc: 'Only collect, access, download, or use customer information strictly needed for your active assigned tasks.'
                    },
                    {
                        icon: Headphones,
                        title: 'Report incidents immediately',
                        desc: 'Report suspicious logins, phishing attempts, lost devices, accidental data sharing, malware, or unauthorized access through customer support.'
                    },
                    {
                        icon: HelpCircle,
                        title: 'When unsure, don’t share',
                        desc: 'Verify the request with your assigned manager, mentor, or authorized client contact before releasing sensitive information.'
                    }
                ].map((item, idx) => (
                    <div 
                        key={idx}
                        className="p-7 rounded-[28px] bg-[#0B0B1E] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 flex items-start gap-5 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-transform">
                            <item.icon size={22} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                                <span className="text-emerald-400 text-xs font-mono">0{idx + 1}.</span> {item.title}
                            </h3>
                            <p className="text-xs font-bold text-white/50 uppercase tracking-wider leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Support CTA */}
            <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Need assistance or spotted a vulnerability?</h4>
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Connect with SmartBug Media Customer Support for immediate resolution.</p>
                    </div>
                </div>
                <Link
                    href="/service"
                    className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-[0.2em] rounded-full transition-all shrink-0"
                >
                    Contact Support
                </Link>
            </div>
        </div>
    );
}
