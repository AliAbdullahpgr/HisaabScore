"use client";

import { ReactNode } from "react";
import { useDeferredAnimation } from "@/lib/animation-performance";

interface DeferredAnimationWrapperProps {
  children: ReactNode;
  delay?: number;
  fallback?: ReactNode;
}

/**
 * DeferredAnimationWrapper Component
 *
 * Defers rendering of non-critical animations until after initial render.
 * This improves initial page load performance.
 *
 * Requirement 7.4
 */
export function DeferredAnimationWrapper({
  children,
  delay = 100,
  fallback = null,
}: DeferredAnimationWrapperProps) {
  const shouldRender = useDeferredAnimation(delay);

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
