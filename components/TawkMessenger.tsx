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

        let isHandlingState = false;

        // 1. Immediately hide default launcher widget once Tawk finishes loading
        (window as any).Tawk_API.onLoad = function () {
            try {
                (window as any).Tawk_API.hideWidget?.();
            } catch (err) {
                console.error('Tawk hideWidget error on load:', err);
            }
        };

        // 2. When chat is minimized by user, hide the default widget launcher so only DraggableChat remains visible
        (window as any).Tawk_API.onChatMinimized = function () {
            if (isHandlingState) return;
            isHandlingState = true;
            try {
                (window as any).Tawk_API.hideWidget?.();
            } catch (err) {
                console.error('Tawk hideWidget error on minimize:', err);
            } finally {
                setTimeout(() => {
                    isHandlingState = false;
                }, 500);
            }
        };

        // 3. Inject script safely into the DOM once
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
    }, [propertyId, widgetId]);

    return null;
}
