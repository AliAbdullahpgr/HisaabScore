#!/usr/bin/env node

/**
 * Performance Measurement Script
 *
 * This script provides guidance for measuring animation performance
 * and includes automated checks where possible.
 */

console.log("📊 Animation Performance Measurement Guide\n");
console.log("=".repeat(70));

console.log(`
This script provides instructions for measuring animation performance.
Some checks are automated, while others require manual testing in the browser.

`);

// Automated Checks
console.log("🤖 AUTOMATED CHECKS\n");

const fs = require("fs");

// Check 1: Verify GPU-accelerated properties
console.log("1. GPU-Accelerated Properties Check");
console.log("   Analyzing animation code for GPU-friendly properties...\n");

const animationsFile = "src/lib/animations.ts";
const pageFile = "src/app/page.tsx";

if (fs.existsSync(animationsFile)) {
  const content = fs.readFileSync(animationsFile, "utf8");

  // Count GPU-accelerated properties
  const transformCount = (
    content.match(/transform|translateX|translateY|scale|rotate/gi) || []
  ).length;
  const opacityCount = (content.match(/opacity:/gi) || []).length;

  // Count non-GPU properties (should be minimal)
  const widthCount = (content.match(/width:/gi) || []).length;
  const heightCount = (content.match(/height:/gi) || []).length;
  const topCount = (content.match(/top:/gi) || []).length;
  const leftCount = (content.match(/left:/gi) || []).length;

  console.log(`   ✅ GPU-accelerated properties found:`);
  console.log(`      • transform/translate/scale/rotate: ${transformCount}`);
  console.log(`      • opacity: ${opacityCount}`);

  if (widthCount + heightCount + topCount + leftCount > 0) {
    console.log(`   ⚠️  Non-GPU properties found (may impact performance):`);
    console.log(`      • width: ${widthCount}`);
    console.log(`      • height: ${heightCount}`);
    console.log(`      • top: ${topCount}`);
    console.log(`      • left: ${leftCount}`);
  } else {
    console.log(`   ✅ No non-GPU properties detected`);
  }
}

console.log("\n" + "-".repeat(70) + "\n");

// Check 2: Animation duration analysis
console.log("2. Animation Duration Analysis");
console.log("   Analyzing animation timing configurations...\n");

if (fs.existsSync(pageFile)) {
  const content = fs.readFileSync(pageFile, "utf8");

  // Extract all duration values
  const durationMatches = content.match(/duration:\s*[\d.]+/g) || [];
  const durations = durationMatches.map((d) =>
    parseFloat(d.match(/[\d.]+/)[0])
  );

  if (durations.length > 0) {
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    console.log(`   📊 Duration Statistics:`);
    console.log(`      • Total animations with duration: ${durations.length}`);
    console.log(`      • Average duration: ${avgDuration.toFixed(3)}s`);
    console.log(`      • Min duration: ${minDuration}s`);
    console.log(`      • Max duration: ${maxDuration}s`);

    if (maxDuration > 1.0) {
      console.log(`   ⚠️  Some animations exceed 1 second (may feel slow)`);
    } else {
      console.log(`   ✅ All animations are under 1 second`);
    }

    if (avgDuration < 0.5) {
      console.log(`   ✅ Average duration is snappy (< 0.5s)`);
    }
  }
}

console.log("\n" + "-".repeat(70) + "\n");

// Check 3: Reduced motion implementation
console.log("3. Reduced Motion Implementation Check");
console.log("   Verifying accessibility support...\n");

if (fs.existsSync(animationsFile)) {
  const content = fs.readFileSync(animationsFile, "utf8");

  const hasUseMotionPreferences = content.includes("useMotionPreferences");
  const hasGetReducedMotion = content.includes("getReducedMotionTransition");
  const hasPrefersReducedMotion = content.includes("prefersReducedMotion");

  if (hasUseMotionPreferences) {
    console.log(`   ✅ useMotionPreferences hook implemented`);
  }
  if (hasGetReducedMotion) {
    console.log(`   ✅ getReducedMotionTransition helper implemented`);
  }
  if (hasPrefersReducedMotion) {
    console.log(`   ✅ prefersReducedMotion detection present`);
  }

  if (hasUseMotionPreferences && hasGetReducedMotion) {
    console.log(`   ✅ Reduced motion support is comprehensive`);
  } else {
    console.log(`   ⚠️  Reduced motion support may be incomplete`);
  }
}

