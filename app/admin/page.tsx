'use client'; 
import { useEffect, useState } from 'react'; 
import { supabase } from '@/lib/supabase/index'; 
import { Users, Layers, Grid3X3, DollarSign, TrendingUp, Share2, ArrowDownToLine, ArrowUpFromLine, Clock, Package, Bell, Activity, ArrowRight, Zap } from 'lucide-react'; 
import Link from 'next/link'; 

interface DashStats { 
  totalUsers: number; 
  totalLevels: number; 
  totalTasks: number; 
  totalReferrals: number; 
  totalDepositsAmount: number; 
  totalWithdrawalsAmount: number; 
  totalCommissions: number; 
  pendingDeposits: number; 
  pendingWithdrawals: number; 
  totalBundles: number; 
  todayProfit: number;
  todayTasks: number;
  todayVolume: number;
} 

interface RecentTransaction { 
  id: number; 
  type: string; 
  amount: number; 
  status: string; 
  created_at: string; 
  profile?: { username: string }; 
} 

export default function AdminDashboard() { 
  const [stats, setStats] = useState<DashStats>({ 
    totalUsers: 0, 
    totalLevels: 0, 
    totalTasks: 0, 
    totalReferrals: 0, 
    totalDepositsAmount: 0, 
    totalWithdrawalsAmount: 0, 
    totalCommissions: 0, 
    pendingDeposits: 0, 
    pendingWithdrawals: 0, 
    totalBundles: 0, 
    todayProfit: 0,
    todayTasks: 0,
    todayVolume: 0,
  }); 
  const [recentTx, setRecentTx] = useState<RecentTransaction[]>([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => { 
    const fetchAll = async () => { 
      try {
          const res = await fetch('/api/admin/stats');
          if (!res.ok) throw new Error('Metric matrix synchronization failure');
          const data = await res.json();
          
          if (data) {
            setStats(data);
          }

          const { data: recent } = await supabase.from('transactions').select('id, type, amount, status, created_at, profile:profiles(username)').order('created_at', { ascending: false }).limit(8); 
          if (recent) setRecentTx(recent as any); 
      } catch (err: any) {
          console.error("Dashboard Sync Loss:", err);
      } finally {
          setLoading(false); 
      }
    }; 
    fetchAll(); 
  }, []); 

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'blue' },
    { label: 'Today Profit', value: `$${stats.todayProfit.toLocaleString()}`, icon: TrendingUp, color: 'cyan' },
    { label: 'Today Volume', value: `$${stats.todayVolume.toLocaleString()}`, icon: Activity, color: 'purple' },
    { label: 'Today Tasks', value: stats.todayTasks.toLocaleString(), icon: Zap, color: 'amber' },
  ];


  return ( 
    <div className="space-y-8 pb-8"> 
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Overview</h2>
          <p className="text-slate-400 mt-1">Platform performance and metrics.</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-slate-950/40 border border-white/[0.05] p-8 rounded-[40px] backdrop-blur-xl group hover:border-[#3DD6C8]/40 transition-all duration-500 relative overflow-hidden shadow-2xl">
            {/* Background Accent Glow */}
            <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${stat.color}-500 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity`} />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-3xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-${stat.color}-500/5`}>
                <stat.icon size={28} strokeWidth={2.5} />
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 group-hover:text-slate-300 transition-colors">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black text-white italic tracking-tighter transition-transform duration-500 group-hover:translate-x-1">{stat.value}</h3>
                    {i === 1 && <span className="text-[10px] font-bold text-emerald-400 opacity-60">+12.5%</span>}
                </div>
                
                {/* Micro Chart Hint */}
                <div className="mt-6 flex items-end gap-1 h-3 opacity-20 group-hover:opacity-40 transition-opacity">
                    {[0.3, 0.5, 0.4, 0.8, 0.6, 0.9, 0.7].map((h, j) => (
                        <div key={j} className={`w-full bg-${stat.color}-400 rounded-full`} style={{ height: `${h * 100}%` }} />
                    ))}
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Alerts */}
      {(stats.pendingDeposits > 0 || stats.pendingWithdrawals > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.pendingDeposits > 0 && (
            <Link href="/admin/deposits" className="flex items-center justify-between p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl hover:bg-blue-500/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/40">
                  <ArrowDownToLine size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{stats.pendingDeposits} Pending Deposits</h4>
                  <p className="text-blue-200/60 text-sm">Action required to update user balances</p>
                </div>
              </div>
              <ArrowRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {stats.pendingWithdrawals > 0 && (
            <Link href="/admin/withdrawals" className="flex items-center justify-between p-6 bg-red-500/10 border border-red-500/20 rounded-3xl hover:bg-red-500/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/40">
                  <ArrowUpFromLine size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{stats.pendingWithdrawals} Pending Withdrawals</h4>
                  <p className="text-red-200/60 text-sm">Review and process payout requests</p>
                </div>
              </div>
              <ArrowRight className="text-red-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      )}

      {/* Platforms Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: Layers, label: 'VIP Levels', value: stats.totalLevels, href: '/admin/levels' },
          { icon: Grid3X3, label: 'Task Items', value: stats.totalTasks, href: '/admin/tasks' },
          { icon: Share2, label: 'Referrals', value: stats.totalReferrals, href: '/admin/referrals' },
          { icon: Package, label: 'Bundles', href: '/admin/bundles' },
          { icon: Clock, label: 'T-Records', href: '/admin/record' },
          { icon: Activity, label: 'Activity', href: '/admin/activity' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:border-slate-600 transition-colors group">
            <item.icon className="text-slate-500 mb-2 group-hover:text-[#3DD6C8] transition-colors" size={20} />
            <span className="text-xs font-medium text-slate-400">{item.label}</span>
            {item.value !== undefined && <span className="text-sm font-bold text-white mt-0.5">{item.value}</span>}
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <Link href="/admin/transactions" className="text-[#3DD6C8] text-sm font-semibold hover:text-purple-300">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {recentTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-slate-200 font-medium">{tx.profile?.username || 'Unknown'}</span>
                  </td>
                  <td className="px-6 py-4 uppercase text-xs font-bold tracking-widest text-slate-400">
                    {tx.type}
                  </td>
                  <td className="px-6 py-4 font-bold text-white">
                    ${tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      tx.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      tx.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                    {new Date(tx.created_at).toLocaleDateString()} {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {recentTx.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No recent transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div> 
  ); 
}
