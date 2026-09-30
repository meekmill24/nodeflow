import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Script from 'next/script'

const _montserrat = Montserrat({ subsets: ["latin"], weight: ['400','600','700','800','900'] });

import { AuthProvider } from '@/context/AuthContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { Toaster } from 'sonner'
import TawkMessenger from '@/components/TawkMessenger'
import DraggableChat from '@/components/DraggableChat'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

export const viewport: Viewport = {
  themeColor: '#0B0B1E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'SmartBugMedia. | Precision Optimization & Amplified Returns',
  description: 'SmartBugMedia. — The intelligent marketplace optimization platform for high-performance distributed task management.',
  generator: 'SmartBugMedia.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SmartBug',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#0F172A]" suppressHydrationWarning={true}>
        <AuthProvider>
          <SettingsProvider>
            <CurrencyProvider>
              <LanguageProvider>
                <ThemeProvider>
                  <NotificationProvider>
                    {children}
                    <Toaster 
                      position="top-center" 
                      richColors 
                      closeButton
                      toastOptions={{ 
                        style: { 
                          marginTop: 'max(env(safe-area-inset-top, 0px), 12px)',
                          borderRadius: '20px', 
                          border: '1px solid rgba(61, 214, 200, 0.25)', 
                          background: 'rgba(11, 11, 30, 0.95)', 
                          backdropFilter: 'blur(16px)',
                          color: '#FFFFFF',
                          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
                        }, 
                        className: 'font-sans font-medium text-xs sm:text-sm tracking-wide !w-[calc(100vw-32px)] sm:!w-auto sm:max-w-md'
                      }} 
                    />
                    <Analytics />
                    
                    <TawkMessenger />
                    <DraggableChat />
                    <PWAInstallPrompt />
                  </NotificationProvider>
                </ThemeProvider>
              </LanguageProvider>
            </CurrencyProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
