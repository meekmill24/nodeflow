"use client";

import { useState } from "react";
import { Star, MapPin, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Marcus T.",
    role: "Warehouse Supervisor",
    location: "Lagos, Nigeria",
    avatar: "https://i.pravatar.cc/150?u=marcus-t",
    content: "Honestly I was skeptical at first. Spent 2 weeks just watching before I even signed up. But when my first payout hit my account I nearly fell off my chair 😂 Now it's just part of my daily routine. Wake up, tasks done by 9am, go to work.",
    earnings: "$6,240",
    joined: "7 months ago",
    tasks: 980,
    rating: 5,
    verified: true,
    tag: "Daily user"
  },
  {
    name: "Priya S.",
    role: "Freelance Designer",
    location: "Mumbai, India",
    avatar: "https://i.pravatar.cc/150?u=priya-s",
    content: "Client work can be so unpredictable — some months are great, some are dry. SmartBugMedia fills that gap. I do tasks between client projects and the referral earnings from my sister and two cousins I brought on is just a bonus 🙌",
    earnings: "$4,810",
    joined: "5 months ago",
    tasks: 620,
    rating: 5,
    verified: true,
    tag: "Referral earner"
  },
  {
    name: "James O.",
    role: "University Student",
    location: "Accra, Ghana",
    avatar: "https://i.pravatar.cc/150?u=james-o",
    content: "I started during exam break with $100. Used some of the early earnings to upgrade my level, which gave me more tasks per day. The math just made sense. Paying for half my rent now which is wild for a 21-year-old honestly.",
    earnings: "$3,120",
    joined: "4 months ago",
    tasks: 480,
    rating: 5,
    verified: true,
    tag: "Student earner"
  },
  {
    name: "Sandra K.",
    role: "Stay-at-home Mum",
    location: "Nairobi, Kenya",
    avatar: "https://i.pravatar.cc/150?u=sandra-k",
    content: "My husband thought it was a scam until I showed him the bank transfer. Now he does it too lol. I do it during nap time and after the kids sleep. The tasks don't take long and the app never crashes on me which I appreciate.",
    earnings: "$9,400",
    joined: "9 months ago",
    tasks: 1240,
    rating: 5,
    verified: true,
    tag: "Top earner"
  },
  {
    name: "Kweku A.",
    role: "Small Business Owner",
    location: "Kumasi, Ghana",
    avatar: "https://i.pravatar.cc/150?u=kweku-a",
    content: "Used profits from my first 3 months to buy a new delivery motorbike for my shop. That's real. Not some abstract number on a screen — an actual physical thing I bought. That moment made me go all in on inviting my whole team.",
    earnings: "$11,700",
    joined: "11 months ago",
    tasks: 1650,
    rating: 5,
    verified: true,
    tag: "Team builder"
  },
  {
    name: "Zara M.",
    role: "Nurse",
    location: "Birmingham, UK",
    avatar: "https://i.pravatar.cc/150?u=zara-m",
    content: "Long shifts leave me drained but the tasks take like 20 minutes max. Do them on my commute mostly. What surprised me is how consistent it is — same routine every day, same results. That predictability is underrated when everything else feels uncertain.",
    earnings: "$5,560",
    joined: "6 months ago",
    tasks: 810,
    rating: 5,
    verified: true,
    tag: "Consistent earner"
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const visibleCount = 3;

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(testimonials.length - visibleCount, c + 1));

  const visible = testimonials.slice(current, current + visibleCount);

  return (
    <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="section-header mb-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real Members, Real Withdrawals
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              What actual people<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">are saying</span>
            </h2>
          </div>
          {/* Nav arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              disabled={current >= testimonials.length - visibleCount}
              className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <p className="text-slate-400 text-base max-w-xl">
          These are unedited reviews. Spelling quirks and all. Because real people don't talk in bullet points.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((t, i) => (
          <div
            key={t.name}
            className="group flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[28px] p-7 hover:border-white/10 hover:bg-slate-900/60 transition-all duration-300"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* Top: Avatar + Name */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10"
                  />
                  {t.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[#020617]">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-white text-base">{t.name}</p>
                  <p className="text-slate-500 text-sm">{t.role}</p>
                </div>
              </div>
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            {/* The actual quote - humanized */}
            <p className="text-slate-300 text-[15px] leading-relaxed flex-1 mb-6">
              "{t.content}"
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <p className="text-emerald-400 font-bold text-base">{t.earnings}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-wide mt-0.5">Earned</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <p className="text-white font-bold text-base">{t.tasks.toLocaleString()}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-wide mt-0.5">Tasks</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <p className="text-cyan-400 font-bold text-base truncate text-sm">{t.joined}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-wide mt-0.5">Member</p>
              </div>
            </div>

            {/* Bottom: location + tag */}
            <div className="flex items-center justify-between pt-5 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <MapPin size={12} />
                {t.location}
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold uppercase tracking-wide">
                {t.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {Array.from({ length: testimonials.length - visibleCount + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  );
}
