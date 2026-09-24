'use client';

import { useState } from 'react';
import { 
    Calendar, 
    ChevronRight, 
    Info, 
    Zap, 
    ShieldCheck, 
    Flame, 
    Trophy, 
    Activity, 
    Globe, 
    ArrowLeft, 
    Share2, 
    X, 
    Check, 
    Layers, 
    Sparkles,
    Cpu,
    Radio
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface NewsArticle {
    id: number;
    title: string;
    date: string;
    tag: string;
    color: string;
    badgeColor: string;
    desc: string;
    fullReport?: string;
    stats?: { label: string; value: string }[];
    icon: any;
}

const FEATURED_REPORT: NewsArticle = {
    id: 999,
    title: 'SmartBugMedia reaches 2.5 million verified nodes milestone.',
    date: '2026-03-12',
    tag: 'Global Milestone',
    color: 'text-primary-light bg-primary/20',
    badgeColor: 'text-primary-light bg-primary/10 border-primary/20',
    desc: 'Our collective decentralized workforce has successfully verified over 100 million neural tasks in the past quarter, advancing the global AI landscape at unprecedented scales.',
    fullReport: 'SmartBugMedia has achieved an institutional breakthrough, surpassing 2,500,000 active verified human-in-the-loop nodes worldwide. Over the past 90 days, network participants contributed to over 100,000,000 discrete AI reinforcement cycles, generating superior validation accuracy across image recognition, large language model alignment, and multilingual algorithmic scoring. SmartBugMedia’s automated payout engine disbursed over $14,200,000 USDT in commissions to verified agents across 45 countries, maintaining 99.98% system uptime.',
    stats: [
        { label: 'Active Verified Nodes', value: '2,500,000+' },
        { label: 'Neural Tasks Completed', value: '100M+' },
        { label: 'Settlement Disbursed', value: '$14.2M USDT' },
        { label: 'Protocol Reliability', value: '99.98%' }
    ],
    icon: Activity
};

const NEWS_ITEMS: NewsArticle[] = [
    {
        id: 1,
        title: 'Network Optimization v2.4 Live',
        date: '2026-03-08',
        tag: 'System Update',
        color: 'text-[#3DD6C8] bg-[#3DD6C8]/10',
        badgeColor: 'text-[#3DD6C8] bg-[#3DD6C8]/10 border-[#3DD6C8]/20',
        desc: 'New nodal synchronization algorithms have been deployed, reducing task latency by 14% and increasing overall productivity yields.',
        fullReport: 'The Core Engineering Group has completed the deployment of NodeFlow Synchronization Protocol v2.4 across all primary clusters. The update includes intelligent load balancing, zero-lag task distribution, and compressed cryptographic verification payloads. Agents will observe up to a 14% decrease in round-trip optimization latency and immediate batch settlement upon milestone completion.',
        stats: [
            { label: 'Latency Reduction', value: '-14%' },
            { label: 'Cluster Concurrency', value: '45,000 req/s' },
            { label: 'Protocol Version', value: 'v2.4.0-STABLE' }
        ],
        icon: Zap
    },
    {
        id: 2,
        title: 'Tier 5 Expansion Program',
        date: '2026-03-05',
        tag: 'Events',
        color: 'text-emerald-400 bg-emerald-400/10',
        badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        desc: 'Elite contributors can now apply for the VIP5+ program, offering priority task access and customer support settlement assistance during operational hours.',
        fullReport: 'The Tier 5 Expansion Initiative is officially active. High-performing contributors with consistent 98%+ task accuracy ratings and Tier 5 volume qualifications are invited to unlock the institutional VIP bracket. Benefits include direct 1-on-1 concierge routing, enhanced bonus yield curves, and priority access to high-yield enterprise task pipelines.',
        stats: [
            { label: 'VIP Commission Multiplier', value: 'Up to 2.5x' },
            { label: 'Support SLA', value: '< 2 Minutes' },
            { label: 'Allocation Pool', value: 'Top 5% Nodes' }
        ],
        icon: Trophy
    },
    {
        id: 3,
        title: 'Institutional Security Protocol 2026',
        date: '2026-03-01',
        tag: 'Security',
        color: 'text-indigo-400 bg-indigo-400/10',
        badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
        desc: 'Enhanced wallet encryption and multi-sig verification for all withdrawals exceeding $5,000 are now mandatory to ensure client safety.',
        fullReport: 'As part of our continuous institutional compliance and asset safety commitments for 2026, SmartBugMedia has activated MPC (Multi-Party Computation) and multi-signature cold storage vaulting for high-volume transactions. All disbursements exceeding $5,000 undergo real-time cryptographic audit trail validation before release.',
        stats: [
            { label: 'Encryption Standard', value: 'AES-256 + MPC' },
            { label: 'Audit Trail', value: 'Immutable' },
            { label: 'Security Grade', value: 'Level 4 Enterprise' }
        ],
        icon: ShieldCheck
    },
    {
        id: 4,
        title: 'Global Expansion: SE Asian Data Hubs',
        date: '2026-02-25',
        tag: 'Enterprise',
        color: 'text-amber-400 bg-amber-400/10',
        badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        desc: 'Establishment of 4 new server arrays in Singapore and Jakarta to accommodate the rapidly growing contributor base in the region.',
        fullReport: 'To serve the exponential expansion of digital workforce contributors across Southeast Asia, four dedicated edge routing facilities have gone live in Singapore and Jakarta. Local latency has decreased to sub-20 milliseconds for Southeast Asian operators, ensuring fluid task verification without geographic throttles.',
        stats: [
            { label: 'New Server Arrays', value: '4 Clusters' },
            { label: 'Regional Latency', value: '< 20ms' },
            { label: 'Capacity Influx', value: '+350,000 Nodes' }
        ],
        icon: Globe
    }
];

const ARCHIVED_ITEMS: NewsArticle[] = [
    {
        id: 5,
        title: 'Mainnet Liquidity Pool Audit Q1 2026',
        date: '2026-02-10',
        tag: 'Audit',
        color: 'text-cyan-400 bg-cyan-400/10',
        badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
        desc: 'Independent third-party financial audits concluded with zero discrepancies in contributor escrow reserves.',
        fullReport: 'The Q1 2026 Liquidity Audit has completed with an exemplary AAA rating. All user balances, pending rewards, and escrow reserves are backed 1:1 in segregated institutional custodial accounts.',
        stats: [
            { label: 'Solvency Ratio', value: '100% Backed' },
            { label: 'Audit Result', value: 'Passed Flawless' }
        ],
        icon: Layers
    },
    {
        id: 6,
        title: 'Mobile Architecture Overhaul 2026',
        date: '2026-01-20',
        tag: 'System Update',
        color: 'text-violet-400 bg-violet-400/10',
        badgeColor: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
        desc: 'Ultra-low data usage compression integrated for contributors optimizing tasks on mobile networks.',
        fullReport: 'NodeFlow mobile optimization algorithms have reduced data bandwidth consumption by 60%, allowing contributors worldwide to seamlessly run workflows on limited mobile data packages.',
        stats: [
            { label: 'Data Savings', value: '60% Less Bandwidth' },
            { label: 'App Load Speed', value: '0.4s' }
        ],
        icon: Cpu
    }
];

export default function NewsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
    const [showArchived, setShowArchived] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const categories = ['All', 'System Update', 'Events', 'Security', 'Enterprise'];

    const filteredNews = NEWS_ITEMS.filter(item => 
        selectedCategory === 'All' ? true : item.tag === selectedCategory
    );

    const handleCopyArticleLink = (article: NewsArticle) => {
        if (typeof window !== 'undefined') {
            const url = `${window.location.origin}/news#article-${article.id}`;
            navigator.clipboard.writeText(`${article.title} - ${url}`);
            setCopied(true);
            toast.success('Intel headline link copied to clipboard!');
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-24 animate-fade-in space-y-8">
            
            {/* Top Navigation & Back to Home */}
            <div className="flex items-center justify-between">
                <Link 
                    href="/home" 
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-[#3DD6C8]" />
                    <span>Back to Home</span>
                </Link>

                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20">
                    <Radio size={14} className="text-primary-light animate-pulse" />
                    <span className="text-[10px] font-black text-primary-light uppercase tracking-[0.2em]">Network Intel 2026</span>
                </div>
            </div>

            {/* Title Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Latest Intel & Broadcasts</h1>
                <p className="text-text-secondary text-xs mt-1.5 font-bold uppercase tracking-widest font-mono opacity-60">
                    Verified Global Nodal Announcements • 2026 Protocol Cycle
                </p>
            </div>

            {/* Featured Section */}
            <div className="glass-card-strong p-1 rounded-[40px] bg-gradient-to-br from-[#3DD6C8]/20 via-primary/10 to-indigo-500/20 shadow-2xl">
                <div className="bg-[#0B0B1E]/95 backdrop-blur-3xl rounded-[39px] p-8 md:p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#3DD6C8]/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#3DD6C8]/20 border border-[#3DD6C8]/30 flex items-center justify-center">
                                    <Activity size={18} className="text-[#3DD6C8]" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-widest block">Network Status: Nominal</span>
                                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">{FEATURED_REPORT.date}</span>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <Flame size={12} className="text-amber-400" /> Featured Milestone
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight max-w-2xl">
                            {FEATURED_REPORT.title}
                        </h2>
                        
                        <p className="text-text-secondary text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
                            {FEATURED_REPORT.desc}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <button 
                                onClick={() => setSelectedArticle(FEATURED_REPORT)}
                                className="flex items-center gap-2 text-xs font-black text-[#0B0B1E] uppercase tracking-[0.2em] bg-gradient-to-r from-[#3DD6C8] to-cyan-400 hover:brightness-110 px-6 py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(61,214,200,0.3)] active:scale-95"
                            >
                                Read Full Report <ChevronRight size={15} />
                            </button>

                            <button
                                onClick={() => handleCopyArticleLink(FEATURED_REPORT)}
                                className="flex items-center gap-2 text-xs font-black text-white/80 hover:text-white uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3.5 rounded-2xl transition-all active:scale-95"
                            >
                                <Share2 size={14} /> Share Intel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                            selectedCategory === cat
                                ? 'bg-white text-[#0B0B1E] shadow-lg shadow-white/10'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                    >
                        {cat === 'All' ? 'All Intel' : cat}
                    </button>
                ))}
            </div>

            {/* News Feed */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] opacity-50">
                        Operational Updates ({filteredNews.length})
                    </h3>
                    <span className="text-[9px] font-mono text-white/40 uppercase">Cycle 2026</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredNews.map((news) => (
                        <div 
                            key={news.id} 
                            onClick={() => setSelectedArticle(news)}
                            className="glass-card p-6 md:p-7 group hover:border-[#3DD6C8]/40 transition-all flex flex-col md:flex-row gap-5 relative cursor-pointer border border-white/5 hover:-translate-y-0.5 shadow-lg"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${news.color} transition-transform group-hover:scale-105 shadow-xl shadow-black/20`}>
                                <news.icon size={26} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${news.badgeColor}`}>
                                        {news.tag}
                                    </span>
                                    <span className="text-[10px] font-black text-text-secondary/60 font-mono flex items-center gap-1.5">
                                        <Calendar size={12} /> {news.date}
                                    </span>
                                </div>
                                <h4 className="text-base md:text-lg font-black text-white uppercase tracking-tight group-hover:text-[#3DD6C8] transition-colors">
                                    {news.title}
                                </h4>
                                <p className="text-xs font-medium text-text-secondary/70 leading-relaxed line-clamp-2">
                                    {news.desc}
                                </p>
                            </div>
                            <div className="flex items-center md:items-center pt-2 md:pt-0">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#3DD6C8]/20 group-hover:text-[#3DD6C8] text-white/50 transition-all">
                                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Archived Timeline Section (Expandable) */}
            {showArchived && (
                <div className="space-y-4 pt-4 animate-in fade-in duration-300">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] pl-2">
                        Archived Nodal Logs (2026 Archive)
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {ARCHIVED_ITEMS.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => setSelectedArticle(item)}
                                className="glass-card p-6 group hover:border-white/20 transition-all flex flex-col md:flex-row gap-5 relative cursor-pointer border border-white/5 opacity-80 hover:opacity-100"
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                                    <item.icon size={22} />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${item.badgeColor}`}>
                                            {item.tag}
                                        </span>
                                        <span className="text-[10px] font-mono text-white/40">{item.date}</span>
                                    </div>
                                    <h4 className="text-sm font-black text-white uppercase">{item.title}</h4>
                                    <p className="text-xs text-white/60">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Archive Toggle Button */}
            <div className="text-center pt-4">
                <button 
                    onClick={() => setShowArchived(prev => !prev)}
                    className="text-[10px] font-black text-text-secondary uppercase tracking-[0.25em] hover:text-white transition-all inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5"
                >
                    <Info size={14} className="text-[#3DD6C8]" />
                    {showArchived ? 'Hide Archived History' : 'View Entire Nodal History (2026)'}
                </button>
            </div>

            {/* Interactive Article Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0B0B1E] border border-white/10 w-full max-w-xl rounded-[36px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header Bar */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${selectedArticle.badgeColor}`}>
                                    {selectedArticle.tag}
                                </span>
                                <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                                    <Calendar size={11} /> {selectedArticle.date}
                                </span>
                            </div>
                            <button 
                                onClick={() => setSelectedArticle(null)}
                                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Content Area (Scrollable) */}
                        <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight">
                                    {selectedArticle.title}
                                </h2>
                                <p className="text-xs font-bold text-[#3DD6C8] uppercase tracking-wider mt-2">
                                    Official Operational Intel Release
                                </p>
                            </div>

                            {/* Stat Chips if available */}
                            {selectedArticle.stats && selectedArticle.stats.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    {selectedArticle.stats.map((st, i) => (
                                        <div key={i} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">
                                                {st.label}
                                            </span>
                                            <span className="text-sm font-black text-white font-mono">
                                                {st.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Article Body */}
                            <div className="space-y-4 text-xs md:text-sm text-white/70 leading-relaxed font-normal">
                                <p>{selectedArticle.fullReport || selectedArticle.desc}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                                <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                                    Cryptographically Signed by SmartBugMedia Infrastructure • 2026
                                </span>
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-3 shrink-0">
                            <button
                                onClick={() => handleCopyArticleLink(selectedArticle)}
                                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-[10px] tracking-wider transition-all flex items-center justify-center gap-2"
                            >
                                {copied ? <Check size={14} className="text-[#3DD6C8]" /> : <Share2 size={14} />}
                                {copied ? 'Link Copied!' : 'Copy Intel Link'}
                            </button>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="py-3 px-6 rounded-xl bg-[#3DD6C8] hover:bg-[#3DD6C8]/90 text-[#0B0B1E] font-black uppercase text-[10px] tracking-wider transition-all"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
