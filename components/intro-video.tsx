"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const INTRO_STORAGE_KEY = "sips-bites-intro-seen";

interface IntroVideoProps {
  onComplete: () => void;
}

export function IntroVideo({ onComplete }: IntroVideoProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(INTRO_STORAGE_KEY);
    if (hasSeenIntro) {
      onComplete();
      return;
    }
    setIsVisible(true);
  }, [onComplete]);

  const handleEnter = () => {
    setIsExiting(true);
    localStorage.setItem(INTRO_STORAGE_KEY, "true");
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 900);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex overflow-hidden bg-[#1a0a0a]"
        >
          <motion.div
            animate={{
              scale: isExiting ? 1.08 : 1,
              filter: isExiting ? "blur(8px)" : "blur(0px)",
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {!videoError ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
                onError={() => setVideoError(true)}
              >
                <source src="/videos/intro.mp4" type="video/mp4" />
              </video>
            ) : (
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000] via-[#4a0000] to-[#1a0a0a]" />
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#A31D1D] blur-[120px]" />
                  <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-amber-200/20 blur-[100px]" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/60">
                  <span className="text-6xl">🍽️</span>
                  <p className="text-sm tracking-[0.3em] uppercase">
                    Sips &amp; Bites
                  </p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
          </motion.div>

          <div className="relative z-10 flex h-full w-full flex-col">
            <motion.p
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="pt-10 text-center text-xs font-medium tracking-[0.4em] text-white/80 uppercase sm:pt-14"
            >
              Premium Ghanaian Delicacies
            </motion.p>

            <div className="flex-1" aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center px-6 pb-12 sm:pb-16"
            >
              <motion.button
                onClick={handleEnter}
                disabled={isExiting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "group animate-pulse-subtle flex items-center gap-3 rounded-full",
                  "border border-white/20 bg-white/10 px-8 py-4",
                  "text-sm font-medium tracking-wide text-white backdrop-blur-md",
                  "transition-all duration-300 hover:bg-white/20 hover:shadow-2xl",
                  "disabled:pointer-events-none disabled:opacity-50"
                )}
              >
                Enter Sips &amp; Bites
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function resetIntroState() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(INTRO_STORAGE_KEY);
  }
}
