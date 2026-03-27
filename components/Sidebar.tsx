'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';


import { useAuth } from '@/context/AuthContext';


import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/context/ThemeContext';


import { 
    Home, 
    PlayCircle, 
    FileText, 
    Wallet, 
    Shield, 
    User,
    LogOut,
    Search,
    X,
    Headset
} from 'lucide-react';


const menuItems = [
    { label: 'Home', icon: Home, href: '/home' },
    { label: 'Start tasks', icon: PlayCircle, href: '/start' },
    { label: 'Record', icon: FileText, href: '/record' },
    { label: 'Wallet', icon: Wallet, href: '/wallet' },
    { label: 'Vip map', icon: Shield, href: '/levels' },
    { label: 'My profile', icon: User, href: '/profile' },
    { label: 'Live support', icon: Headset, href: '#', isAction: true },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { profile, signOut } = useAuth();
    const { t, language } = useLanguage();
    const { format } = useCurrency();
    const { theme } = useTheme();

    return (
        <>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed top-0 left-0 h-screen w-72 z-[70] transition-all duration-300 transform md:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } flex flex-col ${
                theme === 'dark' 
                ? 'bg-surface/60 backdrop-blur-xl border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' 
                : 'bg-white border-r border-black/5 shadow-xl'
            }`}>
                

                <div className="p-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 overflow-hidden">
                            <div className="w-full h-full rounded-[7px] bg-slate-900 flex items-center justify-center p-1.5">
                                <img src="/logo.png" alt="NodeFlow Logo" className="w-full h-full" />
                            </div>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-text-primary to-text-primary/60 bg-clip-text text-transparent">
                            NodeFlow.
                        </h1>
                    </div>
                    {/* Mobile Close Button */}
                    <button 
                        onClick={onClose}
                        className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>


            <div className={`mt-2 mb-4 h-px transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : 'bg-gradient-to-r from-transparent via-black/5 to-transparent'}`} />

            <div className="px-6 py-2 text-[10px] text-text-secondary font-bold opacity-50 uppercase tracking-widest">
                Dashboard Protocol
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-2">
                {menuItems.map((item: any, index: number) => {
                    const isActive = pathname === item.href;
                    const translatedLabel = t(item.label.toLowerCase().replace(' ', '_'));
                    
                    const isQuickStart = index === 3; // Before Wallet

                    const renderItem = () => {
                        if (item.isAction) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        const tawk = (window as any).Tawk_API;
                                    if (tawk) {
                                        if (typeof tawk.isChatMaximized === 'function' && tawk.isChatMaximized()) {
                                            tawk.minimize?.();
                                        } else {
                                            tawk.maximize?.();
                                        }
                                    }
                                    onClose();
                                    }}
                                    className="w-full sidebar-nav-item text-text-secondary hover:text-text-primary"
                                >
                                    <item.icon size={18} className="opacity-70" />
                                    <span className="font-medium">{translatedLabel}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={onClose}
                                className={`sidebar-nav-item ${isActive ? 'active' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                <item.icon size={18} className={isActive ? 'text-primary' : 'opacity-70'} />
                                <span className="font-medium">{translatedLabel}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] animate-pulse" />
                                )}
                            </Link>
                        );
                    };

                    return (
                        <div key={item.label}>
                            {isQuickStart && (
                                <div className="mt-8 mb-4">
                                    <div className={`h-px transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : 'bg-gradient-to-r from-transparent via-black/5 to-transparent'}`} />
                                    <div className="px-2 pt-6 pb-2 text-[10px] text-text-secondary font-bold opacity-50 uppercase tracking-widest">
                                        Quick Hub
                                    </div>
                                </div>
                            )}
                            {renderItem()}
                        </div>
                    );
                })}
            </nav>


            <div className={`p-4 mt-auto border-t transition-colors duration-300 ${
                theme === 'dark' 
                ? 'border-white/5 bg-black/[0.1]' 
                : 'border-black/5 bg-white'
            }`}>
                <div className="flex items-center justify-between mb-4">
                    <Link 
                        href="/profile" 
                        onClick={onClose}
                        className="flex items-center gap-3 group flex-1"
                    >
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative group-hover:border-primary transition-all ${
                            theme === 'dark' ? 'border-primary/30 bg-white/10' : 'border-primary/20 bg-gray-50'
                        }`}>
                            <span className="text-primary font-bold">{profile?.username?.[0].toUpperCase() || 'U'}</span>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-white dark:border-surface flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-success-light dark:bg-black animate-pulse" />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-text-primary truncate transition-colors group-hover:text-primary">
                                {profile?.username || 'User'}
                            </p>
                            <p className="text-[10px] text-primary-light font-medium tracking-tight mt-0.5 opacity-60">
                                Vip level {profile?.level_id || 1}
                            </p>
                        </div>
                    </Link>
                    <button 
                        onClick={() => signOut()}
                        className={`p-2 transition-colors rounded-lg border ${
                            theme === 'dark' 
                            ? 'text-text-secondary hover:text-danger bg-white/10 border-white/5' 
                            : 'text-text-secondary hover:text-danger bg-gray-50 border-black/5'
                        }`}
                        title={t('logout')}
                    >
                        <LogOut size={16} />
                    </button>
                </div>

                {/* Info Circles */}
                <div className="flex gap-2">
                    <div className={`flex-1 glass-card p-2 flex flex-col items-center justify-center text-center border transition-all ${
                        theme === 'dark' 
                        ? 'bg-white/5 border-white/5' 
                        : 'bg-gray-50/50 border-black/5 backdrop-blur-none'
                    }`}>
                        <span className="text-[8px] text-text-secondary uppercase tracking-tighter mb-1 font-bold">{t('joined')}</span>
                        <span className="text-[10px] font-bold text-text-primary">
                            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString(
                                language === 'English' ? 'en-US' :
                                language === 'Spanish' ? 'es-ES' :
                                language === 'French' ? 'fr-FR' :
                                language === 'German' ? 'de-DE' :
                                language === 'Chinese' ? 'zh-CN' :
                                language === 'Japanese' ? 'ja-JP' : 'en-US',
                                { month: 'short', year: '2-digit' }
                            ) : '---'}
                        </span>
                    </div>
                    <div className={`flex-1 glass-card p-2 flex flex-col items-center justify-center text-center border transition-all ${
                        theme === 'dark' 
                        ? 'bg-primary/10 border-primary/20' 
                        : 'bg-primary/5 border-primary/10 backdrop-blur-none'
                    }`}>
                        <span className="text-[8px] text-primary uppercase tracking-tighter mb-1 font-bold">{t('balance_sidebar')}</span>
                        <span className="text-[10px] font-black text-primary transition-colors">
                            {format(profile?.wallet_balance ?? 0)}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
        </>
    );
}
