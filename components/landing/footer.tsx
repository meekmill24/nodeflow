"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle, ArrowUpRight } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "How It Works", href: "#ecosystem" },
    { label: "VIP Levels", href: "/levels" },
    { label: "Salary Benefits", href: "/salary" },
    { label: "Referral Program", href: "/invite" },
  ],
  account: [
    { label: "Sign In", href: "/auth/login" },
    { label: "Create Account", href: "/auth/sign-up" },
    { label: "Dashboard", href: "/home" },
    { label: "Deposit", href: "/deposit" },
  ],
  support: [
    { label: "Help Center", href: "/faq" },
    { label: "Contact Us", href: "/service" },
    { label: "Company Info", href: "/company" },
    { label: "About Us", href: "/about" },
  ],
  legal: [
    { label: "Terms of Service", href: "/rules" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Platform Rules", href: "/service" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-slate-950/80 backdrop-blur-xl overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center p-1.5 shadow-lg shadow-cyan-500/10 overflow-hidden transition-transform group-hover:scale-110">
                <Image src="/logo.png" alt="SmartBugMedia Logo" width={24} height={24} />
              </div>
              <span className="text-xl font-black tracking-tight italic text-white">
                SmartBugMedia<span className="text-cyan-500">.</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
              Your trusted platform for daily task earnings. Complete tasks, build your network, and grow your income consistently.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <a
                href="mailto:support@smartbugmedia.com"
                className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-cyan-400 transition-colors group"
              >
                <Mail size={14} className="group-hover:text-cyan-400 transition-colors" />
                support@smartbugmedia.com
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-cyan-400 transition-colors group"
              >
                <MessageCircle size={14} className="group-hover:text-cyan-400 transition-colors" />
                24/7 Live Support
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">Account</h4>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} SmartBugMedia. All rights reserved.
          </p>

          {/* Payment badges */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-600 uppercase tracking-widest">Accepted</span>
            <div className="flex items-center gap-2">
              {[
                { name: "USDT", color: "#26A17B", bg: "rgba(38,161,123,0.1)" },
                { name: "ETH", color: "#627EEA", bg: "rgba(98,126,234,0.1)" },
                { name: "BTC", color: "#F7931A", bg: "rgba(247,147,26,0.1)" },
              ].map((c) => (
                <div
                  key={c.name}
                  className="h-8 px-3 rounded-lg border border-white/10 flex items-center justify-center"
                  style={{ background: c.bg }}
                >
                  <span className="text-[10px] font-black" style={{ color: c.color }}>
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/auth/sign-up"
            className="flex items-center gap-2 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest"
          >
            Get Started <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
