'use client';

import { useState, useEffect } from 'react';
import { 
    Download, 
    Share, 
    PlusSquare, 
    X, 
    Smartphone, 
    CheckCircle2, 
    Sparkles, 
    Zap,
    ArrowUpRight
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

    useEffect(() => {
        // 1. Check if running inside installed standalone PWA
        const checkStandalone = () => {
            const isStandaloneMode = 
                window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true ||
                document.referrer.includes('android-app://');
            setIsStandalone(isStandaloneMode);
            return isStandaloneMode;
        };

        const alreadyStandalone = checkStandalone();
        if (alreadyStandalone) return;

        // 2. Detect platform & device
        const ua = window.navigator.userAgent.toLowerCase();
        const isAppleDevice = /iphone|ipad|ipod/.test(ua) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
        const isMobileDevice = /mobile|iphone|ipad|ipod|android|tablet/.test(ua) || window.innerWidth < 1024;
        
        setIsIOS(isAppleDevice);
        setIsMobileOrTablet(isMobileDevice);

        // 3. Check if user dismissed recently (session-based)
        const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');

        // Show banner after 2 seconds on mobile/tablet if not dismissed
        if (isMobileDevice && !dismissed) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1800);
            return () => clearTimeout(timer);
        }

        // 4. Capture native beforeinstallprompt (Android / Chrome / Edge)
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Only auto-open modal for mobile/tablet users, never on PC/Desktop
            if (isMobileDevice && !sessionStorage.getItem('pwa_prompt_dismissed')) {
                setIsOpen(true);
            }
        };

        const handleAppInstalled = () => {
            setInstalledSuccessfully(true);
            setIsOpen(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // 5. Custom event listener so any button in the app can open the PWA install modal
        const handleOpenPrompt = () => {
            setIsOpen(true);
        };
        window.addEventListener('open-pwa-install', handleOpenPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('open-pwa-install', handleOpenPrompt);
        };
    }, []);

    // Register Service Worker
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(() => console.log('SmartBug PWA Service Worker Registered'))
                .catch((err) => console.log('SW registration notice:', err));
        }
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
                setInstalledSuccessfully(true);
                setIsOpen(false);
            }
            setDeferredPrompt(null);
        } catch (err) {
            console.error('Install prompt error:', err);
        }
    };

    const handleDismiss = () => {
        sessionStorage.setItem('pwa_prompt_dismissed', 'true');
        setIsOpen(false);
    };

    if (isStandalone || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10002] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
            {/* Modal Box */}
            <div className="bg-[#0B0B1E] border border-[#3DD6C8]/30 w-full max-w-md rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative flex flex-col p-6 animate-scale-in">
                
                {/* Glow backdrop */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-56 bg-[#3DD6C8]/15 rounded-full blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-10"
                    aria-label="Dismiss"
                >
                    <X size={18} />
                </button>

                {/* Header with App Icon */}
                <div className="flex items-center gap-4 mb-5 relative z-10">
                    <div className="w-16 h-16 rounded-[22px] bg-slate-950 border border-[#3DD6C8]/30 flex items-center justify-center p-2.5 shadow-[0_0_30px_rgba(61,214,200,0.25)] relative overflow-hidden shrink-0">
                        <img 
                            src="/icon-192.png" 
                            alt="SmartBug" 
                            className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(61,214,200,0.6)]" 
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#3DD6C8]/15 text-[#3DD6C8] text-[9px] font-black uppercase tracking-wider border border-[#3DD6C8]/20 flex items-center gap-1">
                                <Sparkles size={10} /> Standalone App
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">SmartBug Media</h3>
                        <p className="text-[11px] text-white/50 font-medium">Add to Home Screen for Full Performance</p>
                    </div>
                </div>

                {/* Benefit Pills */}
                <div className="grid grid-cols-2 gap-2 mb-6 relative z-10">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-2.5">
                        <Zap size={16} className="text-[#3DD6C8] shrink-0" />
                        <span className="text-[10px] font-bold text-white/90 leading-tight">Zero Browser Bar • Full Viewport</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        <span className="text-[10px] font-bold text-white/90 leading-tight">Instant Real-Time Task Alerts</span>
                    </div>
                </div>

                {/* Platform Specific Instructions */}
                {isIOS ? (
                    /* iOS / Safari Steps */
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-6 space-y-3 relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#3DD6C8] block mb-1">
                            How to Install on iPhone / iPad:
                        </span>
                        
                        <div className="flex items-center gap-3 text-xs text-white/80">
                            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-[#3DD6C8] shrink-0 font-black">
                                1
                            </div>
                            <p className="leading-snug">
                                Tap the <strong className="text-white inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-white/10"><Share size={12} className="text-[#3DD6C8]" /> Share</strong> icon in Safari.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-white/80">
                            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-[#3DD6C8] shrink-0 font-black">
                                2
                            </div>
                            <p className="leading-snug">
                                Scroll down and tap <strong className="text-white inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-white/10"><PlusSquare size={12} className="text-[#3DD6C8]" /> Add to Home Screen</strong>.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-white/80">
                            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-[#3DD6C8] shrink-0 font-black">
                                3
                            </div>
                            <p className="leading-snug">
                                Tap <strong className="text-white">Add</strong> in the top-right corner to launch SmartBug directly!
                            </p>
                        </div>
                    </div>
                ) : deferredPrompt ? (
                    /* Android / Chrome Direct 1-Click Install Button */
                    <div className="mb-6 relative z-10">
                        <button
                            type="button"
                            onClick={handleInstallClick}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3DD6C8] to-teal-400 text-[#0B0B1E] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(61,214,200,0.4)] active:scale-95 transition-all hover:brightness-110"
                        >
                            <Download size={18} />
                            Install SmartBug to Home Screen
                        </button>
                    </div>
                ) : (
                    /* Fallback Instructions */
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-6 space-y-2 relative z-10 text-xs text-white/80">
                        <p className="flex items-center gap-2">
                            <Smartphone size={16} className="text-[#3DD6C8]" />
                            Open your browser menu (⋮) and tap <strong>Add to Home screen</strong> or <strong>Install App</strong>.
                        </p>
                    </div>
                )}

                {/* Footer Actions: Allow user to access/continue immediately */}
                <div className="flex items-center gap-3 relative z-10">
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2"
                    >
                        <span>Continue to Web Dashboard</span>
                        <ArrowUpRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
