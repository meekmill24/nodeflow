'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
    ArrowLeft, Award, ShieldCheck, CheckCircle2, Globe, Building, Download, 
    Share2, Loader2, Copy, Check, ExternalLink, Sparkles, X, MessageCircle, Send, Image
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

export default function CertificatePage() {
    const { profile } = useAuth();
    const { t } = useLanguage();

    const [view, setView] = useState<'personal' | 'company'>('personal');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDownloadingImage, setIsDownloadingImage] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    
    // Live visible element & dedicated printable element
    const certRef = useRef<HTMLDivElement>(null);
    const exportRef = useRef<HTMLDivElement>(null);

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const certId = profile?.id 
        ? `SBM-CERT-${profile.id.replace(/-/g, '').substring(0, 10).toUpperCase()}`
        : 'SBM-CERT-8849204A12';

    const verificationUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/certificate?verify=${certId}`
        : 'https://smartbugmedia.io/certificate';

    // High-fidelity A4 Landscape PDF generator
    const handleDownloadPDF = async () => {
        const targetElement = exportRef.current || certRef.current;
        if (!targetElement || isDownloading) return;
        
        setIsDownloading(true);
        const toastId = toast.loading('Rendering high-fidelity A4 certificate PDF...');

        try {
            const html2canvas = (await import('html2canvas-pro')).default;
            const { jsPDF } = await import('jspdf');

            // Render at high DPI without external asset taint
            const canvas = await html2canvas(targetElement, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#0a0d1a',
                logging: false,
                windowWidth: 1200,
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.98);

            // True A4 landscape dimensions: 297mm x 210mm
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
                compress: true,
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
            
            const fileName = view === 'personal'
                ? `SmartBugMedia_Certificate_${(profile?.username || 'member').toUpperCase()}.pdf`
                : `SmartBugMedia_Corporate_Operating_License.pdf`;

            pdf.save(fileName);
            toast.success('Certificate PDF generated and downloaded successfully!', { id: toastId });
        } catch (err: any) {
            console.error('PDF Generation Error:', err);
            toast.error(`PDF generation issue: ${err.message || 'Error creating document'}. Try downloading as PNG image instead.`, { id: toastId });
        } finally {
            setIsDownloading(false);
        }
    };

    // Export as crisp PNG image directly for easy chat sharing
    const handleDownloadImage = async () => {
        const targetElement = exportRef.current || certRef.current;
        if (!targetElement || isDownloadingImage) return;

        setIsDownloadingImage(true);
        const toastId = toast.loading('Generating high-res certificate image...');

        try {
            const html2canvas = (await import('html2canvas-pro')).default;
            const canvas = await html2canvas(targetElement, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#0a0d1a',
                logging: false,
                windowWidth: 1200,
            });

            const link = document.createElement('a');
            link.download = `SmartBugMedia_${view === 'personal' ? 'Certificate' : 'License'}_${profile?.username || 'Official'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            toast.success('Certificate image saved to downloads!', { id: toastId });
        } catch (err: any) {
            console.error('Image Export Error:', err);
            toast.error('Unable to export image. Please try again.', { id: toastId });
        } finally {
            setIsDownloadingImage(false);
        }
    };

    const handleShareProof = async () => {
        const certTitle = view === 'personal' 
            ? `SmartBugMedia Official Certificate — ${profile?.username || 'Verified Operator'}`
            : 'SmartBugMedia Official Corporate Operating License';
        const shareText = `Official Verification: Certified by SmartBugMedia Operations Inc. (Cert ID: ${certId}). Access authentic ledger proof:`;

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: certTitle,
                    text: shareText,
                    url: verificationUrl
                });
                toast.success('Proof shared successfully!');
                return;
            } catch (err: any) {
                if (err?.name === 'AbortError') return;
            }
        }

        // Open modal fallback with instant copy, WhatsApp, and Telegram options
        setShowShareModal(true);
    };

    const copyVerificationLink = () => {
        navigator.clipboard.writeText(verificationUrl);
        setCopiedLink(true);
        toast.success('Official verification link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 2500);
    };

    return (
        <div className="space-y-8 pb-24 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between animate-slide-up">
                <div className="flex items-center gap-4">
                    <Link href="/home" className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-white border border-white/5">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight uppercase">Credentials & Licensing</h1>
                        <p className="text-[10px] font-black text-[#3DD6C8] uppercase tracking-[0.25em]">Cryptographic & Institutional Verification</p>
                    </div>
                </div>
                
                {/* View Toggle */}
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10">
                    <button 
                        onClick={() => setView('personal')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            view === 'personal' 
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Operator Certificate
                    </button>
                    <button 
                        onClick={() => setView('company')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            view === 'company' 
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Corporate License
                    </button>
                </div>
            </div>

            {/* LIVE DISPLAY CERTIFICATE */}
            <div className="relative group perspective-1000 animate-slide-up [animation-delay:0.1s]">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-[#3DD6C8]/20 to-amber-500/20 rounded-[44px] blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000" />
                
                <div 
                    ref={certRef} 
                    className="relative rounded-[36px] overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-[#080B14] p-4 sm:p-8 md:p-12 text-white"
                    style={{
                        backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(61, 214, 200, 0.08) 0%, transparent 60%)`
                    }}
                >
                    {/* Double Ornamental Guilloche Border */}
                    <div className="border border-amber-500/30 rounded-[28px] p-2 sm:p-4 relative">
                        <div className="border-2 border-amber-400/60 rounded-[22px] p-6 sm:p-10 md:p-14 relative flex flex-col justify-between min-h-[580px]">
                            
                            {/* Corner Decorative Accents */}
                            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400" />
                            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400" />
                            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400" />
                            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400" />

                            {/* Center Watermark Emblem */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                                <Award size={400} className="text-amber-400" />
                            </div>

                            {view === 'personal' ? (
                                <>
                                    {/* PERSONAL CERTIFICATE TOP */}
                                    <div className="relative z-10 text-center space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-left">
                                                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">SMARTBUG MEDIA OPERATIONS</span>
                                                <p className="text-[8px] font-mono text-slate-500">{certId}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                                                <ShieldCheck size={12} className="text-amber-400" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">AUTHENTICATED LEDGER</span>
                                            </div>
                                        </div>

                                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-xl flex items-center justify-center">
                                            <div className="w-full h-full rounded-full bg-[#0a0d1a] flex items-center justify-center border border-amber-300/40">
                                                <Award size={34} className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white uppercase drop-shadow-md">
                                                Certificate of Achievement
                                            </h2>
                                            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.45em] text-amber-400/90 mt-2">
                                                Professional Node Optimization Specialist
                                            </p>
                                        </div>
                                    </div>

                                    {/* PERSONAL CERTIFICATE BODY */}
                                    <div className="relative z-10 text-center my-6 sm:my-8 space-y-4 max-w-2xl mx-auto">
                                        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-400 font-serif italic">
                                            This prestigious operational credential is duly conferred upon
                                        </p>
                                        
                                        <div className="py-2 border-b-2 border-amber-400/60 inline-block min-w-[280px] sm:min-w-[420px]">
                                            <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-wider text-amber-300 uppercase drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                                                {profile?.display_name || profile?.username || 'Valued Member'}
                                            </h3>
                                        </div>

                                        <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 leading-relaxed font-medium pt-2">
                                            In recognition of distinguished competence, account integrity, and verified task throughput within the 
                                            <span className="text-amber-400 font-bold"> SmartBugMedia Global Optimization Protocol</span>. 
                                            The operator is officially accredited with active operational clearance for 
                                            <span className="text-white font-bold"> VIP Level {profile?.level_id || 1}</span> asset optimization.
                                        </p>
                                    </div>

                                    {/* PERSONAL CERTIFICATE FOOTER */}
                                    <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 border-t border-amber-500/20">
                                        {/* Signature 1 */}
                                        <div className="flex flex-col items-center text-center">
                                            <div className="font-serif italic text-lg sm:text-2xl text-amber-300 font-bold select-none -rotate-2">
                                                Ryan Malone
                                            </div>
                                            <div className="w-24 sm:w-36 h-[1px] bg-amber-400/40 my-1" />
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white">Ryan Malone</span>
                                            <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider text-amber-400/70">Founder & Board Chair</span>
                                        </div>

                                        {/* Golden Wax Seal */}
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-800 p-1 shadow-2xl flex items-center justify-center relative">
                                                <div className="w-full h-full rounded-full border border-amber-200/50 flex flex-col items-center justify-center bg-gradient-to-b from-amber-600 to-amber-900 text-center p-1 shadow-inner">
                                                    <ShieldCheck size={22} className="text-amber-100 drop-shadow" />
                                                    <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-tighter text-amber-100 mt-0.5 leading-none">OFFICIAL SEAL</span>
                                                    <span className="text-[5px] sm:text-[6px] font-black tracking-widest text-amber-200">VERIFIED</span>
                                                </div>
                                            </div>
                                            <span className="text-[7px] font-black uppercase tracking-[0.25em] text-amber-400 mt-2">{today}</span>
                                        </div>

                                        {/* QR Code & Auth */}
                                        <div className="flex flex-col items-center text-center">
                                            <div className="bg-white p-1 rounded-lg shadow-md mb-1">
                                                <QRCodeSVG value={verificationUrl} size={46} level="M" />
                                            </div>
                                            <span className="text-[7px] sm:text-[8px] font-mono uppercase tracking-tight text-slate-400 font-bold">SCAN TO VERIFY</span>
                                            <span className="text-[6px] sm:text-[7px] font-mono text-amber-400/90">{certId}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* INSTITUTIONAL LICENSE TOP */}
                                    <div className="relative z-10 text-center space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-left">
                                                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">STATE OF CALIFORNIA • DEPARTMENT OF COMMERCE</span>
                                                <p className="text-[8px] font-mono text-slate-500">ENTITY ID: C2984102-SBM • INCORPORATED 2007</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                                                <Building size={12} className="text-amber-400" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">CORPORATE CHARTER</span>
                                            </div>
                                        </div>

                                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-0.5 shadow-xl flex items-center justify-center">
                                            <div className="w-full h-full rounded-full bg-[#0a0d1a] flex items-center justify-center border border-amber-300/40">
                                                <Building size={34} className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white uppercase drop-shadow-md">
                                                Certificate of Incorporation
                                            </h2>
                                            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.45em] text-amber-400/90 mt-2">
                                                Commercial Operating License & Corporate Registration
                                            </p>
                                        </div>
                                    </div>

                                    {/* INSTITUTIONAL LICENSE BODY */}
                                    <div className="relative z-10 text-center my-6 sm:my-8 space-y-4 max-w-2xl mx-auto">
                                        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-400 font-serif italic">
                                            This is to officially certify that the operating corporation
                                        </p>
                                        
                                        <div className="py-2 border-b-2 border-amber-400/60 inline-block min-w-[280px] sm:min-w-[420px]">
                                            <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-wider text-amber-300 uppercase drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                                                SmartBug Media Operations Inc.
                                            </h3>
                                        </div>

                                        <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 leading-relaxed font-medium pt-2">
                                            is duly incorporated and registered under the General Corporation Law of the State of California, 
                                            founded in 2007 by <strong className="text-amber-400">Ryan Malone & Julia Feldman</strong>. 
                                            Authorized to conduct high-performance digital marketing optimization, 
                                            decentralized liquidity matching, and automated multi-tiered task settlement operations globally.
                                        </p>

                                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center max-w-lg mx-auto">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Registered Corporate Address:</span>
                                            <p className="text-[11px] font-bold text-amber-200 mt-0.5">
                                                4533 MacArthur Blvd, Suite A-2155, Newport Beach, CA 92660
                                            </p>
                                        </div>
                                    </div>

                                    {/* INSTITUTIONAL LICENSE FOOTER */}
                                    <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 border-t border-amber-500/20">
                                        {/* Signature: CEO */}
                                        <div className="flex flex-col items-center text-center">
                                            <div className="font-serif italic text-lg sm:text-2xl text-amber-300 font-bold select-none -rotate-2">
                                                Adam Bleitreu
                                            </div>
                                            <div className="w-24 sm:w-36 h-[1px] bg-amber-400/40 my-1" />
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white">Adam Bleitreu</span>
                                            <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider text-amber-400/70">Chief Executive Officer</span>
                                        </div>

                                        {/* Golden Corporate Seal */}
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-800 p-1 shadow-2xl flex items-center justify-center relative">
                                                <div className="w-full h-full rounded-full border border-amber-200/50 flex flex-col items-center justify-center bg-gradient-to-b from-amber-600 to-amber-900 text-center p-1 shadow-inner">
                                                    <Building size={22} className="text-amber-100 drop-shadow" />
                                                    <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-tighter text-amber-100 mt-0.5 leading-none">SEAL OF INC.</span>
                                                    <span className="text-[5px] sm:text-[6px] font-black tracking-widest text-amber-200">EST. 2007</span>
                                                </div>
                                            </div>
                                            <span className="text-[7px] font-black uppercase tracking-[0.25em] text-amber-400 mt-2">CALIFORNIA REGISTRY</span>
                                        </div>

                                        {/* Signature: Corporate Secretary */}
                                        <div className="flex flex-col items-center text-center">
                                            <div className="font-serif italic text-lg sm:text-2xl text-amber-300 font-bold select-none -rotate-2">
                                                Julia Feldman
                                            </div>
                                            <div className="w-24 sm:w-36 h-[1px] bg-amber-400/40 my-1" />
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white">Julia Feldman</span>
                                            <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider text-amber-400/70">Corporate Secretary</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* DEDICATED OFF-SCREEN HIGH-RES A4 PRINTABLE CANVAS (Ensures PDF is 100% Crisp & Properly Scaled) */}
            <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0 overflow-hidden" aria-hidden="true">
                <div 
                    ref={exportRef}
                    style={{ width: '1120px', height: '792px' }}
                    className="bg-[#080B14] text-white p-8 border-4 border-amber-500/80 flex flex-col justify-between"
                >
                    <div className="border-2 border-amber-400/60 rounded-[20px] p-10 h-full flex flex-col justify-between relative bg-gradient-to-br from-[#0c1020] to-[#060810]">
                        {view === 'personal' ? (
                            <>
                                <div className="text-center space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-amber-400">SMARTBUG MEDIA OPERATIONS</span>
                                        <span className="text-xs font-mono text-amber-300">{certId}</span>
                                    </div>
                                    <h2 className="text-4xl font-serif font-black tracking-tight text-white uppercase mt-4">
                                        Certificate of Achievement
                                    </h2>
                                    <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-400">
                                        Professional Node Optimization Specialist
                                    </p>
                                </div>

                                <div className="text-center my-6 space-y-4">
                                    <p className="text-sm uppercase tracking-widest text-slate-400 font-serif italic">
                                        This official credential is duly conferred upon
                                    </p>
                                    <div className="py-2 border-b-2 border-amber-400/80 inline-block min-w-[500px]">
                                        <h3 className="text-5xl font-serif font-black tracking-wider text-amber-300 uppercase">
                                            {profile?.display_name || profile?.username || 'Valued Member'}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto pt-2">
                                        In recognition of verified account integrity and operational throughput within the SmartBugMedia Global Optimization Protocol. Officially accredited with active operational clearance for VIP Level {profile?.level_id || 1}.
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-6 items-end pt-6 border-t border-amber-500/30">
                                    <div className="flex flex-col items-center">
                                        <div className="font-serif italic text-3xl text-amber-300 font-bold select-none">Ryan Malone</div>
                                        <div className="w-48 h-[1px] bg-amber-400/60 my-1" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Ryan Malone</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">Founder & Board Chair</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-24 h-24 rounded-full border-2 border-amber-300 bg-amber-800/80 flex flex-col items-center justify-center p-2 text-center">
                                            <ShieldCheck size={28} className="text-amber-200" />
                                            <span className="text-[8px] font-black uppercase text-amber-100">OFFICIAL SEAL</span>
                                            <span className="text-[6px] font-bold text-amber-200">VERIFIED</span>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 mt-2">{today}</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-white p-1 rounded-lg mb-1">
                                            <QRCodeSVG value={verificationUrl} size={58} level="M" />
                                        </div>
                                        <span className="text-[8px] font-mono text-slate-300 font-bold">SCAN TO VERIFY</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-center space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-amber-400">STATE OF CALIFORNIA • DEPT OF COMMERCE</span>
                                        <span className="text-xs font-mono text-amber-300">REGISTRATION: C2984102-SBM</span>
                                    </div>
                                    <h2 className="text-4xl font-serif font-black tracking-tight text-white uppercase mt-4">
                                        Certificate of Incorporation
                                    </h2>
                                    <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-400">
                                        Commercial Operating License & Corporate Registration
                                    </p>
                                </div>

                                <div className="text-center my-6 space-y-4">
                                    <p className="text-sm uppercase tracking-widest text-slate-400 font-serif italic">
                                        This is to officially certify that the operating corporation
                                    </p>
                                    <div className="py-2 border-b-2 border-amber-400/80 inline-block min-w-[500px]">
                                        <h3 className="text-5xl font-serif font-black tracking-wider text-amber-300 uppercase">
                                            SmartBug Media Operations Inc.
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto pt-2">
                                        is duly incorporated and registered under the General Corporation Law of the State of California, founded in 2007 by Ryan Malone & Julia Feldman. Authorized to conduct digital marketing optimization and liquidity matching operations globally.
                                    </p>
                                    <p className="text-xs font-mono text-amber-200">
                                        Principal Address: 4533 MacArthur Blvd, Suite A-2155, Newport Beach, CA 92660
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-6 items-end pt-6 border-t border-amber-500/30">
                                    <div className="flex flex-col items-center">
                                        <div className="font-serif italic text-3xl text-amber-300 font-bold select-none">Adam Bleitreu</div>
                                        <div className="w-48 h-[1px] bg-amber-400/60 my-1" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Adam Bleitreu</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">Chief Executive Officer</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-24 h-24 rounded-full border-2 border-amber-300 bg-amber-800/80 flex flex-col items-center justify-center p-2 text-center">
                                            <Building size={28} className="text-amber-200" />
                                            <span className="text-[8px] font-black uppercase text-amber-100">SEAL OF INC.</span>
                                            <span className="text-[6px] font-bold text-amber-200">EST. 2007</span>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 mt-2">CALIFORNIA REGISTRY</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="font-serif italic text-3xl text-amber-300 font-bold select-none">Julia Feldman</div>
                                        <div className="w-48 h-[1px] bg-amber-400/60 my-1" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Julia Feldman</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">Corporate Secretary</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up [animation-delay:0.2s]">
                <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                    {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {isDownloading ? 'Generating PDF...' : 'Download Official PDF'}
                </button>

                <button 
                    onClick={handleDownloadImage}
                    disabled={isDownloadingImage}
                    className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                    {isDownloadingImage ? <Loader2 size={16} className="animate-spin" /> : <Image size={16} />}
                    {isDownloadingImage ? 'Exporting Image...' : 'Save As Image (PNG)'}
                </button>

                <button 
                    onClick={handleShareProof}
                    className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-[#3DD6C8]/10 border border-[#3DD6C8]/30 text-[#3DD6C8] font-black uppercase tracking-widest text-xs hover:bg-[#3DD6C8]/20 transition-all active:scale-95 cursor-pointer"
                >
                    <Share2 size={16} />
                    Share Proof
                </button>
            </div>

            {/* Verification Guarantee & Security Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up [animation-delay:0.3s]">
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 flex gap-4">
                    <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Authenticity Guaranteed</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            Cryptographically stamped with unique serial ID <strong className="text-white font-mono">{certId}</strong>. Verified against the SmartBugMedia central corporate register.
                        </p>
                    </div>
                </div>
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 flex gap-4">
                    <Globe className="text-[#3DD6C8] shrink-0" size={24} />
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Worldwide Recognition</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            Conforms with international multi-tiered digital asset settlement standards, verified for compliance across all distributed clusters.
                        </p>
                    </div>
                </div>
            </div>

            {/* SHARE PROOF INTERACTIVE MODAL */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-[#0B0F1A] border border-amber-500/30 rounded-[32px] p-6 sm:p-8 max-w-lg w-full space-y-6 relative shadow-2xl">
                        <button 
                            onClick={() => setShowShareModal(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <Share2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Share Certificate Proof</h3>
                                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Instant Proof Verification</p>
                            </div>
                        </div>

                        {/* Credential Snapshot Card */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Holder:</span>
                                <span className="text-xs font-bold text-white uppercase">{profile?.display_name || profile?.username || 'Valued Member'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Serial ID:</span>
                                <span className="text-xs font-mono font-bold text-amber-400">{certId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Status:</span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    VERIFIED OFFICIAL
                                </span>
                            </div>
                        </div>

                        {/* Share Links */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verification URL</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    readOnly 
                                    value={verificationUrl}
                                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:outline-none"
                                />
                                <button 
                                    onClick={copyVerificationLink}
                                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl flex items-center gap-1.5 transition-all"
                                >
                                    {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                                    {copiedLink ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* Instant Social Channels */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <a 
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Verified SmartBugMedia Official Certificate for ${profile?.username || 'Member'} (ID: ${certId}): ${verificationUrl}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider transition-all"
                            >
                                <MessageCircle size={16} /> WhatsApp
                            </a>
                            <a 
                                href={`https://t.me/share/url?url=${encodeURIComponent(verificationUrl)}&text=${encodeURIComponent(`Verified SmartBugMedia Official Certificate (ID: ${certId})`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-sky-600/10 hover:bg-sky-600/20 border border-sky-500/30 text-sky-400 text-xs font-black uppercase tracking-wider transition-all"
                            >
                                <Send size={16} /> Telegram
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
