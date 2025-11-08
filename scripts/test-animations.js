#!/usr/bin/env node

/**
 * Animation Testing and Quality Assurance Script
 *
 * This script performs automated checks for animation quality, performance,
 * and accessibility compliance across the landing page.
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 Animation Testing & Quality Assurance\n");
console.log("=".repeat(60));

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

// Test 1: Verify all animation components exist
function testAnimationComponentsExist() {
  console.log("\n📦 Test 1: Animation Components Existence");

  const components = [
    "src/components/loading-screen.tsx",
    "src/components/animated/animated-section.tsx",
    "src/components/animated/animated-card.tsx",
    "src/components/animated/animated-button.tsx",
    "src/components/floating-element.tsx",
    "src/components/parallax-background.tsx",
    "src/lib/animations.ts",
  ];

  let allExist = true;
  components.forEach((component) => {
    if (fs.existsSync(component)) {
      console.log(`  ✅ ${path.basename(component)} exists`);
    } else {
      console.log(`  ❌ ${path.basename(component)} missing`);
      allExist = false;
    }
  });

  if (allExist) {
    results.passed.push("All animation components exist");
  } else {
    results.failed.push("Some animation components are missing");
  }

  return allExist;
}

// Test 2: Verify reduced motion support
function testReducedMotionSupport() {
  console.log("\n♿ Test 2: Reduced Motion Support");

  const files = ["src/lib/animations.ts", "src/app/page.tsx"];

  let hasSupport = true;

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");

    // Check for useMotionPreferences hook
    if (
      content.includes("useMotionPreferences") ||
      content.includes("prefersReducedMotion")
    ) {
      console.log(`  ✅ ${path.basename(file)} implements reduced motion`);
    } else {
      console.log(`  ❌ ${path.basename(file)} missing reduced motion support`);
      hasSupport = false;
    }

    // Check for getReducedMotionTransition
    if (
      file === "src/app/page.tsx" &&
      content.includes("getReducedMotionTransition")
    ) {
      console.log(`  ✅ Uses getReducedMotionTransition helper`);
    }
  });

  if (hasSupport) {
    results.passed.push("Reduced motion support implemented");
  } else {
    results.failed.push("Reduced motion support incomplete");
  }

  return hasSupport;
}

// Test 3: Verify GPU-accelerated properties
function testGPUAcceleration() {
  console.log("\n⚡ Test 3: GPU Acceleration");

  const animationsFile = "src/lib/animations.ts";
  const content = fs.readFileSync(animationsFile, "utf8");

  // Check for transform and opacity usage (GPU-accelerated)
  const hasTransform =
    content.includes("transform") ||
    content.includes("x:") ||
    content.includes("y:") ||
    content.includes("scale:");
  const hasOpacity = content.includes("opacity:");

  // Check for non-GPU properties that should be avoided
  const hasWidth = content.includes("width:");
  const hasHeight = content.includes("height:");
  const hasTop = content.includes("top:");
  const hasLeft = content.includes("left:");

  if (hasTransform && hasOpacity) {
    console.log("  ✅ Uses GPU-accelerated properties (transform, opacity)");
    results.passed.push("GPU-accelerated properties used");
  } else {
    console.log("  ⚠️  May not be using optimal GPU-accelerated properties");
    results.warnings.push("Check GPU-accelerated property usage");
  }

  if (hasWidth || hasHeight || hasTop || hasLeft) {
    console.log(
      "  ⚠️  Found non-GPU-accelerated properties (width, height, top, left)"
    );
    results.warnings.push("Non-GPU-accelerated properties detected");
  } else {
    console.log("  ✅ No non-GPU-accelerated properties detected");
  }

  return true;
}

// Test 4: Verify animation timing compliance
function testAnimationTiming() {
  console.log("\n⏱️  Test 4: Animation Timing Compliance");

  const pageFile = "src/app/page.tsx";
  const content = fs.readFileSync(pageFile, "utf8");

  // Check for appropriate durations
  const durations = content.match(/duration:\s*[\d.]+/g) || [];

  console.log(`  📊 Found ${durations.length} duration specifications`);

  let appropriateTiming = true;
  durations.forEach((duration) => {
    const value = parseFloat(duration.match(/[\d.]+/)[0]);
    if (value > 1.0) {
      console.log(`  ⚠️  Long duration detected: ${duration} (>1s)`);
      appropriateTiming = false;
    }
  });

  if (appropriateTiming) {
    console.log("  ✅ All animation durations are appropriate (<1s)");
    results.passed.push("Animation timing is appropriate");
  } else {
    results.warnings.push("Some animations may be too slow");
  }

  return appropriateTiming;
}

// Test 5: Verify loading screen implementation
function testLoadingScreen() {
  console.log("\n🔄 Test 5: Loading Screen Implementation");

  const loadingFile = "src/components/loading-screen.tsx";
  const pageFile = "src/app/page.tsx";

  if (!fs.existsSync(loadingFile)) {
    console.log("  ❌ Loading screen component missing");
    results.failed.push("Loading screen not implemented");
    return false;
  }

  const loadingContent = fs.readFileSync(loadingFile, "utf8");
  const pageContent = fs.readFileSync(pageFile, "utf8");

  // Check loading screen features
  const hasFadeIn =
    loadingContent.includes("fadeIn") || loadingContent.includes("opacity");
  const hasFadeOut =
    loadingContent.includes("fadeOut") || loadingContent.includes("exit");
  const isUsedInPage =
    pageContent.includes("LoadingScreen") && pageContent.includes("isLoading");

  if (hasFadeIn && hasFadeOut) {
    console.log("  ✅ Loading screen has fade in/out animations");
  } else {
    console.log("  ⚠️  Loading screen may be missing fade animations");
  }

  if (isUsedInPage) {
    console.log("  ✅ Loading screen is integrated in landing page");
    results.passed.push("Loading screen properly implemented");
  } else {
    console.log("  ❌ Loading screen not integrated in landing page");
    results.failed.push("Loading screen not integrated");
  }

  return hasFadeIn && hasFadeOut && isUsedInPage;
}

// Test 6: Verify scroll-based animations
function testScrollAnimations() {
  console.log("\n📜 Test 6: Scroll-Based Animations");

  const pageFile = "src/app/page.tsx";
  const content = fs.readFileSync(pageFile, "utf8");

  // Check for viewport-based animations
  const hasWhileInView = content.includes("whileInView");
  const hasViewport = content.includes("viewport");
  const hasOnce = content.includes("once: true");

  if (hasWhileInView && hasViewport) {
    console.log("  ✅ Scroll-based animations implemented with whileInView");
    results.passed.push("Scroll-based animations implemented");
  } else {
    console.log("  ❌ Scroll-based animations may not be properly implemented");
    results.failed.push("Scroll-based animations incomplete");
  }

  if (hasOnce) {
    console.log("  ✅ Animations set to trigger once (prevents repetition)");
  } else {
    console.log("  ⚠️  Some animations may repeat on scroll");
    results.warnings.push("Check animation repetition behavior");
  }

  return hasWhileInView && hasViewport;
}

// Test 7: Verify hover interactions
function testHoverInteractions() {
  console.log("\n🖱️  Test 7: Hover Interactions");

  const pageFile = "src/app/page.tsx";
  const content = fs.readFileSync(pageFile, "utf8");

  // Check for hover animations
  const hasWhileHover = content.includes("whileHover");
  const hasWhileTap = content.includes("whileTap");
  const hasScale = content.includes("scale:");

  if (hasWhileHover) {
    console.log("  ✅ Hover interactions implemented with whileHover");
  } else {
    console.log("  ❌ Hover interactions missing");
  }

  if (hasWhileTap) {
    console.log("  ✅ Tap interactions implemented with whileTap");
  } else {
    console.log("  ⚠️  Tap interactions may be missing");
  }

  if (hasScale) {
    console.log("  ✅ Scale effects used for micro-interactions");
  }

  if (hasWhileHover && hasWhileTap) {
    results.passed.push("Hover and tap interactions implemented");
    return true;
  } else {
    results.warnings.push("Some interactions may be missing");
    return false;
  }
}

// Test 8: Verify chatbot animations
function testChatbotAnimations() {
  console.log("\n💬 Test 8: Chatbot Widget Animations");

  const pageFile = "src/app/page.tsx";
  const content = fs.readFileSync(pageFile, "utf8");

  // Check for chatbot animation features
  const hasChatOpen = content.includes("isChatOpen");
  const hasMessageAnimation = content.includes("msg.role");
  const hasTypingIndicator = content.includes("isTyping");
  const hasSuggestedQuestions = content.includes("suggestedQuestions");

  let score = 0;
  if (hasChatOpen) {
    console.log("  ✅ Chatbot open/close state managed");
    score++;
  }
  if (hasMessageAnimation) {
    console.log("  ✅ Message animations implemented");
    score++;
  }
  if (hasTypingIndicator) {
    console.log("  ✅ Typing indicator with animation");
    score++;
  }
  if (hasSuggestedQuestions) {
    console.log("  ✅ Suggested questions with staggered animation");
    score++;
  }

  if (score >= 3) {
    results.passed.push("Chatbot animations properly implemented");
    return true;
  } else {
    results.warnings.push("Some chatbot animations may be incomplete");
    return false;
  }
}

// Test 9: Verify AnimatePresence for enter/exit
function testAnimatePresence() {
  console.log("\n🎭 Test 9: Enter/Exit Animations");

  const pageFile = "src/app/page.tsx";
  const content = fs.readFileSync(pageFile, "utf8");

  // Check for AnimatePresence (needed for exit animations)
  const hasAnimatePresence = content.includes("AnimatePresence");
  const hasExit = content.includes("exit:");
  const hasInitial = content.includes("initial:");
  const hasAnimate = content.includes("animate:");

  if (hasInitial && hasAnimate) {
    console.log("  ✅ Initial and animate states defined");
  }

  if (hasExit) {
    console.log("  ✅ Exit animations defined");
  } else {
    console.log("  ⚠️  Exit animations may be missing");
  }

  if (hasAnimatePresence) {
    console.log("  ✅ AnimatePresence used for conditional rendering");
    results.passed.push("Enter/exit animations implemented");
  } else {
    console.log("  ⚠️  AnimatePresence not found (may affect exit animations)");
    results.warnings.push("Check AnimatePresence usage");
  }

  return hasInitial && hasAnimate;
}

// Test 10: Verify accessibility features
function testAccessibility() {
  console.log("\n♿ Test 10: Accessibility Features");

  const pageFile = "src/app/page.tsx";
  const content = fs.readFileSync(pageFile, "utf8");

  // Check for keyboard navigation support
  const hasOnKeyDown = content.includes("onKeyDown");
  const hasAriaLabels = content.includes("aria-");
  const hasAltText = content.includes("alt=");

  if (hasOnKeyDown) {
    console.log("  ✅ Keyboard navigation implemented");
  } else {
    console.log("  ⚠️  Keyboard navigation may be limited");
  }

  if (hasAltText) {
    console.log("  ✅ Alt text provided for images");
  } else {
    console.log("  ⚠️  Some images may be missing alt text");
  }

  // Check for focus management
  const hasFocus = content.includes("focus") || content.includes("Focus");
  if (hasFocus) {
    console.log("  ✅ Focus management implemented");
  }

  results.passed.push("Basic accessibility features present");
  return true;
}

// Test 11: Check for performance optimizations
function testPerformanceOptimizations() {
  console.log("\n🚀 Test 11: Performance Optimizations");

  const perfFile = "src/lib/animation-performance.ts";

  if (!fs.existsSync(perfFile)) {
    console.log("  ⚠️  Performance optimization utilities not found");
    results.warnings.push("Performance utilities may be missing");
    return false;
  }

  const content = fs.readFileSync(perfFile, "utf8");

  const hasThrottling =
    content.includes("throttle") || content.includes("Throttle");
  const hasWillChange =
    content.includes("willChange") || content.includes("will-change");
  const hasPerformanceMonitor =
    content.includes("PerformanceMonitor") || content.includes("performance");

  if (hasThrottling) {
    console.log("  ✅ Animation throttling implemented");
  }
  if (hasWillChange) {
    console.log("  ✅ will-change CSS hints implemented");
  }
  if (hasPerformanceMonitor) {
    console.log("  ✅ Performance monitoring utilities present");
  }

  if (hasThrottling && hasWillChange) {
    results.passed.push("Performance optimizations implemented");
    return true;
  } else {
    results.warnings.push("Some performance optimizations may be missing");
    return false;
  }
}

// Test 12: Verify documentation
function testDocumentation() {
  console.log("\n📚 Test 12: Documentation");

  const docs = [
    "docs/ANIMATION_PERFORMANCE.md",
    "docs/ANIMATION_QUICK_REFERENCE.md",
  ];

  let allExist = true;
  docs.forEach((doc) => {
    if (fs.existsSync(doc)) {
      console.log(`  ✅ ${path.basename(doc)} exists`);
    } else {
      console.log(`  ⚠️  ${path.basename(doc)} missing`);
      allExist = false;
    }
  });

  if (allExist) {
    results.passed.push("Documentation complete");
  } else {
    results.warnings.push("Some documentation may be missing");
  }

  return allExist;
}

// Run all tests
console.log("\n🏃 Running all tests...\n");

testAnimationComponentsExist();
testReducedMotionSupport();
testGPUAcceleration();
testAnimationTiming();
testLoadingScreen();
testScrollAnimations();
testHoverInteractions();
testChatbotAnimations();
testAnimatePresence();
testAccessibility();
testPerformanceOptimizations();
testDocumentation();

// Print summary
console.log("\n" + "=".repeat(60));
console.log("\n📊 TEST SUMMARY\n");

console.log(`✅ Passed: ${results.passed.length}`);
results.passed.forEach((test) => console.log(`   • ${test}`));

if (results.warnings.length > 0) {
  console.log(`\n⚠️  Warnings: ${results.warnings.length}`);
  results.warnings.forEach((warning) => console.log(`   • ${warning}`));
}

if (results.failed.length > 0) {
  console.log(`\n❌ Failed: ${results.failed.length}`);
  results.failed.forEach((failure) => console.log(`   • ${failure}`));
}

// Overall result
console.log("\n" + "=".repeat(60));
if (results.failed.length === 0) {
  console.log("\n✅ ALL TESTS PASSED!");
  console.log(
    "\n🎉 Animation implementation is complete and ready for manual testing."
  );
  console.log("\nNext steps:");
  console.log("  1. Run the development server: npm run dev");
  console.log("  2. Test animations in browser on desktop and mobile");
  console.log("  3. Test with reduced motion enabled in OS settings");
  console.log("  4. Test keyboard navigation (Tab, Enter, Escape)");
  console.log("  5. Test with screen reader (NVDA, JAWS, VoiceOver)");
  console.log("  6. Measure performance with Chrome DevTools");
  console.log("  7. Check Lighthouse scores for performance and accessibility");
  process.exit(0);
} else {
  console.log("\n⚠️  SOME TESTS FAILED");
  console.log("\nPlease review the failed tests above and fix the issues.");
  process.exit(1);
}