console.log("\n" + "=".repeat(70) + "\n");

// Manual Testing Instructions
console.log("🧪 MANUAL TESTING REQUIRED\n");

console.log(`
The following tests must be performed manually in the browser:

1. FRAME RATE MEASUREMENT
   ────────────────────────────────────────────────────────────────
   
   Steps:
   a) Open Chrome DevTools (F12)
   b) Press Cmd/Ctrl+Shift+P to open command palette
   c) Type "Show frames per second (FPS) meter"
   d) Enable the FPS meter
   e) Interact with the page (scroll, hover, click)
   
   Expected Results:
   • FPS should stay at or near 60fps during all animations
   • No significant drops below 50fps
   • Smooth visual experience
   
   ────────────────────────────────────────────────────────────────

2. CUMULATIVE LAYOUT SHIFT (CLS) MEASUREMENT
   ────────────────────────────────────────────────────────────────
   
   Method 1: Chrome DevTools Performance Tab
   a) Open DevTools > Performance tab
   b) Click Record
   c) Load the page and scroll through it
   d) Stop recording
   e) Look for "Experience" section in the timeline
   f) Check for Layout Shift events
   
   Method 2: Lighthouse
   a) Open DevTools > Lighthouse tab
   b) Select "Performance" category
   c) Click "Generate report"
   d) Check CLS score in the metrics
   
   Expected Results:
   • CLS score < 0.1 (Good)
   • No unexpected layout shifts during page load
   • No layout shifts during animations
   
   ────────────────────────────────────────────────────────────────

3. LIGHTHOUSE PERFORMANCE AUDIT
   ────────────────────────────────────────────────────────────────
   
   Steps:
   a) Open Chrome DevTools (F12)
   b) Go to Lighthouse tab
   c) Select categories: Performance, Accessibility, Best Practices
   d) Click "Generate report"
   
   Target Scores:
   • Performance: 90+ (Green)
   • Accessibility: 95+ (Green)
   • Best Practices: 90+ (Green)
   
   Key Metrics:
   • First Contentful Paint (FCP): < 1.8s
   • Largest Contentful Paint (LCP): < 2.5s
   • Cumulative Layout Shift (CLS): < 0.1
   • Time to Interactive (TTI): < 3.8s
   • Total Blocking Time (TBT): < 200ms
   
   ────────────────────────────────────────────────────────────────

4. GPU ACCELERATION VERIFICATION
   ────────────────────────────────────────────────────────────────
   
   Steps:
   a) Open Chrome DevTools (F12)
   b) Go to More Tools > Layers
   c) Interact with animated elements
   d) Check if elements are promoted to their own layers
   
   Expected Results:
   • Animated elements should be on separate layers
   • Look for "Compositing Reasons" in layer details
   • Should see "will-change" or "transform" as reasons
   
   ────────────────────────────────────────────────────────────────

5. ANIMATION TIMING VERIFICATION
   ────────────────────────────────────────────────────────────────
   
   Steps:
   a) Open Chrome DevTools (F12)
   b) Go to Performance tab
   c) Click Record
   d) Trigger specific animations (scroll, hover, etc.)
   e) Stop recording
   f) Analyze animation frames in timeline
   
   Check:
   • Header fade-down: ~300ms
   • Hero stagger: ~100ms between elements
   • Scroll animations: ~400-600ms
   • Hover effects: ~200ms
   • Chatbot open/close: ~300ms
   • Message animations: ~200ms
   
   ────────────────────────────────────────────────────────────────

6. REDUCED MOTION TESTING
   ────────────────────────────────────────────────────────────────
   
   Enable Reduced Motion:
   
   Windows:
   • Settings > Ease of Access > Display
   • Turn OFF "Show animations in Windows"
   
   macOS:
   • System Preferences > Accessibility > Display
   • Check "Reduce motion"
   
   Linux:
   • Settings > Universal Access
   • Enable "Reduce Animation"
   
   Then:
   a) Reload the page
   b) Verify all animations still work but are faster
   c) Check that parallax and floating effects are disabled
   d) Ensure functionality is not broken
   
   Expected Results:
   • Animations complete in < 50ms
   • No scale or rotation effects
   • Opacity transitions only
   • All features still functional
   
   ────────────────────────────────────────────────────────────────

7. MOBILE PERFORMANCE TESTING
   ────────────────────────────────────────────────────────────────
   
   Method 1: Chrome DevTools Device Emulation
   a) Open DevTools (F12)
   b) Click device toolbar icon (Ctrl+Shift+M)
   c) Select mobile device (e.g., iPhone 12, Pixel 5)
   d) Test animations and interactions
   
   Method 2: Real Device Testing
   a) Access the dev server from mobile device
   b) Test all animations and interactions
   c) Monitor for performance issues
   
   Check:
   • Smooth scrolling
   • Responsive touch interactions
   • No jank or stuttering
   • Acceptable battery usage
   
   ────────────────────────────────────────────────────────────────

8. MEMORY USAGE MONITORING
   ────────────────────────────────────────────────────────────────
   
   Steps:
   a) Open Chrome DevTools (F12)
   b) Go to Memory tab
   c) Take heap snapshot before interactions
   d) Interact with page (scroll, open chatbot, etc.)
   e) Take another heap snapshot
   f) Compare memory usage
   
   Expected Results:
   • No significant memory leaks
   • Memory usage should stabilize
   • No continuous memory growth
   
   ────────────────────────────────────────────────────────────────

9. NETWORK THROTTLING TEST
   ────────────────────────────────────────────────────────────────
   
   Steps:
   a) Open DevTools > Network tab
   b) Set throttling to "Slow 3G"
   c) Reload the page
   d) Observe loading screen and animations
   
   Expected Results:
   • Loading screen appears and persists appropriately
   • Animations don't start before content loads
   • No broken animations due to delayed resources
   • Graceful degradation
   
   ────────────────────────────────────────────────────────────────

10. KEYBOARD NAVIGATION PERFORMANCE
    ────────────────────────────────────────────────────────────────
    
    Steps:
    a) Use Tab key to navigate through page
    b) Monitor FPS during focus transitions
    c) Check for smooth focus indicator animations
    
    Expected Results:
    • No FPS drops during keyboard navigation
    • Focus transitions are smooth
    • No lag when tabbing through elements
    
    ────────────────────────────────────────────────────────────────

`);

