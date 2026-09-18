'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/index';
import { 
  Headphones, 
  ExternalLink, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Users, 
  Clock, 
  ShieldCheck, 
  Zap,
  Radio,
  Send,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLiveChatPage() {
  const [propertyId, setPropertyId] = useState<string>('');
  const [widgetId, setWidgetId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['tawkto_property_id', 'tawkto_widget_id']);

        if (data) {
          const prop = data.find(s => s.key === 'tawkto_property_id')?.value || '6a466c3aa8e00f1d434a0ef9';
          const widg = data.find(s => s.key === 'tawkto_widget_id')?.value || '1jshhdhta';
          setPropertyId(prop);
          setWidgetId(widg);
        }
      } catch (err) {
        console.error('Failed to load chat settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const isConfigured = Boolean(propertyId && widgetId);

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Live Chat Operations</h1>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Console Active
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">
            Operator Hub & Visitor Synchronization Console
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Settings size={16} />
            Chat Configuration
          </Link>
          <a
            href="https://dashboard.tawk.to"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3DD6C8] to-[#20B2AA] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#3DD6C8]/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-2"
          >
            Launch Operator Desk
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Main Status & Quick Launch Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl p-8 md:p-10 relative overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#3DD6C8]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#3DD6C8] to-indigo-600 flex items-center justify-center shadow-xl shadow-[#3DD6C8]/10">
              <Headphones size={32} className="text-slate-950" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                Respond to visitors & users in real time
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed max-w-2xl font-medium">
                The SmartBugMedia live chat system utilizes high-performance Tawk.to infrastructure to route user queries, deposit verification receipts, and concierge tickets straight to your administrative devices.
              </p>
            </div>

            {/* Config Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Property ID:</span>
                <span className="text-[#3DD6C8] font-bold">{loading ? '...' : (propertyId || 'Not Set')}</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Widget ID:</span>
                <span className="text-[#3DD6C8] font-bold">{loading ? '...' : (widgetId || 'Not Set')}</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-1 text-xs">
                {isConfigured ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold text-[11px]">
                    <CheckCircle2 size={14} /> Connected to User Portal
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1 font-bold text-[11px]">
                    <AlertTriangle size={14} /> Needs Configuration
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative z-10">
            <a
              href="https://dashboard.tawk.to"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-[#3DD6C8] text-slate-950 font-black text-xs uppercase tracking-widest text-center hover:bg-[#32b5aa] transition-all flex items-center justify-center gap-2"
            >
              Open Official Tawk.to Operator Console
              <ExternalLink size={16} />
            </a>
            <button
              type="button"
              onClick={() => {
                const tawk = (window as any).Tawk_API;
                if (tawk && typeof tawk.maximize === 'function') {
                  tawk.showWidget?.();
                  tawk.maximize?.();
                } else {
                  alert('Chat widget initialized. Visit any user page or launch the operator dashboard.');
                }
              }}
              className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest text-center hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              Test Chat Widget
            </button>
          </div>
        </div>

        {/* Quick Help & Mobile App Card */}
        <div className="rounded-3xl p-8 border border-white/10 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 flex items-center justify-center text-[#3DD6C8]">
              <Radio size={20} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              Operator Mobile Apps
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              You can answer user questions on the go directly from your iPhone or Android device using the official Tawk.to app.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5">
            <a
              href="https://apps.apple.com/app/tawk-to/id907607147"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center justify-between transition-all"
            >
              <span>Download for iOS (App Store)</span>
              <ExternalLink size={14} className="text-slate-500" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=to.tawk.android"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center justify-between transition-all"
            >
              <span>Download for Android (Google Play)</span>
              <ExternalLink size={14} className="text-slate-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Operator Workflow & Verification Protocols */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 pl-2 flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#3DD6C8]" />
          Live Chat Procedures
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl p-6 border border-white/5 bg-slate-900/30 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-xs">
              01
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight">Deposit Proof Verification</h4>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              When users upload transaction receipts (USDT, USDC, PayPal, BNB, PYUSD), verify the blockchain TXID or PayPal transaction ID in your respective gateway before approving.
            </p>
          </div>

          <div className="rounded-3xl p-6 border border-white/5 bg-slate-900/30 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-[#3DD6C8]/10 text-[#3DD6C8] flex items-center justify-center font-black text-xs">
              02
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight">Withdrawal Inquiries</h4>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Standard review window is up to 24 hours. Ensure users have completed their designated level task requirements before approving payout releases.
            </p>
          </div>

          <div className="rounded-3xl p-6 border border-white/5 bg-slate-900/30 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xs">
              03
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight">VIP & Custom Nodes</h4>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Provide manual receiving addresses or customized payment links directly in chat for VIP members requesting institutional deposit tiers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
