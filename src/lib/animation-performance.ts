/**
 * Animation Performance Utilities
 *
 * Provides utilities for optimizing animation performance including:
 * - Animation throttling to limit concurrent animations
 * - GPU acceleration verification
 * - Performance monitoring
 * - Deferred animation loading
 *
 * Requirements: 7.1, 7.2, 7.4, 7.5
 */

/**
 * Animation Throttle Manager
 *
 * Limits the number of concurrent animations to prevent performance issues.
 * Queues animations when the limit is reached and executes them when slots become available.
 */
class AnimationThrottleManager {
  private activeAnimations = 0;
  private readonly maxConcurrentAnimations = 10; // Requirement 7.2
  private queue: Array<() => void> = [];

  /**
   * Request permission to start an animation
   * Returns a promise that resolves when the animation can start
   */
  async requestAnimation(): Promise<() => void> {
    if (this.activeAnimations < this.maxConcurrentAnimations) {
      this.activeAnimations++;
      return () => this.releaseAnimation();
    }

    // Queue the animation if limit is reached
    return new Promise((resolve) => {
      this.queue.push(() => {
        this.activeAnimations++;
        resolve(() => this.releaseAnimation());
      });
    });
  }

  /**
   * Release an animation slot
   */
  private releaseAnimation(): void {
    this.activeAnimations--;

    // Process queue if there are waiting animations
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) {
        next();
      }
    }
  }

  /**
   * Get current animation count
   */
  getActiveCount(): number {
    return this.activeAnimations;
  }

  /**
   * Check if animations can be started immediately
   */
  canStartImmediately(): boolean {
    return this.activeAnimations < this.maxConcurrentAnimations;
  }
}

// Singleton instance
export const animationThrottle = new AnimationThrottleManager();

/**
 * GPU-Accelerated Properties
 *
 * List of CSS properties that are GPU-accelerated and should be used for animations.
 * Requirement 7.1
 */
export const GPU_ACCELERATED_PROPERTIES = [
  "transform",
  "opacity",
  "filter",
] as const;

/**
 * Non-GPU-Accelerated Properties
 *
 * Properties that should be avoided in animations as they trigger layout/paint
 */
export const NON_GPU_PROPERTIES = [
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "margin",
  "padding",
] as const;

/**
 * Verify if animation properties are GPU-accelerated
 *
 * @param properties - Object containing animation properties
 * @returns Object with validation result and warnings
 */
export function verifyGPUAcceleration(properties: Record<string, any>): {
  isOptimized: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  let isOptimized = true;

  for (const prop of Object.keys(properties)) {
    if (NON_GPU_PROPERTIES.includes(prop as any)) {
      warnings.push(
        `Property "${prop}" is not GPU-accelerated and may cause performance issues`
      );
      isOptimized = false;
    }
  }

  return { isOptimized, warnings };
}

/**
 * Performance Monitor
 *
 * Monitors frame rate during animations to ensure 60fps target
 * Requirement 7.5
 */
class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private isMonitoring = false;
  private animationFrameId: number | null = null;

  /**
   * Start monitoring frame rate
   */
  startMonitoring(): void {
    if (this.isMonitoring || typeof window === "undefined") return;

    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frameCount = 0;

    const measureFrame = (currentTime: number) => {
      this.frameCount++;

      const elapsed = currentTime - this.lastTime;

      // Calculate FPS every second
      if (elapsed >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastTime = currentTime;

        // Log warning if FPS drops below 60
        if (this.fps < 60 && process.env.NODE_ENV === "development") {
          console.warn(`Animation FPS dropped to ${this.fps}`);
        }
      }

      if (this.isMonitoring) {
        this.animationFrameId = requestAnimationFrame(measureFrame);
      }
    };

    this.animationFrameId = requestAnimationFrame(measureFrame);
  }

  /**
   * Stop monitoring frame rate
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return this.fps;
  }

  /**
   * Check if performance is acceptable (>= 60fps)
   */
  isPerformanceAcceptable(): boolean {
    return this.fps >= 60;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Deferred Animation Hook
 *
 * Defers non-critical animations until after initial render
 * Requirement 7.4
 */
export function useDeferredAnimation(delay: number = 100): boolean {
  if (typeof window === "undefined") return false;

  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  React.useEffect(() => {
    // Defer animation until after initial render
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldAnimate;
}

// Import React for the hook
import React from "react";

/**
 * Device Performance Detection
 *
 * Detects device performance capabilities to adjust animation complexity
 * Requirement 7.5
 */
export function detectDevicePerformance(): "high" | "medium" | "low" {
  if (typeof window === "undefined") return "high";

  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;

  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;

  // Check for connection type (if available)
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || "4g";

  // Determine performance tier
  if (cores >= 8 && memory >= 8 && effectiveType === "4g") {
    return "high";
  } else if (cores >= 4 && memory >= 4) {
    return "medium";
  } else {
    return "low";
  }
}

/**
 * Get optimized animation config based on device performance
 */
export function getOptimizedAnimationConfig(
  devicePerformance: "high" | "medium" | "low"
): {
  enableComplexAnimations: boolean;
  enableParallax: boolean;
  enableFloating: boolean;
  maxConcurrentAnimations: number;
} {
  switch (devicePerformance) {
    case "high":
      return {
        enableComplexAnimations: true,
        enableParallax: true,
        enableFloating: true,
        maxConcurrentAnimations: 10,
      };
    case "medium":
      return {
        enableComplexAnimations: true,
        enableParallax: false,
        enableFloating: true,
        maxConcurrentAnimations: 6,
      };
    case "low":
      return {
        enableComplexAnimations: false,
        enableParallax: false,
        enableFloating: false,
        maxConcurrentAnimations: 3,
      };
  }
}

/**
 * Apply will-change CSS hint for GPU acceleration
 *
 * @param properties - Array of properties that will be animated
 * @returns CSS style object with will-change hint
 */
export function applyWillChange(properties: string[]): React.CSSProperties {
  return {
    willChange: properties.join(", "),
  };
}

/**
 * Remove will-change hint after animation completes
 *
 * @param element - DOM element to remove will-change from
 */
export function removeWillChange(element: HTMLElement | null): void {
  if (element) {
    element.style.willChange = "auto";
  }
}
