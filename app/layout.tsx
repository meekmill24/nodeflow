import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'SmartBugMedia. | Precision Optimization & Amplified Returns',
  description: 'SmartBugMedia. — The intelligent marketplace optimization platform for high-performance distributed task management.',
  generator: 'SmartBugMedia.',
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
                    <Toaster position="top-center" richColors containerStyle={{ left: '50%', transform: 'translateX(-50%)' }} toastOptions={{ style: { marginTop: '36px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }, className: 'md:!left-[57.5%] !left-1/2' }} />
                    <Analytics />
                    
                    <TawkMessenger />
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
