"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Brandon M.",
    role: "Digital Marketing Specialist",
    location: "Austin, TX, USA",
    avatar: "https://i.pravatar.cc/150?u=brandon-austin",
    content: "Living in Austin with rising living costs, having an extra consistent yield stream makes a huge difference. SmartBugMedia pays out directly to my PayPal USD and USDC wallet without delay. The customer service team verified my payout on the same day.",
    earnings: "$8,450",
    joined: "6 mos",
    tasks: 1120,
    rating: 5,
    verified: true,
    tag: "US Verified"
  },
  {
    name: "Sarah Jenkins",
    role: "Logistics Operations Lead",
    location: "Chicago, IL, USA",
    avatar: "https://i.pravatar.cc/150?u=sarah-chicago",
    content: "I work Central Time, so having customer service and withdrawal approvals active right through US Central Time 10am to 7pm every day is perfect. The platform is responsive, dependable, and pays exactly as promised.",
    earnings: "$7,190",
    joined: "5 mos",
    tasks: 940,
    rating: 5,
    verified: true,
    tag: "Central Time User"
  },
  {
    name: "David R.",
    role: "IT Solutions Consultant",
    location: "Atlanta, GA, USA",
    avatar: "https://i.pravatar.cc/150?u=david-atlanta",
    content: "The multi-currency options sealed the deal for me. Withdrawing via PayPal USD or BNB gives me total flexibility. Customer support verified and approved my payouts promptly every single cycle.",
    earnings: "$10,320",
    joined: "8 mos",
    tasks: 1480,
    rating: 5,
    verified: true,
    tag: "Senior Node"
  },
  {
    name: "Tyler V.",
    role: "E-Commerce Merchant",
    location: "Miami, FL, USA",
    avatar: "https://i.pravatar.cc/150?u=tyler-miami",
    content: "Started with a modest level 1 node and upgraded as my tasks accumulated. The 20% referral commissions from inviting my network have created a solid passive income stream on top of daily tasks.",
    earnings: "$12,850",
    joined: "10 mos",
    tasks: 1820,
    rating: 5,
    verified: true,
    tag: "Top US Earner"
  },
  {
    name: "Marcus T.",
    role: "Warehouse Supervisor",
    location: "Houston, TX, USA",
    avatar: "https://i.pravatar.cc/150?u=marcus-t",
    content: "Honestly I was skeptical at first. Spent 2 weeks just watching before I even signed up. But when my first payout hit my PayPal USD I nearly fell off my chair 😂 Now it's just part of my daily routine. Wake up, tasks done by 9am, go to work.",
    earnings: "$6,240",
    joined: "7 mos",
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
    joined: "6 mos",
    tasks: 810,
    rating: 5,
    verified: true,
    tag: "Consistent earner"
  },
  {
    name: "Sandra K.",
    role: "Stay-at-home Mom",
    location: "Phoenix, AZ, USA",
    avatar: "https://i.pravatar.cc/150?u=sandra-k",
    content: "My husband thought it was a scam until I showed him the PayPal USD transfer. Now he does it too lol. I do it during nap time and after the kids sleep. The tasks don't take long and the app never crashes on me.",
    earnings: "$9,400",
    joined: "9 mos",
    tasks: 1240,
    rating: 5,
    verified: true,
    tag: "Top US Earner"
  },
  {
    name: "Priya S.",
    role: "Freelance Designer",
    location: "Seattle, WA, USA",
    avatar: "https://i.pravatar.cc/150?u=priya-s",
    content: "Client work can be so unpredictable — some months are great, some are dry. SmartBugMedia fills that gap. I do tasks between client projects and the referral earnings from my sister and two friends I brought on is just a bonus 🙌",
    earnings: "$4,810",
    joined: "5 mos",
    tasks: 620,
    rating: 5,
    verified: true,
    tag: "Referral Earner"
  },
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Automatic scroll interval (slides to next testimonial like a real carousel every 3.5s)
  useEffect(() => {
    if (!emblaApi || isHovered) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [emblaApi, isHovered]);

  return (
    <section className="py-12 sm:py-32 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
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

          {/* Carousel Next / Prev Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 active:scale-95 transition-all shadow-md"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 active:scale-95 transition-all shadow-md"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <p className="text-slate-400 text-xs sm:text-base max-w-xl">
          These are unedited reviews. Spelling quirks and all. Because real people don't talk in bullet points.
        </p>
      </div>

      {/* Embla Smooth Sliding Carousel Viewport */}
      <div
        ref={emblaRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <div className="flex gap-2.5 sm:gap-6 touch-pan-y">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="basis-[calc(50%-5px)] lg:basis-[calc((100%-48px)/3)] shrink-0 min-w-0"
            >
              <div className="h-full flex flex-col justify-between bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[18px] sm:rounded-[28px] p-3 sm:p-7 hover:border-white/10 hover:bg-slate-900/60 transition-all duration-300">
                <div>
                  {/* Top: Avatar + Name + Stars */}
                  <div className="flex items-start justify-between gap-1.5 sm:gap-4 mb-3 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover border-2 border-white/10"
                        />
                        {t.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[#020617]">
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="sm:w-2.5 sm:h-2.5">
                              <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-white text-xs sm:text-base leading-tight truncate">{t.name}</p>
                        <p className="text-slate-400 text-[9px] sm:text-sm truncate mt-0.5">{t.role}</p>
                        {/* Mobile Stars: Clean row below role so name doesn't clip */}
                        <div className="flex sm:hidden gap-0.5 mt-1">
                          {[...Array(t.rating)].map((_, idx) => (
                            <Star key={idx} size={9} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Desktop Stars */}
                    <div className="hidden sm:flex gap-0.5 shrink-0">
                      {[...Array(t.rating)].map((_, idx) => (
                        <Star key={idx} size={13} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* The actual quote */}
                  <p className="text-slate-300 text-[10px] sm:text-[15px] leading-relaxed mb-3 sm:mb-6 line-clamp-4 sm:line-clamp-none">
                    &quot;{t.content}&quot;
                  </p>
                </div>

                <div>
                  {/* Stats row — NO truncation, comfortable padding */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-3 mb-3 sm:mb-5">
                    <div className="bg-white/5 rounded-lg sm:rounded-xl px-1 py-1.5 sm:p-3 text-center border border-white/5 min-w-0">
                      <p className="text-emerald-400 font-extrabold text-[10px] min-[370px]:text-[11px] sm:text-base whitespace-nowrap">{t.earnings}</p>
                      <p className="text-slate-400 text-[7.5px] sm:text-[10px] uppercase font-semibold tracking-wider mt-0.5">Earned</p>
                    </div>
                    <div className="bg-white/5 rounded-lg sm:rounded-xl px-1 py-1.5 sm:p-3 text-center border border-white/5 min-w-0">
                      <p className="text-white font-extrabold text-[10px] min-[370px]:text-[11px] sm:text-base whitespace-nowrap">{t.tasks.toLocaleString()}</p>
                      <p className="text-slate-400 text-[7.5px] sm:text-[10px] uppercase font-semibold tracking-wider mt-0.5">Tasks</p>
                    </div>
                    <div className="bg-white/5 rounded-lg sm:rounded-xl px-1 py-1.5 sm:p-3 text-center border border-white/5 min-w-0">
                      <p className="text-cyan-400 font-extrabold text-[10px] min-[370px]:text-[11px] sm:text-base whitespace-nowrap">{t.joined}</p>
                      <p className="text-slate-400 text-[7.5px] sm:text-[10px] uppercase font-semibold tracking-wider mt-0.5">Member</p>
                    </div>
                  </div>

                  {/* Bottom: location + tag with NO clipping or overlap */}
                  <div className="pt-2 sm:pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-slate-400 text-[9px] sm:text-xs min-w-0">
                      <MapPin size={11} className="text-cyan-400 shrink-0" />
                      <span className="truncate">{t.location}</span>
                    </div>
                    <div className="flex justify-start sm:justify-end">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                        {t.tag}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots with active indicator */}
      <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
