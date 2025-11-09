"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import Logo from "@/components/logo";
import {
  useMotionPreferences,
  getReducedMotionTransition,
} from "@/lib/animations";
import { applyWillChange, removeWillChange } from "@/lib/animation-performance";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const { prefersReducedMotion } = useMotionPreferences();
  const containerRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  // Transition configurations based on motion preferences
  const fadeInTransition = getReducedMotionTransition(prefersReducedMotion, {
    duration: 0.1,
    ease: "easeOut",
  });

  const fadeOutTransition = getReducedMotionTransition(prefersReducedMotion, {
    duration: 0.3,
    ease: "easeIn",
  });

  const spinnerTransition = prefersReducedMotion
    ? { duration: 0.05 }
    : {
        duration: 1,
        repeat: Infinity,
        ease: "linear" as const,
      };

  // Apply GPU acceleration hints (Requirement 7.1)
  useEffect(() => {
    if (!isLoading || prefersReducedMotion) return;

    const container = containerRef.current;
    const spinner = spinnerRef.current;

    if (container) {
      const style = applyWillChange(["opacity"]);
      Object.assign(container.style, style);
    }

    if (spinner) {
      const style = applyWillChange(["transform"]);
      Object.assign(spinner.style, style);
    }

    return () => {
      removeWillChange(container);
      removeWillChange(spinner);
    };
  }, [isLoading, prefersReducedMotion]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeOutTransition}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background backdrop-blur-lg pointer-events-auto"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Logo with fade-in animation */}
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={getReducedMotionTransition(prefersReducedMotion, {
                duration: 0.3,
                ease: "easeOut",
              })}
              className="scale-150"
            >
              <Logo />
            </motion.div>

            {/* Animated spinner */}
            <div className="relative w-16 h-16">
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={fadeInTransition}
              />

              {/* Spinning arc */}
              <motion.div
                ref={spinnerRef}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={spinnerTransition}
                style={{
                  opacity: prefersReducedMotion ? 0.5 : 1,
                }}
              />
            </div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={getReducedMotionTransition(prefersReducedMotion, {
                duration: 0.3,
                delay: 0.1,
              })}
              className="text-sm text-muted-foreground font-medium"
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
