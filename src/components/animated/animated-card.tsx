"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import {
  smoothTransition,
  useMotionPreferences,
  getReducedMotionTransition,
} from "@/lib/animations";
import { applyWillChange, removeWillChange } from "@/lib/animation-performance";

/**
 * Props for AnimatedCard component
 */
export interface AnimatedCardProps {
  children: ReactNode;
  hoverScale?: number;
  className?: string;
}

/**
 * AnimatedCard Component
 *
 * A wrapper component for card elements with hover effects.
 * Provides elevation, shadow glow, and scale effects on hover.
 *
 * @param children - Card content to be animated
 * @param hoverScale - Scale factor on hover (default: 1.02 for 102%)
 * @param className - Additional CSS classes
 *
 * Requirements: 2.2, 3.2
 */
export function AnimatedCard({
  children,
  hoverScale = 1.02,
  className = "",
}: AnimatedCardProps) {
  const { prefersReducedMotion } = useMotionPreferences();
  const elementRef = useRef<HTMLDivElement>(null);

  // Get appropriate transition based on motion preferences
  const transition = getReducedMotionTransition(prefersReducedMotion, {
    ...smoothTransition,
    duration: 0.3,
  });

  // Define hover animation - scale only if motion is not reduced
  const hoverAnimation = prefersReducedMotion
    ? { opacity: 0.9 }
    : {
        scale: hoverScale,
        y: -4,
      };

  // Apply GPU acceleration hints (Requirement 7.1)
  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    // Apply will-change on mount for hover interactions
    const style = applyWillChange(["transform", "opacity"]);
    Object.assign(element.style, style);

    return () => {
      removeWillChange(element);
    };
  }, [prefersReducedMotion]);

  return (
    <motion.div
      ref={elementRef}
      whileHover={hoverAnimation}
      transition={transition}
      className={className}
      style={{
        // Ensure smooth transitions for shadow and other properties
        transition: "box-shadow 0.3s ease-out",
      }}
    >
      {children}
    </motion.div>
  );
}
