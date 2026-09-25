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
  Wallet,
  Target,
  Gift,
  Mail,
  Sparkles,
  Brush,
  Eye,
  RotateCcw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const THEME_PRESETS = [
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    primary: '#3DD6C8',
    accent: '#E34304',
    background: '#0B0B1E',
    surface: 'rgba(15, 23, 42, 0.6)',
    desc: 'Default Neon Cyan with Radiant Ember Accent'
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    primary: '#8B5CF6',
    accent: '#EC4899',
    background: '#0E0720',
    surface: 'rgba(24, 12, 46, 0.6)',
    desc: 'Deep Cosmic Purple with Laser Pink Highlights'
  },
  {
    id: 'apex-emerald',
    name: 'Apex Emerald',
    primary: '#10B981',
    accent: '#F59E0B',
    background: '#051811',
    surface: 'rgba(6, 32, 22, 0.6)',
    desc: 'Fintech Emerald with Bullion Gold Tones'
  },
  {
    id: 'solar-crimson',
    name: 'Solar Crimson',
    primary: '#F59E0B',
    accent: '#EF4444',
    background: '#160E04',
    surface: 'rgba(34, 20, 6, 0.6)',
    desc: 'Warm Radiant Amber with Laser Red Flare'
  },
  {
    id: 'abyss-azure',
    name: 'Abyss Azure',
    primary: '#0EA5E9',
    accent: '#6366F1',
    background: '#041122',
    surface: 'rgba(8, 28, 54, 0.6)',
    desc: 'Deep Marine Azure with Futuristic Indigo'
  }
];

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
    setSettings(prev => {
      const exists = prev.some(s => s.key === key);
      let updated = exists 
        ? prev.map(s => s.key === key ? { ...s, value } : s)
        : [...prev, { id: key, key, value, description: null }];

      if (key === 'referral_commission_l1') {
        const hasTaskPct = updated.some(s => s.key === 'referral_task_percentage');
        updated = hasTaskPct
          ? updated.map(s => s.key === 'referral_task_percentage' ? { ...s, value } : s)
          : [...updated, { id: 'referral_task_percentage', key: 'referral_task_percentage', value, description: 'Task Referral %' }];
      }

      return updated;
    });
    setSuccess(false);
  };

  const handleSave = async (updatedSettings = settings) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updatedSettings })
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
              onClick={() => handleSave()} 
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
                      value={settings.find(s => s.key === 'default_language')?.value || 'English'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const updated = settings.some(s => s.key === 'default_language')
                          ? settings.map(s => s.key === 'default_language' ? { ...s, value: newValue } : s)
                          : [...settings, { id: 'default_language', key: 'default_language', value: newValue, description: 'Default site language' }];
                        setSettings(updated);
                        handleSave(updated);
                      }}
                    >
                      <option value="English">English (US)</option>
                      <option value="Spanish">Español (Spanish)</option>
                      <option value="French">Français (French)</option>
                      <option value="German">Deutsch (German)</option>
                      <option value="Portuguese">Português (Portuguese)</option>
                      <option value="Russian">Русский (Russian)</option>
                      <option value="Chinese">中文 (Chinese)</option>
                      <option value="Japanese">日本語 (Japanese)</option>
                      <option value="Arabic">العربية (Arabic)</option>
                      <option value="Turkish">Türkçe (Turkish)</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                      <option value="Vietnamese">Tiếng Việt (Vietnamese)</option>
                    </select>
                </div>
            </div>
          </section>

          {/* EMAIL & COMMUNICATION SECTION */}
          <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl group hover:border-violet-500/20 transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-400 ring-1 ring-violet-500/20">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Email Matrix</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Support & Operations Dispatch</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">1. Primary Member Support Email</label>
                <input 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all" 
                  value={settings.find(s => s.key === 'support_email')?.value || ''} 
                  onChange={(e) => handleUpdate('support_email', e.target.value)} 
                  placeholder="support@smartbugmedia.io" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">2. Admin Alert Email (Second Email)</label>
                <input 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all" 
                  value={settings.find(s => s.key === 'admin_notification_email')?.value || ''} 
                  onChange={(e) => handleUpdate('admin_notification_email', e.target.value)} 
                  placeholder="operations@smartbugmedia.io" 
                />
                <p className="text-[9px] text-slate-600 font-bold ml-1">Receives automated notifications for deposit slips & withdrawals.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">3. Resend Dispatch Sender</label>
                <input 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-violet-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all" 
                  value={settings.find(s => s.key === 'resend_from_email')?.value || ''} 
                  onChange={(e) => handleUpdate('resend_from_email', e.target.value)} 
                  placeholder="SmartBugMedia <notifications@smartbugmedia.io>" 
                />
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
                    { key: 'min_withdrawal', label: 'Minimum Extraction', icon: ArrowUpRight, suffix: 'USD', placeholder: '10' },
                    { key: 'min_task_balance', label: 'Minimum Task Balance', icon: Wallet, suffix: 'USD', placeholder: '60' },
                    { key: 'referral_commission_l1', label: 'L1 Growth Yield', icon: Share2, suffix: '%', placeholder: '20' },
                    { key: 'referral_commission_l2', label: 'L2 Growth Yield', icon: Share2, suffix: '%', placeholder: '8' },
                    { key: 'referral_commission_l3', label: 'L3 Growth Yield', icon: Share2, suffix: '%', placeholder: '4' },
                    { key: 'signup_bonus', label: 'Referral Signup Bonus', icon: UserPlus, suffix: 'USD', placeholder: '2' },
                    { key: 'welcome_bonus', label: 'First User Signup Bonus', icon: Wallet, suffix: 'USD', placeholder: '25' },
                    { key: 'reward_tier_1', label: 'Reward Tier 1 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '100/10' },
                    { key: 'reward_tier_2', label: 'Reward Tier 2 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '500/100' },
                    { key: 'reward_tier_3', label: 'Reward Tier 3 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '1000/200' },
                    { key: 'reward_tier_4', label: 'Reward Tier 4 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '3000/600' },
                    { key: 'reward_tier_5', label: 'Reward Tier 5 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '5000/1000' },
                    { key: 'reward_tier_6', label: 'Reward Tier 6 (Req/Bonus)', icon: Gift, suffix: 'USD', placeholder: '10000/5000' },
                    { key: 'require_task_completion_to_withdraw', label: 'Require Set Completion for Payout', icon: Lock, suffix: 'BOOL', placeholder: 'true' },
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

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Default Protocol Currency</label>
                    <select 
                      className="w-full bg-black/40 border border-white/5 rounded-[24px] px-6 py-[1.125rem] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                      value={settings.find(s => s.key === 'default_currency')?.value || 'USD'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const updated = settings.map(s => s.key === 'default_currency' ? { ...s, value: newValue } : s);
                        setSettings(updated);
                        handleSave(updated);
                      }}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="CHF">CHF (Fr)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="SGD">SGD (S$)</option>
                      <option value="AED">AED (Dh)</option>
                      <option value="ZAR">ZAR (R)</option>
                      <option value="BRL">BRL (R$)</option>
                      <option value="GHC">GHC (GH₵)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="CNY">CNY (¥)</option>
                      <option value="KRW">KRW (₩)</option>
                      <option value="HKD">HKD (HK$)</option>
                      <option value="NZD">NZD (NZ$)</option>
                      <option value="MXN">MXN ($)</option>
                      <option value="RUB">RUB (₽)</option>
                      <option value="SAR">SAR (SR)</option>
                      <option value="TRY">TRY (₺)</option>
                      <option value="IDR">IDR (Rp)</option>
                      <option value="MYR">MYR (RM)</option>
                      <option value="THB">THB (฿)</option>
                      <option value="PHP">PHP (₱)</option>
                      <option value="VND">VND (₫)</option>
                      <option value="BTC">BTC (₿)</option>
                      <option value="ETH">ETH (Ξ)</option>
                      <option value="USDC">USDC (USDC)</option>
                      <option value="BNB">BNB (BNB)</option>
                      <option value="PAYPALUSD">PYUSD (PayPal USD)</option>
                    </select>
                </div>
             </div>

             <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                {[
                    { key: 'wallet_trc20', label: 'USDT (TRC20) RECEIVING NODE', icon: Wallet, placeholder: 'T...' },
                    { key: 'wallet_erc20', label: 'USDT (ERC20) NODE', icon: Palette, placeholder: '0x...' },
                    { key: 'wallet_bep20', label: 'USDT (BEP20) NODE', icon: ShieldCheck, placeholder: '0x...' },
                    { key: 'wallet_eth', label: 'ETHEREUM (ETH) RECEIVING NODE', icon: Wallet, placeholder: '0x...' },
                    { key: 'wallet_btc', label: 'BTC RECEIVING NODE', icon: Target, placeholder: '1... or 3... or bc1...' },
                    { key: 'wallet_usdc', label: 'USDC RECEIVING NODE', icon: Wallet, placeholder: '0x... or Solana address' },
                    { key: 'wallet_bnb', label: 'BNB CHAIN (BEP20) NODE', icon: ShieldCheck, placeholder: '0x...' },
                    { key: 'wallet_paypalusd', label: 'PAYPAL USD (PYUSD) NODE', icon: Wallet, placeholder: '0x...' },
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
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">WhatsApp Endpoint (Number or Link)</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-emerald-400 font-bold" value={settings.find(s => s.key === 'whatsapp_url')?.value || ''} onChange={(e) => handleUpdate('whatsapp_url', e.target.value)} placeholder="e.g. 1234567890" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Telegram Pathway</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sky-400 font-bold" value={settings.find(s => s.key === 'telegram_url')?.value || ''} onChange={(e) => handleUpdate('telegram_url', e.target.value)} placeholder="e.g. https://t.me/smartbugmedia_ops" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Tawk.to Property ID</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-pink-400 font-bold font-mono text-[11px]" value={settings.find(s => s.key === 'tawkto_property_id')?.value || ''} onChange={(e) => handleUpdate('tawkto_property_id', e.target.value)} placeholder="Property ID" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Tawk.to Widget ID</label>
                            <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-pink-400 font-bold font-mono text-[11px]" value={settings.find(s => s.key === 'tawkto_widget_id')?.value || ''} onChange={(e) => handleUpdate('tawkto_widget_id', e.target.value)} placeholder="Widget ID" />
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

           {/* PILLAR 3: VISUAL APPEARANCE & THEME ENGINE */}
           <section className="bg-slate-900/40 border border-white/5 p-10 rounded-[48px] backdrop-blur-xl relative overflow-hidden group hover:border-[#3DD6C8]/20 transition-all duration-700">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#3DD6C8]/5 blur-[120px] rounded-full pointer-events-none" />
             
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-[#3DD6C8]/10 rounded-2xl text-[#3DD6C8] ring-1 ring-[#3DD6C8]/30 shadow-[0_0_20px_rgba(61,214,200,0.2)]">
                    <Brush size={26} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none flex items-center gap-3">
                      Visual Terminal & Theme Engine
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30">Live Sync</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                      Configure platform colors, accent tones, and terminal styling in real time.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const defaultTheme = {
                      primary: '#3DD6C8',
                      accent: '#E34304',
                      background: '#0B0B1E',
                      surface: 'rgba(15, 23, 42, 0.6)'
                    };
                    handleUpdate('theme_colors', defaultTheme);
                    if (typeof document !== 'undefined') {
                      const root = document.documentElement;
                      root.style.setProperty('--primary', defaultTheme.primary);
                      root.style.setProperty('--primary-glow', `${defaultTheme.primary}40`);
                      root.style.setProperty('--accent', defaultTheme.accent);
                      root.style.setProperty('--background', defaultTheme.background);
                    }
                    toast.success('Reset to Default Theme');
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all w-fit"
                >
                  <RotateCcw size={14} /> Reset Defaults
                </button>
             </div>

             {/* 1-Click Theme Presets */}
             <div className="space-y-4 mb-10">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2">
                  <Sparkles size={14} className="text-[#3DD6C8]" />
                  Instant 1-Click Theme Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {THEME_PRESETS.map((preset) => {
                    const themeValue = settings.find(s => s.key === 'theme_colors')?.value || {};
                    const isSelected = themeValue?.primary?.toLowerCase() === preset.primary.toLowerCase();
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          const updated = {
                            primary: preset.primary,
                            accent: preset.accent,
                            background: preset.background,
                            surface: preset.surface
                          };
                          handleUpdate('theme_colors', updated);
                          if (typeof document !== 'undefined') {
                            const root = document.documentElement;
                            root.style.setProperty('--primary', preset.primary);
                            root.style.setProperty('--primary-glow', `${preset.primary}40`);
                            root.style.setProperty('--accent', preset.accent);
                            root.style.setProperty('--background', preset.background);
                          }
                          toast.success(`Preset "${preset.name}" Applied`);
                        }}
                        className={`p-5 rounded-3xl text-left border transition-all duration-300 relative group overflow-hidden ${
                          isSelected 
                            ? 'bg-white/10 border-[#3DD6C8] shadow-[0_0_25px_rgba(61,214,200,0.15)] scale-[1.02]' 
                            : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-5 h-5 rounded-full shadow-md border border-white/20" style={{ backgroundColor: preset.primary }} />
                          <div className="w-3.5 h-3.5 rounded-full shadow-md border border-white/20" style={{ backgroundColor: preset.accent }} />
                          <div className="w-3 h-3 rounded-full border border-white/10 ml-auto" style={{ backgroundColor: preset.background }} />
                        </div>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">{preset.name}</h4>
                        <p className="text-[9px] text-slate-500 font-medium leading-relaxed">{preset.desc}</p>
                        {isSelected && (
                          <div className="mt-3 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-[#3DD6C8]">
                            <CheckCircle2 size={12} /> Active Preset
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
             </div>

             {/* Custom Color Controls & Live Interactive Terminal Preview */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Color Controls */}
                <div className="lg:col-span-6 space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">
                    Custom Color Palette Calibration
                  </label>

                  {/* Primary Color */}
                  {(() => {
                    const themeValue = settings.find(s => s.key === 'theme_colors')?.value || {};
                    const primary = themeValue?.primary || '#3DD6C8';
                    const accent = themeValue?.accent || '#E34304';
                    const background = themeValue?.background || '#0B0B1E';

                    const updateColor = (key: string, val: string) => {
                      const updated = {
                        primary,
                        accent,
                        background,
                        surface: 'rgba(15, 23, 42, 0.6)',
                        [key]: val
                      };
                      handleUpdate('theme_colors', updated);
                      if (typeof document !== 'undefined') {
                        const root = document.documentElement;
                        root.style.setProperty(`--${key}`, val);
                        if (key === 'primary') root.style.setProperty('--primary-glow', `${val}40`);
                      }
                    };

                    return (
                      <div className="space-y-4">
                        <div className="p-4 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <input 
                              type="color" 
                              value={primary.startsWith('#') ? primary : '#3DD6C8'} 
                              onChange={(e) => updateColor('primary', e.target.value)}
                              className="w-10 h-10 rounded-2xl cursor-pointer bg-transparent border-0"
                            />
                            <div>
                              <span className="text-xs font-black text-white uppercase tracking-wider block">Primary Brand Color</span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Buttons, glow borders, badges</span>
                            </div>
                          </div>
                          <input 
                            type="text" 
                            value={primary} 
                            onChange={(e) => updateColor('primary', e.target.value)}
                            className="w-28 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-[#3DD6C8]"
                          />
                        </div>

                        <div className="p-4 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <input 
                              type="color" 
                              value={accent.startsWith('#') ? accent : '#E34304'} 
                              onChange={(e) => updateColor('accent', e.target.value)}
                              className="w-10 h-10 rounded-2xl cursor-pointer bg-transparent border-0"
                            />
                            <div>
                              <span className="text-xs font-black text-white uppercase tracking-wider block">Accent / Hot Action Tone</span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Withdrawal, badges, alert dots</span>
                            </div>
                          </div>
                          <input 
                            type="text" 
                            value={accent} 
                            onChange={(e) => updateColor('accent', e.target.value)}
                            className="w-28 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="p-4 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <input 
                              type="color" 
                              value={background.startsWith('#') ? background : '#0B0B1E'} 
                              onChange={(e) => updateColor('background', e.target.value)}
                              className="w-10 h-10 rounded-2xl cursor-pointer bg-transparent border-0"
                            />
                            <div>
                              <span className="text-xs font-black text-white uppercase tracking-wider block">Terminal Base Tint</span>
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Global platform canvas background</span>
                            </div>
                          </div>
                          <input 
                            type="text" 
                            value={background} 
                            onChange={(e) => updateColor('background', e.target.value)}
                            className="w-28 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-right font-mono font-bold text-xs text-white focus:outline-none focus:border-blue-400"
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Live Preview Card */}
                <div className="lg:col-span-6">
                  {(() => {
                    const themeValue = settings.find(s => s.key === 'theme_colors')?.value || {};
                    const primary = themeValue?.primary || '#3DD6C8';
                    const accent = themeValue?.accent || '#E34304';
                    const background = themeValue?.background || '#0B0B1E';

                    return (
                      <div 
                        className="h-full rounded-3xl p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-500"
                        style={{ backgroundColor: background }}
                      >
                        <div className="flex items-center justify-between pb-6 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs" style={{ backgroundColor: `${primary}25`, color: primary, border: `1px solid ${primary}40` }}>
                              <Eye size={16} />
                            </div>
                            <div>
                              <span className="text-xs font-black text-white uppercase tracking-wider block">Real-Time Terminal Preview</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Simulated Member View</span>
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5" style={{ backgroundColor: `${primary}15`, color: primary, border: `1px solid ${primary}30` }}>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primary }} />
                            Live Matrix
                          </div>
                        </div>

                        <div className="my-6 space-y-4">
                          <div className="p-5 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Yield Optimization Balance</span>
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accent}25`, color: accent }}>Hot Shard</span>
                            </div>
                            <div className="text-3xl font-black italic tracking-tight text-white flex items-baseline gap-2">
                              $14,850.00
                              <span className="text-xs font-mono font-bold" style={{ color: primary }}>+18.4%</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => toast('Theme Preview: Start Optimization demonstration button')}
                              className="py-3.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-transform hover:scale-105 active:scale-95"
                              style={{ backgroundColor: primary, color: '#0B0B1E', boxShadow: `0 0 25px ${primary}40` }}
                            >
                              Start Optimization
                            </button>
                            <button
                              type="button"
                              onClick={() => toast('Theme Preview: Withdraw Funds demonstration button')}
                              className="py-3.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-colors hover:bg-white/10 active:scale-95"
                              style={{ borderColor: `${accent}60`, color: accent }}
                            >
                              Withdraw Funds
                            </button>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>Primary: <span className="font-mono text-white">{primary}</span></span>
                          <span>Accent: <span className="font-mono text-white">{accent}</span></span>
                          <span>Canvas: <span className="font-mono text-white">{background}</span></span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
             </div>
           </section>
        </div>
      </div> 
    </div> 
  ); 
}
