"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import {
  fadeInUp,
  scaleIn,
  smoothTransition,
  useMotionPreferences,
  getReducedMotionTransition,
  getReducedMotionVariants,
} from "@/lib/animations";
import {
  applyWillChange,
  removeWillChange,
  animationThrottle,
} from "@/lib/animation-performance";

/**
 * Props for AnimatedSection component
 */
export interface AnimatedSectionProps {
  children: ReactNode;
  variant?: "fadeInUp" | "fadeIn" | "scaleIn";
  delay?: number;
  once?: boolean;
  className?: string;
  amount?: number | "some" | "all";
}

/**
 * Variant configurations for different animation types
 */
const variants: Record<string, Variants> = {
  fadeInUp,
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scaleIn,
};

/**
 * AnimatedSection Component
 *
 * A wrapper component for scroll-triggered section animations.
 * Animates content when it enters the viewport using Framer Motion's whileInView.
 *
 * @param children - Content to be animated
 * @param variant - Animation type: "fadeInUp" (default), "fadeIn", or "scaleIn"
 * @param delay - Delay before animation starts in seconds (default: 0)
 * @param once - Whether animation should only play once (default: true)
 * @param className - Additional CSS classes
 * @param amount - Intersection threshold: number (0-1), "some", or "all" (default: 0.3)
 *
 * Requirements: 2.1, 2.2
 */
export function AnimatedSection({
  children,
  variant = "fadeInUp",
  delay = 0,
  once = true,
  className = "",
  amount = 0.3,
}: AnimatedSectionProps) {
  const { prefersReducedMotion } = useMotionPreferences();
  const elementRef = useRef<HTMLDivElement>(null);

  // Get appropriate variants and transition based on motion preferences
  const animationVariants = getReducedMotionVariants(
    prefersReducedMotion,
    variants[variant]
  );

  const transition = getReducedMotionTransition(prefersReducedMotion, {
    ...smoothTransition,
    delay,
  });

  // Apply GPU acceleration hints and cleanup
  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    // Apply will-change for GPU acceleration (Requirement 7.1)
    const style = applyWillChange(["transform", "opacity"]);
    Object.assign(element.style, style);

    // Cleanup: remove will-change after animation completes
    const timer = setTimeout(() => {
      removeWillChange(element);
    }, ((transition.duration as number) || 0.3) * 1000 + delay * 1000);

    return () => {
      clearTimeout(timer);
      removeWillChange(element);
    };
  }, [prefersReducedMotion, transition.duration, delay]);

  return (
    <motion.div
      ref={elementRef}
      initial="initial"
      whileInView="animate"
      exit="exit"
      viewport={{ once, amount }}
      variants={animationVariants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
