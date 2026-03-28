'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { 
    ShieldCheck, 
    Wallet, 
    Mail, 
    ChevronRight, 
    LogOut, 
    Settings,
    CheckCircle,
    Users,
    ArrowDownToLine,
    ArrowUpFromLine,
    FileText,
    Building2,
    Award,
    Upload,
    Loader2,
    Image as ImageIcon,
    Gift,
    ArrowRight,
    Calendar,
    Cpu,
    Zap,
    Network,
    Activity,
    Lock
} from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/index';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { profile, signOut } = useAuth();
    const { t } = useLanguage();
    const { format } = useCurrency();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile?.id) return;
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${profile.id}/${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
            await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
            window.location.reload(); 
        } catch (err) { alert('Upload failed.'); } finally { setUploading(false); }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />

            {/* IDENTITY SHARD HEADER */}
            <div className="relative group overflow-hidden rounded-[48px] bg-slate-900 border border-white/5 p-10 md:p-14 shadow-2xl">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-[#3DD6C8]/5 blur-[100px] rounded-full pointer-events-none" />
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
                    <div className="relative group/avatar cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] bg-gradient-to-br from-[#3DD6C8]/20 to-transparent border border-white/10 p-[3px] shadow-2xl relative transition-transform hover:scale-105 active:scale-95 duration-500 overflow-hidden">
                             <div className="w-full h-full rounded-[29px] md:rounded-[37px] bg-slate-950 flex items-center justify-center border border-white/5 overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                                ) : (
                                    <span className="text-4xl font-black text-white italic">{profile?.username?.[0].toUpperCase() || 'U'}</span>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                                    <Upload size={24} className="text-[#3DD6C8] animate-bounce" />
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest mt-2">{uploading ? 'UPLOADING' : 'EDIT IDENTITY'}</span>
                                </div>
                             </div>
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[32px] md:rounded-[40px]">
                                <Loader2 className="animate-spin text-[#3DD6C8]" size={32} />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-2xl bg-[#0B0B1E] border-4 border-slate-900 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#3DD6C8] animate-pulse" />
                        </div>
                    </div>

                    <div className="flex flex-col flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                             <span className="px-3 py-1 bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic">Identity Verified</span>
                             <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Node Protocol 3.1</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-4">{profile?.username || 'Node User'}</h2>
                        <div className="flex items-center gap-4">
                             <div 
                                onClick={() => {
                                    if (profile?.referral_code) {
                                        navigator.clipboard.writeText(profile.referral_code);
                                        toast.success('Protocol Token Copied to Clipboard');
                                    }
                                }}
                                className="flex flex-col cursor-pointer group/ref hover:scale-105 active:scale-95 transition-all bg-white/5 border border-white/5 hover:border-[#3DD6C8]/30 px-3 py-2 rounded-xl"
                             >
                                <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.5em] mb-1 leading-none italic group-hover/ref:text-[#3DD6C8] transition-colors">SECURE ACCESS TOKEN</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-white/60 tracking-widest leading-none group-hover/ref:text-white transition-colors">{profile?.referral_code || '--- --- ---'}</span>
                                    <Activity size={10} className="text-[#3DD6C8] opacity-0 group-hover/ref:opacity-100 transition-opacity" />
                                </div>
                             </div>
                             <div className="h-6 w-[1px] bg-white/10" />
                             <div className="flex flex-col">
                                <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.5em] mb-1 leading-none italic">SYSTEM LV. STATUS</span>
                                <span className="text-xs font-black text-[#3DD6C8] tracking-widest leading-none">ELITE SHARD LV.{profile?.level_id || 1}</span>
                             </div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* ASSET CONTROL MATRIX */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: t('available_balance'), value: format(profile?.wallet_balance || 0), desc: 'Liquidity Matrix', icon: Wallet, color: 'text-white' },
                    { label: t('daily_profits'), value: format(profile?.profit || 0), desc: 'Rebate Velocity', icon: Zap, color: 'text-amber-400' },
                    { label: t('referral_bonus'), value: format(profile?.referral_earned || 0), desc: 'Network Yield', icon: Network, color: 'text-[#3DD6C8]' },
                ].map((asset, i) => (
                    <div key={i} className="bg-[#0B0B1E] border border-white/5 p-8 rounded-[40px] shadow-xl relative overflow-hidden group hover:border-white/10 transition-all duration-700">
                         <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                                <asset.icon size={20} />
                            </div>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] italic">{asset.desc}</span>
                         </div>
                         <div className="space-y-1 relative z-10">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{asset.label}</span>
                            <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${asset.color}`}>{asset.value}</h3>
                         </div>
                         <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            {/* COMMAND CENTER NAVIGATION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Protocol Records */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_rgba(61,214,200,0.8)]" />
                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">PROTOCOL LOGS</h3>
                    </div>
                    <div className="bg-[#0B0B1E] border border-white/5 rounded-[40px] divide-y divide-white/5 overflow-hidden">
                        {[
                            { icon: CheckCircle, label: t('task_history'), href: '/record', color: 'text-[#3DD6C8]' },
                            { icon: ArrowDownToLine, label: t('deposit_record'), href: '/record/deposit', color: 'text-emerald-400' },
                            { icon: ArrowUpFromLine, label: t('withdrawal_record'), href: '/record/withdraw', color: 'text-amber-400' },
                            { icon: Calendar, label: 'Asset Cycle Hub', href: '/salary', color: 'text-indigo-400' },
                        ].map((item, i) => (
                            <Link key={i} href={item.href} className="flex items-center justify-between p-6 hover:bg-white/[0.03] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">{item.label}</span>
                                </div>
                                <ChevronRight size={18} className="text-white/20 group-hover:translate-x-1 group-hover:text-white transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* System Nodes */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E34304] shadow-[0_0_8px_rgba(227,67,4,0.8)]" />
                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">IDENTITY SHARD CONTROL</h3>
                    </div>
                    <div className="bg-[#0B0B1E] border border-white/5 rounded-[40px] divide-y divide-white/5 overflow-hidden">
                        {[
                            { icon: ShieldCheck, label: t('security_center'), href: '/profile/security' },
                            { icon: Wallet, label: t('wallet_address'), href: '/profile/wallet' },
                            { icon: Mail, label: t('bind_email'), href: '/profile/email' },
                            { icon: Settings, label: t('settings'), href: '/profile/settings' },
                        ].map((item, i) => (
                            <Link key={i} href={item.href} className="flex items-center justify-between p-6 hover:bg-white/[0.03] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-white/5 text-white/40 group-hover:text-white transition-colors">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">{item.label}</span>
                                </div>
                                <ChevronRight size={18} className="text-white/20 group-hover:translate-x-1 group-hover:text-white transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* EXIT PROTOCOL */}
            <button 
                onClick={() => signOut()}
                className="w-full bg-rose-500/10 border border-rose-500/20 p-8 rounded-[40px] flex items-center justify-between group hover:bg-rose-500/20 transition-all active:scale-95 shadow-2xl"
            >
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center text-[#0B0B1E] shadow-[0_0_30px_rgba(244,63,94,0.4)] group-hover:scale-110 transition-transform">
                        <LogOut size={26} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xl font-black text-white italic uppercase tracking-tighter font-black">Deactivate Identity</span>
                        <span className="text-[9px] font-black text-rose-500/60 uppercase tracking-[0.3em] italic leading-none">Shutdown Signal Node Flow</span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-rose-500/30 flex items-center justify-center text-rose-500 group-hover:translate-x-2 transition-transform">
                    <ArrowRight size={24} />
                </div>
            </button>
        </div>
    );
}
