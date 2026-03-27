'use client';

import { useLanguage } from '@/context/LanguageContext';
import { 
    Headset, 
    ShieldCheck, 
    Zap, 
    Clock, 
    ChevronRight, 
    ArrowLeft, 
    Sparkles, 
    Gem,
    Cpu,
    Target
} from 'lucide-react';
import Link from 'next/link';

export default function ConciergeHubPage() {
    const { t } = useLanguage();

    const protocols = [
        {
            icon: Target,
            title: 'Operation Protocol',
            desc: 'Standardized workflow for network optimization tasks.',
            color: 'text-primary'
        },
        {
            icon: ShieldCheck,
            title: 'Security Compliance',
            desc: 'End-to-end encryption and account protection measures.',
            color: 'text-success'
        },
        {
            icon: Zap,
            title: 'Priority Settlement',
            desc: 'Accelerated payout processing for VIP members.',
            color: 'text-accent'
        },
        {
            icon: Cpu,
            title: 'Neural Engine',
            desc: 'Optimization logic and market analysis framework.',
            color: 'text-[#3DD6C8]'
        }
    ];

    return (
        <div className="space-y-8 pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 animate-slide-up">
                <Link href="/home" className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary/10 transition-all text-text-primary hover:text-primary">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-text-primary tracking-tight uppercase">Concierge Hub</h1>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-60">Priority Protocol & Support</p>
                </div>
            </div>

            {/* Support Hero */}
            <div className="glass-card-strong p-8 relative overflow-hidden group animate-slide-up [animation-delay:0.1s]">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Headset size={120} className="text-primary" />
                </div>
                
                <div className="relative z-10 space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-light border border-primary/30">
                        <Gem size={28} />
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-text-primary tracking-tight uppercase leading-tight">
                            Personalized <br />
                            <span className="text-primary-light">VIP Concierge</span>
                        </h2>
                        <p className="max-w-md text-xs text-text-secondary font-medium leading-relaxed">
                            Our priority support team is active 24/7 to handle account inquiries, large settlements, and tier advancement consultations.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={() => {
                                const tawk = (window as any).Tawk_API;
                                if (tawk) {
                                    tawk.showWidget?.();
                                    tawk.maximize?.();
                                }
                            }}
                            className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 group/btn shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            Live Chat <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        <a 
                            href="https://wa.me/1234567890" 
                            target="_blank"
                            className="bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#25D366]/30 transition-all active:scale-95"
                        >
                            WhatsApp
                        </a>

                        <a 
                            href="mailto:support@nodeflow.com"
                            className="bg-accent/20 border border-accent/30 text-accent-light px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-accent/30 transition-all active:scale-95"
                        >
                            Email Support
                        </a>
                    </div>
                </div>
            </div>

            {/* protocols */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-2 animate-slide-up [animation-delay:0.2s]">
                    <div className="w-1 h-3 bg-primary rounded-full" />
                    <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] opacity-60">System Protocols</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {protocols.map((protocol, i) => (
                        <div 
                            key={i} 
                            className="glass-card p-6 flex items-center gap-6 group hover:translate-y-[-4px] transition-all animate-slide-up"
                            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center ${protocol.color} border border-transparent group-hover:border-current/20 transition-all`}>
                                <protocol.icon size={28} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-text-primary text-sm uppercase tracking-tight mb-1">{protocol.title}</h4>
                                <p className="text-[10px] text-text-secondary font-semibold leading-relaxed opacity-70">{protocol.desc}</p>
                            </div>
                            <div className="text-text-secondary opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* info Footer */}
            <div className="glass-card p-6 bg-warning/5 border-warning/10 animate-slide-up [animation-delay:0.7s]">
                <div className="flex gap-4">
                    <Clock className="text-warning shrink-0" size={20} />
                    <div className="space-y-1">
                        <h5 className="text-[10px] font-black text-text-primary uppercase tracking-widest leading-none">Global Coverage</h5>
                        <p className="text-[10px] text-text-secondary font-medium leading-relaxed">
                            Support coverage: 09:00 AM - 09:00 PM EST. Offline messages are processed sequentially within 4 hours.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
