'use client'; 
import { useEffect, useState } from 'react'; 
import { Send, Users, Bell, AlertTriangle, XCircle, Loader2, MessageSquare, Zap, History, UserCheck, Layers, Target, ChevronDown, X } from 'lucide-react'; 
import { toast } from 'sonner';

type TargetMode = 'all' | 'user' | 'tier';

export default function AdminNotifyPage() { 
  const [users, setUsers] = useState<any[]>([]); 
  const [levels, setLevels] = useState<any[]>([]);
  const [title, setTitle] = useState(''); 
  const [message, setMessage] = useState(''); 
  const [sending, setSending] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Targeting state
  const [targetMode, setTargetMode] = useState<TargetMode>('all');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const resp = await fetch('/api/admin/notify');
      const data = await resp.json();
      if (data.success) setHistory(data.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, levelsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/levels').catch(() => ({ ok: false, json: async () => [] }))
        ]);
        if (usersRes.ok) {
          const data = await usersRes.json();
          if (Array.isArray(data)) setUsers(data);
        }
        if (levelsRes.ok) {
          const lData = await (levelsRes as Response).json();
          if (Array.isArray(lData)) setLevels(lData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchHistory();
  }, []);

  // Fetch levels directly from supabase if no dedicated route
  useEffect(() => {
    if (levels.length === 0) {
      import('@/lib/supabase/index').then(({ supabase }) => {
        supabase.from('levels').select('*').order('price', { ascending: true }).then(({ data }) => {
          if (data) setLevels(data);
        });
      });
    }
  }, [levels.length]);

  const handleDelete = async (title: string, message: string) => {
    if (!confirm('Decommission this broadcast protocol?')) return;
    try {
      const res = await fetch('/api/admin/notify', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'De-index failure');
      toast.success('Protocol de-indexed.');
      fetchHistory();
    } catch (err: any) {
      toast.error(err.message || 'De-index failure');
    }
  };

  const getTargetUserIds = (): string[] => {
    if (targetMode === 'all') return users.map(u => u.id);
    if (targetMode === 'user') return selectedUserId ? [selectedUserId] : [];
    if (targetMode === 'tier' && selectedLevelId) {
      return users.filter(u => u.level_id === selectedLevelId).map(u => u.id);
    }
    return [];
  };

  const targetCount = getTargetUserIds().length;
  const selectedUser = users.find(u => u.id === selectedUserId);
  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  ).slice(0, 20);

  const handleSend = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!title || !message) return;
    const userIds = getTargetUserIds();
    if (userIds.length === 0) {
      toast.error('No target nodes matched. Check your selection.');
      return;
    }
    setSending(true); 
    try {
      const res = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, userIds })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transmission failure');
      toast.success(`Broadcast deployed to ${userIds.length} node${userIds.length !== 1 ? 's' : ''}.`);
      setTitle(''); 
      setMessage(''); 
      fetchHistory();
    } catch (err: any) {
      toast.error(err.message || 'Transmission failure');
    } finally {
      setTimeout(() => setSending(false), 800);
    }
  }; 

  return ( 
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl pb-20"> 
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">System Broadcast</h2>
        <p className="text-slate-400 mt-1">Deploy targeted or global push notifications across the agent network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <form onSubmit={handleSend} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] backdrop-blur-sm space-y-6 shadow-2xl"> 

            {/* Target Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 pl-1">Target Audience</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-2xl">
                {([
                  { mode: 'all' as TargetMode, icon: Users, label: 'All Users' },
                  { mode: 'user' as TargetMode, icon: UserCheck, label: 'Single User' },
                  { mode: 'tier' as TargetMode, icon: Layers, label: 'By Tier' },
                ]).map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setTargetMode(mode); setSelectedUserId(''); setSelectedLevelId(null); }}
                    className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${
                      targetMode === mode
                        ? 'bg-[#3DD6C8] text-white shadow-lg shadow-[#3DD6C8]/20'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    <Icon size={12} /> {label}
                  </button>
                ))}
              </div>

              {/* User search dropdown */}
              {targetMode === 'user' && (
                <div className="relative">
                  <div
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white flex items-center justify-between cursor-pointer hover:border-[#3DD6C8]/50 transition-all"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <span className={selectedUser ? 'text-white font-bold' : 'text-slate-600 text-sm'}>
                      {selectedUser ? `${selectedUser.username} — ${selectedUser.email}` : 'Select a user...'}
                    </span>
                    <ChevronDown size={16} className="text-slate-600" />
                  </div>
                  {showUserDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-3 border-b border-slate-800">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search by name or email..."
                          value={userSearch}
                          onChange={e => setUserSearch(e.target.value)}
                          className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3DD6C8]/50"
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredUsers.map(u => (
                          <div
                            key={u.id}
                            onClick={() => { setSelectedUserId(u.id); setShowUserDropdown(false); setUserSearch(''); }}
                            className="px-5 py-3 hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black text-xs">
                              {u.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-black text-white">{u.username}</div>
                              <div className="text-[10px] text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        ))}
                        {filteredUsers.length === 0 && (
                          <div className="px-5 py-6 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">No matches found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tier dropdown */}
              {targetMode === 'tier' && (
                <div className="grid grid-cols-2 gap-2">
                  {levels.map(l => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelectedLevelId(selectedLevelId === l.id ? null : l.id)}
                      className={`py-3 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border text-left flex items-center gap-2 ${
                        selectedLevelId === l.id
                          ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Layers size={12} />
                      <div>
                        <div>{l.name}</div>
                        <div className="text-[8px] opacity-50 normal-case">
                          {users.filter(u => u.level_id === l.id).length} users
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Reach indicator */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                targetCount > 0 ? 'bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/20' : 'bg-slate-900 text-slate-600'
              }`}>
                <Target size={12} />
                Reach: {loading ? 'Scanning...' : `${targetCount} node${targetCount !== 1 ? 's' : ''}`}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Protocol Title</label>
              <input 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#3DD6C8]/20 focus:border-[#3DD6C8] transition-all italic text-lg" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="SYSTEM_UPDATE_PROTOCOL" 
                required 
              /> 
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Encrypted Payload</label>
              <textarea 
                className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-6 py-5 text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#3DD6C8]/20 focus:border-[#3DD6C8] transition-all h-32 leading-relaxed text-sm" 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                placeholder="Enter notification content here..." 
                required 
              /> 
            </div>

            <button 
              type="submit" 
              disabled={sending || loading || targetCount === 0} 
              className={`
                w-full py-5 rounded-[24px] font-black uppercase tracking-[0.3em] italic text-lg transition-all flex items-center justify-center gap-4
                ${sending ? 'bg-slate-800 text-slate-500' : 'bg-[#3DD6C8] text-white hover:bg-[#3DD6C8]/90 shadow-xl shadow-[#3DD6C8]/20 active:scale-95'}
                disabled:opacity-50
              `}
            >
              {sending ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
              {sending ? 'Broadcasting...' : `Deploy to ${targetCount} Node${targetCount !== 1 ? 's' : ''}`}
            </button> 
          </form> 

          {/* History Ledger */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 pl-2 flex items-center gap-2 italic">
               <History size={14} className="text-[#3DD6C8]" />
               Transmission Ledger
            </h3>
            <div className="space-y-4">
               {loadingHistory ? (
                   <div className="p-12 flex justify-center text-slate-700 italic font-medium">Synchronizing Ledger...</div>
               ) : history.length === 0 ? (
                   <div className="p-12 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-[32px] text-slate-600 font-bold uppercase tracking-widest text-[10px]">No historical protocols found.</div>
               ) : (
                history.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[32px] group hover:border-[#3DD6C8]/30 transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 shrink-0">
                                    <Bell size={20} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-black text-white italic uppercase">{item.title}</h4>
                                        <span className="px-2 py-0.5 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 text-[8px] font-black text-[#3DD6C8] uppercase tracking-widest">{item.count} NODES</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-xl">{item.message}</p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">STAMP: {new Date(item.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDelete(item.title, item.message)}
                                className="p-3 rounded-xl bg-white/5 text-slate-600 hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    </div>
                ))
               )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] backdrop-blur-sm sticky top-8 space-y-8">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                   <Users size={14} className="text-[#3DD6C8]" />
                   Network Status
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">Total Agents</span>
                    <span className="text-lg font-black text-white italic">{users.length}</span>
                  </div>
                  {levels.map(l => (
                    <div key={l.id} className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{l.name}</span>
                      <span className="text-sm font-black text-slate-300">{users.filter(u => u.level_id === l.id).length}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-amber-500 mb-4">
                    <AlertTriangle size={20} />
                    <h4 className="font-black uppercase italic tracking-tighter">Caution</h4>
                </div>
                <p className="text-[10px] text-amber-200/60 leading-relaxed font-bold uppercase tracking-widest opacity-80">
                    Broadcasts are immutable and cannot be recalled once the execution protocol is initiated. Verify payload integrity before confirming.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div> 
  ); 
}
