'use client';

import { Bell, ChevronLeft, CalendarClock, CheckCircle2, ShieldCheck, Zap, Info, Target } from 'lucide-react';
import Link from 'next/link';
import { useNotifications } from '@/context/NotificationContext';

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications();

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-10">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">System Intel</h1>
                    <p className="text-text-secondary text-xs mt-1 font-bold uppercase tracking-widest font-mono opacity-60">Neural Feed & Alert Hub</p>
                </div>
                <div className="flex items-center gap-4">
                    {unreadCount > 0 && (
                        <button 
                            onClick={markAllRead} 
                            className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-black text-primary-light uppercase tracking-widest hover:bg-primary/20 transition-colors flex items-center gap-2"
                        >
                            <CheckCircle2 size={14} /> Mark All Read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button 
                            onClick={clearAll} 
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-danger/10 hover:border-danger/30 hover:text-danger transition-colors flex items-center gap-2"
                        >
                            <Zap size={14} /> Wipe Feed
                        </button>
                    )}
                    <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${unreadCount > 0 ? 'bg-primary animate-pulse' : 'bg-white/20'}`} />
                         <span className="text-[10px] font-black text-primary-light uppercase tracking-widest">{unreadCount} Pending</span>
                    </div>
                </div>
            </div>

            {/* Neural Feed List */}
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="glass-card p-16 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                            <Bell size={32} className="text-text-secondary" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight">Feed Empty</p>
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">No operational alerts detected.</p>
                        </div>
                    </div>
                ) : (
                        notifications.map((notif, idx) => {
                        const isSystem = notif.title.toLowerCase().includes('system') || notif.title.toLowerCase().includes('security');
                        const isReward = notif.title.toLowerCase().includes('reward') || notif.title.toLowerCase().includes('profit');
                        const isNew = !notif.is_read;
                        const dateStr = new Date(notif.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

                        return (
                            <div
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={`group glass-card p-7 flex items-start gap-6 border transition-all cursor-pointer animate-slide-up
                                    ${isNew ? 'border-primary/40 bg-primary/[0.03] shadow-[0_15px_30px_rgba(var(--primary),0.1)]' : 'border-white/5 hover:border-white/10 opacity-70'}
                                `}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <div className={`mt-1 flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                                    ${isNew ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 text-text-secondary'}
                                `}>
                                    {isSystem ? <ShieldCheck size={26} /> : isReward ? <Zap size={26} /> : <Bell size={26} />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-lg font-black uppercase tracking-tight ${isNew ? 'text-white' : 'text-text-secondary'}`}>
                                                {notif.title}
                                            </h3>
                                            {isNew && (
                                                <span className="bg-primary/20 text-primary-light text-[8px] font-black px-1.5 py-0.5 rounded border border-primary/30 uppercase tracking-[0.2em]">New Intel</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-text-secondary/60 uppercase tracking-widest font-mono">
                                            <CalendarClock size={12} />
                                            <span>{dateStr}</span>
                                        </div>
                                    </div>
                                    <p className={`text-xs font-medium leading-relaxed uppercase tracking-wider ${isNew ? 'text-text-secondary' : 'text-text-secondary/70'}`}>
                                        {notif.message}
                                    </p>
                                    
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1 h-1 rounded-full ${isNew ? 'bg-primary' : 'bg-white/20'}`} />
                                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-50">Node: TR-882</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Target size={10} className="text-text-secondary/30" />
                                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-50">Priority: 0{isNew ? '1' : '3'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:bg-primary/10 ${isNew ? 'rotate-0 opacity-100' : 'rotate-90 opacity-20'}`}>
                                     <Info size={16} className={isNew ? 'text-primary-light' : 'text-text-secondary'} />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Quick Filter Section */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[30px] flex items-center justify-between">
                 <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-black text-primary-light uppercase tracking-widest">All Events</button>
                    <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-text-secondary uppercase tracking-widest hover:text-white transition-colors">Settlements</button>
                    <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-text-secondary uppercase tracking-widest hover:text-white transition-colors">Security</button>
                 </div>
                 <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">
                    Sync Status: Real-time (Active)
                 </p>
            </div>

        </div>
    );
}
