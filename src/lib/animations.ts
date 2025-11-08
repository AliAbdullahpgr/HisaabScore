import { useEffect, useState } from "react";
import { Transition, Variants } from "framer-motion";

/**
 * Animation Variants
 * Reusable animation configurations for consistent motion across the app
 */

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

/**
 * Transition Configurations
 * Predefined transition settings for different animation types
 */

export const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
};

export const smoothTransition: Transition = {
  duration: 0.3,
  ease: "easeOut",
};

/**
 * Stagger Container Configuration
 * Used for animating multiple children with delays
 */

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Motion Preferences Hook
 * Detects user's reduced motion preferences for accessibility
 */

export interface MotionPreferences {
  prefersReducedMotion: boolean;
  shouldAnimate: boolean;
}

export function useMotionPreferences(): MotionPreferences {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === "undefined") {
      return;
    }

    // Create media query to detect reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add event listener (using deprecated addListener for broader compatibility)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return {
    prefersReducedMotion,
    shouldAnimate: !prefersReducedMotion,
  };
}

/**
 * Helper function to get reduced motion transition
 * Returns minimal transition when reduced motion is preferred
 */

export function getReducedMotionTransition(
  prefersReducedMotion: boolean,
  normalTransition: Transition = smoothTransition
): Transition {
  if (prefersReducedMotion) {
    return { duration: 0.05 }; // 50ms or less as per requirements
  }
  return normalTransition;
}

/**
 * Helper function to get reduced motion variants
 * Simplifies animations to opacity-only when reduced motion is preferred
 */

export function getReducedMotionVariants(
  prefersReducedMotion: boolean,
  normalVariants: Variants
): Variants {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  return normalVariants;
}
