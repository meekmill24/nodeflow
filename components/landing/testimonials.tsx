"use client";

import { useState } from "react";
import { Star, MapPin, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Brandon M.",
    role: "Digital Marketing Specialist",
    location: "Austin, Texas, USA",
    avatar: "https://i.pravatar.cc/150?u=brandon-austin",
    content: "Living in Austin with rising living costs, having an extra consistent yield stream makes a huge difference. SmartBugMedia pays out directly to my PayPal and USDC wallet without delay. The customer service team verified my payout on the same day.",
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
    role: "Stay-at-home Mum",
    location: "Nairobi, Kenya",
    avatar: "https://i.pravatar.cc/150?u=sandra-k",
    content: "My husband thought it was a scam until I showed him the bank transfer. Now he does it too lol. I do it during nap time and after the kids sleep. The tasks don't take long and the app never crashes on me.",
    earnings: "$9,400",
    joined: "9 months ago",
    tasks: 1240,
    rating: 5,
    verified: true,
    tag: "Top earner"
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
