'use client';

import { useSiteSettings } from '@/context/SettingsContext';
import { useEffect } from 'react';

export default function TawkMessenger() {
    const settings = useSiteSettings() as any;
    
    const propertyId = settings?.tawkto_property_id || '6abe44e19762d834392b3344';
    const widgetId = settings?.tawkto_widget_id || '1k3rjq8ai';

    useEffect(() => {
        // Initialize Tawk variables on the window object
        (window as any).Tawk_API = (window as any).Tawk_API || {};
        (window as any).Tawk_LoadStart = new Date();

        // 1. Proactively disable attention grabber bubble ("We Are Here!")
        (window as any).Tawk_API.showAttentionGrabber = false;

        // 2. Inject high-priority suppression style tag directly into <head>
        const styleId = 'tawk-suppress-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                #chat-bubble, #chat-bubble *,
                #min-widget, #min-widget *,
                #message-preview, #message-preview *,
                #branding-widget, #branding-widget *,
                .tawk-min-container, .tawk-min-container *,
                .tawk-bubble, .tawk-bubble *,
                .tawk-button, .tawk-button *,
                [id*="tawk-bubble"], [id*="tawk-bubble"] *,
                [id*="chat-bubble"], [id*="chat-bubble"] *,
                [id*="min-widget"], [id*="min-widget"] *,
                iframe[title="chat:minimized"],
                iframe[title="chat:bubble"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    clip: rect(0, 0, 0, 0) !important;
                    clip-path: inset(100%) !important;
                    width: 0 !important;
                    height: 0 !important;
                    position: fixed !important;
                    left: -9999px !important;
                    top: -9999px !important;
                    z-index: -9999 !important;
                    transform: scale(0) !important;
                }
            `;
            document.head.appendChild(style);
        }

        let isHandlingState = false;

        const hideDefaultWidget = () => {
            try {
                const targetIds = ['chat-bubble', 'min-widget', 'message-preview', 'branding-widget'];
                for (const id of targetIds) {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.setProperty('display', 'none', 'important');
                        el.style.setProperty('visibility', 'hidden', 'important');
                        el.style.setProperty('opacity', '0', 'important');
                        el.style.setProperty('pointer-events', 'none', 'important');
                        el.querySelectorAll('iframe').forEach((ifr) => {
                            ifr.style.setProperty('display', 'none', 'important');
                            ifr.style.setProperty('visibility', 'hidden', 'important');
                            ifr.style.setProperty('opacity', '0', 'important');
                        });
                    }
                }
                if (typeof (window as any).Tawk_API?.hideWidget === 'function') {
                    (window as any).Tawk_API.hideWidget();
                }
            } catch (err) {
                // Ignore any DOM check errors
            }
        };

        // 3. Hide default launcher widget once Tawk finishes loading
        (window as any).Tawk_API.onLoad = function () {
            hideDefaultWidget();
        };

        // 4. When chat is minimized by user, hide the default widget launcher so only DraggableChat remains visible
        (window as any).Tawk_API.onChatMinimized = function () {
            if (isHandlingState) return;
            isHandlingState = true;
            hideDefaultWidget();
            setTimeout(() => {
                isHandlingState = false;
            }, 500);
        };

        // 5. Fast MutationObserver to immediately suppress #chat-bubble the microsecond it touches the DOM on reload
        const observer = new MutationObserver(() => {
            hideDefaultWidget();
        });

        const rootTarget = document.documentElement || document.body;
        if (rootTarget) {
            observer.observe(rootTarget, { childList: true, subtree: true });
        }

        // 6. Inject script safely into the DOM once
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

        return () => {
            observer.disconnect();
        };
    }, [propertyId, widgetId]);

    return null;
}

