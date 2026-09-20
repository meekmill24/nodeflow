'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

export function LandingGallery() {
  return (
    <section id="gallery" className="px-6 lg:px-12 py-28 max-w-7xl mx-auto border-t border-white/5 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-cyan-500/[0.04] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-500/[0.04] blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SmartBugMedia in Action
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase text-white mb-5"
          >
            REAL PEOPLE.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              REAL RESULTS.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base md:text-lg font-medium leading-relaxed"
          >
            Behind the numbers are real teams, continuous operational intelligence, and dedicated resources built to maximize member earnings.
          </motion.p>
        </div>

        {/* Asymmetric 3-Card Bento Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left Hero Card — 7 Columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-7 relative group rounded-[36px] overflow-hidden border border-white/10 bg-slate-900/60 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
              <img
                src="/landing-team-1.jpg"
                alt="SmartBugMedia executive strategy and operational planning session"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Gradient dark scrim for readable text */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent hidden md:block" />

              {/* Floating Pill Tag */}
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Operations
                </span>
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest mb-2">
                  <Sparkles size={14} />
                  Operational Alignment
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tight mb-2">
                  Daily Strategy &amp; Task Optimization
                </h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed opacity-90 max-w-xl">
                  Our core operations team meets daily to calibrate task routing, ensure prompt withdrawal verification, and maintain platform uptime.
                </p>

                {/* Team avatar strip */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/10">
                  <div className="flex -space-x-2">
                    {['ag1', 'ag2', 'ag3', 'ag4'].map((seed, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-800">
                        <img src={`https://i.pravatar.cc/100?u=${seed}`} alt="Team member" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">SmartBug Operations &amp; Verification Team</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column Stack — 5 Columns */}
          <div className="md:col-span-5 flex flex-col gap-6">

            {/* Top Right Card — Member Collaboration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative group rounded-[36px] overflow-hidden border border-white/10 bg-slate-900/60 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex-1"
            >
              <div className="relative w-full h-[240px] md:h-[245px] overflow-hidden">
                <img
                  src="/landing-team-2.jpg"
                  alt="SmartBugMedia community members collaborating"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                <div className="absolute top-5 left-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                    <Users size={12} />
                    Member Success
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h4 className="text-lg md:text-xl font-black text-white italic tracking-tight mb-1">
                    Collaborative Growth
                  </h4>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed opacity-90">
                    High-performing agents sharing tips and scaling multi-tier referral income across the network.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bottom Right Card — SmartBug Knowledge & Guide */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative group rounded-[36px] overflow-hidden border border-white/10 bg-slate-900/60 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex-1"
            >
              <div className="relative w-full h-[240px] md:h-[245px] overflow-hidden">
                <img
                  src="/landing-team-3.jpg"
                  alt="The Beginner's Guide to Business Operations by SmartBug"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-5 left-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                    <BookOpen size={12} />
                    Education Hub
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h4 className="text-lg md:text-xl font-black text-white italic tracking-tight mb-1">
                    Official Guides &amp; Playbooks
                  </h4>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed opacity-90">
                    Built-in documentation and guides so you can maximize task speed and daily payout efficiency.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Secondary Motion AI & Pinterest Inspired Operations Showcase */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <h3 className="text-xs font-black uppercase tracking-[0.35em] text-white/50">
                Institutional Infrastructure &amp; Live Terminal Visuals
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden sm:block">
              Motion AI • Real-Time Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                src: '/landing-asset-1.jpg',
                tag: 'Operations Center',
                title: 'Live Task Orchestration',
                desc: 'Continuous real-time telemetry from enterprise partner integrations.'
              },
              {
                src: '/landing-asset-2.jpg',
                tag: 'Terminal Analytics',
                title: 'High-Velocity Routing',
                desc: 'Dynamic latency minimization across decentralized data pipelines.'
              },
              {
                src: '/landing-asset-3.jpg',
                tag: 'Neural Topology',
                title: 'AI Product Allocation',
                desc: 'Autonomous matching of merchant task batches directly to agent nodes.'
              },
              {
                src: '/landing-asset-5.jpg',
                tag: 'Treasury & Escrow',
                title: 'Institutional Clearance',
                desc: 'Multi-signature cold storage vaults backing every daily withdrawal.'
              },
              {
                src: '/landing-asset-6.jpg',
                tag: 'Global Nodes',
                title: 'Tier-4 Data Centers',
                desc: '99.98% SLA guaranteeing persistent agent availability.'
              },
              {
                src: '/landing-asset-7.jpg',
                tag: 'Collaborative Sprint',
                title: 'Merchant Integration',
                desc: 'Engineering team onboarding Fortune 500 catalog optimization workflows.'
              },
              {
                src: '/landing-asset-9.jpg',
                tag: 'Newport Beach HQ',
                title: 'Corporate Headquarters',
                desc: 'Strategic management and VIP customer support operations.'
              },
              {
                src: '/landing-asset-10.jpg',
                tag: 'Smart Contract',
                title: 'Escrow Settlements',
                desc: 'Instant cryptographic confirmation of completed task set commissions.'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group relative rounded-[28px] overflow-hidden border border-white/10 bg-slate-900/50 shadow-lg hover:border-cyan-500/40 transition-all duration-500"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/15 text-[9px] font-black uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                      {item.tag}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-black text-white italic tracking-tight group-hover:text-cyan-400 transition-colors mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Metrics Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 rounded-[28px] bg-slate-900/40 border border-white/5 backdrop-blur-md p-6 sm:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black italic tracking-tight text-white">2,800+</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-cyan-400 mt-1">Active US &amp; Global Members</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black italic tracking-tight text-emerald-400">$4.2M+</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Verified Member Payouts</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black italic tracking-tight text-white">98.7%</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-400 mt-1">Member Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black italic tracking-tight text-amber-400">10AM-7PM</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">US Central Time Support</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
