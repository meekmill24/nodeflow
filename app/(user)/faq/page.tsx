'use client';

import { HelpCircle, ChevronLeft, ChevronDown, Search, MessageSquare, Zap, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const FAQS = [
    {
        category: "Platform Architecture",
        icon: Globe,
        q: "What is NodeFlow.?",
        a: "NodeFlow. is an AI collaboration platform that bridges the gap between neural network models and human verification. We provide structured data verify by global contributors to ensure the accuracy and safety of modern AI systems."
    },
    {
        category: "Financial Settlements",
        icon: Zap,
        q: "How do I withdraw my earnings?",
        a: "Earnings are settled daily via the USDT-TRC20 protocol. Once a task set is finalized, you can request a withdrawal to your personal digital wallet. Most transfers are completed within 5-15 minutes after network confirmation."
    },
    {
        category: "Security & Escrow",
        icon: ShieldCheck,
        q: "What are Frozen Amounts?",
        a: "Frozen amounts indicate assets currently undergoing multi-node verification or special bundle processing. These funds are held in a secure escrow smart-contract until the optimization sequence is fully validated by our compliance engine."
    },
    {
        category: "Growth & Rewards",
        icon: MessageSquare,
        q: "Can I earn without investing?",
        a: "Every new node receives a $25 starter credit. While base-level participation is automated, upgrading your VIP Tier unlocks higher commission tiers, specialized asset batches, and priority settlement slots."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-10">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Knowledge Base</h1>
                    <p className="text-text-secondary text-xs mt-1 font-bold uppercase tracking-widest font-mono opacity-60">System FAQ & Support Hub</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search protocols..." 
                        className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-colors w-[200px]"
                    />
                </div>
            </div>

            {/* Support Hero */}
            <div className="glass-card p-8 flex items-center gap-6 border-primary/20 bg-primary/[0.03]">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                    <HelpCircle size={24} className="text-primary-light" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Need live assistance?</h3>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em] opacity-60">
                        Our technical support nodes are available 24/7 for account-specific queries.
                    </p>
                </div>
                <Link href="/service" className="ml-auto px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 shrink-0">
                    Contact Support
                </Link>
            </div>

            {/* FAQ Accordion List */}
            <div className="space-y-4">
                {FAQS.map((faq, idx) => {
                    const Icon = faq.icon;
                    const isOpen = openIndex === idx;

                    return (
                        <div key={idx} className={`group glass-card overflow-hidden transition-all duration-500 ${isOpen ? 'border-primary/30 ring-1 ring-primary/20' : 'border-white/5 hover:border-white/10'}`}>
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                                className="w-full flex items-start gap-5 p-6 text-left"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary'}`}>
                                    <Icon size={18} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.3em] block mb-1 opacity-50">{faq.category}</span>
                                    <span className="text-sm font-black text-white uppercase tracking-tight leading-tight">{faq.q}</span>
                                </div>
                                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mt-1 transition-transform duration-500 ${isOpen ? 'rotate-180 bg-primary/10' : ''}`}>
                                    <ChevronDown size={14} className={isOpen ? 'text-primary-light' : 'text-text-secondary'} />
                                </div>
                            </button>

                            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-6 pb-8 pl-[76px] space-y-4">
                                    <div className="h-[1px] w-full bg-white/5" />
                                    <p className="text-[11px] font-bold text-text-secondary leading-relaxed uppercase tracking-wider opacity-80 max-w-2xl">
                                        {faq.a}
                                    </p>
                                    <div className="flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                                        <span className="text-[9px] font-black text-success uppercase tracking-widest">Verified Solution</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Notice */}
            <div className="text-center pt-8 border-t border-white/5">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] opacity-40">
                    Document Version: 2.1.0-Release-SG
                </p>
            </div>

        </div>
    );
}
