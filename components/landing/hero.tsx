"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (value >= 1000) {
      return `${prefix}${(latest / 1000).toFixed(1)}K${suffix}`;
    }
    return `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}

export function Hero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background - Video-like effect */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "-1s" }} />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px"
          }}
        />
        
        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-scan" />
        </div>
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Live indicator badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 rounded-full bg-card border border-border px-4 py-2 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">2,847</span> people earning right now
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              <span className="text-balance">
                Earn money,{" "}
                <span className="relative">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">
                    simplified.
                  </span>
                  <span className="absolute bottom-2 left-0 right-0 h-3 bg-accent/20 -z-10 rounded" />
                </span>
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed text-pretty"
            >
              Complete simple tasks. Earn daily commissions. Build your income 
              with our transparent rewards platform trusted by thousands.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-10 grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0"
            >
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-foreground">
                  <AnimatedCounter value={2400000} prefix="$" suffix="" />
                </p>
                <p className="text-sm text-muted-foreground mt-1">Paid out</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-foreground">
                  <AnimatedCounter value={10000} suffix="+" />
                </p>
                <p className="text-sm text-muted-foreground mt-1">Members</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-accent">
                  1.5%
                </p>
                <p className="text-sm text-muted-foreground mt-1">Max rate</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                Start Earning Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-border px-8 py-4 text-base font-medium text-foreground hover:bg-card transition-all duration-300"
              >
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Play className="h-3 w-3 text-accent fill-accent ml-0.5" />
                </span>
                Watch Demo
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12 flex flex-wrap items-center gap-6 justify-center lg:justify-start"
            >
              {[
                { icon: Shield, text: "Secure & Verified" },
                { icon: Zap, text: "Instant Payouts" },
                { icon: TrendingUp, text: "Daily Growth" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="h-4 w-4 text-accent" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - App Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative"
          >
            {/* Phone mockup */}
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              {/* Glow effect behind phone */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-emerald-500/20 rounded-[3rem] blur-3xl scale-110" />
              
              {/* Phone frame */}
              <div className="relative bg-card rounded-[2.5rem] p-3 border border-border shadow-2xl">
                <div className="relative bg-background rounded-[2rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 py-3 bg-card/50 backdrop-blur-sm">
                    <span className="text-xs text-muted-foreground">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
                      <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
                      <div className="w-6 h-3 bg-accent rounded-sm" />
                    </div>
                  </div>
                  
                  {/* App content */}
                  <div className="px-5 py-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Welcome back</p>
                        <p className="text-lg font-semibold text-foreground">Alex Thompson</p>
                      </div>
                      <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <span className="text-accent font-bold">LV3</span>
                      </div>
                    </div>

                    {/* Balance card */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="bg-gradient-to-br from-accent to-emerald-600 rounded-2xl p-5 mb-5"
                    >
                      <p className="text-sm text-white/80">Total Balance</p>
                      <p className="text-3xl font-bold text-white mt-1">$12,847.50</p>
                      <div className="flex items-center gap-2 mt-3">
                        <TrendingUp className="h-4 w-4 text-white/80" />
                        <span className="text-sm text-white/80">+$847.50 today</span>
                      </div>
                    </motion.div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-card rounded-xl p-4 border border-border"
                      >
                        <p className="text-xs text-muted-foreground">Tasks Done</p>
                        <p className="text-xl font-bold text-foreground mt-1">48/60</p>
                        <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-accent rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "80%" }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                          />
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className="bg-card rounded-xl p-4 border border-border"
                      >
                        <p className="text-xs text-muted-foreground">Commission</p>
                        <p className="text-xl font-bold text-accent mt-1">0.95%</p>
                        <p className="text-xs text-muted-foreground mt-2">Per task</p>
                      </motion.div>
                    </div>

                    {/* Recent activity */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="space-y-3"
                    >
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Recent</p>
                      {[
                        { label: "Task completed", amount: "+$32.50", time: "2m" },
                        { label: "Referral bonus", amount: "+$150.00", time: "1h" },
                        { label: "Withdrawal", amount: "-$500.00", time: "3h" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.3 + i * 0.1 }}
                          className="flex items-center justify-between py-2 border-b border-border last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.time} ago</p>
                          </div>
                          <span className={`text-sm font-semibold ${item.amount.startsWith("+") ? "text-accent" : "text-muted-foreground"}`}>
                            {item.amount}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -left-16 top-1/4 bg-card rounded-2xl shadow-2xl border border-border p-4 hidden lg:block animate-float"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Daily Profit</p>
                    <p className="text-lg font-bold text-accent">+$847.50</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 }}
                className="absolute -right-12 bottom-1/4 bg-card rounded-2xl shadow-2xl border border-border p-4 hidden lg:block animate-float-delayed"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <p className="text-sm text-foreground font-medium">Payout Sent!</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">$2,500 to your wallet</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Video modal placeholder */}
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-4xl aspect-video bg-card rounded-2xl border border-border flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Play className="h-16 w-16 text-accent mx-auto mb-4" />
                <p className="text-xl font-semibold text-foreground">Demo Video</p>
                <p className="text-muted-foreground mt-2">Video preview coming soon</p>
              </div>
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
        >
          <div className="h-2 w-1 bg-muted-foreground rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
