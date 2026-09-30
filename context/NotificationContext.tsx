'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/index';
import { useAuth } from '@/context/AuthContext';
import { Bell, Megaphone, Check, X, ShieldAlert, Info, Clock, ChevronDown, ChevronUp, History, ArrowRight } from 'lucide-react';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'danger';
    is_read: boolean;
    created_at: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    toast: Notification | null;
    markAsRead: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
    clearAll: () => Promise<void>;
    refresh: () => Promise<void>;
    clearToast: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    toast: null,
    markAsRead: async () => { },
    markAllRead: async () => { },
    clearAll: async () => { },
    refresh: async () => { },
    clearToast: () => { }
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user, profile, loading: authLoading } = useAuth();
    const pathname = usePathname();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [toast, setToast] = useState<Notification | null>(null);
    const [broadcastModal, setBroadcastModal] = useState<Notification | null>(null);
    const [previousBroadcasts, setPreviousBroadcasts] = useState<Notification[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [loading, setLoading] = useState(false);

    // Completely prevent popups and notifications for unauthenticated users or public auth pages
    const isPublicAuthPage = pathname === '/' || pathname?.startsWith('/auth');
    const isUserLoggedIn = Boolean(user && profile?.id && !authLoading);
    const shouldDisplayPopups = isUserLoggedIn && !isPublicAuthPage;

    const formatTimestamp = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - d.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);

            if (diffMins < 2) return 'Just Now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' • ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return dateStr;
        }
    };

    const isBroadcast = (n: Notification) => 
        n.type === 'info' || 
        n.title?.toLowerCase().includes('broadcast') || 
        n.title?.toLowerCase().includes('system') || 
        n.title?.toLowerCase().includes('announcement') || 
        n.title?.toLowerCase().includes('notice') ||
        n.title?.toLowerCase().includes('maintenance');

    const fetchNotifications = useCallback(async () => {
        if (!isUserLoggedIn || !profile?.id) {
            setNotifications([]);
            setBroadcastModal(null);
            setPreviousBroadcasts([]);
            setToast(null);
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            const notifs = data || [];
            setNotifications(notifs);

            // Filter all broadcast notifications in reverse chronological order
            const broadcasts = notifs.filter(isBroadcast);

            // Filter broadcasts that user has NOT dismissed in localStorage
            const unreadUnseen = broadcasts.filter(n => {
                if (n.is_read) return false;
                if (typeof window === 'undefined') return true;
                const dismissedKey = `dismissed_broadcast_${profile.id}_${n.id}`;
                return !localStorage.getItem(dismissedKey);
            });

            if (unreadUnseen.length > 0) {
                // Newest unread broadcast is displayed on top
                const latest = unreadUnseen[0];
                setBroadcastModal(latest);

                // Previous broadcasts stacked beneath (up to 5 most recent older messages)
                const older = broadcasts.filter(n => n.id !== latest.id).slice(0, 5);
                setPreviousBroadcasts(older);
            } else {
                setBroadcastModal(null);
                setPreviousBroadcasts([]);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [isUserLoggedIn, profile?.id]);

    useEffect(() => {
        if (!isUserLoggedIn || !profile?.id) {
            setNotifications([]);
            setBroadcastModal(null);
            setToast(null);
            return;
        }

        fetchNotifications();
        
        // Subscribe to new notifications
        const channel = supabase
            .channel(`notifications-${profile.id}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'notifications',
                filter: `user_id=eq.${profile.id}`
            }, (payload) => {
                const newNotif = payload.new as Notification;
                setToast(newNotif);
                // Promptly show as modal if it is a broadcast notification
                setBroadcastModal(newNotif);
                fetchNotifications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isUserLoggedIn, profile?.id, fetchNotifications]);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 6000); // 6 seconds
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const markAsRead = async (id: string) => {
        const notif = notifications.find(n => n.id === id);
        if (!notif || notif.is_read) return;

        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );

        try {
            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id);
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
            // Revert on error
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: false } : n)
            );
        }
    };

    const markAllRead = async () => {
        if (!profile?.id || unreadCount === 0) return;
        const previousNotifs = [...notifications];
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

        try {
            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', profile.id);
        } catch (err) {
            console.error('Failed to mark all notifications as read:', err);
            setNotifications(previousNotifs);
        }
    };

    const clearAll = async () => {
        if (!profile?.id || notifications.length === 0) return;
        const previousNotifs = [...notifications];
        setNotifications([]);

        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('user_id', profile.id);
            if (error) throw error;
        } catch (err) {
            console.error('Failed to clear all notifications:', err);
            setNotifications(previousNotifs);
        }
    };

    const unreadCount = notifications.filter(n => n && n.is_read === false).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            toast,
            markAsRead, 
            markAllRead,
            clearAll,
            refresh: fetchNotifications,
            clearToast: () => setToast(null)
        }}>
            {children}
            
            {/* Real-time Toast Banner */}
            {shouldDisplayPopups && toast && (
                <div className="fixed top-20 sm:top-24 inset-x-3 sm:inset-x-auto sm:right-6 sm:w-auto sm:max-w-sm z-[100] animate-slide-in">
                    <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3.5 ${
                        toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40' :
                        toast.type === 'danger' ? 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/40' :
                        'bg-[#0B0B1E]/95 border-white/10 text-white shadow-black/60'
                    }`}>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm tracking-tight truncate">{toast.title}</h4>
                            <p className="text-[11px] sm:text-xs opacity-85 leading-snug mt-1 break-words">{toast.message}</p>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setToast(null)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0 text-white/50 hover:text-white cursor-pointer"
                            aria-label="Dismiss toast"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Global Broadcast Popup Modal */}
            {shouldDisplayPopups && broadcastModal && (
                <div className="fixed inset-0 z-[10002] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
                    <div className="bg-[#0B0B1E] border border-[#3DD6C8]/40 w-full max-w-lg rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 shadow-[0_30px_120px_rgba(0,0,0,0.95)] relative overflow-hidden text-center space-y-5 animate-scale-in my-auto">
                        {/* Neon accent top bar */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#3DD6C8] to-transparent" />
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#3DD6C8]/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Top quick close button */}
                        <button
                            type="button"
                            onClick={async () => {
                                if (broadcastModal.id && profile?.id && typeof window !== 'undefined') {
                                    localStorage.setItem(`dismissed_broadcast_${profile.id}_${broadcastModal.id}`, 'true');
                                }
                                if (broadcastModal.id) {
                                    await markAsRead(broadcastModal.id);
                                }
                                setBroadcastModal(null);
                                setPreviousBroadcasts([]);
                                setShowHistory(false);
                            }}
                            className="absolute top-5 right-5 p-2 text-white/40 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                            aria-label="Dismiss modal"
                        >
                            <X size={16} />
                        </button>

                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 flex items-center justify-center text-[#3DD6C8] shadow-[0_0_30px_rgba(61,214,200,0.25)]">
                            <Megaphone size={32} className="animate-bounce" />
                        </div>

                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 text-[9px] font-black uppercase tracking-[0.25em] text-[#3DD6C8]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] animate-pulse" />
                                Official Node Broadcast
                            </div>

                            {/* New Message (On Top) */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#3DD6C8]/10 via-white/[0.03] to-transparent border border-[#3DD6C8]/30 text-left space-y-2.5 shadow-[0_0_25px_rgba(61,214,200,0.08)]">
                                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-[#3DD6C8] text-[#0B0B1E]">
                                        Latest Transmission
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-[#3DD6C8] flex items-center gap-1 shrink-0">
                                        <Clock size={11} />
                                        {formatTimestamp(broadcastModal.created_at)}
                                    </span>
                                </div>
                                <h3 className="text-lg sm:text-xl font-black text-white italic tracking-tight uppercase leading-tight">
                                    {broadcastModal.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium whitespace-pre-line max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                    {broadcastModal.message}
                                </p>
                            </div>

                            {/* Previous Messages (Beneath) */}
                            {previousBroadcasts.length > 0 && (
                                <div className="pt-1 text-left">
                                    <button
                                        type="button"
                                        onClick={() => setShowHistory(prev => !prev)}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-black uppercase tracking-wider text-white/60 hover:text-white transition-all cursor-pointer"
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <History size={12} className="text-[#3DD6C8]" />
                                            Previous Broadcasts ({previousBroadcasts.length})
                                        </span>
                                        {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>

                                    {showHistory && (
                                        <div className="mt-2 space-y-2 max-h-44 overflow-y-auto custom-scrollbar pr-1 animate-fade-in">
                                            {previousBroadcasts.map((prevMsg) => (
                                                <div
                                                    key={prevMsg.id}
                                                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 hover:border-white/10 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between text-[9px] text-white/40 font-mono">
                                                        <span className="font-bold text-white/70 uppercase truncate pr-2">
                                                            {prevMsg.title}
                                                        </span>
                                                        <span className="shrink-0 flex items-center gap-1 text-[#3DD6C8]/80">
                                                            <Clock size={10} />
                                                            {formatTimestamp(prevMsg.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">
                                                        {prevMsg.message}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-2.5 pt-2">
                            <button
                                type="button"
                                onClick={async () => {
                                    if (broadcastModal.id && profile?.id && typeof window !== 'undefined') {
                                        localStorage.setItem(`dismissed_broadcast_${profile.id}_${broadcastModal.id}`, 'true');
                                        previousBroadcasts.forEach(p => {
                                            localStorage.setItem(`dismissed_broadcast_${profile.id}_${p.id}`, 'true');
                                        });
                                    }
                                    if (broadcastModal.id) {
                                        await markAsRead(broadcastModal.id);
                                    }
                                    if (previousBroadcasts.length > 0) {
                                        await Promise.all(
                                            previousBroadcasts.filter(p => !p.is_read).map(p => markAsRead(p.id))
                                        );
                                    }
                                    setBroadcastModal(null);
                                    setPreviousBroadcasts([]);
                                    setShowHistory(false);
                                }}
                                className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#3DD6C8] to-teal-500 text-[#0B0B1E] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(61,214,200,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <Check size={18} /> Acknowledge &amp; Continue
                            </button>
                            <div className="flex items-center justify-between px-2 pt-1">
                                <Link
                                    href="/notifications"
                                    onClick={() => {
                                        if (broadcastModal.id && profile?.id && typeof window !== 'undefined') {
                                            localStorage.setItem(`dismissed_broadcast_${profile.id}_${broadcastModal.id}`, 'true');
                                        }
                                        if (broadcastModal.id) {
                                            markAsRead(broadcastModal.id);
                                        }
                                        setBroadcastModal(null);
                                    }}
                                    className="text-[10px] font-bold text-[#3DD6C8] hover:underline flex items-center gap-1"
                                >
                                    Open Broadcast Archive <ArrowRight size={12} />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (broadcastModal.id && profile?.id && typeof window !== 'undefined') {
                                            localStorage.setItem(`dismissed_broadcast_${profile.id}_${broadcastModal.id}`, 'true');
                                        }
                                        setBroadcastModal(null);
                                    }}
                                    className="text-[10px] font-bold text-white/40 hover:text-white transition-colors cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
}
