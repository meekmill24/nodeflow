'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

interface IntroLoaderProps {
  onComplete?: () => void;
}

const statusPhrases = [
  'INITIALIZING PROTOCOL',
  'SYNCING NODE CONSENSUS',
  'OPTIMIZING PIPELINES',
  'SYSTEM ONLINE',
];

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [phase, setPhase] = useState(statusPhrases[0]);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const progressTextRef = useRef<HTMLSpanElement>(null);
  const circleProgressRef = useRef<SVGCircleElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const hasFinishedRef = useRef(false);

  // Lock scroll while active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Butter-smooth hardware-timed progress ticker using requestAnimationFrame & direct DOM refs
  useEffect(() => {
    const duration = 2800; // 2.8s progress duration
    const startTime = performance.now();
    const circumference = 2 * Math.PI * 74; // circle r=74

    let lastPhaseIdx = 0;

    const frame = (now: number) => {
      if (hasFinishedRef.current) return;

      const elapsed = now - startTime;
      const progressRatio = Math.min(1, elapsed / duration);

      // Smooth ease-out sine curve
      const easedRatio = Math.sin((progressRatio * Math.PI) / 2);
      const currentPct = Math.min(100, Math.floor(easedRatio * 100));

      // Direct DOM update for 60/120fps counter without React re-render lag
      if (progressTextRef.current) {
        progressTextRef.current.textContent = String(currentPct).padStart(2, '0');
      }

      // Direct SVG offset update
      if (circleProgressRef.current) {
        const offset = circumference * (1 - currentPct / 100);
        circleProgressRef.current.style.strokeDashoffset = `${offset}`;
      }

      // Infrequent React state updates only when phase changes
      let currentPhaseIdx = 0;
      if (currentPct < 35) currentPhaseIdx = 0;
      else if (currentPct < 70) currentPhaseIdx = 1;
      else if (currentPct < 96) currentPhaseIdx = 2;
      else currentPhaseIdx = 3;

      if (currentPhaseIdx !== lastPhaseIdx) {
        lastPhaseIdx = currentPhaseIdx;
        setPhase(statusPhrases[currentPhaseIdx]);
      }

      if (progressRatio < 1) {
        animFrameRef.current = requestAnimationFrame(frame);
      } else {
        // Reached 100%
        hasFinishedRef.current = true;
        if (progressTextRef.current) progressTextRef.current.textContent = '100';
        if (circleProgressRef.current) circleProgressRef.current.style.strokeDashoffset = '0';
        setPhase(statusPhrases[3]);

        // Hold at 100% for 400ms so user registers completion, then trigger burst exit
        setTimeout(() => {
          setIsExiting(true);
        }, 400);

        // Remove from DOM after exit transition
        setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = '';
          onComplete?.();
        }, 950);
      }
    };

    animFrameRef.current = requestAnimationFrame(frame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (hasFinishedRef.current || isExiting || isDone) return;
    hasFinishedRef.current = true;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (progressTextRef.current) progressTextRef.current.textContent = '100';
    if (circleProgressRef.current) circleProgressRef.current.style.strokeDashoffset = '0';
    setPhase(statusPhrases[3]);

    setIsExiting(true);
    setTimeout(() => {
      setIsDone(true);
      document.body.style.overflow = '';
      onComplete?.();
    }, 450);
  };

  if (isDone) return null;

  return (
    <>
      <style>{`
        @keyframes introPulseRing1 {
          0% { transform: scale(0.85) translateZ(0); opacity: 0.75; }
          100% { transform: scale(2.05) translateZ(0); opacity: 0; }
        }
        @keyframes introPulseRing2 {
          0% { transform: scale(0.85) translateZ(0); opacity: 0.6; }
          100% { transform: scale(2.35) translateZ(0); opacity: 0; }
        }
        @keyframes introPulseRing3 {
          0% { transform: scale(0.85) translateZ(0); opacity: 0.45; }
          100% { transform: scale(2.65) translateZ(0); opacity: 0; }
        }
        @keyframes introSpinSlow {
          from { transform: rotate(0deg) translateZ(0); }
          to { transform: rotate(360deg) translateZ(0); }
        }
        @keyframes introSpinReverse {
          from { transform: rotate(360deg) translateZ(0); }
          to { transform: rotate(0deg) translateZ(0); }
        }
        @keyframes introBreatheCore {
          0%, 100% { transform: scale(1) translateZ(0); box-shadow: 0 0 30px rgba(61,214,200,0.35); }
          50% { transform: scale(1.04) translateZ(0); box-shadow: 0 0 50px rgba(61,214,200,0.7); }
        }
        @keyframes introBarPulse {
          0%, 100% { transform: scaleY(0.25) translateZ(0); opacity: 0.35; }
          50% { transform: scaleY(1) translateZ(0); opacity: 1; }
        }
      `}</style>

      <div
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070714] text-white select-none overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}
        style={{ willChange: 'opacity, transform' }}
      >
        {/* Deep Ambient Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Center Cyan Radial Flare */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#3DD6C8]/20 via-[#189e93]/15 to-transparent blur-3xl opacity-75" />
          {/* Subtle Orange Counter-Balance Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[#E34304]/12 blur-2xl" />
          {/* Subtle Cyber Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #3DD6C8 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Central Kinetic Pulse Waves & Concentric Expanding Rings */}
        <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80">
          {/* Concentric Expanding Ring 1 */}
          <div
            className="absolute inset-0 rounded-full border border-[#3DD6C8]/45 shadow-[0_0_30px_rgba(61,214,200,0.3)] pointer-events-none"
            style={{
              animation: 'introPulseRing1 2.2s cubic-bezier(0.1, 0.4, 0.2, 1) infinite',
              willChange: 'transform, opacity',
            }}
          />

          {/* Concentric Expanding Ring 2 (Staggered) */}
          <div
            className="absolute inset-0 rounded-full border border-[#3DD6C8]/35 shadow-[0_0_40px_rgba(61,214,200,0.2)] pointer-events-none"
            style={{
              animation: 'introPulseRing2 2.2s cubic-bezier(0.1, 0.4, 0.2, 1) infinite 0.6s',
              willChange: 'transform, opacity',
            }}
          />

          {/* Concentric Expanding Ring 3 (Outer Shockwave) */}
          <div
            className="absolute inset-0 rounded-full border border-teal-300/25 pointer-events-none"
            style={{
              animation: 'introPulseRing3 2.2s cubic-bezier(0.1, 0.4, 0.2, 1) infinite 1.2s',
              willChange: 'transform, opacity',
            }}
          />

          {/* Rotating Dotted Orbital Ring */}
          <div
            className="absolute w-60 h-60 sm:w-64 sm:h-64 rounded-full border border-dashed border-[#3DD6C8]/30 pointer-events-none"
            style={{
              animation: 'introSpinSlow 18s linear infinite',
              willChange: 'transform',
            }}
          />

          {/* Counter-Rotating Cyber Accent Notches */}
          <div
            className="absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full border-t-2 border-b-2 border-[#E34304]/40 pointer-events-none"
            style={{
              animation: 'introSpinReverse 22s linear infinite',
              willChange: 'transform',
            }}
          />

          {/* SVG Circular Progress Meter around Logo */}
          <svg className="absolute w-44 h-44 sm:w-48 sm:h-48 -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="74"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="3"
            />
            <circle
              ref={circleProgressRef}
              cx="50%"
              cy="50%"
              r="74"
              fill="none"
              stroke="url(#loaderGradSmooth)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 74}
              strokeDashoffset={2 * Math.PI * 74}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(61,214,200,0.85))',
                willChange: 'stroke-dashoffset',
              }}
            />
            <defs>
              <linearGradient id="loaderGradSmooth" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3DD6C8" />
                <stop offset="60%" stopColor="#19a194" />
                <stop offset="100%" stopColor="#E34304" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Core Logo Glass Capsule */}
          <div
            className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0B0B1E]/95 backdrop-blur-2xl border border-[#3DD6C8]/45 flex items-center justify-center p-5 shadow-2xl overflow-hidden transition-transform duration-500 ${
              isExiting ? 'scale-125 shadow-[0_0_70px_rgba(61,214,200,1)]' : ''
            }`}
            style={{
              animation: isExiting ? 'none' : 'introBreatheCore 2.4s ease-in-out infinite',
              willChange: 'transform, box-shadow',
            }}
          >
            {/* Internal Glass Highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#3DD6C8]/10 pointer-events-none" />

            <Image
              src="/logo.png"
              alt="SmartBugMedia"
              width={72}
              height={72}
              priority
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(61,214,200,0.7)]"
            />
          </div>
        </div>

        {/* Typography & Telemetry */}
        <div className="mt-8 flex flex-col items-center text-center px-4 relative z-10">
          {/* Brand Title */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              SmartBug<span className="text-[#3DD6C8]">Media</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#E34304] animate-ping" />
          </div>

          {/* Status Telemetry Phrase */}
          <div className="h-6 flex items-center justify-center overflow-hidden mb-3">
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#3DD6C8] uppercase drop-shadow-[0_0_8px_rgba(61,214,200,0.5)] flex items-center gap-2 transition-all duration-300">
              <Sparkles size={12} className="animate-spin text-[#3DD6C8]" />
              {phase}
            </span>
          </div>

          {/* Numerical Progress Indicator */}
          <div className="flex items-baseline gap-1 font-mono">
            <span
              ref={progressTextRef}
              className="text-3xl sm:text-4xl font-black text-white tracking-tighter"
            >
              00
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#3DD6C8]">%</span>
          </div>

          {/* Kinetic Frequency Equalizer Bars */}
          <div className="flex items-center gap-1 mt-4">
            {[40, 70, 100, 60, 90, 45, 80, 55].map((height, i) => (
              <div
                key={i}
                style={{
                  height: `${height * 0.22}px`,
                  animation: `introBarPulse ${0.85 + (i % 3) * 0.2}s ease-in-out infinite ${i * 0.09}s`,
                  willChange: 'transform, opacity',
                }}
                className="w-1 rounded-full bg-gradient-to-t from-[#19a194] to-[#3DD6C8]"
              />
            ))}
          </div>
        </div>

        {/* Quick Skip Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute bottom-8 sm:bottom-10 right-6 sm:right-10 z-20 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md text-[11px] font-mono uppercase tracking-widest text-white/50 hover:text-white transition-all duration-300 hover:border-[#3DD6C8]/40 active:scale-95 cursor-pointer"
        >
          Skip Intro →
        </button>
      </div>
    </>
  );
}
