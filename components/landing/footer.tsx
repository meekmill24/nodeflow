"use client";

import Link from "next/link";
import { DollarSign, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  platform: [
    { label: "How It Works", href: "#features" },
    { label: "VIP Levels", href: "/levels" },
    { label: "Salary Benefits", href: "/salary" },
    { label: "Referral Program", href: "/invite" },
  ],
  account: [
    { label: "Sign In", href: "/login" },
    { label: "Create Account", href: "/signup" },
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
    { label: "Terms of Service", href: "/agreement" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Platform Rules", href: "/rules" },
  ],
};

const cryptoIcons = [
  { name: "USDT", color: "#26A17B" },
  { name: "ETH", color: "#627EEA" },
  { name: "BTC", color: "#F7931A" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
                <DollarSign className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">
                SmartBugMedia.
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Your trusted platform for daily earnings. Complete tasks, earn
              commissions, and grow your income with confidence.
            </p>
            
            {/* Contact */}
            <div className="flex flex-col gap-3">
              <a href="mailto:support@smartbugmedia.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                support@smartbugmedia.com
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="h-4 w-4" />
                24/7 Live Chat
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5 uppercase tracking-wider">
              Account
            </h4>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SmartBugMedia.. All rights reserved.
            </p>
            
            {/* Crypto accepted */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Accepted
              </span>
              <div className="flex items-center gap-2">
                {cryptoIcons.map((crypto) => (
                  <div
                    key={crypto.name}
                    className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center border border-border"
                    title={crypto.name}
                  >
                    <span className="text-xs font-bold" style={{ color: crypto.color }}>
                      {crypto.name.charAt(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
