'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
    Users,
    TrendingUp,
    Copy,
    Check,
    Share2,
    ShieldCheck,
    ChevronLeft,
    Gift,
    Zap,
    QrCode,
    Sparkles,
    Award,
    ExternalLink,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface TeamMember {
    id: string;
    username: string;
    fullUsername: string;
    joinedAt: string;
    tier: number;
    levelId: number;
    completedTasks: number;
}

interface MilestoneReward {
    tier: number;
    target: number;
    reward: number;
}

export default function InvitePage() {
    const { profile } = useAuth();
    const { t } = useLanguage();
    const { format } = useCurrency();

    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'l1' | 'l2' | 'l3'>('l1');
    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState({
        totalNetworkSize: 0,
        totalCommissionEarned: 0,
        l1Count: 0,
        l2Count: 0,
        l3Count: 0,
        rates: { l1: 20, l2: 10, l3: 5 }
    });

    const [team, setTeam] = useState<{
        level1: TeamMember[];
        level2: TeamMember[];
        level3: TeamMember[];
    }>({
        level1: [],
        level2: [],
        level3: []
    });

    const [milestones, setMilestones] = useState<MilestoneReward[]>([
        { tier: 1, target: 100, reward: 10 },
        { tier: 2, target: 500, reward: 100 },
        { tier: 3, target: 1000, reward: 200 },
        { tier: 4, target: 3000, reward: 600 },
        { tier: 5, target: 5000, reward: 1000 },
        { tier: 6, target: 10000, reward: 5000 },
    ]);

    const referralCode = profile?.referral_code || profile?.id?.slice(0, 8).toUpperCase() || 'SB-INVITE';
    const referralLink = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/sign-up?ref=${referralCode}`
        : '';

    useEffect(() => {
        if (!profile?.id) return;

        const fetchDownlineData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/referral/downline?userId=${profile.id}`);
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                    setTeam(data.team);
                    if (data.milestoneRewards && data.milestoneRewards.length > 0) {
                        setMilestones(data.milestoneRewards);
                    }
                }
            } catch (err) {
                console.error('Failed to load referral downline:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDownlineData();
    }, [profile?.id]);

    const handleCopyLink = () => {
        if (!referralLink) return;
        navigator.clipboard.writeText(referralLink);
        setCopiedLink(true);
        toast.success('Referral link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(referralCode);
        setCopiedCode(true);
        toast.success(`Referral code ${referralCode} copied!`);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join SmartBugMedia Optimization Network',
                    text: `Join my optimization team on SmartBugMedia! Use invite code ${referralCode} to claim your $25 welcome bonus:`,
                    url: referralLink,
                });
            } catch (err) {
                console.log('Share error or cancelled:', err);
            }
        } else {
            handleCopyLink();
        }
    };

    const currentTeamList = activeTab === 'l1' ? team.level1 : activeTab === 'l2' ? team.level2 : team.level3;
    const currentRate = activeTab === 'l1' ? stats.rates.l1 : activeTab === 'l2' ? stats.rates.l2 : stats.rates.l3;

    return (
        <div className="max-w-4xl mx-auto pb-28 space-y-8 animate-fade-in px-3 md:px-6">

            {/* Top Navigation */}
            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                    <Link
                        href="/home"
                        className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                            {t('referral_program')}
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30">
                                3-Tier Multi-Yield
                            </span>
                        </h1>
                        <p className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-widest">
                            Inspired by SimpleMoneys & Captiv8 Affiliate Protocols
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowQrModal(true)}
                    className="p-2.5 rounded-2xl bg-[#3DD6C8]/10 hover:bg-[#3DD6C8]/20 border border-[#3DD6C8]/30 text-[#3DD6C8] transition-all flex items-center gap-1.5 text-xs font-bold"
                    title="View QR Code"
                >
                    <QrCode size={18} />
                    <span className="hidden sm:inline">QR Code</span>
                </button>
            </div>

            {/* HERO INVITATION HUB */}
            <div className="relative rounded-[32px] overflow-hidden p-6 md:p-8 bg-gradient-to-br from-[#10102b] via-[#0B0B1E] to-[#16163a] border border-[#3DD6C8]/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#3DD6C8]/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    {/* Header Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#3DD6C8]/15 border border-[#3DD6C8]/30 flex items-center justify-center text-[#3DD6C8] shadow-[0_0_20px_rgba(61,214,200,0.25)] shrink-0">
                                <Users size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.25em]">Exclusive Referral Node</span>
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                                    Invite Friends & Earn Perpetual Yields
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                            <Sparkles size={14} />
                            <span>Instant Task Rebates</span>
                        </div>
                    </div>

                    {/* Invitation Code & Link Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Invitation Code Box */}
                        <div className="md:col-span-5 p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 flex flex-col justify-between">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">
                                Your Invitation Code
                            </span>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-2xl md:text-3xl font-mono font-black text-[#3DD6C8] tracking-widest">
                                    {referralCode}
                                </span>
                                <button
                                    onClick={handleCopyCode}
                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-[#3DD6C8]/20 border border-white/10 hover:border-[#3DD6C8]/40 text-white/80 hover:text-[#3DD6C8] transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
                                >
                                    {copiedCode ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Referral Link Box */}
                        <div className="md:col-span-7 p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 flex flex-col justify-between">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">
                                Your Exclusive Invitation Link
                            </span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={referralLink}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white/80 truncate focus:outline-none"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-[#3DD6C8]/20 border border-white/10 hover:border-[#3DD6C8]/40 text-white/80 hover:text-[#3DD6C8] transition-all active:scale-95 shrink-0"
                                    title="Copy Link"
                                >
                                    {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="px-3.5 py-2.5 rounded-xl bg-[#3DD6C8] hover:bg-[#34c4b6] text-[#0B0B1E] font-black text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5 shrink-0 shadow-[0_0_20px_rgba(61,214,200,0.3)]"
                                >
                                    <Share2 size={15} />
                                    <span className="hidden sm:inline">Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PERFORMANCE METRICS GRID (SimpleMoneys Style) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">Total Team Units</span>
                    <p className="text-2xl md:text-3xl font-black text-white tracking-tight tabular-nums">
                        {stats.totalNetworkSize}
                    </p>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Across All 3 Tiers</p>
                </div>

                <div className="p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">Total Yield Earned</span>
                    <p className="text-2xl md:text-3xl font-black text-[#3DD6C8] tracking-tight tabular-nums">
                        {format(stats.totalCommissionEarned)}
                    </p>
                    <p className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest">Real-time Payouts</p>
                </div>

                <div className="p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">Direct Partners</span>
                    <p className="text-2xl md:text-3xl font-black text-amber-300 tracking-tight tabular-nums">
                        {stats.l1Count}
                    </p>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Tier 1 Network</p>
                </div>

                <div className="p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">Max Network Rebate</span>
                    <p className="text-2xl md:text-3xl font-black text-purple-400 tracking-tight">
                        35%
                    </p>
                    <p className="text-[9px] font-bold text-purple-300/80 uppercase tracking-widest">20% + 10% + 5% Stacked</p>
                </div>
            </div>

            {/* 3-TIER COMMISSION STRUCTURE (SimpleMoneys Style) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                            <TrendingUp size={18} className="text-[#3DD6C8]" />
                            Multi-Level Commission Structure
                        </h3>
                        <p className="text-xs text-white/50 font-medium">
                            Commissions are credited automatically into your wallet whenever a team member completes an optimization task.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Tier 1 Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/20 to-black/40 border border-[#3DD6C8]/30 space-y-3 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/20">
                                Tier 1 Direct
                            </span>
                            <span className="text-2xl font-black text-[#3DD6C8]">
                                {stats.rates.l1}%
                            </span>
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide">Direct Referral Yield</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Earn <strong className="text-white">{stats.rates.l1}% commission</strong> on every completed task from members who register directly using your invitation link.
                        </p>
                        <div className="pt-1 text-[11px] font-bold text-white/40 flex items-center justify-between border-t border-white/5">
                            <span>Your Members:</span>
                            <span className="font-mono text-white font-bold">{stats.l1Count} Contributors</span>
                        </div>
                    </div>

                    {/* Tier 2 Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/20 to-black/40 border border-teal-500/20 space-y-3 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
                                Tier 2 Secondary
                            </span>
                            <span className="text-2xl font-black text-teal-400">
                                {stats.rates.l2}%
                            </span>
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide">Secondary Downline Yield</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Earn <strong className="text-white">{stats.rates.l2}% passive yield</strong> whenever partners invited by your direct referrals complete their tasks.
                        </p>
                        <div className="pt-1 text-[11px] font-bold text-white/40 flex items-center justify-between border-t border-white/5">
                            <span>Your Members:</span>
                            <span className="font-mono text-white font-bold">{stats.l2Count} Contributors</span>
                        </div>
                    </div>

                    {/* Tier 3 Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/20 to-black/40 border border-purple-500/20 space-y-3 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                                Tier 3 Tertiary
                            </span>
                            <span className="text-2xl font-black text-purple-400">
                                {stats.rates.l3}%
                            </span>
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wide">Network Scaling Yield</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Earn <strong className="text-white">{stats.rates.l3}% passive yield</strong> from third-generation team activity as your referral network expands.
                        </p>
                        <div className="pt-1 text-[11px] font-bold text-white/40 flex items-center justify-between border-t border-white/5">
                            <span>Your Members:</span>
                            <span className="font-mono text-white font-bold">{stats.l3Count} Contributors</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* DEPOSIT MILESTONE BONUS LADDER (Captiv8s Style) */}
            <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-br from-[#121226] via-[#0E0E20] to-[#181830] border border-amber-500/20 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                            <Gift size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Captiv8 Bonus Protocol</span>
                            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                                Partner Deposit Milestone Rewards
                            </h3>
                        </div>
                    </div>

                    <Link
                        href="/rewards/first-deposit"
                        className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
                    >
                        <span>View First Deposit Rewards</span>
                        <ChevronRight size={14} />
                    </Link>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                    Earn high-yield cash bonuses whenever partners activate and fund their accounts. Bonus rewards are credited directly following security audit verification.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {milestones.map((m) => (
                        <div
                            key={m.tier}
                            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between text-center space-y-2 group hover:border-amber-400/40 transition-colors"
                        >
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                                Tier {m.tier}
                            </span>
                            <div>
                                <p className="text-xs font-bold text-white/70">Deposit</p>
                                <p className="text-sm font-black text-white">{format(m.target)}</p>
                            </div>
                            <div className="pt-1.5 border-t border-white/5">
                                <p className="text-[10px] font-bold text-amber-400">Bonus</p>
                                <p className="text-base font-black text-amber-400 tracking-tight">
                                    +{format(m.reward)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MY TEAM DIRECTORY (Downline Tabs) */}
            <div className="p-6 md:p-8 rounded-[32px] bg-black/40 border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                            <Award size={18} className="text-[#3DD6C8]" />
                            Team Downline Directory
                        </h3>
                        <p className="text-xs text-white/50">
                            Monitor the activity and yield generated across your 3 network tiers.
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
                        <button
                            onClick={() => setActiveTab('l1')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'l1'
                                    ? 'bg-[#3DD6C8] text-[#0B0B1E] shadow-[0_0_15px_rgba(61,214,200,0.3)]'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            Tier 1 ({team.level1.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('l2')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'l2'
                                    ? 'bg-[#3DD6C8] text-[#0B0B1E] shadow-[0_0_15px_rgba(61,214,200,0.3)]'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            Tier 2 ({team.level2.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('l3')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'l3'
                                    ? 'bg-[#3DD6C8] text-[#0B0B1E] shadow-[0_0_15px_rgba(61,214,200,0.3)]'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            Tier 3 ({team.level3.length})
                        </button>
                    </div>
                </div>

                {/* Team List Table */}
                {isLoading ? (
                    <div className="py-12 text-center text-white/50 text-xs">
                        Loading network directory...
                    </div>
                ) : currentTeamList.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest text-[10px]">
                                    <th className="pb-3 font-black">Member ID</th>
                                    <th className="pb-3 font-black">Tier Level</th>
                                    <th className="pb-3 font-black">Completed Tasks</th>
                                    <th className="pb-3 font-black">Joined Date</th>
                                    <th className="pb-3 font-black text-right">Yield Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {currentTeamList.map((member, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3.5 font-mono font-bold text-white/90">
                                            @{member.username}
                                        </td>
                                        <td className="py-3.5">
                                            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[#3DD6C8]">
                                                VIP {member.levelId}
                                            </span>
                                        </td>
                                        <td className="py-3.5 font-bold text-white/80">
                                            {member.completedTasks} Orders
                                        </td>
                                        <td className="py-3.5 text-white/50">
                                            {new Date(member.joinedAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3.5 text-right font-bold text-emerald-400">
                                            +{currentRate}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 px-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-3">
                        <Users size={32} className="mx-auto text-white/30" />
                        <div>
                            <p className="text-sm font-bold text-white/80">No members in Tier {activeTab === 'l1' ? 1 : activeTab === 'l2' ? 2 : 3} yet</p>
                            <p className="text-xs text-white/40 max-w-sm mx-auto mt-1">
                                Share your invitation link with friends and colleagues to start accumulating perpetual daily task rebates!
                            </p>
                        </div>
                        <button
                            onClick={handleShare}
                            className="px-5 py-2.5 rounded-xl bg-[#3DD6C8] hover:bg-[#34c4b6] text-[#0B0B1E] font-black text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-[0_0_20px_rgba(61,214,200,0.3)] active:scale-95"
                        >
                            <Share2 size={14} /> Invite Partners Now
                        </button>
                    </div>
                )}
            </div>

            {/* PROTOCOL GUIDELINES & FAIR PLAY */}
            <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3 text-xs text-white/60">
                <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-wider text-[11px]">
                    <ShieldCheck size={16} className="text-[#3DD6C8]" />
                    <span>Referral Protocol & Settlement Terms</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-slate-300">
                    <li>Referral commissions are calculated in real time upon successful order completion and credited instantly to your wallet.</li>
                    <li>Tier 1 (20%), Tier 2 (10%), and Tier 3 (5%) commissions stack perpetually without daily earning caps.</li>
                    <li>All accounts are monitored for fair play. Creating self-referrals or synthetic accounts violates network terms.</li>
                </ul>
            </div>

            {/* QR CODE MODAL */}
            {showQrModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#0B0B1E] border border-[#3DD6C8]/40 rounded-3xl p-6 md:p-8 max-w-sm w-full space-y-5 text-center shadow-2xl relative">
                        <button
                            onClick={() => setShowQrModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs"
                        >
                            ✕
                        </button>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-widest">
                                Mobile Invitation Pass
                            </span>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                Scan to Join Team
                            </h3>
                        </div>

                        <div className="p-6 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(61,214,200,0.2)]">
                            <QRCodeSVG
                                value={referralLink}
                                size={190}
                                level="H"
                                includeMargin={false}
                            />
                        </div>

                        <div className="space-y-1 font-mono">
                            <p className="text-xs text-white/50">Invite Code</p>
                            <p className="text-xl font-black text-[#3DD6C8] tracking-widest">{referralCode}</p>
                        </div>

                        <button
                            onClick={handleCopyLink}
                            className="w-full py-3 rounded-xl bg-[#3DD6C8] hover:bg-[#34c4b6] text-[#0B0B1E] font-black uppercase text-xs tracking-wider transition-all"
                        >
                            Copy Invitation Link
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
