"use client";

import { motion } from "framer-motion";
import { Phone, Sparkles } from "lucide-react";

const PHONE_NUMBER = "0546522181";
const PHONE_HREF = "tel:+233546522181";

export function ContactSection() {
  return (
    <section id="contact" className="px-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#8B0000]/10 bg-gradient-to-br from-white via-[#FDFBF7] to-[#f5ebe0] p-10 text-center shadow-[0_20px_60px_rgb(139,0,0,0.08)] sm:p-14"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -8, 0] }}
              transition={{
                duration: 2 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute text-[#8B0000]/30"
              style={{
                left: `${12 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.span>
          ))}
        </div>

        <div className="relative">
          <p className="mb-2 text-xs font-medium tracking-[0.35em] text-[#8B0000] uppercase">
            Contact Us
          </p>
          <h2 className="text-2xl font-light tracking-tight text-[#1a1a1a] sm:text-3xl">
            We&apos;d love to <span className="font-semibold">hear from you</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500">
            Call or WhatsApp us to place an order, ask about our menu, or plan
            your next treat.
          </p>

          <motion.a
            href={PHONE_HREF}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group mt-8 inline-flex flex-col items-center gap-3 rounded-2xl px-6 py-4 transition-colors hover:bg-white/60"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-neutral-600">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B0000] text-white shadow-md shadow-[#8B0000]/25">
                <Phone className="h-4 w-4" />
              </span>
              Tap to call
            </span>
            <span className="text-glitter relative text-3xl font-bold tracking-wide sm:text-4xl">
              {PHONE_NUMBER}
            </span>
            <span className="text-xs text-neutral-400 group-hover:text-[#8B0000]">
              Available daily · Cape Coast, Ghana
            </span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
