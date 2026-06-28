"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  MessageCircle,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import {
  PRODUCTS,
  TOPPINGS,
  type ProductId,
  formatPrice,
  getProduct,
} from "@/lib/products";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Welcome to Sips & Bites. I'm your culinary sommelier — here to guide you through our premium Ghanaian delicacies. Would you like a recommendation, or shall I help you build your order?",
  timestamp: new Date(),
};

const QUICK_PROMPTS = [
  "Recommend something sweet",
  "I'd like 2 Creamy Kens",
  "What toppings for BanBite?",
  "Show me the menu",
];

function parseOrderIntent(
  input: string
): {
  productId?: ProductId;
  quantity: number;
  toppings?: string[];
  action: "add" | "recommend" | "menu" | "toppings" | "greeting" | "unknown";
} {
  const lower = input.toLowerCase();

  if (/menu|what do you (have|sell|offer)|show me/.test(lower)) {
    return { quantity: 0, action: "menu" };
  }

  if (/recommend|suggest|what('s| is) (good|best|popular)/.test(lower)) {
    return { quantity: 0, action: "recommend" };
  }

  if (/topping|extra|add.*to/.test(lower)) {
    let productId: ProductId | undefined;
    if (/creamy ken|creamyken|kenkey|ice kenkey/.test(lower)) productId = "ice-kenkey";
    else if (/banbite|ban bite|banana bread|banana/.test(lower)) productId = "banana-bread";
    else if (/chocobite|choco bite|coco bread|choco/.test(lower)) productId = "coco-bread";
    return { productId, quantity: 0, action: "toppings" };
  }

  if (/hello|hi|hey|good (morning|afternoon|evening)/.test(lower)) {
    return { quantity: 0, action: "greeting" };
  }

  const qtyMatch = lower.match(/(\d+|one|two|three|a|an)/);
  let quantity = 1;
  if (qtyMatch) {
    const q = qtyMatch[1];
    const wordMap: Record<string, number> = {
      one: 1,
      two: 2,
      three: 3,
      a: 1,
      an: 1,
    };
    quantity = (wordMap[q] ?? parseInt(q, 10)) || 1;
  }

  let productId: ProductId | undefined;
  if (/creamy ken|creamyken|kenkey|ice kenkey|mashed/.test(lower)) productId = "ice-kenkey";
  else if (/banbite|ban bite|banana bread|banana/.test(lower)) productId = "banana-bread";
  else if (/chocobite|choco bite|coco bread|choco/.test(lower)) productId = "coco-bread";

  if (productId && /(add|order|want|like|get|i'll take|give me)/.test(lower)) {
    const toppings: string[] = [];
    const allToppings = Object.values(TOPPINGS).flat();
    for (const topping of allToppings) {
      if (lower.includes(topping.toLowerCase())) {
        toppings.push(topping);
      }
    }
    return { productId, quantity, toppings, action: "add" };
  }

  if (productId) {
    return { productId, quantity, action: "add" };
  }

  return { quantity: 0, action: "unknown" };
}

function generateResponse(
  input: string,
  addToCart: (id: ProductId, qty?: number, toppings?: string[]) => void
): string {
  const intent = parseOrderIntent(input);

  switch (intent.action) {
    case "menu":
      return PRODUCTS.map(
        (p) => `• **${p.name}** — ${p.description} (${formatPrice(p.price)})`
      ).join("\n");

    case "recommend": {
      const sweet = getProduct("banana-bread")!;
      const savory = getProduct("coco-bread")!;
      const chilled = getProduct("ice-kenkey")!;
      return `For a delightful experience, I'd suggest:\n\n🍌 **${sweet.name}** — perfect for afternoon indulgence\n🥖 **${savory.name}** — warm, buttery comfort\n🍨 **${chilled.name}** — refreshingly unique\n\nShall I add any of these to your bag?`;
    }

    case "toppings": {
      const id = intent.productId ?? "banana-bread";
      const product = getProduct(id)!;
      const toppings = TOPPINGS[id];
      return `Excellent choice exploring **${product.name}**. Our curated toppings:\n\n${toppings.map((t) => `• ${t}`).join("\n")}\n\nSimply tell me which you'd like — e.g. "Add 1 BanBite with Walnuts"`;
    }

    case "greeting":
      return "Good day! The kitchen is warm and our delicacies are ready. What can I prepare for you today — something sweet, savory, or refreshingly chilled?";

    case "add": {
      const product = getProduct(intent.productId!)!;
      addToCart(intent.productId!, intent.quantity, intent.toppings);
      const toppingNote =
        intent.toppings?.length
          ? ` with ${intent.toppings.join(" & ")}`
          : "";
      return `Wonderful selection. I've added **${intent.quantity}× ${product.name}**${toppingNote} to your bag (${formatPrice(product.price * intent.quantity)}). Anything else to complete your order?`;
    }

    default:
      return "I'd love to help! You can ask me to recommend dishes, explore toppings, or order directly — try \"Add 2 Creamy Kens\" or \"What toppings for ChocoBite?\"";
  }
}

export function OrderAgent() {
  const { addToCart, itemCount, total } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

      const response = generateResponse(text, addToCart);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    },
    [addToCart, isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-[#8B0000]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part.split("\n").map((line, j, arr) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < arr.length - 1 && <br />}
        </span>
      ));
    });
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full",
              "bg-[#8B0000] px-5 py-4 text-white shadow-2xl shadow-[#8B0000]/30",
              "transition-shadow hover:shadow-[#8B0000]/40"
            )}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Order with AI</span>
            <Sparkles className="h-4 w-4 text-white/70" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden",
              "h-[min(600px,calc(100vh-3rem))] w-[min(420px,calc(100vw-2rem))]",
              "rounded-3xl border border-white/60 bg-white/95 shadow-2xl shadow-black/10 backdrop-blur-xl"
            )}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 bg-[#FDFBF7] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8B0000] text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">
                    Culinary Sommelier
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-neutral-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Ready to assist
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {itemCount > 0 && (
              <div className="flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-2.5 text-xs">
                <span className="text-neutral-500">
                  {itemCount} item{itemCount !== 1 ? "s" : ""} in bag
                </span>
                <span className="font-semibold text-[#8B0000]">
                  {formatPrice(total)}
                </span>
              </div>
            )}

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2.5",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl",
                      message.role === "user"
                        ? "bg-[#8B0000] text-white"
                        : "bg-[#FDFBF7] text-[#8B0000]"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="h-3.5 w-3.5" />
                    ) : (
                      <Bot className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      message.role === "user"
                        ? "rounded-tr-md bg-[#8B0000] text-white"
                        : "rounded-tl-md border border-neutral-100 bg-[#FDFBF7] text-neutral-700"
                    )}
                  >
                    {renderContent(message.content)}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#FDFBF7] text-[#8B0000]">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-neutral-100 bg-[#FDFBF7] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="h-1.5 w-1.5 rounded-full bg-[#8B0000]/40"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-neutral-100 bg-white p-3">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    disabled={isTyping}
                    className="shrink-0 rounded-full border border-neutral-200 bg-[#FDFBF7] px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:border-[#8B0000]/20 hover:text-[#8B0000] disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about menu, toppings, or order..."
                  disabled={isTyping}
                  className={cn(
                    "flex-1 rounded-2xl border border-neutral-200 bg-[#FDFBF7] px-4 py-3",
                    "text-sm text-neutral-800 placeholder:text-neutral-400",
                    "outline-none transition-colors focus:border-[#8B0000]/30 focus:ring-2 focus:ring-[#8B0000]/10",
                    "disabled:opacity-50"
                  )}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B0000] text-white shadow-md shadow-[#8B0000]/20 transition-colors hover:bg-[#A31D1D] disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
