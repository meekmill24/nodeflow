'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Lock scroll while active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Smooth progress ticker
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2100; // 2.1 seconds for snappy, impactful intro

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const raw = Math.min(100, Math.floor((elapsed / duration) * 100));

      // Ease progress slightly
      const eased = Math.floor(100 * Math.sin((raw / 100) * (Math.PI / 2)));
      setProgress(eased);

      if (eased < 35) {
        setPhaseIndex(0);
      } else if (eased < 70) {
        setPhaseIndex(1);
      } else if (eased < 96) {
        setPhaseIndex(2);
      } else {
        setPhaseIndex(3);
      }

      if (elapsed >= duration) {
        clearInterval(timer);
        setProgress(100);
        setPhaseIndex(3);

        // Trigger shockwave burst exit
        setTimeout(() => {
          setIsExiting(true);
        }, 150);

        // Remove from DOM
        setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = '';
          onComplete?.();
        }, 800);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    if (isExiting || isDone) return;
    setProgress(100);
    setPhaseIndex(3);
    setIsExiting(true);
    setTimeout(() => {
      setIsDone(true);
      document.body.style.overflow = '';
      onComplete?.();
    }, 400);
  };

  if (isDone) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          animate={
            isExiting
              ? {
                  opacity: 0,
                  scale: 1.06,
                  filter: 'blur(12px)',
                  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                }
              : { opacity: 1, scale: 1, filter: 'blur(0px)' }
          }
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070714] text-white select-none overflow-hidden"
        >
          {/* Deep Ambient Background Glow */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Center Cyan Radial Flare */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#3DD6C8]/20 via-[#189e93]/15 to-transparent blur-3xl animate-pulse" />
            {/* Subtle Orange Counter-Balance Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-[#E34304]/10 blur-2xl" />
            {/* Subtle Cyber Grid lines */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #3DD6C8 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          {/* Central Kinetic Pulse Waves & Expanding Rings */}
          <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80">
            {/* Concentric Expanding Ring 1 */}
            <motion.div
              animate={{
                scale: [0.85, 1.8],
                opacity: [0.7, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute inset-0 rounded-full border border-[#3DD6C8]/40 shadow-[0_0_30px_rgba(61,214,200,0.25)] pointer-events-none"
            />

            {/* Concentric Expanding Ring 2 (Staggered) */}
            <motion.div
              animate={{
                scale: [0.85, 2.1],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: 0.55,
                ease: 'easeOut',
              }}
              className="absolute inset-0 rounded-full border border-[#3DD6C8]/30 shadow-[0_0_40px_rgba(61,214,200,0.2)] pointer-events-none"
            />

            {/* Concentric Expanding Ring 3 (Outer Shockwave) */}
            <motion.div
              animate={{
                scale: [0.85, 2.4],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: 1.1,
                ease: 'easeOut',
              }}
              className="absolute inset-0 rounded-full border border-teal-300/25 pointer-events-none"
            />

            {/* Subtle Rotating Dotted Orbital Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              className="absolute w-60 h-60 sm:w-64 sm:h-64 rounded-full border border-dashed border-[#3DD6C8]/30 pointer-events-none"
            />

            {/* Rotating Cyber Accent Notches */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full border-t border-b border-[#E34304]/40 pointer-events-none"
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
              <motion.circle
                cx="50%"
                cy="50%"
                r="74"
                fill="none"
                stroke="url(#loaderGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 74}
                strokeDashoffset={2 * Math.PI * 74 * (1 - progress / 100)}
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(61,214,200,0.8))',
                  transition: 'stroke-dashoffset 0.08s ease-out',
                }}
              />
              <defs>
                <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3DD6C8" />
                  <stop offset="60%" stopColor="#19a194" />
                  <stop offset="100%" stopColor="#E34304" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Core Logo Glass Capsule */}
            <motion.div
              animate={
                isExiting
                  ? {
                      scale: 1.25,
                      boxShadow: '0 0 60px rgba(61,214,200,0.9)',
                      transition: { duration: 0.4 },
                    }
                  : {
                      scale: [1, 1.03, 1],
                      boxShadow: [
                        '0 0 25px rgba(61,214,200,0.3)',
                        '0 0 45px rgba(61,214,200,0.6)',
                        '0 0 25px rgba(61,214,200,0.3)',
                      ],
                    }
              }
              transition={{
                duration: 2,
                repeat: isExiting ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0B0B1E]/90 backdrop-blur-2xl border border-[#3DD6C8]/40 flex items-center justify-center p-5 shadow-2xl overflow-hidden"
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
            </motion.div>
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
              <AnimatePresence mode="wait">
                <motion.span
                  key={phaseIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#3DD6C8] uppercase drop-shadow-[0_0_8px_rgba(61,214,200,0.5)] flex items-center gap-2"
                >
                  <Sparkles size={12} className="animate-spin text-[#3DD6C8]" />
                  {statusPhrases[phaseIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Numerical Progress Indicator */}
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
                {String(progress).padStart(2, '0')}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#3DD6C8]">%</span>
            </div>

            {/* Kinetic Sound / Frequency Bars */}
            <div className="flex items-center gap-1 mt-4">
              {[40, 70, 100, 60, 90, 45, 80, 55].map((height, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [0.3, 1, 0.4],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8 + (i % 3) * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.08,
                  }}
                  style={{ height: `${height * 0.2}px` }}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
