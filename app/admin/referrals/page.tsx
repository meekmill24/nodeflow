'use client'; 
import React, { useEffect, useState } from 'react'; 
import { supabase } from '@/lib/supabase/index'; 
import { Search, Copy, CheckCircle, XCircle, Users, TrendingUp, Share2, Filter, User as UserIcon, ExternalLink, DollarSign } from 'lucide-react'; 
import { toast } from 'sonner';

export default function AdminReferralsPage() { 
  const [referrals, setReferrals] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReferrals = async () => { 
    setLoading(true);
    try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) throw new Error('Affiliate directory sync failure');
        const data = await res.json();
        // Filter out people with no referrals if you want, or show all
        if (data) setReferrals(data); 
    } catch (err) {
        console.error(err);
        toast.error('System Node Collision: Affiliate registry unreachable');
    } finally {
        setLoading(false); 
    }
  }; 

  useEffect(() => { fetchReferrals(); }, []); 

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Referral code copied to clipboard');
  };

  const filteredReferrals = referrals.filter(r => 
    r.referral_code?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return ( 
    <div className="space-y-8 animate-in fade-in duration-500 pb-20"> 
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"> 
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Affiliate Network</h1> 
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Monitor growth loops and referral performance.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-[32px] flex items-center gap-4 shadow-2xl">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl shadow-inner">
                 <TrendingUp size={24} />
              </div>
              <div>
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">NETWORK GROWTH</div>
                 <div className="text-2xl font-black text-white italic leading-tight mt-1 tracking-tighter">
                    +{referrals.reduce((sum, r) => sum + (Number(r.referred_users_count) || 0), 0)} <span className="text-xs text-slate-600 not-italic font-bold">UNITS</span>
                 </div>
              </div>
           </div>
        </div>
      </div> 

      {/* Stats Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'TOTAL AFFILIATES', value: referrals.length, color: 'text-blue-400', glow: 'bg-blue-500/10' },
          { icon: Share2, label: 'ACTIVE NODES', value: referrals.filter(r => (r.referred_users_count || 0) > 0).length, color: 'text-[#3DD6C8]', glow: 'bg-[#3DD6C8]/10' },
          { icon: DollarSign, label: 'PASSIVE CAPITAL', value: `$${referrals.reduce((sum, r) => sum + (Number(r.referral_earned) || 0), 0).toLocaleString()}`, color: 'text-emerald-400', glow: 'bg-emerald-500/10' },
          { icon: TrendingUp, label: 'AVG CONVERSION', value: `${referrals.length ? Math.round((referrals.filter(r => (r.referred_users_count || 0) > 0).length / referrals.length) * 100) : 0}%`, color: 'text-indigo-400', glow: 'bg-indigo-500/10' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] backdrop-blur-md relative overflow-hidden group">
             <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-2xl ${s.glow} flex items-center justify-center ${s.color}`}>
                   <s.icon size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
             </div>
             <div className={`text-4xl font-black italic tracking-tighter ${s.color}`}>
                {s.value}
             </div>
          </div>
        ))}
      </div>

      <div className="relative group"> 
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-[#3DD6C8] transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search by code or affiliate username..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="w-full pl-16 pr-6 py-5 bg-slate-900/30 border border-slate-800 rounded-[32px] text-white focus:outline-none focus:ring-4 focus:ring-[#3DD6C8]/10 focus:border-[#3DD6C8]/50 transition-all font-bold placeholder:text-slate-800 uppercase tracking-wider text-sm" 
        /> 
      </div> 

      <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] overflow-hidden backdrop-blur-sm shadow-2xl relative"> 
        <div className="overflow-x-auto">
          <table className="w-full text-sm"> 
            <thead> 
              <tr className="text-left text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/[0.05] bg-white/[0.02]"> 
                <th className="px-8 py-6">Identity</th> 
                <th className="px-8 py-6">Referral Code</th> 
                <th className="px-8 py-6 text-center">Conversion</th> 
                <th className="px-8 py-6">Engagement</th> 
                <th className="px-8 py-6 text-right">Protocol</th> 
              </tr> 
            </thead> 
            <tbody className="divide-y divide-white/[0.05]"> 
              {filteredReferrals.map(ref => ( 
                <tr key={ref.id} className="hover:bg-slate-800/30 transition-colors group"> 
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-white font-black italic shadow-inner">
                        {ref.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-slate-200 uppercase italic tracking-tight">{ref.username || 'GHOST_USER'}</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">{ref.phone}</div>
                      </div>
                    </div>
                  </td> 
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => copyCode(ref.referral_code)}
                      className="group flex items-center gap-3 bg-slate-950 border border-white/10 px-4 py-2 rounded-2xl hover:border-[#3DD6C8]/50 transition-all active:scale-95 shadow-xl shadow-black/40"
                    >
                       <span className="font-mono font-black text-[#3DD6C8] italic tracking-widest text-lg">{ref.referral_code}</span>
                       <Copy size={14} className="text-slate-700 group-hover:text-[#3DD6C8] transition-colors" />
                    </button>
                  </td> 
                  <td className="px-8 py-6 text-center">
                    <div className="text-3xl font-black text-white italic tracking-tighter leading-none">{ref.referred_users_count || 0}</div>
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Confirmed Units</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                      (ref.referred_users_count || 0) > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    }`}>
                      {(ref.referred_users_count || 0) > 0 ? 'ACTIVE YIELD' : 'DORMANT'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right"> 
                    <button className="p-3 bg-white text-black rounded-2xl hover:bg-[#3DD6C8] hover:text-white transition-all shadow-xl active:scale-90">
                       <ExternalLink size={18} strokeWidth={3} />
                    </button> 
                  </td> 
                </tr> 
              ))} 
              {filteredReferrals.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-32 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-[32px] bg-slate-800/50 flex items-center justify-center text-slate-700 mb-6 border border-white/5 shadow-inner">
                        <Share2 size={40} />
                    </div>
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">No Affiliate Records</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">No growth loops detected in this sector</p>
                  </td>
                </tr>
              )}
            </tbody> 
          </table> 
        </div>
      </div> 
    </div> 
  ); 
}
