"use client";

import { motion } from "framer-motion";
import {
  Layers,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Wallet,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Layers,
    title: "Simple Task System",
    description:
      "Complete straightforward tasks in organized sets. Each set you finish earns you commissions based on your VIP level.",
  },
  {
    icon: TrendingUp,
    title: "6 VIP Levels",
    description:
      "Progress from LV1 to LV6 and unlock higher commission rates up to 1.5%. Higher levels mean bigger daily earnings.",
  },
  {
    icon: Users,
    title: "Referral Rewards",
    description:
      "Invite friends and earn bonus rewards from their activity. Build your network and multiply your passive income.",
  },
  {
    icon: Clock,
    title: "Daily Salary Bonuses",
    description:
      "Work consistently and unlock salary rewards. Complete 30 consecutive days to earn up to $32,800 in bonuses.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description:
      "Deposit and withdraw via USDT, ETH, or BTC. All transactions are verified and processed within hours.",
  },
  {
    icon: Wallet,
    title: "Flexible Deposits",
    description:
      "Start with as little as $30. Choose from preset amounts or enter a custom deposit to match your investment goals.",
  },
];

const vipTiers = [
  { level: 1, rate: "0.45%", deposit: "$100", sets: 3 },
  { level: 2, rate: "0.50%", deposit: "$500", sets: 4 },
  { level: 3, rate: "0.80%", deposit: "$2,000", sets: 4 },
  { level: 4, rate: "1.00%", deposit: "$5,000", sets: 5 },
  { level: 5, rate: "1.20%", deposit: "$10,000", sets: 5 },
  { level: 6, rate: "1.50%", deposit: "$30,000", sets: 6 },
];

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[128px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-sm font-medium text-accent mb-6"
          >
            How It Works
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            A transparent system{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">
              built for earners
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-xl mx-auto">
            Everything you need to start earning. No hidden fees, no complex
            rules - just complete tasks and watch your balance grow.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-secondary/50 rounded-2xl p-8 border border-border hover:border-accent/30 hover:bg-secondary transition-all duration-500"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VIP Levels Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-3">
              VIP Level Commission Rates
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Higher levels unlock better rates and more daily task sets
            </p>
          </div>

          <div className="relative bg-secondary/30 rounded-3xl border border-border p-8 lg:p-12 overflow-hidden">
            {/* Background grid */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "32px 32px"
              }}
            />
            
            <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {vipTiers.map((tier, i) => (
                <motion.div
                  key={tier.level}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  className="group bg-card hover:bg-card/80 rounded-2xl p-5 text-center border border-border hover:border-accent/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-accent to-emerald-600 text-primary-foreground font-bold shadow-lg shadow-accent/20">
                    LV{tier.level}
                  </div>
                  <p className="text-2xl font-bold text-foreground">{tier.rate}</p>
                  <p className="text-xs text-muted-foreground mt-1">commission</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-foreground font-medium">{tier.deposit}</p>
                    <p className="text-xs text-muted-foreground">{tier.sets} sets/day</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative mt-10 text-center"
            >
              <Link
                href="/levels"
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors group"
              >
                View detailed level benefits
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
