'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSiteSettings } from './SettingsContext';
import { supabase } from '@/lib/supabase/index';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'CHF' | 'AUD' | 'SGD' | 'AED' | 'ZAR' | 'BRL' | 'GHC' | 'BTC' | 'ETH' | 'INR' | 'CNY' | 'KRW' | 'HKD' | 'NZD' | 'MXN' | 'RUB' | 'SAR' | 'TRY' | 'IDR' | 'MYR' | 'THB' | 'PHP' | 'VND' | 'USDC' | 'PAYPALUSD' | 'BNB';

interface Currency {
    code: CurrencyCode;
    symbol: string;
    rate: number; // Rate relative to USD
}

const currencies: Record<CurrencyCode, Currency> = {
    USD: { code: 'USD', symbol: '$', rate: 1 },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
    JPY: { code: 'JPY', symbol: '¥', rate: 150.5 },
    CAD: { code: 'CAD', symbol: '$', rate: 1.35 },
    CHF: { code: 'CHF', symbol: 'Fr', rate: 0.88 },
    AUD: { code: 'AUD', symbol: 'A$', rate: 1.52 },
    SGD: { code: 'SGD', symbol: 'S$', rate: 1.34 },
    AED: { code: 'AED', symbol: 'Dh', rate: 3.67 },
    ZAR: { code: 'ZAR', symbol: 'R', rate: 19.05 },
    BRL: { code: 'BRL', symbol: 'R$', rate: 4.97 },
    GHC: { code: 'GHC', symbol: 'GH₵', rate: 12.85 },
    BTC: { code: 'BTC', symbol: '₿', rate: 0.000015 },
    ETH: { code: 'ETH', symbol: 'Ξ ', rate: 0.00035 },
    INR: { code: 'INR', symbol: '₹', rate: 82.95 },
    CNY: { code: 'CNY', symbol: '¥', rate: 7.19 },
    KRW: { code: 'KRW', symbol: '₩', rate: 1335.5 },
    HKD: { code: 'HKD', symbol: 'HK$', rate: 7.82 },
    NZD: { code: 'NZD', symbol: 'NZ$', rate: 1.62 },
    MXN: { code: 'MXN', symbol: '$', rate: 17.05 },
    RUB: { code: 'RUB', symbol: '₽', rate: 92.5 },
    SAR: { code: 'SAR', symbol: 'SR', rate: 3.75 },
    TRY: { code: 'TRY', symbol: '₺', rate: 31.05 },
    IDR: { code: 'IDR', symbol: 'Rp', rate: 15650 },
    MYR: { code: 'MYR', symbol: 'RM', rate: 4.75 },
    THB: { code: 'THB', symbol: '฿', rate: 35.85 },
    PHP: { code: 'PHP', symbol: '₱', rate: 56.05 },
    VND: { code: 'VND', symbol: '₫', rate: 24650 },
    USDC: { code: 'USDC', symbol: 'USDC ', rate: 1 },
    PAYPALUSD: { code: 'PAYPALUSD', symbol: 'PYUSD ', rate: 1 },
    BNB: { code: 'BNB', symbol: 'BNB ', rate: 0.0017 },
};

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (code: CurrencyCode) => void;
    convert: (amount: number) => number;
    format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const { profile } = useAuth();
    const siteSettings = useSiteSettings() as any;
    const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('currency') as CurrencyCode;
            if (saved && currencies[saved]) return currencies[saved];
        }
        return currencies.USD;
    });

    useEffect(() => {
        // Determine default from admin override or saved state
        const adminDefaultCode = (siteSettings?.default_currency || siteSettings?.currency?.default) as CurrencyCode;
        const adminCurrency = adminDefaultCode && currencies[adminDefaultCode] ? currencies[adminDefaultCode] : currencies.USD;

        const savedCurrency = (typeof window !== 'undefined' ? localStorage.getItem('currency') : null) as CurrencyCode;

        if (savedCurrency && currencies[savedCurrency]) {
            setCurrentCurrency(currencies[savedCurrency]);
        } else if (profile?.currency && currencies[profile.currency as CurrencyCode]) {
            setCurrentCurrency(currencies[profile.currency as CurrencyCode]);
        } else if (adminCurrency) {
            setCurrentCurrency(adminCurrency);
        }
    }, [profile?.currency, siteSettings?.default_currency, siteSettings?.currency?.default, siteSettings?.loading]);

    // Listen for storage / custom currency-change events across components
    useEffect(() => {
        const handleSync = () => {
            const saved = localStorage.getItem('currency') as CurrencyCode;
            if (saved && currencies[saved]) {
                setCurrentCurrency(currencies[saved]);
            }
        };
        window.addEventListener('storage', handleSync);
        window.addEventListener('currency-changed', handleSync);
        return () => {
            window.removeEventListener('storage', handleSync);
            window.removeEventListener('currency-changed', handleSync);
        };
    }, []);

    const handleSetCurrency = async (code: CurrencyCode) => {
        if (currencies[code]) {
            setCurrentCurrency(currencies[code]);
            if (typeof window !== 'undefined') {
                localStorage.setItem('currency', code);
                window.dispatchEvent(new Event('currency-changed'));
            }

            if (profile?.id) {
                try {
                    await supabase
                        .from('profiles')
                        .update({ currency: code })
                        .eq('id', profile.id);
                } catch {
                    // Fallback to local storage if database column doesn't exist
                }
            }
        }
    };

    const convert = (amount: number) => {
        return (Number(amount) || 0) * currentCurrency.rate;
    };

    const format = (amount: number) => {
        const converted = convert(amount);
        if (currentCurrency.code === 'JPY') {
            return `${currentCurrency.symbol}${Math.round(converted).toLocaleString()}`;
        }
        if (currentCurrency.code === 'BTC') {
            return `${currentCurrency.symbol}${converted.toFixed(8)}`;
        }
        if (currentCurrency.code === 'ETH') {
            return `${currentCurrency.symbol}${converted.toFixed(5)}`;
        }
        if (currentCurrency.code === 'BNB') {
            return `${currentCurrency.symbol}${converted.toFixed(4)}`;
        }
        return `${currentCurrency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency: currentCurrency, setCurrency: handleSetCurrency, convert, format }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
    return context;
};
