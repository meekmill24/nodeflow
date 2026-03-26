"use client";

import { motion } from "framer-motion";
import { Star, Quote, TrendingUp, Users, DollarSign, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Michael Chen",
    role: "VIP Level 5",
    location: "Singapore",
    avatar: "MC",
    content:
      "Started 6 months ago with just $500. Now earning over $3,000 monthly just from completing daily tasks. The system is transparent and payouts are always on time.",
    earnings: "$18,450",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    role: "VIP Level 4",
    location: "United Kingdom",
    avatar: "SW",
    content:
      "What I love most is the referral system. My network now brings in passive income even when I'm not actively working. Best decision I made this year.",
    earnings: "$12,800",
    rating: 5,
  },
  {
    name: "David Okonkwo",
    role: "VIP Level 6",
    location: "Nigeria",
    avatar: "DO",
    content:
      "The salary bonuses for consecutive work days are incredible. 30 days in a row and I earned an extra $32,800. This platform changed my financial situation completely.",
    earnings: "$67,200",
    rating: 5,
  },
  {
    name: "Emily Tanaka",
    role: "VIP Level 3",
    location: "Japan",
    avatar: "ET",
    content:
      "Simple, straightforward, and reliable. I complete my tasks during lunch breaks and the earnings show up instantly. Customer support is also very responsive.",
    earnings: "$8,920",
    rating: 5,
  },
];

const stats = [
  { icon: DollarSign, value: "$2.4M+", label: "Paid out to members" },
  { icon: Users, value: "10,000+", label: "Active earners" },
  { icon: TrendingUp, value: "99.9%", label: "Payout success rate" },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 bg-card rounded-2xl p-6 border border-border"
            >
              <div className="h-14 w-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <stat.icon className="h-7 w-7 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-sm font-medium text-accent mb-6">
            <CheckCircle className="h-4 w-4" />
            Verified Success Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Real people,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">
              real earnings
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Join thousands of members who are already building their income on NodeFlow.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl p-8 border border-border hover:border-accent/20 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 h-10 w-10 text-accent/10" />

              {/* Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground text-lg leading-relaxed mb-8">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-accent font-medium">{testimonial.role}</span>
                      <span>•</span>
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Total earned</p>
                  <p className="text-xl font-bold text-accent">{testimonial.earnings}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
