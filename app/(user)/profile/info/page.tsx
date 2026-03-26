'use client';

import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import Link from 'next/link';

export default function MyInformationPage() {
    const { profile, user } = useAuth();

    return (
        <div className="pt-4 space-y-6">
            <div className="flex items-center gap-3 animate-slide-up">
                <Link href="/profile" className="p-2 rounded-xl bg-text-primary/5 hover:bg-text-primary/10 transition-colors">
                    <ArrowLeft size={20} className="text-text-primary" />
                </Link>
                <h1 className="text-lg font-bold text-text-primary">My Information</h1>
            </div>

            <div className="glass-card divide-y divide-white/5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {[
                    { icon: User, label: 'Username', value: profile?.username || 'N/A' },
                    { icon: Mail, label: 'Email', value: user?.email || 'N/A' },
                    { icon: Phone, label: 'Phone', value: profile?.phone || 'N/A' },
                    { icon: Shield, label: 'Password', value: '********' },
                    { icon: Shield, label: 'Referral Code', value: profile?.referral_code || 'N/A' },
                    { icon: Shield, label: 'Referred By', value: profile?.referred_by || 'None' },
                    { icon: Calendar, label: 'Joined', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A' },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <Icon size={18} className="text-text-secondary" />
                            <span className="text-sm text-text-secondary">{label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-text-primary font-medium">{value}</span>
                            {label === 'Email' && (
                                <Link href="/profile/email" className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-primary/10 text-primary-light border border-primary/20 hover:bg-primary/20 transition-all">
                                    {value === 'N/A' || !value ? 'Bind' : 'Edit'}
                                </Link>
                            )}
                            {label === 'Phone' && (
                                <Link href="/profile/phone" className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-primary/10 text-primary-light border border-primary/20 hover:bg-primary/20 transition-all">
                                    {value === 'N/A' || !value ? 'Bind' : 'Edit'}
                                </Link>
                            )}
                            {label === 'Password' && (
                                <Link href="/profile/password" className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-primary/10 text-primary-light border border-primary/20 hover:bg-primary/20 transition-all">
                                    Update
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
