'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/index';
import { useAuth } from '@/context/AuthContext';
import { Bell, Megaphone, Check, X, ShieldAlert, Info } from 'lucide-react';

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
    const { profile } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [toast, setToast] = useState<Notification | null>(null);
    const [broadcastModal, setBroadcastModal] = useState<Notification | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!profile?.id) return;
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

            // Check if there is an unread system broadcast notification
            const unreadBroadcast = notifs.find(n => !n.is_read && (n.type === 'info' || n.title?.toLowerCase().includes('broadcast') || n.title?.toLowerCase().includes('system') || n.title?.toLowerCase().includes('announcement') || n.title?.toLowerCase().includes('notice')));
            if (unreadBroadcast) {
                // Check if user has dismissed it in this browser session
                const dismissedKey = `dismissed_broadcast_${unreadBroadcast.id}`;
                if (typeof window !== 'undefined' && !sessionStorage.getItem(dismissedKey)) {
                    setBroadcastModal(unreadBroadcast);
                }
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    useEffect(() => {
        fetchNotifications();
        
        // Subscribe to new notifications
        if (!profile?.id) return;
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
    }, [profile?.id, fetchNotifications]);

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
            {toast && (
                <div className="fixed top-20 right-4 z-[100] w-full max-w-sm animate-slide-in">
                    <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-4 ${
                        toast.type === 'success' ? 'bg-success/20 border-success text-success' :
                        toast.type === 'danger' ? 'bg-danger/20 border-danger text-danger' :
                        'bg-surface/80 border-white/10 text-white'
                    }`}>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm tracking-tight">{toast.title}</h4>
                            <p className="text-xs opacity-90 leading-snug mt-1">{toast.message}</p>
                        </div>
                        <button 
                            onClick={() => setToast(null)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Global Broadcast Popup Modal */}
            {broadcastModal && (
                <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#0B0B1E] border border-[#3DD6C8]/40 w-full max-w-lg rounded-[36px] p-8 md:p-10 shadow-[0_30px_120px_rgba(0,0,0,0.95)] relative overflow-hidden text-center space-y-6 animate-scale-in">
                        {/* Neon accent top bar */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#3DD6C8] to-transparent" />
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#3DD6C8]/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 flex items-center justify-center text-[#3DD6C8] shadow-[0_0_30px_rgba(61,214,200,0.25)]">
                            <Megaphone size={36} className="animate-bounce" />
                        </div>

                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 text-[9px] font-black uppercase tracking-[0.25em] text-[#3DD6C8]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] animate-pulse" />
                                Official Node Broadcast
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white italic tracking-tight uppercase leading-tight">
                                {broadcastModal.title}
                            </h3>
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-left max-h-60 overflow-y-auto custom-scrollbar">
                                <p className="text-sm text-white/80 leading-relaxed font-medium whitespace-pre-line">
                                    {broadcastModal.message}
                                </p>
                            </div>
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] block">
                                Broadcast Timestamp: {new Date(broadcastModal.created_at).toLocaleString()}
                            </span>
                        </div>

                        <div className="space-y-3 pt-2">
                            <button
                                type="button"
                                onClick={async () => {
                                    if (broadcastModal.id) {
                                        await markAsRead(broadcastModal.id);
                                        if (typeof window !== 'undefined') {
                                            sessionStorage.setItem(`dismissed_broadcast_${broadcastModal.id}`, 'true');
                                        }
                                    }
                                    setBroadcastModal(null);
                                }}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3DD6C8] to-teal-500 text-[#0B0B1E] font-black uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(61,214,200,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Check size={18} /> Acknowledge & Continue
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (broadcastModal.id && typeof window !== 'undefined') {
                                        sessionStorage.setItem(`dismissed_broadcast_${broadcastModal.id}`, 'true');
                                    }
                                    setBroadcastModal(null);
                                }}
                                className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors"
                            >
                                Remind Me Later
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
}
