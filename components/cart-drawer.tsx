"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Minus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/products";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, total, itemCount, removeFromCart } = useCart();
  const whatsappUrl = buildWhatsAppOrderUrl(items);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm"
            aria-label="Close bag"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className={cn(
              "fixed top-0 right-0 z-[80] flex h-full w-full max-w-md flex-col",
              "border-l border-white/40 bg-white shadow-2xl"
            )}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B0000] text-white">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#1a1a1a]">Your Bag</h2>
                  <p className="text-xs text-neutral-500">
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Close bag panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
                  <ShoppingBag className="h-12 w-12 text-neutral-200" />
                  <p className="text-sm text-neutral-500">Your bag is empty</p>
                  <button
                    onClick={onClose}
                    className="text-sm font-medium text-[#8B0000] hover:underline"
                  >
                    Browse the menu
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="rounded-2xl border border-neutral-100 bg-[#FDFBF7] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#1a1a1a]">
                            {item.quantity}× {item.name}
                          </p>
                          {item.toppings?.length ? (
                            <p className="mt-1 text-xs text-neutral-500">
                              {item.toppings.join(", ")}
                            </p>
                          ) : null}
                          <p className="mt-2 text-sm font-semibold text-[#8B0000]">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white hover:text-[#8B0000]"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-neutral-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Total</span>
                  <span className="text-xl font-semibold text-[#8B0000]">
                    {formatPrice(total)}
                  </span>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4",
                    "text-sm font-semibold text-white shadow-lg shadow-[#25D366]/25",
                    "transition-all hover:bg-[#20bd5a] hover:shadow-xl"
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  Order on WhatsApp
                </a>

                <p className="mt-3 text-center text-xs text-neutral-400">
                  Opens WhatsApp with your order ready to send
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
