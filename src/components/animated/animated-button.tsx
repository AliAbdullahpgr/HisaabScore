"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import {
  smoothTransition,
  useMotionPreferences,
  getReducedMotionTransition,
} from "@/lib/animations";
import { applyWillChange, removeWillChange } from "@/lib/animation-performance";

/**
 * Props for AnimatedButton component
 */
export interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  hoverScale?: number;
  tapScale?: number;
}

/**
 * AnimatedButton Component
 *
 * An enhanced button component with micro-interactions.
 * Provides scale effects on hover and tap for better user feedback.
 *
 * @param children - Button content
 * @param hoverScale - Scale factor on hover (default: 1.05 for 105%)
 * @param tapScale - Scale factor on tap/click (default: 0.95 for 95%)
 * @param className - Additional CSS classes
 * @param ...props - Standard button HTML attributes
 *
 * Requirements: 3.1
 */
export function AnimatedButton({
  children,
  hoverScale = 1.05,
  tapScale = 0.95,
  className = "",
  ...props
}: AnimatedButtonProps) {
  const { prefersReducedMotion } = useMotionPreferences();
  const elementRef = useRef<HTMLButtonElement>(null);

  // Get appropriate transition based on motion preferences
  const transition = getReducedMotionTransition(prefersReducedMotion, {
    ...smoothTransition,
    duration: 0.2,
  });

  // Define hover and tap animations - scale only if motion is not reduced
  const hoverAnimation = prefersReducedMotion
    ? { opacity: 0.9 }
    : { scale: hoverScale };

  const tapAnimation = prefersReducedMotion
    ? { opacity: 0.8 }
    : { scale: tapScale };

  // Apply GPU acceleration hints (Requirement 7.1)
  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion) return;

    // Apply will-change on mount for interactive elements
    const style = applyWillChange(["transform", "opacity"]);
    Object.assign(element.style, style);

    return () => {
      removeWillChange(element);
    };
  }, [prefersReducedMotion]);

  return (
    <motion.button
      ref={elementRef}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
