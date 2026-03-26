"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Start with just $30",
  "Withdraw anytime",
  "24/7 customer support",
  "Multi-crypto support",
];

export function CTA() {
  return (
    <section
      id="signup"
      className="py-24 lg:py-32 bg-card relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[128px]" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px"
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-2 text-sm font-medium text-accent mb-8"
          >
            <Sparkles className="h-4 w-4" />
            Join 10,000+ active earners today
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
            Ready to start{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">
              earning?
            </span>
          </h2>
          <p className="mt-6 text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Create your account in minutes and start completing tasks today.
            Your first commission is just a few clicks away.
          </p>

          {/* Benefits */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="h-5 w-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-accent" />
                </div>
                {benefit}
              </motion.div>
            ))}
          </div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-emerald-600 px-8 py-4 text-base font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-accent/20"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-border px-8 py-4 text-base font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Sign In to Dashboard
            </Link>
          </motion.div>

          {/* Trust note */}
          <p className="mt-8 text-sm text-muted-foreground">
            Secure registration • No credit card required • Start in 2 minutes
          </p>
        </motion.div>

        {/* Quick start steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            {
              step: "01",
              title: "Create Account",
              desc: "Sign up with your email and set up your profile in under 2 minutes.",
            },
            {
              step: "02",
              title: "Make a Deposit",
              desc: "Fund your account with USDT, ETH, or BTC. Start from just $30.",
            },
            {
              step: "03",
              title: "Start Earning",
              desc: "Complete daily tasks, earn commissions, and withdraw your profits.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-full h-px bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="relative inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 text-accent font-bold text-lg mb-5">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
