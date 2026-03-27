'use client';

import { ArrowLeft, DollarSign, Shield, Globe, Users, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="pt-4 space-y-6">
            <div className="flex items-center gap-3 animate-slide-up">
                <Link href="/profile" className="p-2 rounded-xl bg-text-primary/5 hover:bg-text-primary/10 transition-colors">
                    <ArrowLeft size={20} className="text-text-primary" />
                </Link>
                <h1 className="text-lg font-bold text-text-primary">About Us</h1>
            </div>

            {/* Hero */}
            <div className="glass-card p-6 text-center relative overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg shadow-primary/30">
                        <DollarSign className="w-8 h-8 text-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-accent-light bg-clip-text text-transparent">
                        SmartBugMedia.
                    </h2>
                    <p className="text-text-secondary text-sm mt-2">Making Everything Simple</p>
                </div>
            </div>

            {/* Mission */}
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <h3 className="font-bold text-text-primary mb-3">Our Mission</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                    SmartBugMedia. is dedicated to providing a simple, secure, and efficient platform for users
                    to earn commissions through collaborative task completion. Our AI-powered system ensures
                    fair distribution and transparent operations.
                </p>
            </div>

            {/* Features */}
            <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {[
                    { icon: Shield, label: 'Secure Platform', desc: 'Enterprise-grade security protects your data and earnings' },
                    { icon: Globe, label: 'Global Reach', desc: 'Available worldwide with multi-currency support' },
                    { icon: Users, label: 'Community Driven', desc: 'Join thousands of users earning commissions daily' },
                ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="glass-card p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                            <Icon size={18} className="text-primary-light" />
                        </div>
                        <div>
                            <h4 className="font-medium text-text-primary text-sm">{label}</h4>
                            <p className="text-xs text-text-secondary mt-0.5">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact */}
            <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.25s' }}>
                <h3 className="font-bold text-text-primary mb-3">Contact Us</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                    For support, please use the **Concierge Desk** link on your dashboard or navigation. Our team
                    is available during operating hours (9:00 AM - 9:00 PM Eastern Time).
                </p>
            </div>

            {/* VIP Charter Button */}
            <div className="animate-slide-up px-2" style={{ animationDelay: '0.3s' }}>
                <button 
                    onClick={() => window.open('/documents/VIP_CHARTER.pdf', '_blank')}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    <FileText size={18} />
                    Download VIP Charter (PDF)
                </button>
            </div>

            <div className="text-center py-4 text-xs text-text-secondary/50 border-t border-text-primary/5">
                <p>© 2026 All Rights Reserved | SmartBugMedia. v1.0.0</p>
            </div>
        </div>
    );
}
