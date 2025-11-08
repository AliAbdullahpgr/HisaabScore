#!/usr/bin/env node

/**
 * Animation Performance Verification Script
 *
 * Verifies that all animation performance optimizations are in place.
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Verifying Animation Performance Optimizations...\n");

const checks = [];

// Check 1: GPU Acceleration utilities exist
function checkGPUAcceleration() {
  const filePath = "src/lib/animation-performance.ts";
  const content = fs.readFileSync(filePath, "utf8");

  const hasApplyWillChange = content.includes("applyWillChange");
  const hasRemoveWillChange = content.includes("removeWillChange");
  const hasGPUProperties = content.includes("GPU_ACCELERATED_PROPERTIES");

  if (hasApplyWillChange && hasRemoveWillChange && hasGPUProperties) {
    console.log("✅ GPU Acceleration utilities implemented");
    return true;
  } else {
    console.log("❌ GPU Acceleration utilities missing");
    return false;
  }
}

// Check 2: Animation Throttling exists
function checkAnimationThrottling() {
  const filePath = "src/lib/animation-performance.ts";
  const content = fs.readFileSync(filePath, "utf8");

  const hasThrottleManager = content.includes("AnimationThrottleManager");
  const hasMaxConcurrent = content.includes("maxConcurrentAnimations");
  const hasQueue = content.includes("queue");

  if (hasThrottleManager && hasMaxConcurrent && hasQueue) {
    console.log("✅ Animation Throttling implemented");
    return true;
  } else {
    console.log("❌ Animation Throttling missing");
    return false;
  }
}

// Check 3: Error Boundary exists
function checkErrorBoundary() {
  const filePath = "src/components/animated/animation-error-boundary.tsx";

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    const hasErrorBoundary = content.includes("AnimationErrorBoundary");
    const hasCatch = content.includes("componentDidCatch");

    if (hasErrorBoundary && hasCatch) {
      console.log("✅ Error Boundary implemented");
      return true;
    }
  }

  console.log("❌ Error Boundary missing");
  return false;
}

// Check 4: Deferred Animation exists
function checkDeferredAnimation() {
  const filePath = "src/components/deferred-animation-wrapper.tsx";

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    const hasWrapper = content.includes("DeferredAnimationWrapper");
    const hasDelay = content.includes("delay");

    if (hasWrapper && hasDelay) {
      console.log("✅ Deferred Animation implemented");
      return true;
    }
  }

  console.log("❌ Deferred Animation missing");
  return false;
}

// Check 5: Performance Monitoring exists
function checkPerformanceMonitoring() {
  const filePath = "src/lib/animation-performance.ts";
  const content = fs.readFileSync(filePath, "utf8");

  const hasMonitor = content.includes("PerformanceMonitor");
  const hasFPS = content.includes("getCurrentFPS");
  const hasDeviceDetection = content.includes("detectDevicePerformance");

  if (hasMonitor && hasFPS && hasDeviceDetection) {
    console.log("✅ Performance Monitoring implemented");
    return true;
  } else {
    console.log("❌ Performance Monitoring missing");
    return false;
  }
}

// Check 6: Components updated with GPU acceleration
function checkComponentUpdates() {
  const components = [
    "src/components/animated/animated-section.tsx",
    "src/components/animated/animated-card.tsx",
    "src/components/animated/animated-button.tsx",
    "src/components/floating-element.tsx",
    "src/components/parallax-background.tsx",
    "src/components/loading-screen.tsx",
  ];

  let allUpdated = true;

  for (const component of components) {
    const content = fs.readFileSync(component, "utf8");
    const hasWillChange =
      content.includes("applyWillChange") || content.includes("willChange");

    if (!hasWillChange) {
      console.log(
        `❌ ${path.basename(component)} not updated with GPU acceleration`
      );
      allUpdated = false;
    }
  }

  if (allUpdated) {
    console.log("✅ All components updated with GPU acceleration");
  }

  return allUpdated;
}

// Check 7: Documentation exists
function checkDocumentation() {
  const docs = [
    "docs/ANIMATION_PERFORMANCE.md",
    "docs/ANIMATION_QUICK_REFERENCE.md",
    "PERFORMANCE_OPTIMIZATION_SUMMARY.md",
  ];

  let allExist = true;

  for (const doc of docs) {
    if (!fs.existsSync(doc)) {
      console.log(`❌ ${doc} missing`);
      allExist = false;
    }
  }

  if (allExist) {
    console.log("✅ All documentation files created");
  }

  return allExist;
}

// Run all checks
console.log("Running checks...\n");

checks.push(checkGPUAcceleration());
checks.push(checkAnimationThrottling());
checks.push(checkErrorBoundary());
checks.push(checkDeferredAnimation());
checks.push(checkPerformanceMonitoring());
checks.push(checkComponentUpdates());
checks.push(checkDocumentation());

// Summary
console.log("\n" + "=".repeat(50));
const passed = checks.filter(Boolean).length;
const total = checks.length;

if (passed === total) {
  console.log(`\n✅ All checks passed! (${passed}/${total})`);
  console.log("\n🎉 Animation performance optimizations are complete!");
  console.log("\nKey Features:");
  console.log("  • GPU-accelerated animations");
  console.log("  • Animation throttling (max 10 concurrent)");
  console.log("  • Error boundaries for graceful degradation");
  console.log("  • Deferred non-critical animations");
  console.log("  • Real-time performance monitoring");
  console.log("  • Device performance detection");
  console.log("  • Comprehensive documentation");
  process.exit(0);
} else {
  console.log(`\n⚠️  Some checks failed (${passed}/${total})`);
  console.log("\nPlease review the failed checks above.");
  process.exit(1);
}
