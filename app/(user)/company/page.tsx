'use client';

import { Building2, ChevronLeft, Globe, Users, TrendingUp, ShieldCheck, Star, MapPin, Calendar, Award, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

const stats = [
    { label: 'Verified Nodes', value: '2.4M+', icon: Users, color: 'text-primary-light bg-primary/10' },
    { label: 'Settled Daily', value: '$14.2M', icon: TrendingUp, color: 'text-success bg-success/10' },
    { label: 'Global Regions', value: '120+', icon: Globe, color: 'text-accent-light bg-accent/10' },
    { label: 'Tasks Verified', value: '98M+', icon: Star, color: 'text-amber-400 bg-amber-400/10' },
];

const timeline = [
    { year: '2019', event: 'Genesis: Foundational R&D in Singapore Data Hubs' },
    { year: '2021', event: 'Scale: Cross-border liquidity integration enabled' },
    { year: '2023', event: 'Milestone: 1 Million nodes successfully synchronized' },
    { year: '2024', event: 'Innovation: AI-assisted neural task optimization v1.0' },
    { year: '2026', event: 'NodeFlow.: Global release of consumer-facing match hub' },
];

export default function CompanyProfilePage() {
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-10">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Institutional Profile</h1>
                    <p className="text-text-secondary text-xs mt-1 font-bold uppercase tracking-widest font-mono opacity-60">NodeFlow. Global Ops</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
                    <Activity size={16} className="text-primary-light" />
                    <span className="text-[10px] font-black text-primary-light uppercase tracking-[0.2em]">Operational</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative group overflow-hidden rounded-[40px] border border-white/5 bg-white/[0.02] p-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl relative shrink-0">
                        <Building2 size={40} className="text-white" />
                        <div className="absolute -bottom-2 -right-2 bg-success p-1.5 rounded-lg shadow-lg">
                            <ShieldCheck size={16} className="text-white" />
                        </div>
                    </div>
                    
                    <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Revolutionizing AI Training</h2>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-xl font-medium">
                            NodeFlow. operates at the intersection of decentralised workforce management and cutting-edge neural network optimization. 
                            We facilitate the human-in-the-loop verification required for the next generation of LLMs and autonomous systems.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg">
                                <MapPin size={12} className="text-primary-light" /> HQ Singapore
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg">
                                <Calendar size={12} className="text-primary-light" /> Established 2019
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg">
                                <Award size={12} className="text-primary-light" /> ISO-9001
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="glass-card p-6 flex flex-col items-center text-center space-y-4 group hover:border-primary/30 transition-all">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{value}</p>
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-60">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Split Section: Mission & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Mission Card */}
                <div className="glass-card-strong p-8 space-y-6 border border-primary/20 bg-primary/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Zap size={20} className="text-primary-light" />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Core Mission</h3>
                    </div>
                    <p className="text-text-secondary text-sm font-medium leading-relaxed italic opacity-80">
                        "Our goal is to democratise the financial benefits of industrial-scale AI optimization by enabling a global network of verified contributors to earn fair compensation while advancing technology."
                    </p>
                    <div className="pt-6 border-t border-white/5 flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 flex-1 bg-primary/20 rounded-full" />)}
                    </div>
                </div>

                {/* Vertical Timeline */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] flex items-center gap-2 opacity-50">
                        <Activity size={14} /> Historical Trajectory
                    </h3>
                    <div className="space-y-8 relative pl-6 border-l border-white/5">
                        {timeline.map((item, idx) => (
                            <div key={idx} className="relative group">
                                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-white/10 border-2 border-background group-hover:bg-primary transition-colors" />
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-primary-light font-mono">{item.year}</span>
                                    <p className="text-sm font-bold text-white uppercase tracking-wide">{item.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
