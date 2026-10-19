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
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  Maximize2,
  FileText,
  ArrowRight,
  UserCheck,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface PendingDepositInquiry {
  id: number;
  user_id: string;
  amount: number;
  network?: string;
  proof_url?: string;
  created_at: string;
  user?: {
    username?: string;
    email?: string;
  };
}

export default function AdminLiveChatPage() {
  const [propertyId, setPropertyId] = useState<string>('6abe44e19762d834392b3344');
  const [widgetId, setWidgetId] = useState<string>('1k3rjq8ai');
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [pendingDeposits, setPendingDeposits] = useState<PendingDepositInquiry[]>([]);
  const [viewMode, setViewMode] = useState<'overview' | 'simulator'>('overview');

  const fetchSettingsAndInquiries = async () => {
    setLoading(true);
    try {
      // 1. Fetch Tawk settings
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['tawkto_property_id', 'tawkto_widget_id']);

      if (settingsData && settingsData.length > 0) {
        const prop = settingsData.find(s => s.key === 'tawkto_property_id')?.value;
        const widg = settingsData.find(s => s.key === 'tawkto_widget_id')?.value;
        if (prop) setPropertyId(prop);
        if (widg) setWidgetId(widg);
      }

      // 2. Fetch pending deposits waiting for chat verification
      const { data: depositsData } = await supabase
        .from('transactions')
        .select('id, user_id, amount, network, proof_url, created_at, user:profiles(username, email)')
        .eq('type', 'deposit')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(6);

      if (depositsData) {
        setPendingDeposits(depositsData as any);
      }
    } catch (err) {
      console.error('Failed to load live chat hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndInquiries();
  }, []);

  const isConfigured = Boolean(propertyId && widgetId);
  const directChatUrl = `https://tawk.to/chat/${propertyId}/${widgetId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directChatUrl);
    setCopiedLink(true);
    toast.success('Direct Live Chat URL copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCannedResponse = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    toast.success('Response template copied to clipboard!');
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const handleLaunchPopout = () => {
    if (!directChatUrl) return;
    const width = 450;
    const height = 720;
    const left = window.screen.width ? (window.screen.width - width) / 2 : 100;
    const top = window.screen.height ? (window.screen.height - height) / 2 : 100;
    window.open(
      directChatUrl,
      'SmartBugOperatorChat',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  const handleTestInAppWidget = () => {
    const tawk = (window as any).Tawk_API;
    if (tawk && typeof tawk.maximize === 'function') {
      try {
        tawk.showWidget?.();
        tawk.maximize?.();
        toast.success('In-app chat widget opened!');
        return;
      } catch {
        // Fallback to popout
      }
    }
    handleLaunchPopout();
  };

  const cannedResponses = [
    {
      id: 'dep_approved',
      title: 'Deposit Approved & Credited',
      tag: 'Deposit',
      text: 'Hello! Your payment has been successfully confirmed and your account balance is now updated. You can immediately continue your optimization session.'
    },
    {
      id: 'txid_request',
      title: 'Request Proof / TXID',
      tag: 'Verification',
      text: 'Thank you for reaching out. To expedite your deposit approval, please reply here with a clear screenshot of the transfer confirmation along with the blockchain TXID/Hash.'
    },
    {
      id: 'super_order_deficit',
      title: 'Super Order Sequence Guidance',
      tag: 'Super Order',
      text: 'Your account has received an institutional Super Order combo. To complete settlement and release your multiplied yield, fulfill the required sequence deposit via the Deposit page.'
    },
    {
      id: 'withdrawal_processed',
      title: 'Withdrawal Disbursed',
      tag: 'Withdrawal',
      text: 'Good news! Your withdrawal request has been reviewed and approved. The funds have been dispatched to your designated wallet address.'
    }
  ];

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Live Chat Operations</h1>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Console Ready
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">
            Tawk.to Operations Hub • Real-time Visitor & User Support Desk
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchSettingsAndInquiries}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/admin/settings"
            className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <Settings size={16} />
            Chat Settings
          </Link>
          <a
            href="https://dashboard.tawk.to"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3DD6C8] to-[#20B2AA] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#3DD6C8]/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
          >
            Launch Official Dashboard
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Main Status & Quick Launch Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl p-8 md:p-10 relative overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#3DD6C8]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#3DD6C8] to-indigo-600 flex items-center justify-center shadow-xl shadow-[#3DD6C8]/15">
                <Headphones size={32} className="text-slate-950" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'overview' ? 'simulator' : 'overview')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'simulator' 
                      ? 'bg-[#3DD6C8] text-slate-950 border-[#3DD6C8]' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <Maximize2 size={12} />
                  {viewMode === 'simulator' ? 'Close Simulator' : 'Embed Simulator'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                Operator Support & Verification Terminal
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed max-w-2xl font-medium">
                Respond to visitor inquiries, verify payment receipts, and assist members in real time. Launch the operator console or pop out a dedicated chat window directly from here.
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

          {/* Action Buttons */}
          <div className="pt-8 mt-8 border-t border-white/5 flex flex-wrap items-center gap-3 relative z-10">
            <a
              href="https://dashboard.tawk.to"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl bg-[#3DD6C8] hover:bg-[#32b5aa] text-slate-950 font-black text-xs uppercase tracking-widest text-center shadow-lg shadow-[#3DD6C8]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Operator Dashboard</span>
              <ExternalLink size={15} />
            </a>
            <button
              type="button"
              onClick={handleLaunchPopout}
              className="flex-1 sm:flex-initial px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-black text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Maximize2 size={15} className="text-[#3DD6C8]" />
              <span>Pop-Out Chat Window</span>
            </button>
            <button
              type="button"
              onClick={handleTestInAppWidget}
              className="flex-1 sm:flex-initial px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={15} />
              <span>Test Widget</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Copy Direct Chat Link"
            >
              {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Quick Direct Link & Mobile Card */}
        <div className="rounded-3xl p-8 border border-white/10 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 flex items-center justify-center text-[#3DD6C8]">
              <Radio size={20} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              Direct Access & Mobile Apps
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Share the direct chat link with users on Telegram/WhatsApp, or respond anywhere using the mobile operator apps.
            </p>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
                Direct Webchat URL:
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-[#3DD6C8] truncate select-all">
                  {directChatUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 transition-colors"
                >
                  {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-white/5">
            <a
              href="https://apps.apple.com/app/tawk-to/id907607147"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center justify-between transition-all"
            >
              <span>Download for iOS (App Store)</span>
              <ExternalLink size={13} className="text-slate-500" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=to.tawk.android"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center justify-between transition-all"
            >
              <span>Download for Android (Google Play)</span>
              <ExternalLink size={13} className="text-slate-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Embedded Simulator (if toggled) */}
      {viewMode === 'simulator' && (
        <div className="rounded-3xl border border-[#3DD6C8]/30 overflow-hidden bg-slate-950 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-[#3DD6C8]" />
              Live Visitor Webchat Simulator
            </span>
            <button
              onClick={() => setViewMode('overview')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="w-full h-[600px] rounded-2xl overflow-hidden bg-black/60 border border-white/10">
            <iframe
              src={directChatUrl}
              className="w-full h-full border-0"
              title="Live Chat Simulator"
            />
          </div>
        </div>
      )}

      {/* Pending Deposit Verifications Awaiting Support Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pl-2">
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2">
            <Clock size={16} className="text-amber-400" />
            Recent Deposit Receipts Awaiting Verification ({pendingDeposits.length})
          </h3>
          <Link
            href="/admin/deposits"
            className="text-[10px] font-black uppercase tracking-wider text-[#3DD6C8] hover:underline flex items-center gap-1"
          >
            <span>Manage All Deposits</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {pendingDeposits.length === 0 ? (
          <div className="rounded-3xl p-8 border border-white/5 bg-slate-900/30 text-center">
            <CheckCircle2 size={32} className="text-emerald-400/50 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Zero Pending Deposit Tickets • Queue Is Clear
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingDeposits.map((dep) => (
              <div 
                key={dep.id} 
                className="rounded-2xl p-4 border border-white/10 bg-slate-900/40 hover:bg-slate-900/60 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 overflow-hidden">
                      {dep.proof_url ? (
                        <img src={dep.proof_url} alt="Proof" className="w-full h-full object-cover" />
                      ) : (
                        <FileText size={18} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-white truncate block">
                        {dep.user?.username || dep.user?.email || 'User'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        #TXN-{String(dep.id).padStart(6, '0')} • {dep.network || 'USDT'}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-400 font-mono shrink-0">
                    +${dep.amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                  <span className="text-slate-500">
                    {new Date(dep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <Link
                    href={`/admin/deposits?highlight=${dep.id}`}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold uppercase tracking-wider transition-all"
                  >
                    Verify Ticket
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Canned Responses Rapid Clipboard */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 pl-2 flex items-center gap-2">
          <MessageSquare size={16} className="text-[#3DD6C8]" />
          Operator Rapid Responses (1-Click Copy)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cannedResponses.map((item) => {
            const isCopied = copiedSnippet === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl p-4 border border-white/5 bg-slate-900/30 hover:border-[#3DD6C8]/30 transition-all space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[8px] font-black uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <span className="text-xs font-bold text-white tracking-tight">
                      {item.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCannedResponse(item.text, item.id)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#3DD6C8] hover:text-slate-950 text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono select-all bg-black/30 p-2.5 rounded-xl border border-white/5">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
