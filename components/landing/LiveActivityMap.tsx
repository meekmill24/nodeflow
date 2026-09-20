'use client';

import React, { useState } from 'react';
import { Sun, Moon, Radio, Zap, Globe2 } from 'lucide-react';

export function LiveActivityMap() {
  const [mapTheme, setMapTheme] = useState<'night' | 'day'>('night');

  const pins = [
    { top: '39%', left: '21.5%', city: 'Austin, TX', name: 'Brandon M.', amount: '+$12.00', action: 'Daily Yield', color: 'bg-cyan-400', ring: 'ring-cyan-400' },
    { top: '32%', left: '23.8%', city: 'Chicago, IL', name: 'Sarah J.', amount: '+$8.50', action: 'Task Complete', color: 'bg-emerald-400', ring: 'ring-emerald-400' },
    { top: '42%', left: '26.5%', city: 'Miami, FL', name: 'Tyler V.', amount: '+$50.00', action: 'Withdrawal', color: 'bg-amber-400', ring: 'ring-amber-400' },
    { top: '38%', left: '17.8%', city: 'Phoenix, AZ', name: 'Sandra K.', amount: '+$14.20', action: 'Daily Yield', color: 'bg-violet-400', ring: 'ring-violet-400' },
    { top: '28%', left: '16.2%', city: 'Seattle, WA', name: 'Priya S.', amount: '+$6.00', action: 'Task Complete', color: 'bg-blue-400', ring: 'ring-blue-400' },
    { top: '38%', left: '24.8%', city: 'Atlanta, GA', name: 'David R.', amount: '+$24.00', action: 'Withdrawal', color: 'bg-rose-400', ring: 'ring-rose-400' },
    { top: '33%', left: '27.2%', city: 'New York, NY', name: 'Michael C.', amount: '+$18.50', action: 'Task Complete', color: 'bg-teal-400', ring: 'ring-teal-400' },
    { top: '27%', left: '47.8%', city: 'London, UK', name: 'James K.', amount: '+$9.40', action: 'Daily Yield', color: 'bg-indigo-400', ring: 'ring-indigo-400' },
    { top: '42%', left: '62.2%', city: 'Dubai, UAE', name: 'Farah A.', amount: '+$35.00', action: 'Withdrawal', color: 'bg-amber-400', ring: 'ring-amber-400' },
    { top: '46%', left: '69.0%', city: 'Mumbai, IN', name: 'Aarav P.', amount: '+$7.20', action: 'Task Complete', color: 'bg-emerald-400', ring: 'ring-emerald-400' },
    { top: '35%', left: '85.5%', city: 'Tokyo, JP', name: 'Kenji T.', amount: '+$16.00', action: 'Daily Yield', color: 'bg-cyan-400', ring: 'ring-cyan-400' },
    { top: '78%', left: '86.8%', city: 'Sydney, AU', name: 'Liam W.', amount: '+$22.50', action: 'Withdrawal', color: 'bg-violet-400', ring: 'ring-violet-400' },
  ];

  const liveFeed = [
    { city: 'Austin, TX', name: 'Brandon M.', amt: '+$12.00', type: 'Daily Yield', dot: 'bg-cyan-400' },
    { city: 'Miami, FL', name: 'Tyler V.', amt: '+$50.00', type: 'Withdrawal', dot: 'bg-amber-400' },
    { city: 'Chicago, IL', name: 'Sarah J.', amt: '+$8.50', type: 'Task Complete', dot: 'bg-emerald-400' },
    { city: 'Phoenix, AZ', name: 'Sandra K.', amt: '+$14.20', type: 'Daily Yield', dot: 'bg-violet-400' },
    { city: 'Atlanta, GA', name: 'David R.', amt: '+$24.00', type: 'Withdrawal', dot: 'bg-rose-400' },
    { city: 'New York, NY', name: 'Michael C.', amt: '+$18.50', type: 'Task Complete', dot: 'bg-teal-400' },
    { city: 'Seattle, WA', name: 'Priya S.', amt: '+$6.00', type: 'Daily Yield', dot: 'bg-blue-400' },
    { city: 'London, UK', name: 'James K.', amt: '+$9.40', type: 'Daily Yield', dot: 'bg-indigo-400' },
    { city: 'Dubai, UAE', name: 'Farah A.', amt: '+$35.00', type: 'Withdrawal', dot: 'bg-amber-400' },
    { city: 'Tokyo, JP', name: 'Kenji T.', amt: '+$16.00', type: 'Task Complete', dot: 'bg-cyan-400' },
  ];

  const isNight = mapTheme === 'night';

  return (
    <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto border-t border-white/5">
      {/* Header */}
      <div className="section-header text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Network Activity
        </div>
        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight text-white mb-3">
          AGENTS EARNING RIGHT NOW
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Every ping below is a live payout, optimization task, or verified yield release happening across the network.
        </p>
      </div>

      {/* Map Container */}
      <div
        className={`relative rounded-[36px] border transition-colors duration-700 overflow-hidden shadow-[0_25px_90px_rgba(0,0,0,0.6)] ${
          isNight
            ? 'bg-gradient-to-b from-[#0B1120] via-[#090D1A] to-[#040711] border-cyan-500/20'
            : 'bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] border-slate-300/80 text-slate-900 shadow-slate-300/50'
        }`}
      >
        {/* Top Control Bar with Night / Light toggle */}
        <div
          className={`flex items-center justify-between px-6 md:px-10 py-5 border-b backdrop-blur-md transition-colors duration-500 ${
            isNight ? 'border-white/10 bg-white/[0.02]' : 'border-slate-300/60 bg-white/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                isNight
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
              }`}
            >
              <Globe2 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black uppercase tracking-wider ${isNight ? 'text-white' : 'text-slate-900'}`}>
                  Global Telemetry Mesh
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className={`text-[10px] font-mono tracking-widest uppercase ${isNight ? 'text-slate-500' : 'text-slate-500'}`}>
                12 Nodes Broadcasting · US & Global
              </p>
            </div>
          </div>

          {/* Night / Light Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:inline ${isNight ? 'text-slate-400' : 'text-slate-600'}`}>
              Map View:
            </span>
            <div
              className={`p-1 rounded-2xl border flex items-center gap-1 transition-colors ${
                isNight ? 'bg-slate-950/80 border-white/10' : 'bg-white border-slate-300 shadow-sm'
              }`}
            >
              <button
                type="button"
                onClick={() => setMapTheme('night')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  isNight
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Moon size={12} />
                Night Mode
              </button>
              <button
                type="button"
                onClick={() => setMapTheme('day')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  !isNight
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun size={12} />
                Light Mode
              </button>
            </div>
          </div>
        </div>

        {/* Real World Map SVG Stage */}
        <div className="relative w-full p-4 md:p-8" style={{ minHeight: 380, maxHeight: 520 }}>
          {/* Subtle Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: isNight
                ? 'radial-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px)'
                : 'radial-gradient(rgba(100, 116, 139, 0.25) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Genuine Real World Map Vector */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full transition-all duration-700 select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Night land glow gradient */}
              <linearGradient id="nightLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
              </linearGradient>

              {/* Day land gradient */}
              <linearGradient id="dayLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.8" />
              </linearGradient>

              {/* Equator & Meridian grid lines */}
              <pattern id="mapLatLon" width="100" height="50" patternUnits="userSpaceOnUse">
                <path
                  d="M 100 0 L 0 0 0 50"
                  fill="none"
                  stroke={isNight ? 'rgba(56, 189, 248, 0.05)' : 'rgba(148, 163, 184, 0.18)'}
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>

            {/* Grid overlay */}
            <rect width="1000" height="500" fill="url(#mapLatLon)" />

            {/* Continents group */}
            <g
              className="transition-colors duration-700"
              fill={isNight ? 'url(#nightLandGrad)' : 'url(#dayLandGrad)'}
              stroke={isNight ? 'rgba(6, 182, 212, 0.28)' : 'rgba(100, 116, 139, 0.45)'}
              strokeWidth={isNight ? '1' : '1.2'}
              strokeLinejoin="round"
            >
              {/* NORTH AMERICA (Alaska, Canada, USA, Mexico) */}
              <path d="M 80,60 L 105,52 L 140,45 L 180,42 L 210,48 L 245,65 L 230,85 L 245,100 L 265,95 L 290,115 L 295,140 L 280,155 L 290,175 L 275,190 L 260,185 L 235,215 L 225,245 L 210,240 L 195,200 L 175,190 L 155,160 L 135,165 L 120,135 L 95,115 L 80,95 Z" />

              {/* GREENLAND */}
              <path d="M 310,40 L 355,30 L 380,45 L 370,75 L 340,90 L 320,70 Z" />

              {/* CENTRAL AMERICA & CARIBBEAN */}
              <path d="M 215,245 L 235,260 L 255,275 L 250,285 L 235,275 L 220,260 Z" />
              <path d="M 260,240 Q 268,238 275,245 Q 268,250 260,240 Z" />
              <path d="M 278,252 Q 285,250 290,256 Q 284,260 278,252 Z" />

              {/* SOUTH AMERICA */}
              <path d="M 245,285 L 275,280 L 320,300 L 350,330 L 335,375 L 310,430 L 290,465 L 280,450 L 285,395 L 270,350 L 245,315 Z" />

              {/* EUROPE & SCANDINAVIA */}
              <path d="M 465,90 L 485,75 L 505,85 L 500,120 L 475,125 L 460,110 Z" />
              <path d="M 440,125 L 460,115 L 490,125 L 525,120 L 530,150 L 505,175 L 475,185 L 445,180 L 440,155 Z" />

              {/* UNITED KINGDOM & IRELAND */}
              <path d="M 445,115 L 458,105 L 462,125 L 452,138 L 442,128 Z" />
              <path d="M 432,120 L 438,115 L 440,128 L 433,132 Z" />

              {/* AFRICA */}
              <path d="M 445,195 L 520,185 L 565,225 L 560,270 L 530,335 L 505,395 L 475,370 L 450,290 L 420,250 L 430,210 Z" />
              {/* Madagascar */}
              <path d="M 570,330 L 585,320 L 590,360 L 575,375 Z" />

              {/* ASIA (Russia, Middle East, India, China, SE Asia) */}
              <path d="M 530,120 L 600,85 L 680,75 L 770,70 L 850,85 L 890,110 L 855,145 L 800,140 L 770,175 L 750,220 L 710,230 L 685,285 L 650,265 L 660,215 L 610,215 L 585,245 L 555,230 L 540,170 L 530,135 Z" />

              {/* JAPAN */}
              <path d="M 855,160 L 870,150 L 875,175 L 860,195 L 850,180 Z" />

              {/* SOUTHEAST ASIAN ISLANDS (Indonesia, Philippines) */}
              <path d="M 740,290 L 765,285 L 785,310 L 755,320 Z" />
              <path d="M 780,270 L 795,260 L 800,285 L 785,290 Z" />
              <path d="M 800,310 L 835,305 L 840,330 L 805,335 Z" />

              {/* AUSTRALIA & NEW ZEALAND */}
              <path d="M 795,355 L 855,345 L 890,375 L 880,430 L 835,445 L 790,410 L 785,375 Z" />
              <path d="M 915,420 L 930,415 L 925,455 L 910,450 Z" />
            </g>
          </svg>

          {/* Interactive Pinging Telemetry Nodes */}
          {pins.map((pin, i) => (
            <div
              key={i}
              className="absolute transition-transform duration-300 hover:scale-125 hover:z-30 cursor-pointer"
              style={{ top: pin.top, left: pin.left }}
            >
              <div className="relative group">
                {/* Ping ring */}
                <span
                  className={`absolute -inset-1.5 rounded-full ${pin.color} opacity-75 animate-ping`}
                  style={{ animationDuration: '2.4s', animationDelay: `${(i % 5) * 0.35}s` }}
                />
                {/* Core dot */}
                <span
                  className={`relative block w-3.5 h-3.5 rounded-full ${pin.color} border-2 ${
                    isNight ? 'border-slate-950 shadow-[0_0_12px_currentColor]' : 'border-white shadow-md'
                  }`}
                />

                {/* Floating Glass Tooltip */}
                <div
                  className={`absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-40 whitespace-nowrap px-3.5 py-2 rounded-2xl border text-center shadow-2xl backdrop-blur-xl ${
                    isNight
                      ? 'bg-slate-950/95 border-cyan-500/30 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                      : 'bg-white/95 border-slate-300 text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.15)]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${pin.color}`} />
                    <p className="font-bold text-[11px] tracking-tight">{pin.city}</p>
                  </div>
                  <p className="text-[10px] font-semibold opacity-70">{pin.name}</p>
                  <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-center gap-2">
                    <span className="text-emerald-500 font-black text-xs">{pin.amount}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">
                      {pin.action}
                    </span>
                  </div>
                  <div
                    className={`w-2 h-2 rotate-45 mx-auto -mb-3.5 border-b border-r ${
                      isNight ? 'bg-slate-950 border-cyan-500/30' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Continuous Activity Feed Strip at Bottom */}
        <div
          className={`px-6 py-4 border-t overflow-hidden relative backdrop-blur-md transition-colors duration-500 ${
            isNight ? 'border-white/10 bg-slate-950/70' : 'border-slate-300/80 bg-white/80'
          }`}
        >
          <div
            className={`absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r ${
              isNight ? 'from-[#0B1120] to-transparent' : 'from-[#F8FAFC] to-transparent'
            }`}
          />
          <div
            className={`absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l ${
              isNight ? 'from-[#0B1120] to-transparent' : 'from-[#F8FAFC] to-transparent'
            }`}
          />

          <div className="flex gap-4 w-max animate-[ticker_28s_linear_infinite]">
            {[...Array(2)].map((_, r) =>
              liveFeed.map((item, i) => (
                <div
                  key={`${r}-${i}`}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs whitespace-nowrap transition-colors ${
                    isNight
                      ? 'bg-white/[0.03] border-white/5 text-slate-300 hover:border-cyan-500/30'
                      : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${item.dot} animate-pulse`} />
                  <span className="font-bold">{item.name}</span>
                  <span className="opacity-40">·</span>
                  <span className="text-emerald-500 font-black">{item.amt}</span>
                  <span className="opacity-40">·</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.type}
                  </span>
                  <span className="opacity-40">·</span>
                  <span className="text-[11px] font-medium opacity-70">{item.city}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
