'use client';

import { useSiteSettings } from '@/context/SettingsContext';
import { useEffect } from 'react';

export default function TawkMessenger() {
    const settings = useSiteSettings() as any;
    
    const propertyId = settings?.tawkto_property_id || '6a466c3aa8e00f1d434a0ef9';
    const widgetId = settings?.tawkto_widget_id || '1jshhdhta';

    useEffect(() => {
        // Initialize Tawk variables on the window object
        (window as any).Tawk_API = (window as any).Tawk_API || {};
        (window as any).Tawk_LoadStart = new Date();

        // 1. Immediately hide default green launcher widget once Tawk finishes loading
        (window as any).Tawk_API.onLoad = function () {
            try {
                (window as any).Tawk_API.hideWidget();
            } catch (err) {
                console.error('Tawk hideWidget error:', err);
            }
        };

        // 2. When chat is minimized or hidden, ensure default launcher stays hidden
        (window as any).Tawk_API.onChatMinimized = function () {
            try {
                (window as any).Tawk_API.hideWidget();
            } catch (err) {
                console.error('Tawk hideWidget error:', err);
            }
        };

        (window as any).Tawk_API.onChatHidden = function () {
            try {
                (window as any).Tawk_API.hideWidget();
            } catch (err) {
                console.error('Tawk hideWidget error:', err);
            }
        };

        // 3. Inject script safely into the DOM
        if (!document.getElementById('tawk-script')) {
            const s1 = document.createElement("script");
            const s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s1.id = 'tawk-script';
            
            if (s0 && s0.parentNode) {
                s0.parentNode.insertBefore(s1, s0);
            } else {
                document.head.appendChild(s1);
            }
        }

        // 4. Periodic watchdog to ensure the default widget launcher is never visible when chat is minimized
        const watchdog = setInterval(() => {
            const tawk = (window as any).Tawk_API;
            if (tawk && typeof tawk.hideWidget === 'function') {
                if (typeof tawk.isChatMaximized === 'function') {
                    if (!tawk.isChatMaximized()) {
                        tawk.hideWidget();
                    }
                } else {
                    tawk.hideWidget();
                }
            }
        }, 500);

        return () => {
            clearInterval(watchdog);
        };
    }, [propertyId, widgetId]);

    return null;
}
