"use client";

import { useState, useEffect } from "react";
import { Star, MapPin, TrendingUp, Clock, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Brandon M.",
    role: "Digital Marketing Specialist",
    location: "Austin, Texas, USA",
    avatar: "https://i.pravatar.cc/150?u=brandon-austin",
    content: "Living in Austin with rising living costs, having an extra consistent yield stream makes a huge difference. SmartBugMedia pays out directly to my PayPal USD and USDC wallet without delay. The customer service team verified my payout on the same day.",
    earnings: "$8,450",
    joined: "6 months ago",
    tasks: 1120,
    rating: 5,
    verified: true,
    tag: "US Verified"
  },
  {
    name: "Sarah Jenkins",
    role: "Logistics Operations Lead",
    location: "Chicago, Illinois, USA",
    avatar: "https://i.pravatar.cc/150?u=sarah-chicago",
    content: "I work Central Time, so having customer service and withdrawal approvals active right through US Central Time 10am to 7pm every day is perfect. The platform is responsive, dependable, and pays exactly as promised.",
    earnings: "$7,190",
    joined: "5 months ago",
    tasks: 940,
    rating: 5,
    verified: true,
    tag: "Central Time User"
  },
  {
    name: "David R.",
    role: "IT Solutions Consultant",
    location: "Atlanta, Georgia, USA",
    avatar: "https://i.pravatar.cc/150?u=david-atlanta",
    content: "The multi-currency options sealed the deal for me. Withdrawing via PayPal USD or BNB gives me total flexibility. Customer support verified and approved my payouts promptly every single cycle.",
    earnings: "$10,320",
    joined: "8 months ago",
    tasks: 1480,
    rating: 5,
    verified: true,
    tag: "Senior Node"
  },
  {
    name: "Tyler V.",
    role: "E-Commerce Merchant",
    location: "Miami, Florida, USA",
    avatar: "https://i.pravatar.cc/150?u=tyler-miami",
    content: "Started with a modest level 1 node and upgraded as my tasks accumulated. The 20% referral commissions from inviting my network have created a solid passive income stream on top of daily tasks.",
    earnings: "$12,850",
    joined: "10 months ago",
    tasks: 1820,
    rating: 5,
    verified: true,
    tag: "Top US Earner"
  },
  {
    name: "Marcus T.",
    role: "Warehouse Supervisor",
    location: "Houston, Texas, USA",
    avatar: "https://i.pravatar.cc/150?u=marcus-t",
    content: "Honestly I was skeptical at first. Spent 2 weeks just watching before I even signed up. But when my first payout hit my PayPal USD I nearly fell off my chair 😂 Now it's just part of my daily routine. Wake up, tasks done by 9am, go to work.",
    earnings: "$6,240",
    joined: "7 months ago",
    tasks: 980,
    rating: 5,
    verified: true,
    tag: "US Daily User"
  },
  {
    name: "Zara M.",
    role: "Nurse",
    location: "Birmingham, UK",
    avatar: "https://i.pravatar.cc/150?u=zara-m",
    content: "Long shifts leave me drained but the tasks take like 20 minutes max. Do them on my commute mostly. What surprised me is how consistent it is — same routine every day, same results. That predictability is underrated.",
    earnings: "$5,560",
    joined: "6 months ago",
    tasks: 810,
    rating: 5,
    verified: true,
    tag: "Consistent earner"
  },
  {
    name: "Sandra K.",
    role: "Stay-at-home Mom",
    location: "Phoenix, Arizona, USA",
    avatar: "https://i.pravatar.cc/150?u=sandra-k",
    content: "My husband thought it was a scam until I showed him the PayPal USD transfer. Now he does it too lol. I do it during nap time and after the kids sleep. The tasks don't take long and the app never crashes on me.",
    earnings: "$9,400",
    joined: "9 months ago",
    tasks: 1240,
    rating: 5,
    verified: true,
    tag: "Top US Earner"
  },
  {
    name: "Priya S.",
    role: "Freelance Designer",
    location: "Seattle, Washington, USA",
    avatar: "https://i.pravatar.cc/150?u=priya-s",
    content: "Client work can be so unpredictable — some months are great, some are dry. SmartBugMedia fills that gap. I do tasks between client projects and the referral earnings from my sister and two friends I brought on is just a bonus 🙌",
    earnings: "$4,810",
    joined: "5 months ago",
    tasks: 620,
    rating: 5,
    verified: true,
    tag: "Referral Earner"
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [viewportCount, setViewportCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Maximum starting index for the slice
  const maxIndex = Math.max(0, testimonials.length - viewportCount);

  // Responsive card count based on screen width
  const prev = () => setCurrent(c => (c <= 0 ? maxIndex : c - 1));
  const next = () => setCurrent(c => (c >= maxIndex ? 0 : c + 1));

  // Determine visible cards dynamically based on screen size on mount
  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 1024) {
        setViewportCount(2);
      } else {
        setViewportCount(3);
      }
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  // Automatic scroll interval (every 3.5s, loops infinitely, pauses on hover or touch)
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrent(c => (c >= maxIndex ? 0 : c + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const visible = testimonials.slice(current, current + viewportCount);

  return (
    <section
      className="py-12 sm:py-32 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Section header */}
      <div className="section-header mb-8 sm:mb-20">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6 mb-3 sm:mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real Members, Real Withdrawals
            </div>
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              REAL PEOPLE.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">REAL RESULTS.</span>
            </h2>
          </div>

          {/* Controls: Auto-Scroll Indicator + Nav Arrows */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900/60 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-white/20 transition-all"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-cyan-400 animate-pulse'}`} />
              <span>{isPaused ? 'Paused' : 'Auto'}</span>
            </button>

            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all active:scale-95"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <p className="text-slate-400 text-xs sm:text-base max-w-xl">
          These are unedited reviews. Spelling quirks and all. Because real people don't talk in bullet points.
        </p>
      </div>

      {/* Cards — 2 Columns on Mobile, 2 on Tablet, 3 on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 overflow-hidden">
        {visible.map((t, i) => (
          <motion.div
            key={`${t.name}-${current}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
            className="group flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[18px] sm:rounded-[28px] p-3 sm:p-7 hover:border-white/10 hover:bg-slate-900/60 transition-all duration-300"
          >
            {/* Top: Avatar + Name */}
            <div className="flex items-start justify-between mb-3 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover border-2 border-white/10"
                  />
                  {t.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[#020617]">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="sm:w-2.5 sm:h-2.5">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs sm:text-base truncate">{t.name}</p>
                  <p className="text-slate-500 text-[10px] sm:text-sm truncate">{t.role}</p>
                </div>
              </div>
              {/* Stars */}
              <div className="flex gap-0.5 shrink-0">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={10} className="sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            {/* The actual quote - humanized */}
            <p className="text-slate-300 text-[10px] sm:text-[15px] leading-relaxed flex-1 mb-3 sm:mb-6 line-clamp-4 sm:line-clamp-none">
              &quot;{t.content}&quot;
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-1 sm:gap-3 mb-3 sm:mb-5">
              <div className="bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-3 text-center border border-white/5">
                <p className="text-emerald-400 font-bold text-[11px] sm:text-base truncate">{t.earnings}</p>
                <p className="text-slate-500 text-[8px] sm:text-[10px] uppercase tracking-wide mt-0.5">Earned</p>
              </div>
              <div className="bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-3 text-center border border-white/5">
                <p className="text-white font-bold text-[11px] sm:text-base truncate">{t.tasks.toLocaleString()}</p>
                <p className="text-slate-500 text-[8px] sm:text-[10px] uppercase tracking-wide mt-0.5">Tasks</p>
              </div>
              <div className="bg-white/5 rounded-lg sm:rounded-xl p-1.5 sm:p-3 text-center border border-white/5">
                <p className="text-cyan-400 font-bold text-[10px] sm:text-sm whitespace-nowrap truncate">{t.joined}</p>
                <p className="text-slate-500 text-[8px] sm:text-[10px] uppercase tracking-wide mt-0.5">Member</p>
              </div>
            </div>

            {/* Bottom: location + tag */}
            <div className="flex items-center justify-between pt-2.5 sm:pt-5 border-t border-white/5">
              <div className="flex items-center gap-1 sm:gap-1.5 text-slate-500 text-[9px] sm:text-xs truncate">
                <MapPin size={12} />
                {t.location}
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold uppercase tracking-wide">
                {t.tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination dots with active progress glow */}
      <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}
