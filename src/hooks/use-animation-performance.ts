"use client";

import { useEffect, useState } from "react";
import {
  performanceMonitor,
  detectDevicePerformance,
  getOptimizedAnimationConfig,
} from "@/lib/animation-performance";

/**
 * Hook for monitoring animation performance
 *
 * Provides real-time FPS monitoring and device performance detection
 * Requirement 7.5
 */
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const [devicePerformance, setDevicePerformance] = useState<
    "high" | "medium" | "low"
  >("high");
  const [animationConfig, setAnimationConfig] = useState(
    getOptimizedAnimationConfig("high")
  );

  useEffect(() => {
    // Detect device performance on mount
    const performance = detectDevicePerformance();
    setDevicePerformance(performance);
    setAnimationConfig(getOptimizedAnimationConfig(performance));

    // Start monitoring FPS in development mode
    if (process.env.NODE_ENV === "development") {
      performanceMonitor.startMonitoring();

      // Update FPS every second
      const interval = setInterval(() => {
        setFps(performanceMonitor.getCurrentFPS());
      }, 1000);

      return () => {
        clearInterval(interval);
        performanceMonitor.stopMonitoring();
      };
    }
  }, []);

  return {
    fps,
    devicePerformance,
    animationConfig,
    isPerformanceAcceptable: fps >= 60,
  };
}
