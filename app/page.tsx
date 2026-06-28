"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Heart, Leaf, Star } from "lucide-react";
import { IntroVideo } from "@/components/intro-video";
import { Navbar } from "@/components/navbar";
import { MenuCard } from "@/components/menu-card";
import { OrderAgent } from "@/components/order-agent";
import { CartToast } from "@/components/cart-toast";
import { ContactSection } from "@/components/contact-section";
import { PRODUCTS } from "@/lib/products";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const stats = [
  { icon: Star, label: "Premium Quality", value: "Artisan Crafted" },
  { icon: Leaf, label: "Local Ingredients", value: "100% Ghanaian" },
  { icon: Heart, label: "Made with Love", value: "Family Recipe" },
];

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      <IntroVideo onComplete={handleIntroComplete} />

      <div
        className={`min-h-screen bg-[#FDFBF7] transition-opacity duration-500 ${
          introComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        <Navbar />
        <CartToast />

        <main>
          {/* Hero */}
          <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#8B0000]/5 blur-[100px]" />
              <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-amber-100/40 blur-[80px]" />
            </div>

            <div className="relative mx-auto max-w-4xl text-center">
              <motion.p
                custom={0}
                initial="hidden"
                animate={introComplete ? "visible" : "hidden"}
                variants={fadeUp}
                className="mb-6 text-xs font-medium tracking-[0.35em] text-[#8B0000] uppercase"
              >
                Sips &amp; Bites · Cape Coast, Ghana
              </motion.p>

              <motion.h1
                custom={1}
                initial="hidden"
                animate={introComplete ? "visible" : "hidden"}
                variants={fadeUp}
                className="text-5xl font-light tracking-tight text-[#1a1a1a] sm:text-6xl md:text-7xl lg:text-8xl"
              >
                Tradition,{" "}
                <span className="font-semibold text-[#8B0000]">Reimagined.</span>
              </motion.h1>

              <motion.p
                custom={2}
                initial="hidden"
                animate={introComplete ? "visible" : "hidden"}
                variants={fadeUp}
                className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-500 sm:text-xl"
              >
                Premium Ghanaian delicacies crafted with heritage and elegance.
                From chilled Creamy Ken to freshly baked BanBite — every bite
                tells a story of home, elevated.
              </motion.p>

              <motion.div
                custom={3}
                initial="hidden"
                animate={introComplete ? "visible" : "hidden"}
                variants={fadeUp}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <a
                  href="#menu"
                  className="rounded-2xl bg-[#8B0000] px-8 py-4 text-sm font-medium text-white shadow-lg shadow-[#8B0000]/25 transition-all hover:bg-[#A31D1D] hover:shadow-xl"
                >
                  Explore the Menu
                </a>
                <a
                  href="#story"
                  className="rounded-2xl border border-neutral-200 bg-white px-8 py-4 text-sm font-medium text-neutral-700 transition-all hover:border-[#8B0000]/20 hover:text-[#8B0000]"
                >
                  Our Story
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <a
                href="#menu"
                className="flex flex-col items-center gap-2 text-neutral-400 transition-colors hover:text-[#8B0000]"
              >
                <span className="text-xs tracking-widest uppercase">Discover</span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowDown className="h-4 w-4" />
                </motion.div>
              </a>
            </motion.div>
          </section>

          {/* Stats strip */}
          <section className="border-y border-neutral-100 bg-white">
            <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-neutral-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 px-8 py-8 sm:justify-center"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBF7]">
                    <Icon className="h-5 w-5 text-[#8B0000]" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Menu Grid */}
          <section id="menu" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="mb-16 text-center"
              >
                <p className="mb-3 text-xs font-medium tracking-[0.3em] text-[#8B0000] uppercase">
                  The Collection
                </p>
                <h2 className="text-3xl font-light tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
                  Our <span className="font-semibold">Flagship</span> Delicacies
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-neutral-500">
                  Three timeless Ghanaian favorites, reimagined with premium
                  ingredients and artisan craftsmanship.
                </p>
              </motion.div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {PRODUCTS.map((product, index) => (
                  <MenuCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* Story */}
          <section id="story" className="bg-white px-6 py-24 sm:py-32">
            <div className="mx-auto grid max-w-5xl items-center gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <p className="text-xs font-medium tracking-[0.3em] text-[#8B0000] uppercase">
                  Our Story
                </p>
                <h2 className="text-3xl font-light tracking-tight text-[#1a1a1a] sm:text-4xl">
                  Rooted in <span className="font-semibold">Heritage</span>,
                  <br />
                  Crafted for Today
                </h2>
                <p className="leading-relaxed text-neutral-500">
                  Sips &amp; Bites was born from a simple belief: the flavors of
                  home deserve to be celebrated with the same care and elegance
                  as any world-class culinary experience.
                </p>
                <p className="leading-relaxed text-neutral-500">
                  Every BanBite, every pillowy ChocoBite, and every
                  chilled scoop of Creamy Ken is made with locally sourced
                  ingredients and recipes passed down through generations —
                  refined for the modern palate.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B0000]/10 via-[#FDFBF7] to-amber-50"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8">
                    {["🍌", "🥖", "🍨", "✨"].map((emoji, i) => (
                      <motion.div
                        key={emoji}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-4xl shadow-lg sm:h-28 sm:w-28 sm:text-5xl"
                      >
                        {emoji}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA / Order */}
          <section id="order" className="px-6 py-24 sm:py-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-3xl rounded-3xl border border-white bg-white p-10 text-center shadow-[0_20px_60px_rgb(0,0,0,0.06)] sm:p-16"
            >
              <p className="mb-3 text-xs font-medium tracking-[0.3em] text-[#8B0000] uppercase">
                Ready to Order?
              </p>
              <h2 className="text-3xl font-light tracking-tight text-[#1a1a1a] sm:text-4xl">
                Let our AI Sommelier
                <br />
                <span className="font-semibold">Curate Your Experience</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-neutral-500">
                Chat naturally to explore toppings, get recommendations, and
                build your perfect order — all in one elegant conversation.
              </p>
              <p className="mt-8 text-sm text-neutral-400">
                Click the chat button in the bottom right corner to begin →
              </p>
            </motion.div>
          </section>

          <ContactSection />
        </main>

        <footer className="border-t border-neutral-100 bg-white px-6 py-12">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B0000] text-xs font-bold text-white">
                S
              </span>
              <span className="text-sm font-semibold text-[#1a1a1a]">
                Sips &amp; Bites
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              © {new Date().getFullYear()} Sips &amp; Bites. Tradition, Reimagined.
            </p>
          </div>
        </footer>

        <OrderAgent />
      </div>
    </>
  );
}
