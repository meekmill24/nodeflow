'use client'; 
import { useEffect, useState } from 'react'; 
import { supabase } from '@/lib/supabase/index'; 
import { Users, Layers, Grid3X3, DollarSign, TrendingUp, Share2, ArrowDownToLine, ArrowUpFromLine, Clock, Package, Bell, Activity, ArrowRight, Zap, Megaphone, X, Save, CheckCircle2 } from 'lucide-react'; 
import Link from 'next/link'; 
import { toast } from 'sonner';

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

// Mini sparkline bar chart component
function Sparkline({ data, color = '#3DD6C8' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-500"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.6 + (i / data.length) * 0.4 }}
        />
      ))}
    </div>
  );
}

export default function AdminDashboard() { 
  const [stats, setStats] = useState<DashStats>({ 
    totalUsers: 0, totalLevels: 0, totalTasks: 0, totalReferrals: 0,
    totalDepositsAmount: 0, totalWithdrawalsAmount: 0, totalCommissions: 0,
    pendingDeposits: 0, pendingWithdrawals: 0, totalBundles: 0,
    todayProfit: 0, todayTasks: 0, todayVolume: 0,
  }); 
  const [recentTx, setRecentTx] = useState<RecentTransaction[]>([]); 
  const [loading, setLoading] = useState(true);

  // Chart data (last 7 days volumes approximated from transactions)
  const [chartData, setChartData] = useState<{ labels: string[]; deposits: number[]; withdrawals: number[]; users: number[] }>({
    labels: [], deposits: [], withdrawals: [], users: []
  });

  // Announcement with User Targeting
  const [announcement, setAnnouncement] = useState('');
  const [announcementInput, setAnnouncement_input] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'specific'>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showAnnouncementEdit, setShowAnnouncementEdit] = useState(false);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

  useEffect(() => { 
    const fetchAll = async () => { 
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Stats fetch failed');
        const data = await res.json();
        if (data) setStats(data);

        const { data: recent } = await supabase
          .from('transactions')
          .select('id, type, amount, status, created_at, profile:profiles(username)')
          .order('created_at', { ascending: false })
          .limit(8); 
        if (recent) setRecentTx(recent as any); 

        // Load users for banner targeting via Admin API (bypasses client-side RLS)
        let allUsers: any[] = [];
        try {
          const usersRes = await fetch('/api/admin/users');
          if (usersRes.ok) {
            allUsers = await usersRes.json();
            if (Array.isArray(allUsers)) {
              const nonAdminUsers = allUsers.filter((u: any) => u.role !== 'admin');
              setUsersList(nonAdminUsers);
            }
          }
        } catch (uErr) {
          console.error('Failed to load users for targeting:', uErr);
        }

        // Build last-7-days chart data
        const now = new Date();
        const labels: string[] = [];
        const deposits: number[] = [];
        const withdrawals: number[] = [];
        const usersPerDay: number[] = [];

        for (let i = 6; i >= 0; i--) {
          const day = new Date(now);
          day.setDate(now.getDate() - i);
          const dayStr = day.toISOString().split('T')[0];
          labels.push(day.toLocaleDateString('en', { weekday: 'short' }));

          const { data: dayTx } = await supabase
            .from('transactions')
            .select('amount, type')
            .gte('created_at', dayStr + 'T00:00:00')
            .lte('created_at', dayStr + 'T23:59:59');

          deposits.push((dayTx || []).filter(t => t.type === 'deposit').reduce((a, t) => a + t.amount, 0));
          withdrawals.push((dayTx || []).filter(t => t.type === 'withdrawal').reduce((a, t) => a + t.amount, 0));

          const count = (allUsers || []).filter((u: any) => {
            if (!u.created_at) return false;
            return u.created_at.startsWith(dayStr);
          }).length;

          usersPerDay.push(count);
        }

        setChartData({ labels, deposits, withdrawals, users: usersPerDay });

        // Load announcement from site settings
        const { data: settingData } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'announcement_banner')
          .single();
        if (settingData?.value) {
          try {
            const parsed = JSON.parse(settingData.value);
            if (parsed && typeof parsed === 'object' && parsed.text !== undefined) {
              setAnnouncement(parsed.text);
              setAnnouncement_input(parsed.text);
              setTargetAudience(parsed.target || 'all');
              setSelectedUserIds(Array.isArray(parsed.targetUserIds) ? parsed.targetUserIds : []);
            } else {
              setAnnouncement(settingData.value);
              setAnnouncement_input(settingData.value);
              setTargetAudience('all');
              setSelectedUserIds([]);
            }
          } catch {
            setAnnouncement(settingData.value);
            setAnnouncement_input(settingData.value);
            setTargetAudience('all');
            setSelectedUserIds([]);
          }
        }
      } catch (err: any) {
        console.error('Dashboard Sync Loss:', err);
      } finally {
        setLoading(false); 
      }
    }; 
    fetchAll(); 
  }, []); 

  const saveAnnouncement = async () => {
    if (!announcementInput.trim()) {
      toast.error('Please enter a banner message or click Clear to remove.');
      return;
    }
    if (targetAudience === 'specific' && selectedUserIds.length === 0) {
      toast.error('Please select at least one worker for targeted delivery.');
      return;
    }
    setSavingAnnouncement(true);
    try {
      const payloadValue = JSON.stringify({
        text: announcementInput.trim(),
        target: targetAudience,
        targetUserIds: targetAudience === 'specific' ? selectedUserIds : []
      });
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'announcement_banner', value: payloadValue }, { onConflict: 'key' });
      if (error) throw error;
      setAnnouncement(announcementInput.trim());
      setShowAnnouncementEdit(false);
      toast.success(targetAudience === 'specific' 
        ? `Targeted banner activated for ${selectedUserIds.length} worker(s).` 
        : 'Broadcast banner activated for all workers.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const clearAnnouncement = async () => {
    setSavingAnnouncement(true);
    try {
      await supabase.from('site_settings').upsert({ key: 'announcement_banner', value: '' }, { onConflict: 'key' });
      setAnnouncement('');
      setAnnouncement_input('');
      setSelectedUserIds([]);
      setTargetAudience('all');
      setShowAnnouncementEdit(false);
      toast.success('Announcement banner cleared.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'blue', sparkData: chartData.users },
    { label: 'Today Profit', value: `$${stats.todayProfit.toLocaleString()}`, icon: TrendingUp, color: 'cyan', sparkData: chartData.deposits.map(d => d * 0.045) },
    { label: 'Today Volume', value: `$${stats.todayVolume.toLocaleString()}`, icon: Activity, color: 'purple', sparkData: chartData.deposits },
    { label: 'Today Tasks', value: stats.todayTasks.toLocaleString(), icon: Zap, color: 'amber', sparkData: [3,7,5,9,6,8,10] },
  ];

  const colorMap: Record<string, string> = {
    blue: '#3b82f6', cyan: '#3DD6C8', purple: '#a855f7', amber: '#f59e0b'
  };

  return ( 
    <div className="space-y-8 pb-8"> 

      {/* Announcement Banner Manager */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Megaphone size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Announcement Banner</p>
                {announcement && (
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                    targetAudience === 'specific' 
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {targetAudience === 'specific' ? `Targeted (${selectedUserIds.length} Workers)` : 'All Workers (Broadcast)'}
                  </span>
                )}
              </div>
              <p className={`text-sm font-medium mt-0.5 ${announcement ? 'text-white' : 'text-slate-600 italic'}`}>
                {announcement || 'No active banner — click Edit to set one'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {announcement && (
              <button onClick={clearAnnouncement} className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-all border border-rose-500/20">
                Clear
              </button>
            )}
            <button
              onClick={async () => {
                const nextState = !showAnnouncementEdit;
                setShowAnnouncementEdit(nextState);
                if (nextState && usersList.length === 0) {
                  try {
                    const res = await fetch('/api/admin/users');
                    if (res.ok) {
                      const u = await res.json();
                      if (Array.isArray(u)) setUsersList(u.filter((x: any) => x.role !== 'admin'));
                    }
                  } catch {}
                }
              }}
              className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 rounded-xl hover:bg-amber-500/20 transition-all border border-amber-500/20 flex items-center gap-1.5"
            >
              <Megaphone size={12} /> Edit Banner
            </button>
          </div>
        </div>

        {showAnnouncementEdit && (
          <div className="mt-5 pt-5 border-t border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Target Mode Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400">Audience Targeting:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTargetAudience('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    targetAudience === 'all'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All Workers
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setTargetAudience('specific');
                    if (usersList.length === 0) {
                      try {
                        const res = await fetch('/api/admin/users');
                        if (res.ok) {
                          const u = await res.json();
                          if (Array.isArray(u)) setUsersList(u.filter((x: any) => x.role !== 'admin'));
                        }
                      } catch {}
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    targetAudience === 'specific'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Specific Workers ({selectedUserIds.length})
                </button>
              </div>
            </div>

            {/* If Specific Workers, Show Search & Multi-Select Checklist */}
            {targetAudience === 'specific' && (
              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Select Target Workers ({selectedUserIds.length} of {usersList.length} selected):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUserIds(usersList.map(u => u.id))}
                      className="text-[9px] font-bold text-amber-400 hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-700">•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedUserIds([])}
                      className="text-[9px] font-bold text-slate-500 hover:text-white"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  placeholder="Search workers by username or email..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 placeholder:text-slate-700"
                />

                {usersList.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Loading worker accounts...
                  </div>
                ) : usersList.filter(u => 
                    (u.username || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase())
                  ).length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No matching workers found for &quot;{userSearchQuery}&quot;
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pr-1">
                    {usersList
                      .filter(u => 
                        (u.username || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase())
                      )
                      .map(user => {
                        const isSelected = selectedUserIds.includes(user.id);
                        return (
                          <div
                            key={user.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                              } else {
                                setSelectedUserIds([...selectedUserIds, user.id]);
                              }
                            }}
                            className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between gap-2 transition-all select-none ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500/40 text-white'
                                : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                                isSelected ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'
                              }`}>
                                {(user.username || 'U')[0].toUpperCase()}
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-bold text-white truncate">{user.username}</p>
                                <p className="text-[9px] text-slate-500 truncate">{user.email || 'No email'}</p>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-amber-500 border-amber-500 text-black' : 'border-slate-700'
                            }`}>
                              {isSelected && <CheckCircle2 size={12} strokeWidth={3} />}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Banner text input and action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={announcementInput}
                onChange={e => setAnnouncement_input(e.target.value)}
                placeholder="e.g. 🔔 Account settlement required. Please contact support..."
                className="flex-1 bg-black/40 border border-slate-700 rounded-2xl px-5 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-700"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={saveAnnouncement}
                  disabled={savingAnnouncement}
                  className="px-6 py-3 bg-amber-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingAnnouncement ? 'Saving...' : <><Save size={14} /> Save Banner</>}
                </button>
                <button onClick={() => setShowAnnouncementEdit(false)} className="p-3 text-slate-600 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
            <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${stat.color}-500 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className="relative z-10 flex flex-col h-full">
              <div className={`w-14 h-14 rounded-3xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <stat.icon size={28} strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-white italic tracking-tighter mb-4">{stat.value}</h3>
              {stat.sparkData.length > 0 && (
                <Sparkline data={stat.sparkData} color={colorMap[stat.color]} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart — 7 Day Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deposit vs Withdrawal */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-white uppercase italic tracking-tighter">7-Day Volume</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Deposits vs Withdrawals</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-[#3DD6C8]"><span className="w-2.5 h-2.5 rounded-full bg-[#3DD6C8]" /> Deposits</span>
              <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Withdrawals</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {chartData.labels.map((label, i) => {
              const maxVal = Math.max(...chartData.deposits, ...chartData.withdrawals, 1);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5" style={{ height: '100px' }}>
                    <div className="flex-1 rounded-t-lg bg-[#3DD6C8]/70 transition-all duration-700" style={{ height: `${(chartData.deposits[i] / maxVal) * 100}%` }} />
                    <div className="flex-1 rounded-t-lg bg-rose-400/60 transition-all duration-700" style={{ height: `${(chartData.withdrawals[i] / maxVal) * 100}%` }} />
                  </div>
                  <span className="text-[8px] font-black text-slate-600 uppercase">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* New Users per day */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-white uppercase italic tracking-tighter">New Registrations</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">New users per day (7 days)</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {chartData.labels.map((label, i) => {
              const maxVal = Math.max(...chartData.users, 1);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full" style={{ height: '100px', display: 'flex', alignItems: 'flex-end' }}>
                    <div className="w-full rounded-t-lg bg-blue-500/70 transition-all duration-700" style={{ height: `${(chartData.users[i] / maxVal) * 100}%`, minHeight: chartData.users[i] > 0 ? '4px' : '0' }} />
                  </div>
                  <span className="text-[8px] font-black text-slate-600 uppercase">{label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">7-Day Total</span>
            <span className="text-lg font-black text-white">{chartData.users.reduce((a, b) => a + b, 0)} new agents</span>
          </div>
        </div>
      </div>

      {/* Action Alerts */}
      {(stats.pendingDeposits > 0 || stats.pendingWithdrawals > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.pendingDeposits > 0 && (
            <Link href="/admin/deposits" className="flex items-center justify-between p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl hover:bg-blue-500/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/40"><ArrowDownToLine size={24} /></div>
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
                <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/40"><ArrowUpFromLine size={24} /></div>
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
          { icon: Bell, label: 'Notify', href: '/admin/notify' },
          { icon: DollarSign, label: 'Settings', href: '/admin/settings' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:border-slate-600 transition-colors group">
            <item.icon className="text-slate-500 mb-2 group-hover:text-[#3DD6C8] transition-colors" size={20} />
            <span className="text-xs font-medium text-slate-400">{item.label}</span>
            {(item as any).value !== undefined && <span className="text-sm font-bold text-white mt-0.5">{(item as any).value}</span>}
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
                  <td className="px-6 py-4"><span className="text-slate-200 font-medium">{tx.profile?.username || 'Unknown'}</span></td>
                  <td className="px-6 py-4 uppercase text-xs font-bold tracking-widest text-slate-400">{tx.type}</td>
                  <td className="px-6 py-4 font-bold text-white">${tx.amount.toLocaleString()}</td>
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
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No recent transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div> 
  ); 
}
