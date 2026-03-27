'use client';

import { Bell, Calendar, ChevronRight, Info, Zap, ShieldCheck, Flame, Trophy, Activity, Globe } from 'lucide-react';
import Link from 'next/link';

const newsItems = [
    {
        id: 1,
        title: 'Network Optimization v2.4 Live',
        date: '2026-03-08',
        tag: 'System Update',
        color: 'text-primary-light bg-primary/10',
        desc: 'New nodal synchronization algorithms have been deployed, reducing task latency by 14% and increasing overall productivity yields.',
        icon: Zap
    },
    {
        id: 2,
        title: 'Tier 5 Expansion Program',
        date: '2026-03-05',
        tag: 'Events',
        color: 'text-success bg-success/10',
        desc: 'Elite contributors can now apply for the VIP5+ program, offering priority task access and 24/7 concierge settlement support.',
        icon: Trophy
    },
    {
        id: 3,
        title: 'Institutional Security Protocol 2026',
        date: '2026-03-01',
        tag: 'Security',
        color: 'text-accent-light bg-accent/10',
        desc: 'Enhanced wallet encryption and multi-sig verification for all withdrawals exceeding $5,000 are now mandatory to ensure client safety.',
        icon: ShieldCheck
    },
    {
        id: 4,
        title: 'Global Expansion: SE Asian Data Hubs',
        date: '2026-02-25',
        tag: 'Enterprise',
        color: 'text-amber-400 bg-amber-400/10',
        desc: 'Establishment of 4 new server arrays in Singapore and Jakarta to accommodate the rapidly growing contributor base in the region.',
        icon: Globe
    }
];

export default function NewsPage() {
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-10">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Latest Intel</h1>
                    <p className="text-text-secondary text-xs mt-1 font-bold uppercase tracking-widest font-mono opacity-60">Global Network Broadcasts</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                    <Flame size={16} className="text-primary-light" />
                    <span className="text-[10px] font-black text-primary-light uppercase tracking-[0.2em]">Hot Updates</span>
                </div>
            </div>

            {/* Featured Section */}
            <div className="glass-card-strong p-1 p-1 rounded-[40px] bg-gradient-to-br from-primary/20 via-transparent to-accent/20">
                <div className="bg-surface/80 backdrop-blur-3xl rounded-[39px] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Activity size={18} className="text-primary-light" />
                             </div>
                             <span className="text-[10px] font-black text-primary-light uppercase tracking-widest">Network Status: Nominal</span>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none max-w-xl">SmartBugMedia. reaches 2.5 million verified nodes milestone.</h2>
                        <p className="text-text-secondary text-sm font-medium leading-relaxed max-w-2xl">
                            Our collective decentralised workforce has successfully verified over 100 million neural tasks in the past quarter, 
                            advancing the global AI landscape at unprecedented scales.
                        </p>
                        <div className="pt-4">
                            <button className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl transition-all">
                                Read Full Report <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* News Feed */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] pl-2 opacity-50">Operational Updates Feed</h3>
                <div className="grid grid-cols-1 gap-4">
                    {newsItems.map((news) => (
                        <div key={news.id} className="glass-card p-7 group hover:border-primary/30 transition-all flex flex-col md:flex-row gap-6 relative">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${news.color} transition-transform group-hover:scale-110 shadow-xl shadow-black/20`}>
                                <news.icon size={28} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${news.color}`}>
                                        {news.tag}
                                    </span>
                                    <span className="text-[10px] font-black text-text-secondary/50 font-mono flex items-center gap-1.5">
                                        <Calendar size={12} /> {news.date}
                                    </span>
                                </div>
                                <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary-light transition-colors">{news.title}</h4>
                                <p className="text-[11px] font-bold text-text-secondary/60 uppercase tracking-widest leading-relaxed line-clamp-2">
                                    {news.desc}
                                </p>
                            </div>
                            <div className="flex items-center md:items-start pt-4 md:pt-0">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <ChevronRight size={20} className="text-text-secondary group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Archive Link */}
            <div className="text-center pb-10">
                <button className="text-[10px] font-black text-text-secondary uppercase tracking-widest hover:text-white transition-colors inline-flex items-center gap-2">
                    <Info size={14} /> View Entire Nodal History
                </button>
            </div>

        </div>
    );
}
