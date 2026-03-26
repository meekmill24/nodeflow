'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Phone, CheckCircle, AlertCircle, Loader2, Send, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const COUNTRY_CODES = [
    { code: '+1', flag: '🇺🇸', name: 'USA' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
    { code: '+66', flag: '🇹🇭', name: 'Thailand' },
    { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
    { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
    { code: '+82', flag: '🇰🇷', name: 'South Korea' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
];

export default function BindPhonePage() {
    const { profile, refreshProfile } = useAuth();
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
    const [showCountryCodes, setShowCountryCodes] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (profile?.phone) {
            // Try to separate country code if possible
            const matchedCode = COUNTRY_CODES.find(c => profile.phone.startsWith(c.code));
            if (matchedCode) {
                setCountryCode(matchedCode);
                setPhone(profile.phone.slice(matchedCode.code.length));
            } else {
                setPhone(profile.phone);
            }
        }
    }, [profile]);

    const handleBind = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let finalPhone = phone.trim();
        if (!finalPhone.startsWith('+')) {
            finalPhone = `${countryCode.code}${finalPhone.replace(/\D/g, '')}`;
        }

        if (finalPhone.length < 8) {
            setMessage({ type: 'error', text: 'Please enter a valid phone number.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ phone: finalPhone })
                .eq('id', profile?.id);

            if (error) throw error;
            
            await refreshProfile();
            setMessage({ type: 'success', text: 'Phone number updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update phone number.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen -mx-4 -mt-4 px-4 pt-4 pb-8 overflow-hidden bg-background">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-8 max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between animate-slide-up">
                    <Link href="/profile/info" className="p-2 -ml-2 hover:bg-white/5 rounded-2xl transition-all group">
                        <ArrowLeft className="text-text-primary group-hover:text-primary-light transition-colors" />
                    </Link>
                    <h1 className="text-xl font-black text-white uppercase tracking-tight">Account Security</h1>
                    <div className="w-10" />
                </div>

                {/* Status Card */}
                <div className="glass-card-glow p-8 animate-slide-up" style={{ animationDelay: '0.05s' }}>
                    <div className="flex justify-center mb-8">
                        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center border-2 rotate-3 shadow-lg ${profile?.phone ? 'bg-success/20 border-success/30 text-success shadow-success/20' : 'bg-primary/20 border-primary/30 text-primary-light shadow-primary/20'}`}>
                            <Phone size={36} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-white text-center mb-2 uppercase tracking-tight">Bind Phone</h2>
                    <p className="text-xs text-text-secondary text-center mb-10 uppercase tracking-widest font-bold opacity-60">
                        {profile?.phone 
                            ? "Your phone number is linked. You can update it below." 
                            : "Link your phone number to receive important SMS alerts and secure your account."}
                    </p>

                    <form onSubmit={handleBind} className="space-y-8">
                        <div className="relative group">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 block opacity-40">
                                Phone Number
                            </label>
                            <div className="flex flex-nowrap gap-2">
                                {!phone.startsWith('+') && (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowCountryCodes(!showCountryCodes)}
                                            className="h-[60px] bg-white/5 border border-white/10 rounded-2xl px-4 flex items-center gap-2 hover:bg-white/10 transition-all min-w-[100px] justify-between"
                                        >
                                            <span className="text-lg">{countryCode.flag}</span>
                                            <span className="text-sm font-bold text-white">{countryCode.code}</span>
                                            <ChevronDown size={14} className="text-text-secondary" />
                                        </button>
                                        {showCountryCodes && (
                                            <div className="absolute top-full left-0 mt-2 w-64 bg-surface-light border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden">
                                                <div className="max-h-64 overflow-y-auto">
                                                    {COUNTRY_CODES.map((c) => (
                                                        <button
                                                            key={c.code}
                                                            type="button"
                                                            onClick={() => { setCountryCode(c); setShowCountryCodes(false); }}
                                                            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/10 text-left transition-colors"
                                                        >
                                                            <span className="text-xl">{c.flag}</span>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black text-white">{c.code}</span>
                                                                <span className="text-[10px] text-text-secondary uppercase font-bold">{c.name}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-text-secondary group-focus-within:text-primary-light transition-colors" />
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={phone.startsWith('+') ? "+Manual Entry" : "812 345 678"}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white placeholder-text-secondary/30 focus:border-primary-light focus:bg-white/10 transition-all outline-none font-bold min-w-0"
                                    />
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-5 rounded-2xl flex items-start gap-4 animate-scale-in ${message.type === 'success' ? 'bg-success/10 border border-success/20 text-success' : 'bg-danger/10 border border-danger/20 text-danger'}`}>
                                {message.type === 'success' ? <CheckCircle size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                                <p className="text-sm font-bold leading-relaxed uppercase tracking-wide">{message.text}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !phone}
                            className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:grayscale cursor-pointer"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    {profile?.phone ? 'Update Phone' : 'Bind Number'}
                                    <Send size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Verification Tip */}
                <div className="glass-card p-6 animate-slide-up border-transparent hover:border-primary/10 transition-all" style={{ animationDelay: '0.1s' }}>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                            <AlertCircle className="text-accent-light" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Security Protocol</p>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider leading-relaxed opacity-60">
                                SMS verification may be required for large withdrawals. Ensure the number is accurate and belonging to you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
