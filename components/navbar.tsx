"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Story", href: "#story" },
  { label: "Order", href: "#order" },
];

export function Navbar() {
  const { itemCount, total } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2",
          "rounded-2xl border border-white/40 bg-white/70 shadow-lg shadow-black/[0.04]",
          "backdrop-blur-md backdrop-saturate-150 transition-all duration-500",
          scrolled && "top-3 bg-white/85 shadow-xl shadow-black/[0.06]"
        )}
      >
        <nav className="flex items-center justify-between px-5 py-3.5 sm:px-7">
          <a href="#" className="group flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B0000] text-xs font-bold text-white">
              S
            </span>
            <span className="text-sm font-semibold tracking-tight text-[#1a1a1a]">
              Sips <span className="font-normal text-[#8B0000]">&amp;</span> Bites
            </span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-neutral-600 transition-colors hover:text-[#8B0000]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex items-center gap-2 rounded-xl bg-[#8B0000] px-4 py-2 text-sm font-medium text-white shadow-md shadow-[#8B0000]/20 transition-shadow hover:shadow-lg hover:shadow-[#8B0000]/30"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Bag</span>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#8B0000]"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white/80 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {itemCount > 0 && (
          <div className="hidden border-t border-neutral-100 px-7 py-2 text-center text-xs text-neutral-500 sm:block">
            {itemCount} item{itemCount !== 1 ? "s" : ""} · {formatPrice(total)}
          </div>
        )}
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 z-40 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-xl backdrop-blur-md md:hidden"
          >
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm text-neutral-700 transition-colors hover:bg-[#FDFBF7] hover:text-[#8B0000]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
