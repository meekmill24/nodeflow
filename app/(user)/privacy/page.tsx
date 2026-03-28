'use client';

import { 
    ShieldCheck, 
    Lock, 
    Database, 
    Eye, 
    RefreshCcw, 
    Mail, 
    Cpu,
    Blocks,
    FileSearch,
    BadgeAlert
} from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-16">
            
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    <ShieldCheck size={12} />
                    Data Sovereignty Protocols Active
                </div>
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                    Privacy <span className="text-success">Protocol</span>
                </h1>
                <p className="max-w-2xl mx-auto text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
                    Last Global Sync: December 2026 • Security Level: High-Fidelity
                </p>
            </div>

            {/* Core Privacy Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Data Security', icon: Lock, color: 'text-primary-light', desc: 'Enterprise-grade encryption across all nodal activity and wealth calibration cycles.' },
                    { title: 'Neural Masking', icon: Eye, color: 'text-accent-light', desc: 'Anonymized processing of user records through decentralized blockchain protocols.' },
                    { title: 'Zero Extraction', icon: RefreshCcw, color: 'text-success', desc: 'No personal data is sold or exported to third-party commercial matrixes.' },
                ].map((v, i) => (
                    <div key={i} className="glass-card p-10 border-white/5 space-y-6 hover:bg-white/[0.02] transition-colors text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                            <v.icon size={24} className={v.color} />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{v.title}</h3>
                        <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">{v.desc}</p>
                    </div>
                ))}
            </div>

            {/* Detailed Policy Text */}
            <div className="glass-card-strong p-10 md:p-14 border-white/5 space-y-12 bg-slate-900/40 backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-success/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[11px] font-bold text-white/60 leading-relaxed uppercase tracking-widest">
                    <div className="space-y-10">
                        <section className="space-y-4">
                            <h2 className="text-lg font-black text-white uppercase italic flex items-center gap-3">
                                <Database size={18} className="text-success" />
                                1. Eligibility & Acceptance
                            </h2>
                            <p className="opacity-80">
                                By using the SmartBugMedia platform, you confirm you are at least 18 years of age, have the legal capacity to enter into binding agreements, and agree to comply with all platform policies and applicable laws.
                            </p>
                        </section>
                        <section className="space-y-4">
                            <h2 className="text-lg font-black text-white uppercase italic flex items-center gap-3">
                                <Lock size={18} className="text-success" />
                                2. Personal Information Protection
                            </h2>
                            <p className="opacity-80">
                                SmartBugMedia is committed to protecting user privacy. We collect limited personal information necessary to operate our services, including account registration details, contact info, transaction records, and platform activity data. This data is used strictly for account management, transaction verification, platform security, and customer support.
                            </p>
                        </section>
                        <section className="space-y-4">
                            <h2 className="text-lg font-black text-white uppercase italic flex items-center gap-3">
                                <Blocks size={18} className="text-success" />
                                3. Security & Compliance
                            </h2>
                            <p className="opacity-80">
                                SmartBugMedia uses secure digital infrastructure and blockchain-supported transaction systems (USDT, Ethereum, TRC Network) to provide transparent and traceable financial operations. Blockchain technology provides tamper-resistant transaction verification and secure global payment infrastructure.
                            </p>
                        </section>
                    </div>

                    <div className="space-y-10">
                        <section className="space-y-4">
                            <h2 className="text-lg font-black text-white uppercase italic flex items-center gap-3">
                                <BadgeAlert size={18} className="text-success" />
                                4. Reporting Improper Behavior
                            </h2>
                            <p className="opacity-80">
                                SmartBugMedia maintains strict operational integrity standards. Employees or contractors associated with the platform are not permitted to engage in unauthorized activities. If users identify suspicious behavior or misuse of the SmartBugMedia brand, they may report the incident by submitting written descriptions and screenshots to the official support channel.
                            </p>
                        </section>
                        <section className="space-y-4">
                            <h2 className="text-lg font-black text-white uppercase italic flex items-center gap-3">
                                <FileSearch size={18} className="text-success" />
                                5. Fund Management & Security
                            </h2>
                            <p className="opacity-80">
                                SmartBugMedia implements automated transaction monitoring and financial processing systems. Users are responsible for ensuring the accuracy of wallet addresses and verifying transaction details before submitting payments. Transactions sent to incorrect addresses cannot always be reversed due to blockchain design.
                            </p>
                        </section>
                        <section className="space-y-4 md:pt-14">
                            <div className="p-6 bg-success/5 border border-success/20 rounded-2xl">
                                 <h4 className="text-[10px] font-black text-success uppercase tracking-widest mb-2">Institutional Tax compliance</h4>
                                 <p className="text-[9px] font-bold text-white/40 leading-relaxed uppercase tracking-widest lowercase">
                                    Users are responsible for complying with tax regulations in their respective jurisdictions. individuals receiving significant financial income may be required to report earnings and maintain financial records.
                                 </p>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="text-success" size={20} />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Privacy Protocol Sync v4.5 Active</span>
                    </div>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">For privacy inquiries, contact the Neural Matrix Team through official channels.</p>
                </div>
            </div>

        </div>
    );
}
