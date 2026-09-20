'use client';

import Link from 'next/link';
import { 
    ArrowLeft,
    Users, 
    Target, 
    Globe, 
    BarChart3, 
    Code2, 
    Blocks,
    Cpu,
    ShieldCheck,
    Quote,
    Building2,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

const STATS = [
    { label: 'Countries Served', value: '44', icon: Globe },
    { label: 'Industries Analyzed', value: '15', icon: BarChart3 },
    { label: 'Client Satisfaction', value: '94.7%', icon: ShieldCheck },
    { label: 'Quality Index', value: '96.3%', icon: Cpu },
];

const COMPANY_PHOTOS = [
    {
        title: 'Global Operations Headquarters',
        desc: 'Advanced marketing optimization & distributed CRM operations hub.',
        image: '/landing-asset-2.jpg',
        badge: 'Headquarters'
    },
    {
        title: 'Digital Engineering Laboratory',
        desc: 'High-concurrency data analytics, automation deployment & neural systems.',
        image: '/landing-asset-3.jpg',
        badge: 'Tech Hub'
    },
    {
        title: 'Strategic Client Workstations',
        desc: 'Dedicated institutional account management and tier-level support teams.',
        image: '/landing-asset-7.jpg',
        badge: 'Operations'
    },
    {
        title: 'Cloud Architecture & Settlement',
        desc: 'Continuous task ledger synchronization and secure multi-network verification.',
        image: '/landing-asset-8.jpg',
        badge: 'Infrastructure'
    }
];

export default function CompanyPage() {
    return (
        <div className="max-w-5xl mx-auto pb-24 animate-fade-in space-y-16">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link 
                    href="/home" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-black uppercase tracking-widest">
                    <Building2 size={14} /> Established 2007
                </div>
            </div>

            {/* Hero Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    <Blocks size={12} />
                    The SmartBugMedia Genesis
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                    Engineering The <span className="text-primary-light">Digital Matrix</span>
                </h1>
                <p className="max-w-2xl mx-auto text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
                    A global technology partner dedicated to helping businesses leverage high-fidelity automation and neural optimization since 2007.
                </p>
            </div>

            {/* Corporate Photo Showcase */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-primary-light uppercase tracking-[0.3em]">Institutional Facilities</span>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Our Workspaces & Global Hubs</h3>
                    </div>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">North America • Global Remote</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {COMPANY_PHOTOS.map((photo, i) => (
                        <div 
                            key={i} 
                            className="group rounded-[32px] overflow-hidden bg-[#0B0B1E] border border-white/5 hover:border-primary/40 transition-all duration-700 shadow-2xl relative flex flex-col"
                        >
                            <div className="relative h-64 md:h-72 w-full overflow-hidden bg-slate-950">
                                <img 
                                    src={photo.image} 
                                    alt={photo.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B1E] via-transparent to-transparent opacity-90" />
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest">
                                        {photo.badge}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 space-y-2 relative -mt-6 z-10">
                                <h4 className="text-base font-black text-white uppercase tracking-tight group-hover:text-primary-light transition-colors">
                                    {photo.title}
                                </h4>
                                <p className="text-xs font-bold text-white/50 uppercase tracking-wider leading-relaxed">
                                    {photo.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map((s, i) => (
                    <div key={i} className="glass-card p-8 border-white/5 text-center space-y-2 group hover:border-primary/40 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <s.icon size={20} className="text-primary-light" />
                        </div>
                        <p className="text-3xl font-black text-white">{s.value}</p>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Story Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                            <Target size={20} className="text-accent-light" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Our Story</h2>
                    </div>
                    <div className="space-y-4 text-sm font-bold text-white/50 leading-relaxed uppercase tracking-widest text-justify">
                        <p>
                            SmartBugMedia was founded in 2007 by Ryan Malone and Julia Feldman with a mission to help businesses in Canada, Mexico and the United States leverage technology to grow, automate operations, and succeed in an increasingly digital world. Under the executive leadership of CEO Adam Bleitreu, the company continues its institutional mission of global optimization excellence.
                        </p>
                        <p>
                            Inspired by the innovation culture of leading digital companies, SmartBugMedia began as a small team of passionate technologists dedicated to building practical, scalable solutions for modern businesses.
                        </p>
                        <p>
                            What started as a modest operation quickly evolved into a trusted software development and digital engineering company, delivering innovative solutions to businesses across multiple industries.
                        </p>
                    </div>
                </div>
                <div className="glass-card-strong p-10 border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />
                    <Quote size={40} className="text-primary/20 mb-6" />
                    <p className="text-lg font-black text-white italic leading-tight uppercase tracking-tighter mb-6">
                        "Our mission is simple: help businesses work smarter through technology. By combining creativity and technical expertise, we empower organizations to build scalable digital platforms."
                    </p>
                    <div className="flex items-center gap-4">
                        <img 
                            src="/landing-asset-1.jpg" 
                            alt="Leadership" 
                            className="w-12 h-12 rounded-full object-cover border border-white/20" 
                        />
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-widest">Adam Bleitreu</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Chief Executive Officer</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tech Approach */}
            <div className="glass-card p-12 border-primary/20 bg-primary/[0.02] space-y-10">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="shrink-0 p-5 rounded-3xl bg-primary/20 border border-primary/40 text-primary-light">
                        <Code2 size={40} strokeWidth={1} />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Institutional Technology Approach</h2>
                        <p className="text-xs font-bold text-white/50 leading-relaxed uppercase tracking-widest text-justify">
                            To ensure transparency, efficiency, and security across digital operations, SmartBugMedia integrates modern technologies including AI systems and blockchain infrastructure. We utilize blockchain-supported frameworks inspired by technologies such as Tether, Ethereum, and TRON networks to support transparent transaction processes and secure digital operations.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
                            {['Transparency', 'Traceability', 'Security', 'Automation'].map((f, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-primary-light" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Services */}
            <div className="space-y-10">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Liquid Ecosystem</h2>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-2">Specialized Digital Infrastructure</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Custom Web Dev', desc: 'End-to-end digital solutions that transform the way businesses operate.', icon: Blocks },
                        { title: 'AI Data Solutions', desc: 'AI-powered systems designed to optimize product visibility and customer engagement.', icon: Cpu },
                        { title: 'Digital Strategy', desc: 'Consulting and engineering to move from idea to execution with precision.', icon: Target },
                    ].map((s, i) => (
                        <div key={i} className="glass-card p-8 border-white/5 space-y-4 hover:bg-white/[0.02] transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <s.icon size={18} className="text-white/60" />
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{s.title}</h3>
                            <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
