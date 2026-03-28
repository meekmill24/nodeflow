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
    X,
    Headset,
    Compass,
    Activity,
    Cpu
} from 'lucide-react';

const menuItems = [
    { label: 'Home', icon: Home, href: '/home', category: 'DASHBOARD PROTOCOL' },
    { label: 'Start tasks', icon: PlayCircle, href: '/start', category: 'DASHBOARD PROTOCOL' },
    { label: 'Record', icon: FileText, href: '/record', category: 'DASHBOARD PROTOCOL' },
    { label: 'Wallet', icon: Wallet, href: '/wallet', category: 'QUICK HUB' },
    { label: 'Vip map', icon: Shield, href: '/levels', category: 'QUICK HUB' },
    { label: 'My profile', icon: User, href: '/profile', category: 'QUICK HUB' },
    { label: 'Live support', icon: Headset, href: '#', isAction: true, category: 'QUICK HUB' },
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

    const categories = ['DASHBOARD PROTOCOL', 'QUICK HUB'];

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden animate-in fade-in duration-500"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed top-0 left-0 h-screen w-72 z-[70] transition-all duration-500 transform md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                flex flex-col bg-[#0B0B1E]/95 backdrop-blur-3xl border-r border-white/5 shadow-[30px_0_60px_rgba(0,0,0,0.8)]
            `}>
                
                {/* Branding Block */}
                <div className="p-8 pb-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-[#3DD6C8]/20 flex items-center justify-center p-2 relative shadow-[0_0_20px_rgba(61,214,200,0.1)] group-hover:shadow-[0_0_30px_rgba(61,214,200,0.25)] transition-all duration-700 overflow-hidden">
                             <div className="absolute inset-0 bg-[#3DD6C8]/5 animate-pulse" />
                             <img src="/logo.png" alt="Logo" className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_8px_rgba(61,214,200,0.5)] group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-black text-[#3DD6C8] uppercase tracking-tighter italic flex items-baseline leading-none">
                                SmartBugMedia<span className="text-[#E34304] scale-125 ml-0.5 animate-pulse">.</span>
                            </h1>
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] mt-1.5 leading-none">Node Controller</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="md:hidden p-2 text-white/40 hover:text-white transition-colors"><X size={20} /></button> 
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 space-y-10">
                    {categories.map((cat) => (
                        <div key={cat} className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3DD6C8] shadow-[0_0_8px_rgba(61,214,200,0.6)]" />
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">{cat}</span>
                            </div>
                            <nav className="space-y-1.5">
                                {menuItems.filter(i => i.category === cat).map((item) => {
                                    const isActive = pathname === item.href;
                                    const translatedLabel = t(item.label.toLowerCase().replace(' ', '_'));

                                    const content = (
                                        <>
                                            <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-[#3DD6C8]/10 text-[#3DD6C8]' : 'bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/10'}`}>
                                                <item.icon size={18} />
                                            </div>
                                            <span className={`text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                                                {translatedLabel}
                                            </span>
                                            {isActive && (
                                                <div className="ml-auto w-1 h-3 rounded-full bg-[#3DD6C8] shadow-[0_0_15px_rgba(61,214,200,1)] animate-pulse" />
                                            )}
                                        </>
                                    );

                                    if (item.isAction) {
                                        return (
                                            <button
                                                key={item.label}
                                                onClick={() => {
                                                    const tawk = (window as any).Tawk_API;
                                                    if (tawk) {
                                                        tawk.isChatMaximized() ? tawk.minimize() : tawk.maximize();
                                                    }
                                                    onClose();
                                                }}
                                                className="w-full flex items-center gap-4 px-4 py-3 rounded-[20px] transition-all duration-300 group hover:bg-white/5 text-left border border-transparent hover:border-white/5"
                                            >
                                                {content}
                                            </button>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`
                                                flex items-center gap-4 px-4 py-3 rounded-[20px] transition-all duration-500 group relative overflow-hidden border
                                                ${isActive ? 'bg-[#3DD6C8]/5 border-[#3DD6C8]/20 shadow-[0_0_30px_rgba(61,214,200,0.05)]' : 'border-transparent hover:bg-white/[0.03] hover:border-white/5'}
                                            `}
                                        >
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#3DD6C8]/10 to-transparent opacity-50" />
                                            )}
                                            {content}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Account Identity Shard */}
                <div className="p-8 mt-auto border-t border-white/5 bg-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/profile" onClick={onClose} className="flex items-center gap-4 group">
                             <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3DD6C8]/20 to-transparent border border-[#3DD6C8]/30 flex items-center justify-center relative group-hover:scale-110 transition-all duration-500">
                                <span className="text-[#3DD6C8] font-black text-sm italic">{profile?.username?.[0].toUpperCase() || 'U'}</span>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#3DD6C8] border-2 border-[#0B0B1E] flex items-center justify-center">
                                    <div className="w-1 h-1 rounded-full bg-[#0B0B1E] animate-pulse" />
                                </div>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-xs font-black text-white group-hover:text-[#3DD6C8] transition-colors">{profile?.username || 'User'}</span>
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mt-1 italic">Vip Node Lv.{profile?.level_id || 1}</span>
                             </div>
                        </Link>
                        <button onClick={() => signOut()} className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-rose-500 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all duration-300">
                            <LogOut size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1 overflow-hidden relative group/asset">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                            <span className="text-[7px] font-black text-white/30 uppercase tracking-widest relative z-10">{t('joined')}</span>
                            <span className="text-[9px] font-black text-white relative z-10">
                                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : '---'}
                            </span>
                         </div>
                         <div className="p-3 bg-[#3DD6C8]/10 border border-[#3DD6C8]/20 rounded-2xl flex flex-col gap-1 relative group/asset">
                            <div className="absolute inset-0 bg-[#3DD6C8]/5 opacity-0 group-hover/asset:opacity-100 transition-opacity rounded-2xl" />
                            <span className="text-[7px] font-black text-[#3DD6C8] uppercase tracking-widest relative z-10">BALANCE</span>
                            <span className="text-[9px] font-black text-white relative z-10">{format(profile?.wallet_balance ?? 0)}</span>
                         </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
