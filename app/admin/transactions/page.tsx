'use client'; 
import { useEffect, useState } from 'react'; 
import { supabase } from '@/lib/supabase/index'; 
import type { Transaction } from '@/lib/types'; 
import { Search, ArrowUpRight, ArrowDownLeft, Snowflake, DollarSign, Filter, RefreshCcw, User as UserIcon, Calendar, Info, Eye, ExternalLink, Trash2, TrendingUp, Share2, ChevronDown } from 'lucide-react'; 
import { toast } from 'sonner';

export default function AdminTransactionsPage() { 
  const [transactions, setTransactions] = useState<(Transaction & { profile?: { username: string } })[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [search, setSearch] = useState(''); 
  const [typeFilter, setTypeFilter] = useState<string>('all'); 

  const fetchTransactions = async () => { 
    setLoading(true);
    try {
        const res = await fetch('/api/admin/transactions?type=all');
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        setTransactions(data || []);
    } catch (err) {
        console.error(err);
        toast.error('Directory Sync Loss: Ledger registry disconnected');
    } finally {
        setLoading(false);
    }
  }; 

  useEffect(() => { fetchTransactions(); }, []); 

  const handleDelete = async (id: number) => { 
    if (!confirm('EXTREME WARNING: Deleting a transaction record does NOT reverse the financial impact on the user balance. Proceed?')) return; 
    await supabase.from('transactions').delete().eq('id', id); 
    fetchTransactions(); 
  }; 

  const filtered = transactions.filter(t => {
    const matchesSearch = (t.description?.toLowerCase().includes(search.toLowerCase()) || 
                          t.profile?.username?.toLowerCase().includes(search.toLowerCase()));
    
    if (typeFilter === 'all') return matchesSearch;
    if (typeFilter === 'referral') return matchesSearch && t.description?.toLowerCase().includes('referral');
    if (typeFilter === 'task') return matchesSearch && (t.description?.toLowerCase().includes('level') || t.description?.toLowerCase().includes('task'));
    return matchesSearch && t.type === typeFilter;
  });

  // Calculate Matrix
  const stats = {
    turnover: transactions.reduce((sum, t) => sum + t.amount, 0),
    liquidity: transactions.reduce((sum, t) => {
        if (t.type === 'deposit') return sum + t.amount;
        if (t.type === 'withdrawal') return sum - t.amount;
        return sum;
    }, 0),
    referrals: transactions.filter(t => t.description?.toLowerCase().includes('referral')).reduce((sum, t) => sum + t.amount, 0),
    peak: Math.max(...transactions.map(t => t.amount), 0)
  };

  return ( 
    <div className="space-y-8 animate-in fade-in duration-500 pb-20"> 
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"> 
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Financial Ledger</h1> 
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Audit log of all platform financial movements.</p>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={fetchTransactions} className="h-14 px-6 bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl hover:text-[#3DD6C8] hover:border-[#3DD6C8]/30 transition-all flex items-center gap-3 group">
              <RefreshCcw size={20} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
              <span className="text-[10px] font-black uppercase tracking-widest">{loading ? 'SYNCING...' : 'REFRESH'}</span>
            </button>
        </div>
      </div> 

      {/* Stats Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: DollarSign, label: 'TOTAL TURNOVER', value: `$${stats.turnover.toLocaleString()}`, color: 'text-indigo-400', glow: 'bg-indigo-500/10' },
          { icon: TrendingUp, label: 'NET LIQUIDITY', value: `$${stats.liquidity.toLocaleString()}`, color: stats.liquidity >= 0 ? 'text-emerald-400' : 'text-rose-400', glow: stats.liquidity >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10' },
          { icon: Share2, label: 'REFERRAL YIELD', value: `$${stats.referrals.toLocaleString()}`, color: 'text-amber-400', glow: 'bg-amber-500/10' },
          { icon: ArrowUpRight, label: 'PEAK TRANSACTION', value: `$${stats.peak.toLocaleString()}`, color: 'text-[#3DD6C8]', glow: 'bg-[#3DD6C8]/10' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] backdrop-blur-md relative overflow-hidden group">
             <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-2xl ${s.glow} flex items-center justify-center ${s.color}`}>
                   <s.icon size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
             </div>
             <div className={`text-3xl font-black italic tracking-tighter ${s.color}`}>
                {s.value}
             </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-4"> 
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-[#3DD6C8] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by user or description..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-16 pr-6 py-5 bg-slate-900/30 border border-slate-800 rounded-[28px] text-white focus:outline-none focus:ring-4 focus:ring-[#3DD6C8]/10 focus:border-[#3DD6C8]/50 transition-all font-bold placeholder:text-slate-800 text-sm uppercase tracking-wide" 
          /> 
        </div>
        <div className="relative">
          <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)} 
            className="pl-16 pr-12 h-16 bg-slate-900/50 border border-slate-800 rounded-[28px] text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#3DD6C8]/20 transition-all font-black uppercase tracking-widest text-[10px] min-w-[240px]"
          > 
            <option value="all">Global Ledger</option> 
            <option value="deposit">Deposits Only</option> 
            <option value="withdrawal">Withdrawals Only</option> 
            <option value="referral">Referral Commissions</option> 
            <option value="task">Task Commissions</option> 
            <option value="commission">Other Commissions</option> 
            <option value="freeze">Hold / Freeze</option> 
          </select> 
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
        </div>
      </div> 

      <div className="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden backdrop-blur-sm"> 
        <div className="overflow-x-auto">
          <table className="w-full text-sm"> 
            <thead> 
              <tr className="text-left text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-800"> 
                <th className="px-8 py-6">Identity</th> 
                <th className="px-8 py-6">Classification</th> 
                <th className="px-8 py-6 font-bold text-white">Quantum</th> 
                <th className="px-8 py-6">Evidence</th>
                <th className="px-8 py-6">Manifestation</th> 
                <th className="px-8 py-6 text-right text-rose-500">Purge</th> 
              </tr> 
            </thead> 
            <tbody className="divide-y divide-slate-800/50"> 
              {filtered.map(tx => ( 
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group"> 
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                        <UserIcon size={14} />
                      </div>
                      <span className="font-bold text-slate-200">{tx.profile?.username || 'System Account'}</span>
                    </div>
                  </td> 
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {tx.type === 'deposit' ? <ArrowDownLeft className="text-green-500" size={14} /> : 
                        tx.type === 'withdrawal' ? <ArrowUpRight className="text-rose-500" size={14} /> :
                        tx.type === 'freeze' ? <Snowflake className="text-blue-400" size={14} /> :
                        <DollarSign className="text-[#3DD6C8]" size={14} />}
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tx.type}</span>
                    </div>
                  </td> 
                  <td className="px-8 py-6 font-black text-white italic tracking-tight text-lg">
                    ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td> 
                  <td className="px-8 py-6">
                    {tx.type === 'deposit' && tx.proof_url ? (
                      <a 
                        href={tx.proof_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#3DD6C8] hover:text-white transition-all flex items-center gap-2 w-fit"
                      >
                        <Eye size={12} />
                        View Proof
                      </a>
                    ) : (
                      <span className="text-slate-700 text-[10px] italic font-medium opacity-40">—</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="max-w-[200px] truncate text-xs text-slate-500 font-medium mb-1" title={tx.description}>
                      {tx.description}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <Calendar size={10} />
                      {new Date(tx.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right"> 
                    <button onClick={() => handleDelete(tx.id)} className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                       <Trash2 size={16} />
                    </button> 
                  </td> 
                </tr> 
              ))} 
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-600 italic font-medium">No financial records detected in this audit scope</td>
                </tr>
              )}
            </tbody> 
          </table> 
        </div>
      </div> 
    </div> 
  ); 
}

