'use client'; 
import React, { useEffect, useState, useMemo } from 'react'; 
import Link from 'next/link';
import { 
  Search, Copy, Users, TrendingUp, Share2, Filter, 
  ExternalLink, DollarSign, Award, ChevronRight, X, 
  ShieldCheck, ArrowUpRight, CheckCircle2, UserCheck, Network, Sparkles
} from 'lucide-react'; 
import { toast } from 'sonner';

export default function AdminReferralsPage() { 
  const [referrals, setReferrals] = useState<any[]>([]); 
  const [stats, setStats] = useState({
    totalAffiliates: 0,
    activeSponsors: 0,
    totalNetworkUnits: 0,
    totalReferralEarned: 0
  });
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'earners'>('all');
  const [selectedUserDownline, setSelectedUserDownline] = useState<any | null>(null);

  const fetchReferrals = async () => { 
    setLoading(true);
    try {
        const res = await fetch('/api/admin/referrals');
        if (!res.ok) throw new Error('Affiliate directory sync failure');
        const data = await res.json();
        if (data.users) setReferrals(data.users); 
        if (data.stats) setStats(data.stats);
    } catch (err: any) {
        console.error(err);
        toast.error('System Node Collision: Affiliate registry unreachable');
    } finally {
        setLoading(false); 
    }
  }; 

  useEffect(() => { fetchReferrals(); }, []); 

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const filteredReferrals = useMemo(() => {
    return referrals.filter(r => {
      const matchesSearch = 
        r.referral_code?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.sponsor?.username?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterMode === 'active') {
        return (r.referred_users_count || 0) > 0;
      }
      if (filterMode === 'earners') {
        return (Number(r.referral_earned) || 0) > 0;
      }
      return true;
    });
  }, [referrals, searchQuery, filterMode]);

  return ( 
    <div className="space-y-8 animate-in fade-in duration-500 pb-20"> 
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"> 
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/25 text-[#3DD6C8] text-[9px] font-black uppercase tracking-widest">
              Captiv8 & SimpleMoneys Architecture
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[9px] font-black uppercase tracking-widest">
              Multi-Tier Downline
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase bg-gradient-to-r from-white via-slate-100 to-white/40 bg-clip-text text-transparent">
            Affiliate Network Protocol
          </h1> 
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">
            Institutional downline monitoring, upline sponsors & passive yield distribution.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-slate-900/80 border border-slate-800 px-6 py-4 rounded-[32px] flex items-center gap-4 shadow-2xl backdrop-blur-xl">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl shadow-inner border border-indigo-500/20">
                 <Network size={24} />
              </div>
              <div>
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">TOTAL NETWORK NODES</div>
                 <div className="text-2xl font-black text-white italic leading-tight mt-1 tracking-tighter">
                    +{stats.totalNetworkUnits} <span className="text-xs text-slate-500 not-italic font-bold">UNITS</span>
                 </div>
              </div>
           </div>
        </div>
      </div> 

      {/* Stats Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'TOTAL PARTICIPANTS', value: stats.totalAffiliates, color: 'text-blue-400', glow: 'bg-blue-500/10', sub: 'Registered Node Identifiers' },
          { icon: Share2, label: 'ACTIVE SPONSORS', value: stats.activeSponsors, color: 'text-[#3DD6C8]', glow: 'bg-[#3DD6C8]/10', sub: 'With 1+ Confirmed Referrals' },
          { icon: DollarSign, label: 'PASSIVE COMMISSION', value: `$${stats.totalReferralEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'text-emerald-400', glow: 'bg-emerald-500/10', sub: 'Total Distributed Yield' },
          { icon: TrendingUp, label: 'NETWORK CONVERSION', value: `${stats.totalAffiliates ? Math.round((stats.activeSponsors / stats.totalAffiliates) * 100) : 0}%`, color: 'text-indigo-400', glow: 'bg-indigo-500/10', sub: 'Sponsor Activation Rate' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
             <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-2xl ${s.glow} flex items-center justify-center ${s.color} border border-white/5`}>
                   <s.icon size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
             </div>
             <div className={`text-4xl font-black italic tracking-tighter ${s.color}`}>
                {s.value}
             </div>
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-2">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Multi-Tier Commission Rates Overview (SimpleMoneys & Captiv8s standard) */}
      <div className="p-6 rounded-[32px] bg-gradient-to-r from-slate-900/60 via-indigo-950/20 to-slate-900/60 border border-white/10 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-black text-sm">
            L1
          </div>
          <div>
            <div className="text-xs font-black text-white uppercase tracking-wider">Level 1 Direct Sponsor</div>
            <div className="text-emerald-400 font-mono font-black text-base mt-0.5">20.00% Commission</div>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-black text-sm">
            L2
          </div>
          <div>
            <div className="text-xs font-black text-white uppercase tracking-wider">Level 2 Sub-Network</div>
            <div className="text-blue-400 font-mono font-black text-base mt-0.5">10.00% Commission</div>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-black text-sm">
            L3
          </div>
          <div>
            <div className="text-xs font-black text-white uppercase tracking-wider">Level 3 Team Protocol</div>
            <div className="text-purple-400 font-mono font-black text-base mt-0.5">5.00% Commission</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative group w-full md:w-96"> 
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-[#3DD6C8] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by code, username or sponsor..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="w-full pl-14 pr-6 py-4 bg-slate-900/40 border border-slate-800 rounded-[28px] text-white focus:outline-none focus:ring-4 focus:ring-[#3DD6C8]/10 focus:border-[#3DD6C8]/50 transition-all font-bold placeholder:text-slate-800 uppercase tracking-wider text-xs" 
          /> 
        </div> 

        <div className="flex items-center gap-2 p-1.5 rounded-[24px] bg-slate-900/60 border border-slate-800">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filterMode === 'all'
                ? 'bg-white text-black shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Affiliates ({referrals.length})
          </button>
          <button
            onClick={() => setFilterMode('active')}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filterMode === 'active'
                ? 'bg-[#3DD6C8] text-black shadow-lg shadow-[#3DD6C8]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Sponsors ({stats.activeSponsors})
          </button>
          <button
            onClick={() => setFilterMode('earners')}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filterMode === 'earners'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Yield Earners
          </button>
        </div>
      </div> 

      {/* Main Affiliate Directory Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] overflow-hidden backdrop-blur-sm shadow-2xl relative"> 
        <div className="overflow-x-auto">
          <table className="w-full text-sm"> 
            <thead> 
              <tr className="text-left text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/[0.05] bg-white/[0.02]"> 
                <th className="px-8 py-6">Affiliate Identity</th> 
                <th className="px-8 py-6">Invite Protocol</th> 
                <th className="px-8 py-6">Upline Sponsor</th> 
                <th className="px-8 py-6 text-center">Downline Units</th> 
                <th className="px-8 py-6 text-right">Commission Harvest</th> 
                <th className="px-8 py-6 text-right">Actions</th> 
              </tr> 
            </thead> 
            <tbody className="divide-y divide-white/[0.05]"> 
              {filteredReferrals.map(ref => {
                const directCount = Number(ref.referred_users_count) || 0;
                const totalNet = Number(ref.total_network_size) || directCount;
                const earned = Number(ref.referral_earned) || 0;

                return (
                  <tr key={ref.id} className="hover:bg-slate-800/30 transition-colors group"> 
                    {/* Identity */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-white font-black italic shadow-inner">
                          {ref.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-slate-200 uppercase italic tracking-tight">{ref.username || 'ANONYMOUS'}</div>
                          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">
                            {ref.phone || 'No phone registered'}
                          </div>
                          <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">
                            Joined {new Date(ref.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td> 

                    {/* Code & Link */}
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <button 
                          onClick={() => copyText(ref.referral_code || '', 'Referral code')}
                          className="group/btn flex items-center gap-2.5 bg-black/50 border border-white/10 px-3.5 py-1.5 rounded-xl hover:border-[#3DD6C8]/50 transition-all active:scale-95 shadow-sm"
                          title="Click to copy code"
                        >
                           <span className="font-mono font-black text-[#3DD6C8] italic tracking-widest text-sm">{ref.referral_code || 'NONE'}</span>
                           <Copy size={12} className="text-slate-600 group-hover/btn:text-[#3DD6C8] transition-colors" />
                        </button>
                        {ref.referral_code && (
                          <button
                            onClick={() => copyText(`${window.location.origin}/auth/sign-up?ref=${ref.referral_code}`, 'Invitation link')}
                            className="text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
                          >
                            Copy Invite URL ➔
                          </button>
                        )}
                      </div>
                    </td> 

                    {/* Upline Sponsor */}
                    <td className="px-8 py-6">
                      {ref.sponsor ? (
                        <div className="space-y-1">
                          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-black text-[9px] uppercase tracking-wider inline-flex items-center gap-1.5">
                            <UserCheck size={10} /> @{ref.sponsor.username}
                          </span>
                          <div className="text-[9px] text-slate-600 font-mono font-bold tracking-wider pl-1">
                            CODE: {ref.sponsor.code || 'LOCKED'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">
                          Root Node (Organic)
                        </span>
                      )}
                    </td>

                    {/* Downline Units */}
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-2xl font-black italic tracking-tighter ${directCount > 0 ? 'text-[#3DD6C8]' : 'text-slate-500'}`}>
                            {directCount}
                          </span>
                          <span className="text-xs font-bold text-slate-500 uppercase">Direct</span>
                        </div>
                        {totalNet > directCount && (
                          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                            +{totalNet - directCount} Team Nodes
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Commission Harvest */}
                    <td className="px-8 py-6 text-right">
                      <div className="font-mono font-black text-white text-base">
                        ${earned.toFixed(2)}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider inline-block mt-1 ${
                        directCount > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {directCount > 0 ? 'ACTIVE NETWORK' : 'DORMANT'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right"> 
                      <div className="flex items-center justify-end gap-2">
                        {/* Inspect Downline Button */}
                        <button 
                          onClick={() => setSelectedUserDownline(ref)}
                          title="Inspect Downline Network"
                          className="px-3.5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/20 font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                        >
                          <Network size={14} />
                          <span>Downline ({directCount})</span>
                        </button>

                        {/* Inspect Profile */}
                        <Link 
                          href={`/admin/users?search=${encodeURIComponent(ref.username || '')}`}
                          title={`Inspect user ${ref.username}`}
                          className="p-2.5 inline-flex items-center justify-center bg-white text-black rounded-xl hover:bg-[#3DD6C8] hover:text-white transition-all shadow-sm active:scale-95"
                        >
                           <ExternalLink size={16} strokeWidth={2.5} />
                        </Link> 
                      </div>
                    </td> 
                  </tr> 
                );
              })} 

              {filteredReferrals.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-slate-800/50 flex items-center justify-center text-slate-700 mx-auto mb-4 border border-white/5">
                        <Share2 size={32} />
                    </div>
                    <h3 className="text-lg font-black text-white italic tracking-tighter uppercase mb-1">No Affiliate Records Found</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">No growth nodes matching the current criteria</p>
                  </td>
                </tr>
              )}
            </tbody> 
          </table> 
        </div>
      </div> 

      {/* Downline Network Inspector Slide-Over / Modal (SimpleMoneys & Captiv8s standard) */}
      {selectedUserDownline && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-black/75 animate-in fade-in duration-300">
          <div className="bg-[#0B0F1F] border border-white/10 rounded-[40px] w-full max-w-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-[#3DD6C8] to-emerald-500" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Network size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Downline Hierarchy</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Referral Network of @{selectedUserDownline.username}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUserDownline(null)}
                className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sponsor Summary Card */}
            <div className="p-5 rounded-2xl bg-black/50 border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 shrink-0">
              <div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Referral Code</div>
                <div className="font-mono font-black text-[#3DD6C8] text-sm mt-0.5">{selectedUserDownline.referral_code}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Direct Referrals</div>
                <div className="font-black text-white text-sm mt-0.5">{selectedUserDownline.referred_users_count || 0} Units</div>
              </div>
              <div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Team Downline</div>
                <div className="font-black text-indigo-400 text-sm mt-0.5">{selectedUserDownline.total_network_size || 0} Total</div>
              </div>
              <div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Yield Generated</div>
                <div className="font-mono font-black text-emerald-400 text-sm mt-0.5">${(selectedUserDownline.referral_earned || 0).toFixed(2)}</div>
              </div>
            </div>

            {/* Downline Members List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">
                <span>Network Members ({selectedUserDownline.downline?.length || 0})</span>
                <span>Tier Level</span>
              </div>

              {selectedUserDownline.downline && selectedUserDownline.downline.length > 0 ? (
                selectedUserDownline.downline.map((member: any) => (
                  <div 
                    key={member.id} 
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-white italic text-xs">
                        {member.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-white uppercase text-xs tracking-tight flex items-center gap-2">
                          <span>{member.username}</span>
                          <span className="text-[9px] font-mono text-slate-500">{member.phone}</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                          Tasks: {member.completed_count || 0} • Balance: ${Number(member.wallet_balance || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                        member.tier === 1 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                          : member.tier === 2 
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                          : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                      }`}>
                        Level {member.tier}
                      </span>
                      <Link
                        href={`/admin/users?search=${encodeURIComponent(member.username)}`}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="View profile"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-slate-600 space-y-2">
                  <Users size={32} className="mx-auto text-slate-700" />
                  <p className="text-xs font-bold uppercase tracking-wider">No Downline Registered</p>
                  <p className="text-[10px] text-slate-600">This user has not invited any downline units yet.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-6 mt-4 border-t border-white/5 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedUserDownline(null)}
                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-black text-xs uppercase tracking-widest transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div> 
  ); 
}
