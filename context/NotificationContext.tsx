'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface Notification {
    id: number;
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
    markAsRead: (id: number) => Promise<void>;
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
            setNotifications(data || []);
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

    const markAsRead = async (id: number) => {
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
        </NotificationContext.Provider>
    );
}
