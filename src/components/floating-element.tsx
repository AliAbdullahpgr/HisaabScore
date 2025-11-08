"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useMotionPreferences } from "@/lib/animations";
import {
  applyWillChange,
  removeWillChange,
  detectDevicePerformance,
  getOptimizedAnimationConfig,
} from "@/lib/animation-performance";

interface FloatingElementProps {
  children: React.ReactNode;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export function FloatingElement({
  children,
  duration = 3,
  yOffset = 10,
  className = "",
}: FloatingElementProps) {
  const { shouldAnimate } = useMotionPreferences();
  const elementRef = useRef<HTMLDivElement>(null);

  // Check device performance (Requirement 7.5)
  const devicePerformance = detectDevicePerformance();
  const animationConfig = getOptimizedAnimationConfig(devicePerformance);

  // Disable floating on low-end devices
  const enableFloating = shouldAnimate && animationConfig.enableFloating;

  // Apply GPU acceleration hints (Requirement 7.1)
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enableFloating) return;

    // Apply will-change for continuous animations
    const style = applyWillChange(["transform"]);
    Object.assign(element.style, style);

    return () => {
      removeWillChange(element);
    };
  }, [enableFloating]);

  // If reduced motion is enabled or device performance is low, don't apply floating animation
  if (!enableFloating) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={elementRef}
      className={className}
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
