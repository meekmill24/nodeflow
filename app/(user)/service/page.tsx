'use client';
 
import { HeadphonesIcon, MessageSquare, Mail, Phone, Clock, ChevronRight, Zap, Target, Activity, ShieldCheck, Send } from 'lucide-react';
import Link from 'next/link';
import { useSiteSettings } from '@/context/SettingsContext';
import { useMemo } from 'react';
 
const TAWK_TO_LINK = '#tawk';
 
export default function CustomerServicePage() {
    const settings = useSiteSettings() as any;
 
    const channels = useMemo(() => {
        const whatsappValue = settings?.whatsapp_url || '1234567890';
        const whatsappAction = whatsappValue.startsWith('http') 
            ? whatsappValue 
            : `https://wa.me/${whatsappValue}?text=${encodeURIComponent('Hello, I need help with my NodeFlow. account.')}`;
 
        const telegramAction = settings?.telegram_url || 'https://t.me/nodeflow_ops';
 
        return [
            {
                icon: MessageSquare,
                title: 'Neural Chat Support',
                subtitle: 'Avg. latency: 45ms (Live Node)',
                color: 'bg-primary/20 text-primary-light',
                badge: 'Online Now',
                badgeColor: 'bg-success/20 text-success',
                action: TAWK_TO_LINK,
                target: '_blank',
                description: 'Instant verification for account-level queries and transactional support.'
            },
            {
                icon: Phone,
                title: 'Priority WhatsApp',
                subtitle: 'Direct encrypted channel',
                color: 'bg-emerald-500/20 text-emerald-400',
                badge: 'Secure',
                badgeColor: 'bg-emerald-500/10 text-emerald-400',
                action: whatsappAction,
                target: '_blank',
                description: 'Fast-track communication for VIP tier members and wallet synchronization.'
            },
            {
                icon: Send,
                title: 'Telegram Pathway',
                subtitle: '@nodeflow_governance',
                color: 'bg-sky-500/20 text-sky-400',
                badge: 'Active Node',
                badgeColor: 'bg-sky-500/10 text-sky-400',
                action: telegramAction,
                target: '_blank',
                description: 'Announcement protocol and peer-to-peer verification hub.'
            },
            {
                icon: Mail,
                title: 'Governance Email',
                subtitle: 'support@nodeflow.com',
                color: 'bg-accent/20 text-accent-light',
                badge: '24h SLA',
                badgeColor: 'bg-accent/20 text-accent-light',
                action: 'mailto:support@nodeflow.com',
                target: '_self',
                description: 'In-depth inquiries regarding institutional partnership and legal compliance.'
            },
        ];
    }, [settings]);
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-10">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Concierge Hub</h1>
                    <p className="text-text-secondary text-xs mt-1 font-bold uppercase tracking-widest font-mono opacity-60">Operations & Support Gateway</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_var(--color-success)]" />
                    <span className="text-[10px] font-black text-success uppercase tracking-[0.2em]">Agents Active</span>
                </div>
            </div>

            {/* Support Hero Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Main Hero Card */}
                <div className="md:col-span-2 glass-card-strong p-10 relative overflow-hidden flex flex-col justify-between border-primary/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
                            <HeadphonesIcon size={32} className="text-white" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">How can we assist your node today?</h2>
                            <p className="text-text-secondary text-xs uppercase font-bold tracking-[0.15em] opacity-60">
                                NodeFlow. technicians are monitoring system processes in real-time. Choose a dedicated channel below.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex gap-6 pt-10 mt-10 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <Activity size={14} className="text-primary-light" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Ops: 99.9%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-success" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">SSO Verified</span>
                        </div>
                    </div>
                </div>

                {/* Operations Hours Card */}
                <div className="glass-card p-8 flex flex-col justify-between border-white/10 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto md:mx-0">
                            <Clock size={20} className="text-text-secondary" />
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Availability</h3>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em] leading-relaxed opacity-60">
                            System maintenance typically occurs between 02:00 - 04:00 AM (UTC). Support channels remain open throughout.
                        </p>
                    </div>
                    <div className="pt-8 border-t border-white/5">
                        <span className="text-[9px] font-black text-primary-light uppercase tracking-widest block mb-2 opacity-50">Local Status</span>
                        <p className="text-lg font-black text-white uppercase tracking-tight">Active Node</p>
                    </div>
                </div>

            </div>

            {/* Support Channels List */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] pl-2 opacity-50 flex items-center gap-2">
                    <Target size={14} /> Official Support Channels
                </h3>
                {channels.map((c, idx) => {
                    const isTawk = c.action === TAWK_TO_LINK;
                    const Component = isTawk ? 'button' : 'a';
                    const props = isTawk
                        ? { onClick: () => (window as any).Tawk_API?.maximize() }
                        : { href: c.action, target: c.target };

                    return (
                        <Component
                            key={idx}
                            {...props}
                            className="w-full text-left group glass-card p-7 flex flex-col md:flex-row items-center gap-6 hover:border-primary/30 transition-all animate-slide-up"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${c.color} shadow-xl shadow-black/20`}>
                                <c.icon size={28} />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center gap-3 mb-1.5">
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight">{c.title}</h4>
                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${c.badgeColor}`}>{c.badge}</span>
                                </div>
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 opacity-80">{c.subtitle}</p>
                                <p className="text-[11px] font-bold text-text-secondary line-clamp-2 invisible md:visible uppercase tracking-widest opacity-40 leading-relaxed max-w-xl">
                                    {c.description}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <ChevronRight size={20} className="text-text-secondary group-hover:text-white transition-colors" />
                            </div>
                        </Component>
                    );
                })}
            </div>

            {/* Quick Resolution Notice */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[30px] flex items-center justify-center gap-3">
                <Zap size={14} className="text-primary-light" />
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-50">
                    Pro-tip: Check the <Link href="/faq" className="text-primary-light hover:underline">Knowledge Base</Link> for instant resolutions to common challenges.
                </p>
            </div>

        </div>
    );
}
