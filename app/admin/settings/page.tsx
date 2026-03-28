'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  DollarSign, 
  UserPlus, 
  CreditCard, 
  Palette,
  Layout,
  Share2,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [provisioningKeys, setProvisioningKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/site-settings');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
      setSettings(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (key: string, value: any) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');
      
      setSuccess(true);
      toast.success('System Protocols Synchronized');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#3DD6C8]" size={32} />
      </div>
    );
  }

  return ( 
    <div className="space-y-12 animate-in fade-in duration-700 pb-24"> 
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10"> 
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-[#3DD6C8] rounded-full animate-ping" />
             <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent">System Parameters</h1> 
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Global site controls and financial calibration protocols.</p>
        </div>
        <div className="flex items-center gap-4">
            <button 
              onClick={handleSave} 
              disabled={saving} 
              className={`
                flex items-center gap-4 px-10 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-500
                ${success ? 'bg-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-white text-black hover:bg-[#3DD6C8] hover:text-white shadow-2xl'}
                ${saving ? 'opacity-50 cursor-wait' : 'hover:scale-105 active:scale-95'}
              `}
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Save size={20} />}
              {success ? 'PROTOCOLS UPDATED' : 'COMMIT CONFIGURATION'}
            </button> 
        </div>
      </div> 

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8"> 
        {/* PILLAR 1: OPERATIONAL CORE */}
        <div className="space-y-8">
          <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl relative overflow-hidden group hover:border-[#3DD6C8]/20 transition-all duration-700">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#3DD6C8]/5 blur-[80px] rounded-full group-hover:bg-[#3DD6C8]/10 transition-colors" />
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 ring-1 ring-blue-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Operational Core</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Live Kill-Switches</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'maintenance_mode', label: 'Maintenance Mode', desc: 'Lock the site for all users', icon: ShieldCheck, color: 'text-rose-400' },
                { key: 'new_registrations_enabled', label: 'Registrations', desc: 'Allow new user discovery', icon: UserPlus, color: 'text-[#3DD6C8]' },
                { key: 'deposits_enabled', label: 'Top-Up Nodes', desc: 'Enable financial influx', icon: CreditCard, color: 'text-emerald-400' },
                { key: 'withdrawals_enabled', label: 'Payout Nodes', desc: 'Enable wealth extraction', icon: DollarSign, color: 'text-amber-400' },
              ].map((cfg) => {
                const item = settings.find(s => s.key === cfg.key);
                if (!item) return null;
                const isActive = item.value === 'true' || item.value === true;
                return (
                  <div key={cfg.key} className="flex items-center justify-between p-5 bg-black/40 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex gap-4">
                      <div className={`p-2.5 rounded-xl h-fit bg-white/5 ${isActive ? cfg.color : 'text-slate-700 opacity-40'}`}>
                        <cfg.icon size={18} />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-wider">{cfg.label}</div>
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tight mt-0.5">{cfg.desc}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUpdate(cfg.key, !isActive)}
                      className={`
                        w-14 h-7 rounded-full relative transition-all duration-500
                        ${isActive ? 'bg-[#3DD6C8]' : 'bg-slate-800'}
                      `}
                    >
                      <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all duration-500 ${isActive ? 'left-8 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'left-1.5 opacity-40'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl group hover:border-indigo-500/20 transition-all">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 ring-1 ring-indigo-500/20">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Internalization</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Matrix Language</p>
              </div>
            </div>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Default Platform Language</label>
                    <select 
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#3DD6C8]/20 transition-all font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                      value={settings.find(s => s.key === 'default_language')?.value || 'en'}
                      onChange={(e) => handleUpdate('default_language', e.target.value)}
                    >
                      <option value="en">English (US)</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="it">Italiano</option><option value="pt">Português</option><option value="ru">Русский</option><option value="zh">中文 (Chinese)</option><option value="ja">日本語 (Japanese)</option><option value="ko">한국어 (Korean)</option><option value="ar">العربية (Arabic)</option><option value="tr">Türkçe</option><option value="gh">Ghanaian (Ewe/Twi/Ga)</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Default Protocol Currency</label>
                    <select 
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#3DD6C8]/20 transition-all font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                      value={settings.find(s => s.key === 'default_currency')?.value || 'USD'}
                      onChange={(e) => handleUpdate('default_currency', e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="GHC">GHC (GH₵)</option>
                      <option value="AED">AED (Dh)</option>
                      <option value="BTC">BTC (₿)</option>
                    </select>
                </div>
            </div>
          </section>
        </div>

        {/* PILLAR 2: FINANCIAL MATRIX */}
        <div className="xl:col-span-2 space-y-8">
           <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700">
             <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 ring-1 ring-emerald-500/20">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Wealth Calibration</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Commissions & Minimums</p>
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { key: 'min_deposit', label: 'Minimum Influx', icon: ArrowDownLeft, suffix: 'USD', placeholder: '10' },
                    { key: 'min_withdrawal', label: 'Minimum Extraction', icon: ArrowUpRight, suffix: 'USD', placeholder: '30' },
                    { key: 'currency_symbol', label: 'Visual Currency', icon: Palette, suffix: 'SYMBOL', placeholder: '$' },
                    { key: 'referral_commission_l1', label: 'L1 Growth Yield', icon: Share2, suffix: '%', placeholder: '16' },
                    { key: 'referral_commission_l2', label: 'L2 Growth Yield', icon: Share2, suffix: '%', placeholder: '8' },
                    { key: 'referral_commission_l3', label: 'L3 Growth Yield', icon: Share2, suffix: '%', placeholder: '4' },
                    { key: 'signup_bonus', label: 'Referral Signup Bonus', icon: UserPlus, suffix: 'USD', placeholder: '2' },
                ].map((cfg) => {
                    const item = settings.find(s => s.key === cfg.key);
                    return (
                        <div key={cfg.key} className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{cfg.label}</label>
                            <div className="relative group/input">
                                <input 
                                    className="w-full bg-black/40 border border-white/5 rounded-[24px] px-6 py-5 text-white font-black italic text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
                                    value={item?.value || ''}
                                    onChange={(e) => handleUpdate(cfg.key, e.target.value)}
                                    placeholder={cfg.placeholder}
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 text-[10px] font-black group-focus-within/input:text-emerald-500 transition-colors">{cfg.suffix}</span>
                            </div>
                        </div>
                    );
                })}
             </div>

             <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                {[
                    { key: 'wallet_trc20', label: 'TRC20 RECEIVING NODE', icon: Wallet, placeholder: 'T...' },
                    { key: 'wallet_erc20', label: 'ETH RECEIVING NODE', icon: Palette, placeholder: '0x...' },
                ].map((cfg) => {
                    const item = settings.find(s => s.key === cfg.key);
                    return (
                        <div key={cfg.key} className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{cfg.label}</label>
                            <input 
                                className="w-full bg-black/60 border border-white/5 rounded-[24px] px-6 py-4 text-slate-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-dashed"
                                value={item?.value || ''}
                                onChange={(e) => handleUpdate(cfg.key, e.target.value)}
                                placeholder={cfg.placeholder}
                            />
                        </div>
                    );
                })}
             </div>
           </section>

           <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl group hover:border-pink-500/20 transition-all">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-400 ring-1 ring-pink-500/20">
                            <Palette size={24} />
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Identity Shards</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Platform Headline</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-black uppercase tracking-widest text-sm" value={settings.find(s => s.key === 'site_name')?.value || ''} onChange={(e) => handleUpdate('site_name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Support Endpoint</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-blue-400 font-bold" value={settings.find(s => s.key === 'support_link')?.value || ''} onChange={(e) => handleUpdate('support_link', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl group hover:border-indigo-500/20 transition-all">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 ring-1 ring-indigo-500/20">
                            <Layout size={24} />
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Legal Nodes</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Entity Name</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold" value={settings.find(s => s.key === 'platform_name')?.value || ''} onChange={(e) => handleUpdate('platform_name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Entity HQ Address</label>
                            <textarea className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-slate-400 text-[10px] font-bold h-20 resize-none" value={settings.find(s => s.key === 'platform_address')?.value || ''} onChange={(e) => handleUpdate('platform_address', e.target.value)} />
                        </div>
                    </div>
                </div>
           </section>
        </div>
      </div> 
    </div> 
  ); 
}
