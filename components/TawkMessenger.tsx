'use client';

import { useSiteSettings } from '@/context/SettingsContext';
import { useEffect } from 'react';

export default function TawkMessenger() {
    const settings = useSiteSettings() as any;
    
    const propertyId = settings?.tawkto_property_id || '6a466c3aa8e00f1d434a0ef9';
    const widgetId = settings?.tawkto_widget_id || '1jshhdhta';

    useEffect(() => {
        // 1. Prevent double injection in React strict mode
        if (document.getElementById('tawk-script')) return;

        // 2. Initialize Tawk variables on the window object
        (window as any).Tawk_API = (window as any).Tawk_API || {};
        (window as any).Tawk_LoadStart = new Date();

        // 3. Create the script element manually
        const s1 = document.createElement("script");
        const s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s1.id = 'tawk-script'; // Tag it so we know it's injected
        
        // 4. Inject it safely into the DOM
        if (s0 && s0.parentNode) {
            s0.parentNode.insertBefore(s1, s0);
        } else {
            document.head.appendChild(s1);
        }
        
        // Note: We intentionally do NOT remove the script on unmount.
        // We want Tawk to persist across all Next.js route navigations.
    }, [propertyId, widgetId]);

    return null;
}
