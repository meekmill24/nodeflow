'use client';

import { Building2, Globe, Users, TrendingUp, ShieldCheck, Star, MapPin, Calendar, Award, Zap, Activity, Target } from 'lucide-react';
import Link from 'next/link';

const stats = [
    { label: 'Global Nodes', value: '2.8M+', icon: Users, color: 'text-primary-light bg-primary/10' },
    { label: 'Cloud Settlement', value: '$18.5M', icon: TrendingUp, color: 'text-success bg-success/10' },
    { label: 'Supported Regions', value: '145+', icon: Globe, color: 'text-accent-light bg-accent/10' },
    { label: 'Uptime Stability', value: '99.98%', icon: ShieldCheck, color: 'text-amber-400 bg-amber-400/10' },
];

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-12">
            
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">About SmartBugMedia.</h1>
                <p className="text-text-secondary text-sm font-bold uppercase tracking-[0.3em] opacity-60">Architecting the Decentralized Workforce</p>
            </div>

            {/* Visionary Section */}
            <div className="glass-card-glow p-12 relative overflow-hidden group border-primary/20 rounded-[40px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50" />
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
                    <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shrink-0 animate-pulse-slow">
                        <Building2 size={56} className="text-white" />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Governance & Innovation</h2>
                        <p className="text-text-secondary text-sm leading-relaxed font-medium italic">
                            SmartBugMedia. is a global leader in human-augmented AI verification. Founded in 2019, our mission is to provide 
                            scalable, reliable, and fair income opportunities to digital contributors worldwide while assisting 
                            institutional partners in optimizing their neural networks.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {['ISO-27001', 'SOC2 COMPLIANT', 'KYC VERIFIED'].map(tag => (
                                <span key={tag} className="text-[9px] font-black text-white/40 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="glass-card p-6 text-center space-y-3 hover:border-primary/40 transition-all group">
                        <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-white">{value}</p>
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-50">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Core Values */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] text-center opacity-50">Our Operational Pillars</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Transparency', desc: 'Real-time ledger tracking for all client-nodal settlements.', icon: ShieldCheck },
                        { title: 'Efficiency', desc: 'AI-assisted matching ensures 99% task optimization rates.', icon: Zap },
                        { title: 'Equity', desc: 'Fair compensation protocols based on industrial yield standards.', icon: Target }
                    ].map((val, idx) => (
                        <div key={idx} className="glass-card p-8 space-y-4 border-white/5 hover:border-primary/20 transition-all text-center">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto text-primary-light">
                                <val.icon size={20} />
                            </div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">{val.title}</h4>
                            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider leading-relaxed opacity-60">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] text-center space-y-6">
                <p className="text-xs text-text-secondary uppercase font-bold tracking-widest leading-relaxed max-w-lg mx-auto">
                    Join the 2 million+ nodes currently contributing to the global intelligence framework.
                </p>
                <Link href="/start" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary-light transition-all shadow-lg shadow-primary/25">
                    Synchronize Now <Activity size={16} />
                </Link>
            </div>

        </div>
    );
}
