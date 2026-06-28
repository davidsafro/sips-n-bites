"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

export function CartToast() {
  const { notifications, dismissNotification } = useCart();

  return (
    <div className="pointer-events-none fixed top-24 right-4 z-[60] flex flex-col gap-3 sm:right-6">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md",
              notification.type === "success"
                ? "border-[#8B0000]/10 bg-white/95"
                : "border-neutral-200 bg-[#FDFBF7]/95"
            )}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8B0000]" />
            ) : (
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
            )}
            <p className="flex-1 text-sm leading-snug text-neutral-700">
              {notification.message}
            </p>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="shrink-0 rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
