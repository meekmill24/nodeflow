'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/index';
import type { Profile } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import { LogOut, Loader2 } from 'lucide-react';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    isSigningOut: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    mutate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    isSigningOut: false,
    signOut: async () => { },
    refreshProfile: async () => { },
    mutate: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const userRef = useRef<User | null>(null);
    const router = useRouter();

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            console.log("Fetching profile for ID:", userId);
            
            // Try standard client first (respects RLS)
            let { data, error } = await supabase
                .from('profiles')
                .select('*, level:levels(*)')
                .eq('id', userId)
                .maybeSingle();

            // FALLBACK: If RLS blocked it but we have a session, try the Server-Side API
            if (!data) {
                console.warn("Client-side profile fetch empty. Transitioning to server-side authority...");
                const res = await fetch(`/api/auth/profile?userId=${userId}`);
                if (res.ok) {
                    const serverData = await res.json();
                    if (serverData && !serverData.error) {
                        data = serverData;
                        error = null;
                        console.log("Profile resolved via Server-Side Bridge.");
                    }
                }
            }

            if (error) {
                console.error(`DB Error (${error.code}):`, error.message);
                setProfile(null);
            } else if (!data) {
                console.warn(`Profile node not found in any matrix layer for: ${userId}`);
                setProfile(null);
            } else {
                // Resolve active level based on assigned DB level_id (default to Junior Agent / level_id: 1)
                const { data: allLevels } = await supabase
                    .from('levels')
                    .select('*')
                    .order('id', { ascending: true });

                if (allLevels && allLevels.length > 0) {
                    const targetLevelId = data.level_id || 1;
                    const assignedLevel = allLevels.find((l: any) => l.id === targetLevelId) || allLevels[0];
                    data = { ...data, level_id: targetLevelId, level: assignedLevel };
                }

                setProfile(data);
            }
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
            setProfile(null);
        }
    }, [supabase]);

    const refreshProfile = useCallback(async () => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
            await fetchProfile(currentUser.id);
        }
    }, [fetchProfile]);

    useEffect(() => {
        let mounted = true;
        let initialized = false;

        const initialize = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (session?.user) {
                    console.log("Session User:", session.user.email, "| ID:", session.user.id);
                    userRef.current = session.user;
                    setUser(session.user);
                    await fetchProfile(session.user.id);
                } else {
                    userRef.current = null;
                    setUser(null);
                    setProfile(null);
                }
                initialized = true;
            } catch (err: any) {
                console.error('Auth initialization error:', err);

                if (mounted) {
                    const { data: { user: fallbackUser } } = await supabase.auth.getUser();
                    if (fallbackUser) {
                        userRef.current = fallbackUser;
                        setUser(fallbackUser);
                        await fetchProfile(fallbackUser.id);
                    } else {
                        userRef.current = null;
                        setUser(null);
                        setProfile(null);
                    }
                    initialized = true;
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initialize();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;

                // CRITICAL FIX: Background token refresh should be completely silent.
                // Never trigger full-screen loading spinner or reload while user is idle.
                if (event === 'TOKEN_REFRESHED') {
                    if (session?.user) {
                        userRef.current = session.user;
                        setUser(session.user);
                    }
                    return;
                }

                if (event === 'INITIAL_SESSION' && !initialized) return;

                if (session?.user) {
                    const currentUserId = userRef.current?.id;
                    const isSameUser = currentUserId === session.user.id;

                    userRef.current = session.user;
                    setUser(session.user);

                    // Only refetch profile if user ID changed or on initial load
                    if (!isSameUser) {
                        if (!initialized) setLoading(true);
                        await fetchProfile(session.user.id);
                    }
                } else if (event === 'SIGNED_OUT') {
                    console.log("Auth session signed out");
                    userRef.current = null;
                    setUser(null);
                    setProfile(null);
                }

                if (mounted && !initialized) setLoading(false);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    // Real-time balance and profile synchronization
    useEffect(() => {
        if (!user?.id) return;

        const profileChannel = supabase
            .channel(`realtime-profile-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`,
                },
                (payload) => {
                    console.log("Realtime profile update received:", payload);
                    fetchProfile(user.id);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(profileChannel);
        };
    }, [user?.id, fetchProfile]);

    const signOut = useCallback(async () => {
        if (isSigningOut) return;
        setIsSigningOut(true);
        try {
            await Promise.allSettled([
                supabase.auth.signOut(),
                new Promise((resolve) => setTimeout(resolve, 1400)),
            ]);
        } catch (err) {
            console.error('SignOut error:', err);
        } finally {
            setUser(null);
            setProfile(null);
            router.replace('/');
            setTimeout(() => {
                setIsSigningOut(false);
            }, 1000);
        }
    }, [isSigningOut, router]);

    useEffect(() => {
        console.log("PROFILE STATE UPDATE:", profile);
        if (!loading && user && profile === null) {
            console.warn("Profile not loaded, but user exists");
        }
    }, [loading, user, profile, signOut]);

    return (
        <AuthContext.Provider value={{ user, profile, loading, isSigningOut, signOut, refreshProfile, mutate: refreshProfile }}>
            {children}
            {isSigningOut && (
                <div className="fixed inset-0 z-[999999] bg-[#070714]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-500 animate-in fade-in">
                    {/* Ambient glow backgrounds */}
                    <div className="absolute w-96 h-96 rounded-full bg-rose-500/15 blur-[120px] pointer-events-none" />
                    <div className="absolute w-80 h-80 rounded-full bg-[#3DD6C8]/10 blur-[100px] pointer-events-none" />

                    {/* Concentric rotating portal */}
                    <div className="relative flex items-center justify-center mb-8">
                        <div className="w-32 h-32 rounded-full border border-rose-500/20 border-t-rose-500 border-r-rose-400 animate-spin" style={{ animationDuration: '2s' }} />
                        <div className="absolute w-24 h-24 rounded-full border border-[#3DD6C8]/30 border-b-[#3DD6C8] animate-spin" style={{ animationDuration: '1.4s', animationDirection: 'reverse' }} />
                        <div className="absolute w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-[0_0_40px_rgba(244,63,94,0.55)]">
                            <LogOut size={28} className="animate-pulse" />
                        </div>
                    </div>

                    {/* Status Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-[0.25em] mb-4 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        Security Protocol Active
                    </div>

                    {/* Heading */}
                    <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-wider mb-2 drop-shadow-lg">
                        Signing Out
                    </h2>
                    <p className="text-xs text-white/50 tracking-widest uppercase font-mono mb-8 max-w-sm">
                        Ending session & safely clearing cache...
                    </p>

                    {/* Animated Progress Bar */}
                    <div className="w-72 max-w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
                        <div className="h-full bg-gradient-to-r from-rose-500 via-[#3DD6C8] to-rose-500 rounded-full animate-pulse w-full" />
                    </div>
                    <div className="flex justify-between w-72 max-w-full text-[9px] font-mono text-white/30 uppercase tracking-widest mt-3">
                        <span>SmartBug Media</span>
                        <span className="flex items-center gap-1.5 text-rose-400">
                            <Loader2 size={10} className="animate-spin" />
                            Disconnecting
                        </span>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}
