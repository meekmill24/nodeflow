'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Shield, Cpu, Zap, Activity } from 'lucide-react';

interface IntroLoaderProps {
  onComplete?: () => void;
}

const telemetrySteps = [
  { step: '01', tag: 'BOOT', title: 'INITIALIZING KERNEL', detail: 'Calibrating neural consensus engine' },
  { step: '02', tag: 'NETWORK', title: 'SYNCHRONIZING NODES', detail: 'Connecting to distributed task channels' },
  { step: '03', tag: 'SECURITY', title: 'SECURITY ENCRYPTION', detail: '256-Bit cryptographic layer active' },
  { step: '04', tag: 'ONLINE', title: 'SYSTEMS OPTIMAL', detail: 'Access granted • Launching protocol' },
];

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const progressNumberRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const circleMeterRef = useRef<SVGCircleElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // Lock body scroll while loader is visible
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Keyboard shortcut: ESC to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 60-120fps hardware-composited timer using rAF and pure transform/DOM manipulation
  useEffect(() => {
    const DURATION_MS = 2200; // 2.2 seconds total duration - snappy & smooth
    const startTime = performance.now();
    const circumference = 2 * Math.PI * 68; // circle r=68

    let lastStep = 0;

    const tick = (now: number) => {
      if (completedRef.current) return;

      const elapsed = now - startTime;
      const linearRatio = Math.min(1, elapsed / DURATION_MS);

      // Smooth custom ease-out cubic curve for natural deceleration towards 100%
      const easedRatio = 1 - Math.pow(1 - linearRatio, 2.8);
      const currentPct = Math.min(100, Math.floor(easedRatio * 100));

      // 1. Direct DOM update for number (avoids 100+ React state re-renders)
      if (progressNumberRef.current) {
        progressNumberRef.current.textContent = String(currentPct).padStart(2, '0');
      }

      // 2. Direct transform on linear progress bar (GPU transform scaleX is 0-lag)
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${easedRatio})`;
      }

      // 3. Direct stroke offset update on circle
      if (circleMeterRef.current) {
        const offset = circumference * (1 - easedRatio);
        circleMeterRef.current.style.strokeDashoffset = `${offset}`;
      }

      // 4. Update step text only at milestone thresholds
      let targetStep = 0;
      if (currentPct < 30) targetStep = 0;
      else if (currentPct < 65) targetStep = 1;
      else if (currentPct < 94) targetStep = 2;
      else targetStep = 3;

      if (targetStep !== lastStep) {
        lastStep = targetStep;
        setActiveStepIndex(targetStep);
      }

      if (linearRatio < 1) {
        animFrameIdRef.current = requestAnimationFrame(tick);
      } else {
        // Complete
        completedRef.current = true;
        if (progressNumberRef.current) progressNumberRef.current.textContent = '100';
        if (progressBarRef.current) progressBarRef.current.style.transform = 'scaleX(1)';
        if (circleMeterRef.current) circleMeterRef.current.style.strokeDashoffset = '0';
        setActiveStepIndex(3);

        // Hold at 100% briefly for perception, then trigger exit transition
        setTimeout(() => {
          setIsExiting(true);
        }, 250);

        // Remove from DOM after transition completes
        setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = '';
          onComplete?.();
        }, 750);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (completedRef.current || isExiting || isDone) return;
    completedRef.current = true;
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);

    if (progressNumberRef.current) progressNumberRef.current.textContent = '100';
    if (progressBarRef.current) progressBarRef.current.style.transform = 'scaleX(1)';
    if (circleMeterRef.current) circleMeterRef.current.style.strokeDashoffset = '0';
    setActiveStepIndex(3);

    setIsExiting(true);
    setTimeout(() => {
      setIsDone(true);
      document.body.style.overflow = '';
      onComplete?.();
    }, 350);
  };

  if (isDone) return null;

  return (
    <>
      <style>{`
        @keyframes smoothPulseGlow {
          0%, 100% { opacity: 0.55; transform: scale(0.98); }
          50% { opacity: 0.95; transform: scale(1.02); }
        }
        @keyframes subtleSpinOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes subtleReverseSpin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes kineticWave {
          0%, 100% { transform: scaleY(0.3); opacity: 0.35; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>

      <div
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#040612] text-white select-none overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}
        style={{
          contain: 'strict',
          isolation: 'isolate',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'opacity, transform',
        }}
      >
        {/* Top Status Bar Telemetry */}
        <div className="w-full max-w-5xl mx-auto px-6 pt-6 sm:pt-8 flex items-center justify-between text-[10px] font-mono text-white/40 tracking-[0.25em] uppercase z-10">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DD6C8] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3DD6C8] shadow-[0_0_8px_#3DD6C8]" />
            </span>
            <span className="text-white/80 font-bold tracking-[0.22em]">SMARTBUG MEDIA PROTOCOL</span>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-white/50">
              <Cpu size={12} className="text-[#3DD6C8]" /> 60 FPS
            </span>
            <span className="flex items-center gap-1.5 text-white/50">
              <Activity size={12} className="text-emerald-400" /> LATENCY 1.2MS
            </span>
            <span className="flex items-center gap-1.5 text-white/50">
              <Shield size={12} className="text-cyan-400" /> 256-BIT SSL
            </span>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all text-[9px] tracking-widest cursor-pointer active:scale-95 flex items-center gap-1.5 font-mono"
          >
            <span>SKIP</span>
            <kbd className="px-1 py-0.5 rounded bg-white/10 text-[8px] text-white/50">ESC</kbd>
          </button>
        </div>

        {/* Ambient GPU-Friendly Glow Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#3DD6C8]/15 via-cyan-500/10 to-transparent blur-[110px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#06B6D4]/10 blur-[90px]" />
        </div>

        {/* Centerpiece: Glowing Core & Orbiting Rings */}
        <div className="relative flex flex-col items-center justify-center my-auto z-10">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Outer Slow Orbit */}
            <div
              className="absolute inset-0 rounded-full border border-dashed border-[#3DD6C8]/20 pointer-events-none"
              style={{
                animation: 'subtleSpinOrbit 24s linear infinite',
                willChange: 'transform',
              }}
            />

            {/* Accent Ring with Corner Markers */}
            <div
              className="absolute w-56 h-56 rounded-full border-t border-b border-[#3DD6C8]/35 border-l-transparent border-r-transparent pointer-events-none"
              style={{
                animation: 'subtleReverseSpin 18s linear infinite',
                willChange: 'transform',
              }}
            />

            {/* Tech Tick Marks */}
            <div className="absolute w-48 h-48 rounded-full border border-white/5 pointer-events-none flex items-center justify-center">
              <div className="absolute -top-1 w-2.5 h-0.5 bg-[#3DD6C8]/60" />
              <div className="absolute -bottom-1 w-2.5 h-0.5 bg-[#3DD6C8]/60" />
              <div className="absolute -left-1 h-2.5 w-0.5 bg-[#3DD6C8]/60" />
              <div className="absolute -right-1 h-2.5 w-0.5 bg-[#3DD6C8]/60" />
            </div>

            {/* Circular SVG Vector Ring */}
            <svg className="absolute w-44 h-44 -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="68"
                fill="none"
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth="3"
              />
              <circle
                ref={circleMeterRef}
                cx="50%"
                cy="50%"
                r="68"
                fill="none"
                stroke="#3DD6C8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 68}
                strokeDashoffset={2 * Math.PI * 68}
                style={{
                  willChange: 'stroke-dashoffset',
                  transition: 'stroke-dashoffset 0.05s linear',
                }}
              />
            </svg>

            {/* Center Core Glassmorphic Brand Container - CIRCULAR WITH MIX-BLEND-SCREEN */}
            <div
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#0B1026] to-[#040612] border border-[#3DD6C8]/50 backdrop-blur-2xl flex items-center justify-center p-3.5 shadow-[0_0_50px_rgba(61,214,200,0.3)] overflow-hidden"
              style={{
                animation: 'smoothPulseGlow 3s ease-in-out infinite',
                willChange: 'transform, opacity',
              }}
            >
              {/* Internal subtle glow backdrop */}
              <div className="absolute inset-0 bg-radial from-[#3DD6C8]/25 via-transparent to-transparent pointer-events-none" />

              <Image
                src="/logo.png"
                alt="SmartBugMedia Logo"
                width={88}
                height={88}
                priority
                className="w-full h-full object-contain mix-blend-screen scale-110 filter drop-shadow-[0_0_12px_rgba(61,214,200,0.8)]"
              />
            </div>
          </div>

          {/* Brand Name & Dynamic Telemetry State */}
          <div className="mt-5 flex flex-col items-center text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight uppercase text-white flex items-center">
              SmartBug<span className="text-[#3DD6C8]">Media</span>
              <span className="text-cyan-400">.</span>
            </h1>

            {/* Current Step Phrase */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-[#3DD6C8] uppercase tracking-[0.2em] h-6">
              <Zap size={14} className="text-[#3DD6C8] fill-[#3DD6C8]/30 animate-pulse" />
              <span>{telemetrySteps[activeStepIndex]?.title}</span>
            </div>

            <p className="text-[11px] font-mono text-white/50 tracking-wider h-4">
              {telemetrySteps[activeStepIndex]?.detail}
            </p>
          </div>

          {/* Equalizer Micro-Wave Bars */}
          <div className="flex items-center gap-1.5 mt-5">
            {[35, 65, 95, 50, 80, 45, 90, 60, 40].map((h, idx) => (
              <div
                key={idx}
                style={{
                  height: `${h * 0.22}px`,
                  animation: `kineticWave ${0.8 + (idx % 3) * 0.25}s ease-in-out infinite ${idx * 0.08}s`,
                  willChange: 'transform, opacity',
                }}
                className="w-1 rounded-full bg-gradient-to-t from-teal-500 via-[#3DD6C8] to-cyan-300 shadow-[0_0_6px_#3DD6C8]"
              />
            ))}
          </div>
        </div>

        {/* Bottom Hardware Linear Rail & Percentage Counter */}
        <div className="w-full max-w-md mx-auto px-6 pb-8 sm:pb-12 z-10 flex flex-col items-center">
          {/* Numerical Counter */}
          <div className="flex items-baseline justify-center gap-1 font-mono mb-3">
            <span
              ref={progressNumberRef}
              className="text-5xl sm:text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-[#3DD6C8] tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(61,214,200,0.35)]"
            >
              00
            </span>
            <span className="text-base sm:text-lg font-black text-[#3DD6C8] font-mono tracking-wider">%</span>
          </div>

          {/* Linear Progress Rail */}
          <div className="w-full h-2 rounded-full bg-slate-900/90 overflow-hidden relative border border-white/10 shadow-inner p-[1px]">
            <div
              ref={progressBarRef}
              className="h-full w-full bg-gradient-to-r from-teal-400 via-[#3DD6C8] to-[#06B6D4] origin-left rounded-full shadow-[0_0_14px_rgba(61,214,200,0.8)]"
              style={{
                transform: 'scaleX(0)',
                willChange: 'transform',
                transition: 'transform 0.05s linear',
              }}
            />
          </div>

          {/* Mini Stepper Indicators */}
          <div className="w-full flex items-center justify-between mt-3 text-[9px] font-mono">
            {telemetrySteps.map((s, i) => (
              <span
                key={s.step}
                className={`transition-colors duration-300 font-bold tracking-wider ${
                  i <= activeStepIndex ? 'text-[#3DD6C8]' : 'text-white/20'
                }`}
              >
                [{s.step}] {s.tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
