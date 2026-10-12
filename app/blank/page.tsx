'use client'

import React from 'react'
import { Wrench, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <main className="min-h-screen w-full bg-[#0B0B1E] text-white flex flex-col items-center justify-center relative overflow-hidden px-4 selection:bg-[#3DD6C8]/30">
      {/* Background ambient glow spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-[#3DD6C8]/15 via-[#3b82f6]/10 to-[#8b5cf6]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[380px] h-[380px] bg-[#E34304]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 max-w-lg w-full text-center space-y-8 animate-in fade-in duration-700">
        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-inner text-xs font-medium tracking-wider uppercase text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          Scheduled Maintenance
        </div>

        {/* Central Icon Illustration */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-cyan-950/40">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#3DD6C8]/20 to-transparent opacity-60" />
          <Wrench className="w-10 h-10 text-[#3DD6C8] animate-bounce [animation-duration:3s]" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0B0B1E] border border-white/15 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Site Under Maintenance
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            We are performing essential system optimization and scheduled upgrades to enhance your experience. We will be back online shortly.
          </p>
        </div>

        {/* Status Info Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-left space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2.5 border-b border-white/[0.06]">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <RefreshCw className="w-3.5 h-3.5 text-[#3DD6C8] animate-spin [animation-duration:4s]" />
              System Status
            </span>
            <span className="text-amber-400 font-semibold">In Progress</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              User Data & Funds
            </span>
            <span className="text-emerald-400 font-medium">Safe & Encrypted</span>
          </div>
        </div>

        {/* Auto Refresh or Quick Reload hint */}
        <div className="pt-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-95 border border-white/10 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Check Again
          </button>
        </div>

        {/* Footer brand */}
        <p className="text-[11px] text-slate-500 tracking-wider uppercase font-semibold">
          SmartBugMedia Platform
        </p>
      </div>
    </main>
  )
}
