'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
    Download, 
    Share, 
    PlusSquare, 
    X, 
    Smartphone, 
    CheckCircle2, 
    Sparkles, 
    Zap,
    ArrowUpRight,
    Monitor,
    Laptop,
    Globe,
    Check,
    Info
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
    const [isOpen, setIsOpen] = useState(false);
    const [installedSuccessfully, setInstalledSuccessfully] = useState(false);
    const [activeTab, setActiveTab] = useState<'chrome' | 'ios' | 'desktop'>('chrome');

    // Safe dismiss that works reliably across iOS Safari incognito, mobile, tablets, and desktop
    const handleDismiss = useCallback((e?: React.SyntheticEvent) => {
        if (e) {
            e.stopPropagation();
        }
        try {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                sessionStorage.setItem('pwa_prompt_dismissed', 'true');
            }
        } catch {
            // Silently ignore private browsing storage quota exceptions
        }
        setIsOpen(false);
    }, []);

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

        // 2. Detect platform & device to set initial guide tab
        const ua = window.navigator.userAgent.toLowerCase();
        const isAppleMobile = /iphone|ipad|ipod/.test(ua) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
        const isMacOrPC = !(/mobile|iphone|ipad|ipod|android/.test(ua)) && window.innerWidth >= 1024;
        
        if (isAppleMobile) {
            setActiveTab('ios');
        } else if (isMacOrPC) {
            setActiveTab('desktop');
        } else {
            setActiveTab('chrome');
        }

        // 3. Capture native beforeinstallprompt (Android / Chrome / Edge)
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
            console.log('SmartBug PWA: beforeinstallprompt captured and ready');
        };

        const handleAppInstalled = () => {
            setInstalledSuccessfully(true);
            setIsOpen(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // 4. Custom event listener so any button in the app can open the PWA install modal
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

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleDismiss();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleDismiss]);

    // Register Service Worker
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(() => console.log('SmartBug PWA Service Worker Registered'))
                .catch((err) => console.log('SW registration notice:', err));
        }
    }, []);

    const handleInstallClick = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
                setInstalledSuccessfully(true);
            }
            // CRITICAL FIX: Close modal whether accepted OR cancelled/dismissed!
            handleDismiss();
        } catch (err) {
            console.error('Install prompt error:', err);
            handleDismiss();
        } finally {
            setDeferredPrompt(null);
        }
    };

    if (isStandalone || !isOpen) return null;

    return (
        <div 
            onClick={handleDismiss}
            className="fixed inset-0 z-[10002] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none touch-manipulation cursor-pointer"
        >
            {/* Modal Box — stopPropagation ensures clicking inside modal does not dismiss */}
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0B0B1E] border border-[#3DD6C8]/30 w-full max-w-lg max-h-[92vh] overflow-y-auto custom-scrollbar rounded-[32px] sm:rounded-[36px] shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative flex flex-col p-6 sm:p-7 animate-scale-in cursor-default"
            >
                {/* Glow backdrop */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-56 bg-[#3DD6C8]/15 rounded-full blur-3xl pointer-events-none" />

                {/* Touch-Friendly Large Close / Cancel Button */}
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 hover:text-white transition-all flex items-center justify-center z-50 cursor-pointer shadow-lg touch-manipulation"
                    aria-label="Cancel and Close Modal"
                    title="Cancel"
                >
                    <X size={22} className="pointer-events-none text-white/80" />
                </button>

                {/* Header with App Icon */}
                <div className="flex items-center gap-4 mb-5 relative z-10 pr-12">
                    <div className="w-16 h-16 rounded-[22px] bg-slate-950 border border-[#3DD6C8]/30 flex items-center justify-center p-2.5 shadow-[0_0_30px_rgba(61,214,200,0.25)] relative overflow-hidden shrink-0">
                        <img 
                            src="/icon-192.png" 
                            alt="SmartBug" 
                            className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(61,214,200,0.6)]" 
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#3DD6C8]/15 text-[#3DD6C8] text-[9px] font-black uppercase tracking-wider border border-[#3DD6C8]/20 flex items-center gap-1">
                                <Sparkles size={10} /> Standalone PWA
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight truncate">SmartBug Media</h3>
                        <p className="text-[11px] text-white/50 font-medium">Install for 0-latency standalone app performance</p>
                    </div>
                </div>

                {/* Direct 1-Click Install Button (When browser supports instant prompt) */}
                {deferredPrompt && (
                    <div className="mb-5 relative z-10">
                        <button
                            type="button"
                            onClick={handleInstallClick}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3DD6C8] via-teal-300 to-[#3DD6C8] text-slate-950 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2.5 shadow-[0_10px_35px_rgba(61,214,200,0.45)] active:scale-95 transition-all hover:brightness-110 cursor-pointer"
                        >
                            <Download size={18} />
                            <span>Install SmartBug App Now (1-Click)</span>
                        </button>
                    </div>
                )}

                {/* Benefit Pills */}
                <div className="grid grid-cols-2 gap-2 mb-5 relative z-10">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-2.5">
                        <Zap size={16} className="text-[#3DD6C8] shrink-0" />
                        <span className="text-[10px] font-bold text-white/90 leading-tight">Zero Browser Bar • Full Viewport</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        <span className="text-[10px] font-bold text-white/90 leading-tight">Instant Real-Time Task Alerts</span>
                    </div>
                </div>

                {/* Platform Selector Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-white/10 mb-4 relative z-10">
                    <button
                        type="button"
                        onClick={() => setActiveTab('desktop')}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeTab === 'desktop'
                                ? 'bg-[#3DD6C8] text-slate-950 shadow-md font-black'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Laptop size={13} />
                        <span>Chrome / Mac / PC</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('ios')}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeTab === 'ios'
                                ? 'bg-[#3DD6C8] text-slate-950 shadow-md font-black'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Smartphone size={13} />
                        <span>iPhone / iPad</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('chrome')}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            activeTab === 'chrome'
                                ? 'bg-[#3DD6C8] text-slate-950 shadow-md font-black'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Globe size={13} />
                        <span>Android</span>
                    </button>
                </div>

                {/* Platform-Specific Step Guide */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-5 relative z-10 text-xs text-white/80 space-y-3">
                    {activeTab === 'desktop' && (
                        <>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#3DD6C8] block mb-2">
                                Desktop / Mac Chrome &amp; Safari Instructions:
                            </span>
                            
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30 flex items-center justify-center shrink-0 font-black text-[11px] mt-0.5">
                                    1
                                </div>
                                <p className="leading-relaxed">
                                    <strong>In Chrome Address Bar:</strong> Click the <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">Install App ⊕</span> icon on the right side of the URL bar (next to the star).
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30 flex items-center justify-center shrink-0 font-black text-[11px] mt-0.5">
                                    2
                                </div>
                                <p className="leading-relaxed">
                                    <strong>From Browser Menu:</strong> Click <span className="text-white font-bold">⋮ (Menu)</span> &gt; <span className="text-white font-bold">Save and share</span> &gt; <span className="text-[#3DD6C8] font-bold">Install SmartBug Media...</span>
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30 flex items-center justify-center shrink-0 font-black text-[11px] mt-0.5">
                                    3
                                </div>
                                <p className="leading-relaxed">
                                    <strong>On macOS Safari:</strong> Click <span className="text-white font-bold">File</span> in top menu bar &gt; <span className="text-[#3DD6C8] font-bold">Add to Dock...</span>
                                </p>
                            </div>
                        </>
                    )}

                    {activeTab === 'ios' && (
                        <>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#3DD6C8] block mb-2">
                                iPhone &amp; iPad Safari Instructions:
                            </span>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30 flex items-center justify-center shrink-0 font-black text-[11px]">
                                    1
                                </div>
                                <p className="leading-snug">
                                    Tap the <strong className="text-white inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-white/10"><Share size={12} className="text-[#3DD6C8]" /> Share</strong> icon in Safari.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30 flex items-center justify-center shrink-0 font-black text-[11px]">
                                    2
                                </div>
                                <p className="leading-snug">
                                    Scroll down and tap <strong className="text-white inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-white/10"><PlusSquare size={12} className="text-[#3DD6C8]" /> Add to Home Screen</strong>.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30 flex items-center justify-center shrink-0 font-black text-[11px]">
                                    3
                                </div>
                                <p className="leading-snug">
                                    Tap <strong className="text-white">Add</strong> in top-right corner to launch SmartBug directly from your home screen!
                                </p>
                            </div>
                        </>
                    )}

                    {activeTab === 'chrome' && (
                        <>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#3DD6C8] block mb-2">
                                Android / Mobile Chrome Instructions:
                            </span>
                            
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30 flex items-center justify-center shrink-0 font-black text-[11px] mt-0.5">
                                    1
                                </div>
                                <p className="leading-relaxed">
                                    Tap Chrome's <strong className="text-white">three dots (⋮)</strong> in the top-right corner.
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30 flex items-center justify-center shrink-0 font-black text-[11px] mt-0.5">
                                    2
                                </div>
                                <p className="leading-relaxed">
                                    Select <strong className="text-white inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10"><Download size={12} className="text-[#3DD6C8]" /> Install App</strong> or <strong className="text-white">Add to Home screen</strong>.
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-[#3DD6C8]/10 text-[#3DD6C8] border border-[#3DD6C8]/30 flex items-center justify-center shrink-0 font-black text-[11px] mt-0.5">
                                    3
                                </div>
                                <p className="leading-relaxed">
                                    Confirm <strong className="text-white">Install</strong>. SmartBug will appear on your device's app grid!
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Explicit Cancel / Close Button Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 relative z-10 pt-1">
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/25 border border-white/15 text-white font-black text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md touch-manipulation"
                    >
                        <X size={16} className="text-rose-400 pointer-events-none" />
                        <span className="pointer-events-none">Cancel &amp; Close</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-white/70 hover:text-white font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation"
                    >
                        <span className="pointer-events-none">Continue in Browser</span>
                        <ArrowUpRight size={14} className="pointer-events-none" />
                    </button>
                </div>
            </div>
        </div>
    );
}
