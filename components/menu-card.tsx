"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { type Product, formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  product: Product;
  index: number;
}

export function MenuCard({ product, index }: MenuCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.15,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-white/80 bg-white p-6",
          "shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500",
          "group-hover:shadow-[0_20px_60px_rgb(139,0,0,0.08)]"
        )}
      >
        <div
          className={cn(
            "absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-all duration-500",
            "group-hover:scale-150 group-hover:opacity-80",
            product.accent
          )}
        />

        <div className="relative space-y-5">
          <div className="flex items-start justify-between">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDFBF7] text-3xl shadow-inner"
            >
              {product.emoji}
            </motion.div>
            <span className="rounded-full bg-[#8B0000]/8 px-3 py-1 text-xs font-semibold tracking-wide text-[#8B0000] uppercase">
              {product.tagline}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-[#1a1a1a]">
              {product.name}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-500">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider">From</p>
              <p className="text-2xl font-semibold text-[#8B0000]">
                {formatPrice(product.price)}
              </p>
            </div>

            <motion.button
              onClick={() => addToCart(product.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "group/btn flex items-center gap-2 rounded-2xl bg-[#8B0000] px-5 py-3",
                "text-sm font-medium text-white shadow-lg shadow-[#8B0000]/25",
                "transition-all hover:bg-[#A31D1D] hover:shadow-xl hover:shadow-[#8B0000]/30"
              )}
            >
              <Plus className="h-4 w-4 transition-transform group-hover/btn:rotate-90" />
              Add to Bag
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            whileHover={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 border-t border-neutral-100 pt-4 text-xs text-neutral-400">
              <Sparkles className="h-3.5 w-3.5 text-[#8B0000]/60" />
              <span>Ask our AI sommelier for custom toppings</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
