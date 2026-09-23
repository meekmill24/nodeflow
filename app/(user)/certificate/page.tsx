'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Award, ShieldCheck, CheckCircle2, Globe, Building, Download, Share2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CertificatePage() {
    const { profile } = useAuth();
    const { t } = useLanguage();

    const [view, setView] = useState<'personal' | 'company'>('personal');
    const [isDownloading, setIsDownloading] = useState(false);
    const certRef = useRef<HTMLDivElement>(null);

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleDownloadPDF = async () => {
        if (!certRef.current || isDownloading) return;
        setIsDownloading(true);
        const toastId = toast.loading('Generating high-fidelity PDF certificate...');

        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');

            const element = certRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#0a0510',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
            const pdf = new jsPDF({
                orientation,
                unit: 'px',
                format: [imgWidth, imgHeight],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`SmartBugMedia_Certificate_${view}_${profile?.username || 'member'}.pdf`);

            toast.success('Certificate PDF downloaded successfully!', { id: toastId });
        } catch (err) {
            console.error('PDF Generation Error:', err);
            toast.dismiss(toastId);
            toast.info('Printing certificate...');
            window.print();
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShareProof = async () => {
        const certTitle = view === 'personal' ? 'Node Optimization Certificate' : 'Institutional Operating License';
        const certDesc = `SmartBugMedia Official Certificate for ${profile?.username || 'Worker'}`;
        const url = typeof window !== 'undefined' ? window.location.href : '';

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: certTitle,
                    text: certDesc,
                    url: url
                });
                toast.success('Certificate shared successfully!');
                return;
            } catch (err: any) {
                if (err?.name === 'AbortError') return;
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Certificate verification link copied to clipboard!');
        } catch {
            toast.error('Unable to copy link to clipboard');
        }
    };

    return (
        <div className="space-y-8 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between animate-slide-up">
                <div className="flex items-center gap-4">
                    <Link href="/home" className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary/10 transition-all text-text-primary hover:text-primary">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-text-primary tracking-tight uppercase">Credentials</h1>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-60">Authentication & compliance</p>
                    </div>
                </div>
                
                {/* View Toggle */}
                <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5">
                    <button 
                        onClick={() => setView('personal')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'personal' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Personal
                    </button>
                    <button 
                        onClick={() => setView('company')}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'company' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Institutional
                    </button>
                </div>
            </div>

            {/* Certificate Area */}
            <div className="relative group perspective-1000 animate-slide-up [animation-delay:0.1s]">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-[60px] blur-3xl opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                
                <div ref={certRef} id="certificate-node" className="relative glass-card-strong p-1 rounded-[48px] overflow-hidden border border-white/10 shadow-2xl shadow-primary/20">
                    <div className="relative rounded-[46px] overflow-hidden aspect-[1/1.4] md:aspect-[1.4/1] min-h-[600px] flex items-center justify-center p-8 md:p-16">
                        {/* High-fidelity Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            {/* Overlay gradients for readability */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 marker:pointer-events-none" />
                        </div>
                        
                        {/* Certificate Content Overlay */}
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between text-center py-4 md:py-8">
                            {view === 'personal' ? (
                                <>
                                    <div className="space-y-6">
                                        <div className="flex justify-center">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-accent p-0.5 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                                <div className="w-full h-full rounded-[14px] bg-[#0a0510] flex items-center justify-center border border-white/10">
                                                    <Award size={40} className="text-primary-light" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl md:text-5xl font-serif font-black text-white tracking-tight drop-shadow-lg">
                                                Certificate of Achievement
                                            </h2>
                                            <div className="flex items-center justify-center gap-6 mt-4">
                                                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-primary/60" />
                                                <p className="text-[10px] font-black text-primary-light uppercase tracking-[0.5em] drop-shadow-md">Professional Node Optimizer</p>
                                                <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-primary/60" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8 flex-1 flex flex-col justify-center max-w-2xl">
                                        <p className="text-sm text-white/50 italic font-serif tracking-widest uppercase">This prestigious honor is conferred upon</p>
                                        <div className="relative inline-block">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-black text-primary-light uppercase tracking-[0.4em] mb-2 opacity-50">Recipient Name</span>
                                                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest px-8">
                                                    {profile?.username || 'Valued Member'}
                                                </h3>
                                            </div>
                                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                                        </div>
                                        <p className="text-xs md:text-sm text-white/70 leading-[1.8] font-medium px-4 md:px-12 backdrop-blur-[2px] py-4">
                                            For unparalleled dedication to system integrity and neural data excellence. 
                                            By consistently meeting the optimized thresholds of the <span className="text-primary-light font-bold">Global Neural Data Federation</span>, 
                                            the recipient is hereby certified as a verified professional for <span className="text-white font-bold">VIP Level {profile?.level_id || 1}</span> operations.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-end">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-32 h-[1px] bg-white/20" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-2">Issue Date</span>
                                                <span className="text-xs font-bold text-white uppercase tracking-wider">{today}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center -mb-8 scale-110 group-hover:scale-125 transition-transform duration-700">
                                            <div className="relative w-24 h-24 flex items-center justify-center">
                                                <div className="absolute inset-0 border-4 border-double border-primary/40 rounded-full animate-spin-slow" />
                                                <div className="absolute inset-2 border border-primary/20 rounded-full animate-reverse-spin" />
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-dark flex items-center justify-center shadow-2xl">
                                                    <ShieldCheck size={32} className="text-white" />
                                                </div>
                                            </div>
                                            <span className="text-[8px] font-black text-primary-light uppercase tracking-[0.3em] mt-3">Verified Official</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-32 h-[1px] bg-white/20" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-2">Authentication ID</span>
                                                <span className="text-[10px] font-bold text-white font-mono opacity-80 uppercase tracking-tighter">
                                                    {profile?.id?.slice(0, 18).toUpperCase() || 'OPT-SBM-PROTOCOL'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        <div className="flex justify-center">
                                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-1 shadow-2xl">
                                                <div className="w-full h-full rounded-[22px] bg-[#0a0510] flex items-center justify-center border border-white/20">
                                                    <Building size={48} className="text-amber-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tight drop-shadow-lg uppercase italic">
                                                Operating License
                                            </h2>
                                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.6em] mt-4 drop-shadow-md">International Neural Assets Federation</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex-1 flex flex-col justify-center max-w-2xl mt-8">
                                        <div className="relative inline-block">
                                            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-[0.2em] px-8 py-2 font-serif">
                                                SmartBugMedia. GLOBAL OPS
                                            </h3>
                                            <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />
                                        </div>

                                        <p className="text-[11px] text-amber-400/90 font-bold uppercase tracking-[0.25em] max-w-xl mx-auto">
                                            Smartbug Media was founded in 2007 by Ryan Malone and Julia Feldman
                                        </p>

                                        <div className="flex flex-col items-center mt-2">
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 opacity-60">Authorized Holder</span>
                                            <span className="text-xl font-bold text-white uppercase tracking-widest">Adam Bleitreu</span>
                                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.3em] mt-0.5">Chief Executive Officer</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 mt-4">
                                            <div className="text-left space-y-1">
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Registration No.</span>
                                                <p className="text-base font-black text-white tracking-widest font-mono">SBM-GLOBAL-99B2-2026</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Jurisdiction</span>
                                                <p className="text-base font-black text-white tracking-widest">GLOBAL OPERATIONAL</p>
                                            </div>
                                        </div>

                                        <p className="text-[11px] text-white/80 leading-[2] font-semibold px-4 md:px-12 backdrop-blur-[4px] py-4 border-y border-white/10 uppercase tracking-widest italic">
                                            This entity is duly registered and authorized to conduct large-scale neural network optimization, 
                                            liquidity matching, and cross-border digital asset settlements under the 
                                            <span className="text-amber-500"> Financial Integrity Protocol v4.5</span>.
                                        </p>
                                    </div>

                                    {/* Institutional Endorsement, Signature & Seal */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-end mt-8 pb-4">
                                        {/* CEO Endorsement & Signature */}
                                        <div className="flex flex-col items-center text-center space-y-2">
                                            <div className="relative flex flex-col items-center">
                                                {/* Digital Stylized Signature of Adam Bleitreu */}
                                                <div className="relative py-1">
                                                    <span className="font-serif italic text-2xl md:text-3xl text-amber-300 font-extrabold tracking-tight select-none drop-shadow-[0_0_12px_rgba(251,191,36,0.5)] transform -rotate-3 block">
                                                        Adam Bleitreu
                                                    </span>
                                                    <svg className="w-36 h-3 text-amber-400/80 -mt-1 mx-auto overflow-visible" viewBox="0 0 140 12" fill="none">
                                                        <path d="M2 7 C35 1, 75 12, 138 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                </div>
                                                <div className="w-36 h-[1px] bg-amber-400/30 mt-1" />
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[11px] font-black text-white uppercase tracking-widest">Adam Bleitreu</span>
                                                <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.3em]">Chief Executive Officer</span>
                                            </div>
                                        </div>

                                        {/* Golden Seal */}
                                        <div className="flex flex-col items-center justify-center -mb-2">
                                            <div className="w-28 h-28 relative flex items-center justify-center">
                                                <div className="absolute inset-0 border-8 border-double border-amber-600/30 rounded-full animate-spin-slow" />
                                                <div className="w-18 h-18 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center backdrop-blur-md">
                                                    <ShieldCheck size={36} className="text-amber-500" />
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mt-2">GOLD SEAL VERIFIED</span>
                                        </div>

                                        {/* Founders & Certification Body */}
                                        <div className="flex flex-col items-center text-center space-y-2">
                                            <div className="w-32 h-[1px] bg-white/20 mb-2" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.25em] mb-1">Founded 2007 by</span>
                                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Ryan Malone & Julia Feldman</span>
                                                <span className="text-[8px] font-bold text-amber-400/80 uppercase tracking-widest mt-1">Smartbug Media Governance</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 animate-slide-up [animation-delay:0.3s]">
                <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                    {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                </button>
                <button 
                    onClick={handleShareProof}
                    className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-text-primary font-black uppercase tracking-widest text-xs hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                >
                    <Share2 size={18} />
                    Share Proof
                </button>
            </div>


            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up [animation-delay:0.4s]">
                <div className="glass-card p-6 flex gap-4">
                    <CheckCircle2 className="text-success shrink-0" size={24} />
                    <div>
                        <h4 className="text-xs font-black text-text-primary uppercase tracking-wider mb-1">Authenticity Guaranteed</h4>
                        <p className="text-[10px] text-text-secondary font-medium leading-relaxed">This certificate is digitally signed and logged on the platform's distributed ledger for permanent verification.</p>
                    </div>
                </div>
                <div className="glass-card p-6 flex gap-4">
                    <Globe className="text-accent shrink-0" size={24} />
                    <div>
                        <h4 className="text-xs font-black text-text-primary uppercase tracking-wider mb-1">Global Recognition</h4>
                        <p className="text-[10px] text-text-secondary font-medium leading-relaxed">Valid for optimization operations across all supported regional servers and neural network clusters.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
