'use client';

import Link from 'next/link';
import { 
    ArrowLeft, 
    FileCheck2, 
    CheckCircle2, 
    Layers, 
    Eye, 
    ThumbsUp, 
    AlertOctagon, 
    Headphones, 
    FolderSync, 
    ShieldAlert,
    Compass,
    ArrowRight
} from 'lucide-react';

export default function ProtocolPage() {
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
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                    <FileCheck2 size={14} /> Daily Operations
                </div>
            </div>

            {/* Hero Header */}
            <div className="relative group overflow-hidden rounded-[36px] bg-slate-900/60 border border-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="relative z-10 space-y-4 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        Standard Operating Procedure
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight leading-tight">
                        Simple Worker <span className="text-[#3DD6C8]">Operating Protocol</span>
                    </h1>
                    <p className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-wider leading-relaxed">
                        For a worker, think of this protocol as your daily compass: how to log in, handle assignments, collaborate safely, and finalize operations every single day.
                    </p>
                </div>
            </div>

            {/* Easy Workflow Strip */}
            <div className="p-8 rounded-[32px] bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 space-y-4">
                <div className="flex items-center gap-2">
                    <Compass size={18} className="text-[#3DD6C8]" />
                    <span className="text-[11px] font-black text-[#3DD6C8] uppercase tracking-[0.3em]">Easy Workflow to Remember</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    {['Check', 'Work', 'Protect', 'Review', 'Approve', 'Deliver', 'Update'].map((step, idx, arr) => (
                        <div key={idx} className="flex items-center gap-2">
                            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-white uppercase tracking-wider">
                                {step}
                            </span>
                            {idx < arr.length - 1 && <ArrowRight size={14} className="text-[#3DD6C8]/60 shrink-0" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Key Principle Card */}
            <div className="p-7 rounded-[28px] bg-[#0B0B1E] border border-cyan-500/30 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#3DD6C8] shrink-0">
                    <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Key Principle</span>
                    <p className="text-sm font-black text-white uppercase tracking-wide leading-relaxed">
                        Do your assigned work, protect your information, check your work before publishing, and communicate immediately when something goes wrong.
                    </p>
                </div>
            </div>

            {/* Step-by-Step Protocol List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    {
                        title: 'Log in securely',
                        desc: 'Use your own approved account, a strong password, and MFA. Never share your password or verification codes with anyone.'
                    },
                    {
                        title: 'Check your assigned work',
                        desc: 'Make sure you understand the client, task, deadline, and expected result before starting.'
                    },
                    {
                        title: 'Use approved tools only',
                        desc: 'Work only through the company’s approved platforms, including this platform, CRM systems, project management tools, marketing tools, and communication systems.'
                    },
                    {
                        title: 'Protect client information',
                        desc: 'Never send client lists, passwords, campaign data, CRM records, or confidential documents to unauthorized individuals.'
                    },
                    {
                        title: 'Follow instructions and scope',
                        desc: 'Do not make major changes to campaigns, websites, CRM systems, budgets, or client data without authorization from the platform’s customer service team.'
                    },
                    {
                        title: 'Check your work',
                        desc: 'Before submitting or publishing anything, verify spelling, links, data, audience, tracking information, attachments, and details through our customer support.'
                    },
                    {
                        title: 'Get approval when required',
                        desc: 'Do not publish content or make significant client-facing changes until approval has been received from the appropriate supervisor or mentor.'
                    },
                    {
                        title: 'Communicate problems early',
                        desc: 'If you are delayed, confused, blocked, or notice an error, inform your manager, mentor, or support team immediately rather than hiding the issue.'
                    },
                    {
                        title: 'Watch for scams',
                        desc: 'Be cautious of unexpected password requests, payment requests from third parties unlike your mentor or customer support, or suspicious links. We accept only digital currencies. Always contact your mentor or our customer service team for assistance with account upgrades.'
                    },
                    {
                        title: 'Report security problems immediately',
                        desc: 'If you click a suspicious link aside our platform link, lose a device, expose confidential information, or notice unauthorized access, report the incident immediately through SmartBug’s customer support on the platform.'
                    },
                    {
                        title: 'Close your work properly',
                        desc: 'Update task or project status, save files in the correct location, record any outstanding actions, and secure your device when you finish working.'
                    }
                ].map((item, idx) => (
                    <div 
                        key={idx}
                        className="p-7 rounded-[28px] bg-[#0B0B1E] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 flex items-start gap-5 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3DD6C8] shrink-0 font-mono text-xs font-black group-hover:scale-110 group-hover:bg-cyan-500/10 transition-transform">
                            {idx + 1}
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-black text-white uppercase tracking-tight">
                                {item.title}
                            </h3>
                            <p className="text-xs font-bold text-white/50 uppercase tracking-wider leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Contact Mentor CTA */}
            <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Headphones size={24} className="text-[#3DD6C8] shrink-0" />
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Assistance with Account Upgrades or Sets</h4>
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Connect with your assigned mentor or customer support on the platform.</p>
                    </div>
                </div>
                <Link
                    href="/service"
                    className="px-8 py-3.5 bg-[#3DD6C8] hover:bg-[#34b7ab] text-slate-950 font-black text-xs uppercase tracking-[0.2em] rounded-full transition-all shrink-0"
                >
                    Connect Support
                </Link>
            </div>
        </div>
    );
}
