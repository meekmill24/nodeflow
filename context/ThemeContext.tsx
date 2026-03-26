'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Default to dark, but check if user previously selected light
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            // Check OS preference only if not set, but we prefer dark
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            if (prefersLight) {
                setTheme('dark'); // We want default dark anyway as requested
            }
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Prevent hydration mismatch flash by not rendering children until mounted and theme evaluated
    if (!mounted) {
        return <div className="min-h-screen bg-[#1e1b2e]" />; // Fallback dark background while mounting
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
