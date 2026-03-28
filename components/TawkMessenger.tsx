'use client';

import { useSiteSettings } from '@/context/SettingsContext';
import Script from 'next/script';
import { useEffect } from 'react';

export default function TawkMessenger() {
    const settings = useSiteSettings() as any;
    
    // Default values if not set in admin
    const propertyId = settings?.tawkto_property_id || '69c441ae5b8e4d1c398bb6e2';
    const widgetId = settings?.tawkto_widget_id || '1jkja14p1';

    return (
        <Script id="tawk-to" strategy="afterInteractive">
            {`
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                Tawk_API.onLoad = function() {
                    Tawk_API.hideWidget();
                };
                (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/${propertyId}/${widgetId}';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
                })();
            `}
        </Script>
    );
}
