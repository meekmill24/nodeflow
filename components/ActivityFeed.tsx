'use client';

import { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/context/ThemeContext';
import { Award, Zap, TrendingUp, UserCheck } from 'lucide-react';

interface Activity {
    id: number;
    username: string;
    action: string;
    amount?: number;
    type: 'earning' | 'upgrade' | 'deposit';
}

const MOCK_USERNAMES = [
    'Jack***', 'Liam***', 'Noah***', 'Oliver***', 'James***', 'Elijah***', 
    'Lucas***', 'Mason***', 'Ethan***', 'Logan***', 'Aiden***', 'Sofia***', 
    'Emma***', 'Olivia***', 'Isabella***', 'Mia***', 'Charlotte***', 'Amelia***'
];

const ACTIONS = [
    { text: 'just earned', type: 'earning' as const },
    { text: 'upgraded to', type: 'upgrade' as const },
    { text: 'just deposited', type: 'deposit' as const }
];

export default function ActivityFeed() {
    const { format } = useCurrency();
    const { theme } = useTheme();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Generate a random activity every 8-15 seconds
        const generateActivity = () => {
            const username = MOCK_USERNAMES[Math.floor(Math.random() * MOCK_USERNAMES.length)];
            const actionInfo = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
            
            let amount: number | undefined;
            let actionText = actionInfo.text;

            if (actionInfo.type === 'earning') {
                amount = Math.random() * 50 + 5; // $5 - $55
            } else if (actionInfo.type === 'deposit') {
                amount = [30, 50, 100, 300, 500, 1000][Math.floor(Math.random() * 6)];
            } else {
                actionText = `upgraded to VIP ${Math.floor(Math.random() * 4) + 2}`;
            }

            const newActivity: Activity = {
                id: Date.now(),
                username,
                action: actionText,
                amount,
                type: actionInfo.type
            };

            setCurrentActivity(newActivity);
            setIsVisible(true);

            // Hide after 6 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 6000);
        };

        const interval = setInterval(() => {
            generateActivity();
        }, 12000);

        // Initial trigger
        setTimeout(generateActivity, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleSupportClick = () => {
        const tawk = (window as any).Tawk_API;
        if (tawk) {
            tawk.maximize?.();
        }
    };

    if (!currentActivity) return null;

    return (
        <div className={`fixed top-13 sm:top-15 md:!top-6 md:!left-[59%] left-1/2 -translate-x-1/2 z-[55] transition-all duration-500 ease-out transform pointer-events-none ${
            isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95'
        }`}>
            <div 
                onClick={handleSupportClick}
                className={`glass-card-strong pointer-events-auto px-3.5 py-1.5 sm:py-2 flex items-center gap-2.5 sm:gap-3 border transition-all duration-300 min-w-[230px] max-w-[calc(100vw-32px)] cursor-pointer hover:scale-105 active:scale-95 shadow-[0_12px_36px_rgba(0,0,0,0.65)] ${
                theme === 'dark' 
                ? 'border-white/15 bg-[#0B0B1E]/95 backdrop-blur-2xl' 
                : 'border-gray-200 bg-white shadow-[0_15px_50px_-10px_rgba(0,0,0,0.3)]'
            } rounded-full`}>
                <div className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center shrink-0 ${
                    currentActivity.type === 'earning' ? 'bg-success/20 text-success' : 
                    currentActivity.type === 'upgrade' ? 'bg-gold/20 text-gold' : 'bg-primary/20 text-primary-light'
                }`}>
                    {currentActivity.type === 'earning' ? <Zap size={13} /> : 
                     currentActivity.type === 'upgrade' ? <Award size={13} /> : <TrendingUp size={13} />}
                </div>
                
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-black text-text-primary uppercase tracking-tighter">
                            {currentActivity.username}
                        </span>
                        <span className="text-[10px] font-bold text-text-secondary">
                            {currentActivity.action}
                        </span>
                    </div>
                    {currentActivity.amount && (
                        <span className={`text-xs font-black tracking-tight ${
                            currentActivity.type === 'earning' ? 'text-success' : 'text-primary-light'
                        }`}>
                            {format(currentActivity.amount)}
                        </span>
                    )}
                    {!currentActivity.amount && (
                        <div className="flex items-center gap-1 mt-0.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                           <span className="text-[9px] font-black text-gold uppercase tracking-widest">Unlocked Benefits</span>
                        </div>
                    )}
                </div>

                <div className="ml-auto pl-2 border-l border-white/5 flex flex-col items-center">
                    <UserCheck size={12} className="text-text-secondary opacity-30" />
                    <span className="text-[8px] font-mono text-text-secondary/40">SECURE</span>
                </div>
            </div>
        </div>
    );
}