console.log("=".repeat(70) + "\n");

console.log("📋 PERFORMANCE TESTING CHECKLIST\n");

console.log(`
Copy this checklist and mark items as you test:

Desktop Performance:
[ ] Frame rate stays at 60fps during scroll
[ ] Frame rate stays at 60fps during hover interactions
[ ] Frame rate stays at 60fps during chatbot animations
[ ] No layout shifts during page load (CLS < 0.1)
[ ] No layout shifts during animations
[ ] Lighthouse Performance score > 90
[ ] Lighthouse Accessibility score > 95
[ ] GPU acceleration is active for animations
[ ] Animation timings match specifications

Mobile Performance:
[ ] Smooth animations on mobile devices
[ ] No jank or stuttering
[ ] Touch interactions work correctly
[ ] Acceptable battery usage
[ ] Responsive at 375px viewport width

Accessibility:
[ ] Reduced motion preferences respected
[ ] Animations work with reduced motion enabled
[ ] Keyboard navigation is smooth
[ ] Screen reader compatible
[ ] Focus indicators visible during animations

Network Conditions:
[ ] Works on slow 3G connection
[ ] Loading screen behaves correctly
[ ] No broken animations on slow network
[ ] Graceful degradation

Memory & Resources:
[ ] No memory leaks detected
[ ] Memory usage stabilizes
[ ] No continuous memory growth
[ ] Reasonable resource usage

`);

console.log("=".repeat(70) + "\n");

console.log("✅ NEXT STEPS\n");

console.log(`
1. Run the automated test script:
   node scripts/test-animations.js

2. Start the development server:
   npm run dev

3. Open http://localhost:9003 in Chrome

4. Follow the manual testing instructions above

5. Use the manual testing checklist:
   docs/MANUAL_TESTING_CHECKLIST.md

6. Document any issues found

7. Re-test after fixes

8. Get sign-off from stakeholders

`);

console.log("=".repeat(70) + "\n");

console.log("📚 Additional Resources:\n");
console.log(
  "  • Chrome DevTools Performance: https://developer.chrome.com/docs/devtools/performance/"
);
console.log("  • Lighthouse: https://developer.chrome.com/docs/lighthouse/");
console.log("  • Web Vitals: https://web.dev/vitals/");
console.log(
  "  • Framer Motion Performance: https://www.framer.com/motion/guide-reduce-bundle-size/"
);
console.log("\n");
