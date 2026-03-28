'use client';

import Link from 'next/link';

export default function Footer() {
    const links = [
        { label: 'Home', href: '/home' },
        { label: 'About', href: '/about' },
        { label: 'News', href: '/news' },
        { label: 'Support', href: '/service' }
    ];

    return (
        <footer className="mt-20 pb-10 border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                © 2025 All Rights Reserved | SmartBugMedia.
            </p>
            <div className="flex items-center gap-6">
                {links.map((link) => (
                    <Link 
                        key={link.label} 
                        href={link.href} 
                        className="text-[10px] font-bold text-text-secondary uppercase tracking-widest hover:text-white transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </footer>
    );
}
