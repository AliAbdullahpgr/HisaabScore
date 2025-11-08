"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionPreferences } from "@/lib/animations";
import {
  applyWillChange,
  removeWillChange,
  detectDevicePerformance,
  getOptimizedAnimationConfig,
} from "@/lib/animation-performance";

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  speed?: number; // 0-1, where 0.5 is half scroll speed
  className?: string;
}

export function ParallaxBackground({
  children,
  speed = 0.5,
  className = "",
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { shouldAnimate } = useMotionPreferences();
  const [isMounted, setIsMounted] = useState(false);

  // Check device performance (Requirement 7.5)
  const devicePerformance = detectDevicePerformance();
  const animationConfig = getOptimizedAnimationConfig(devicePerformance);

  // Disable parallax on low-end devices
  const enableParallax = shouldAnimate && animationConfig.enableParallax;

  // Get scroll progress relative to the element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to y position
  // Negative speed creates parallax effect (background moves slower)
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableParallax ? -100 * speed : 0]
  );

  // Wait for client-side mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Apply GPU acceleration hints (Requirement 7.1)
  useEffect(() => {
    const element = ref.current;
    if (!element || !enableParallax || !isMounted) return;

    // Apply will-change for scroll-based animations
    const style = applyWillChange(["transform"]);
    Object.assign(element.style, style);

    return () => {
      removeWillChange(element);
    };
  }, [enableParallax, isMounted]);

  // If reduced motion is enabled or device performance is low, don't apply parallax
  // Also render static version during SSR to prevent hydration mismatch
  if (!enableParallax || !isMounted) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
