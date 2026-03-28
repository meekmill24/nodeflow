'use client'; 
import { useEffect, useState } from 'react'; 
import { supabase } from '@/lib/supabase/index'; 
import { Send, Users, Bell, Info, CheckCircle, AlertTriangle, XCircle, Loader2, MessageSquare, Zap, History } from 'lucide-react'; 
import { toast } from 'sonner';

export default function AdminNotifyPage() { 
  const [users, setUsers] = useState<any[]>([]); 
  const [title, setTitle] = useState(''); 
  const [message, setMessage] = useState(''); 
  const [sending, setSending] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const resp = await fetch('/api/admin/notify');
      const data = await resp.json();
      if (data.success) {
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    supabase.from('profiles').select('id, username').then(({ data }) => {
      if (data) setUsers(data);
      setLoading(false);
    });
    fetchHistory();
  }, []);

  const handleDelete = async (title: string, message: string) => {
    if (!confirm("Decomission this broadcast protocol?")) return;
    try {
        const res = await fetch('/api/admin/notify', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, message })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "De-index failure");
        
        toast.success("Protocol de-indexed.");
        fetchHistory();
    } catch (err: any) {
        toast.error(err.message || "De-index failure");
    }
  }

  const handleSend = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!title || !message) return;
    
    setSending(true); 
    try {
      const userIds = users.map(u => u.id);
      const res = await fetch('/api/admin/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, message, userIds })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transmission failure');

      toast.success(`Broadcasting to ${users.length} users completed.`);
      setTitle(''); 
      setMessage(''); 
      fetchHistory();
    } catch (err: any) {
        console.error('Send failed:', err);
      toast.error(err.message || 'Transmission failure');
    } finally {
      setSending(true); // Artificial delay for UX feel
      setTimeout(() => setSending(false), 800);
    }
  }; 

  return ( 
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl pb-20"> 
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">System Broadcast</h2>
        <p className="text-slate-400 mt-1">Deploy and monitor global push notifications across the agent network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Form */}
          <form onSubmit={handleSend} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] backdrop-blur-sm space-y-6 shadow-2xl"> 
            <div className="p-4 bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 rounded-3xl flex items-center gap-4 mb-2">
               <div className="w-12 h-12 bg-[#3DD6C8] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#3DD6C8]/20">
                  <MessageSquare size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-white uppercase italic tracking-widest text-sm">Compose Transmission</h3>
                  <p className="text-[10px] text-[#3DD6C8] font-bold uppercase tracking-[0.1em]">Target: {loading ? 'Scanning...' : `${users.length} Active Agents`}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Protocol Title</label>
                    <input 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#3DD6C8]/20 focus:border-[#3DD6C8] transition-all italic text-lg" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="INCIDENT_REPORT_X" 
                        required 
                    /> 
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Encrypted Payload</label>
                    <textarea 
                        className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-6 py-5 text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#3DD6C8]/20 focus:border-[#3DD6C8] transition-all h-32 leading-relaxed text-sm" 
                        value={message} 
                        onChange={e => setMessage(e.target.value)} 
                        placeholder="Enter detailed notification content here..." 
                        required 
                    /> 
                </div>
            </div>

            <button 
              type="submit" 
              disabled={sending || loading || users.length === 0} 
              className={`
                w-full py-5 rounded-[24px] font-black uppercase tracking-[0.3em] italic text-lg transition-all flex items-center justify-center gap-4
                ${sending ? 'bg-slate-800 text-slate-500' : 'bg-[#3DD6C8] text-white hover:bg-[#3DD6C8]/90 shadow-xl shadow-[#3DD6C8]/20 active:scale-95'}
              `}
            >
              {sending ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
              {sending ? 'Broadcasting...' : 'Execute Protocol'}
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

        <div className="space-y-6">
           <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] backdrop-blur-sm sticky top-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                 <Users size={14} className="text-[#3DD6C8]" />
                 Engagement Status
              </h4>
              
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">Total Reach</span>
                    <span className="text-lg font-black text-white italic">{users.length} Agents</span>
                 </div>
                 <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#3DD6C8] h-full w-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                 </div>
                 <p className="text-[10px] text-slate-600 italic leading-relaxed">System protocols are distributed horizontally across all authorized nodes instantly upon execution.</p>
              </div>

              <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                <div className="flex items-center gap-3 text-amber-500">
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
