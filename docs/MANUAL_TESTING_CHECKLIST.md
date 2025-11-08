# Manual Testing Checklist for Landing Page Animations

This document provides a comprehensive checklist for manually testing all animations, interactions, and accessibility features on the HisaabScore landing page.

## Prerequisites

- Development server running (`npm run dev`)
- Access to multiple browsers (Chrome, Firefox, Safari, Edge)
- Mobile device or browser DevTools device emulation
- Screen reader software (NVDA, JAWS, or VoiceOver)
- Chrome DevTools for performance measurement

---

## 1. Desktop Animation Testing

### 1.1 Initial Page Load Animations

- [ ] **Loading Screen**

  - [ ] Loading screen appears immediately on page load
  - [ ] Loading spinner/logo is visible and animated
  - [ ] Loading screen fades out smoothly after ~1 second
  - [ ] Loading screen doesn't persist longer than 2 seconds
  - [ ] Page content appears after loading screen disappears

- [ ] **Header Animation**

  - [ ] Header fades down from top within 300ms
  - [ ] Navigation links are visible and properly positioned
  - [ ] Logo and buttons appear correctly

- [ ] **Hero Section Staggered Animations**
  - [ ] Badge appears first (fade + scale)
  - [ ] Heading appears second (fade + slide up) ~100ms after badge
  - [ ] Description appears third (fade + slide up) ~200ms after badge
  - [ ] Buttons appear fourth (fade + slide up) ~300ms after badge
  - [ ] Statistics appear last (scale in) ~400ms after badge
  - [ ] Each statistic has internal stagger (~100ms between them)
  - [ ] Hero image has floating animation (subtle up/down motion)
  - [ ] All animations complete within 1000ms total

### 1.2 Scroll-Based Animations

- [ ] **How It Works Section**

  - [ ] Section header fades in when scrolled into view
  - [ ] Three step cards slide up with stagger (50-100ms between)
  - [ ] Step number badges scale in with bounce effect
  - [ ] Animations trigger only once (don't repeat on scroll up/down)

- [ ] **Features Section**

  - [ ] Feature 1 slides in from left
  - [ ] Feature 1 image slides in from right
  - [ ] Feature 2 layout is reversed (image left, text right)
  - [ ] Feature 2 slides in from opposite directions
  - [ ] Feature 3 follows same pattern as Feature 1
  - [ ] Checkmark list items fade in with stagger
  - [ ] Feature images have floating animation

- [ ] **Testimonials Section**

  - [ ] Section header fades in when in viewport
  - [ ] Three testimonial cards scale in with stagger
  - [ ] Cards appear smoothly without layout shift

- [ ] **CTA Section**

  - [ ] Heading scales in (400ms duration)
  - [ ] Description slides up with 200ms delay
  - [ ] Button has pulse animation (continuous)
  - [ ] Animations trigger only once

- [ ] **Footer**
  - [ ] Footer fades in when scrolled into view
  - [ ] All footer content is visible and properly animated

### 1.3 Hover Interactions

- [ ] **Navigation Links**

  - [ ] Links scale to 105% on hover
  - [ ] Color transitions to primary color (200ms)
  - [ ] Smooth return to original state on mouse leave

- [ ] **Buttons**

  - [ ] Primary buttons scale to 105% on hover
  - [ ] Shadow glow effect appears on hover
  - [ ] Tap/click scales down to 95%
  - [ ] Smooth transitions (200ms)

- [ ] **Cards (How It Works, Testimonials)**

  - [ ] Cards elevate with shadow on hover
  - [ ] Cards scale to 102% on hover
  - [ ] Border color changes to primary
  - [ ] Smooth transition (300ms)

- [ ] **Step Icons**

  - [ ] Icons rotate 5 degrees on hover
  - [ ] Icons scale to 110% on hover
  - [ ] Smooth transition (200ms)

- [ ] **Feature Icon Containers**

  - [ ] Glow effect appears on hover
  - [ ] Scale increases slightly
  - [ ] Smooth transition

- [ ] **Testimonial Avatars**

  - [ ] Avatars scale to 110% on hover
  - [ ] Avatars rotate 5 degrees on hover
  - [ ] Smooth transition (200ms)

- [ ] **Social Media Icons (Footer)**

  - [ ] Icons rotate 5 degrees on hover
  - [ ] Icons scale to 110% on hover
  - [ ] Background color changes
  - [ ] Smooth transition (200ms)

- [ ] **Footer Links**
  - [ ] Links change color to primary on hover
  - [ ] Smooth color transition (200ms)

### 1.4 Chatbot Widget Animations

- [ ] **Chatbot Button**

  - [ ] Button is visible in bottom-right corner
  - [ ] Button scales to 110% on hover
  - [ ] Button scales to 95% on click
  - [ ] Smooth transitions

- [ ] **Chat Window Opening**

  - [ ] Window scales and fades in (300ms)
  - [ ] Smooth entrance animation
  - [ ] Initial bot message is visible

- [ ] **Chat Messages**

  - [ ] User messages slide in from right (200ms)
  - [ ] Bot messages slide in from left (200ms)
  - [ ] Messages appear smoothly without jarring

- [ ] **Typing Indicator**

  - [ ] Three dots appear when bot is "typing"
  - [ ] Dots have bounce animation
  - [ ] Animation is smooth and not distracting

- [ ] **Suggested Questions**

  - [ ] Questions appear with stagger (100ms delays)
  - [ ] Questions fade and slide in
  - [ ] Hover effect works on question buttons

- [ ] **Chat Window Closing**
  - [ ] Window scales and fades out (300ms)
  - [ ] Smooth exit animation
  - [ ] Chatbot button reappears

### 1.5 Parallax and Floating Effects

- [ ] **Hero Background**

  - [ ] Background gradient has subtle parallax on scroll
  - [ ] Effect is smooth and not jarring
  - [ ] Doesn't cause layout shifts

- [ ] **Hero Image**

  - [ ] Image floats up and down (3-second cycle)
  - [ ] Motion is subtle and smooth
  - [ ] Doesn't affect surrounding content

- [ ] **Feature Images**
  - [ ] Images have floating animation (4-second cycle)
  - [ ] Motion is subtle and smooth
  - [ ] Doesn't cause layout shifts

---

## 2. Mobile Device Testing

### 2.1 Responsive Animations

- [ ] All animations work on mobile viewport (375px width)
- [ ] Animations don't cause horizontal scrolling
- [ ] Touch interactions work correctly
- [ ] Tap animations (whileTap) work on touch
- [ ] Hover effects don't interfere with touch interactions

### 2.2 Performance on Mobile

- [ ] Animations are smooth (no jank or stuttering)
- [ ] Page loads quickly on mobile
- [ ] Scrolling is smooth during animations
- [ ] No excessive battery drain

### 2.3 Mobile-Specific Features

- [ ] Chatbot widget is accessible on mobile
- [ ] Chat window fits mobile screen
- [ ] Keyboard doesn't cover chat input
- [ ] All buttons are easily tappable (44x44px minimum)

---

## 3. Reduced Motion Testing

### 3.1 Enable Reduced Motion

**Windows:**

- Settings > Ease of Access > Display > Show animations in Windows (OFF)

**macOS:**

- System Preferences > Accessibility > Display > Reduce motion (ON)

**Linux:**

- Settings > Universal Access > Reduce Animation (ON)

### 3.2 Verify Reduced Motion Behavior

- [ ] **All Animations**

  - [ ] Animation durations reduced to 50ms or less
  - [ ] Scale and rotation effects replaced with opacity
  - [ ] Parallax effects disabled
  - [ ] Floating effects disabled
  - [ ] Functionality remains intact

- [ ] **Specific Checks**
  - [ ] Loading screen still appears/disappears (quickly)
  - [ ] Scroll-based animations still trigger (instant)
  - [ ] Hover effects still provide feedback (subtle)
  - [ ] Chatbot animations still work (instant)
  - [ ] No jarring or broken animations

---

## 4. Keyboard Navigation Testing

### 4.1 Tab Navigation

- [ ] Tab key moves focus through all interactive elements
- [ ] Focus order is logical (top to bottom, left to right)
- [ ] Focus indicator is visible on all elements
- [ ] Skip to content link available (if applicable)

### 4.2 Keyboard Interactions

- [ ] **Header**

  - [ ] Tab through navigation links
  - [ ] Enter activates links
  - [ ] Tab to "Log In" and "Get Started" buttons
  - [ ] Enter activates buttons

- [ ] **Hero Section**

  - [ ] Tab to CTA buttons
  - [ ] Enter activates buttons

- [ ] **Chatbot**

  - [ ] Tab to chatbot button
  - [ ] Enter opens chat window
  - [ ] Tab through suggested questions
  - [ ] Enter sends selected question
  - [ ] Tab to message input
  - [ ] Type message and press Enter to send
  - [ ] Escape closes chat window

- [ ] **Footer**
  - [ ] Tab through all footer links
  - [ ] Enter activates links
  - [ ] Tab through social media icons

### 4.3 Focus Management

- [ ] Focus doesn't get trapped in any component
- [ ] Focus returns to appropriate element after modal close
- [ ] Focus is visible during all animations
- [ ] Animations don't interfere with keyboard navigation

---

## 5. Screen Reader Testing

### 5.1 Screen Reader Setup

**Windows (NVDA):**

- Download from https://www.nvaccess.org/
- Press Insert+Down Arrow to start reading

**macOS (VoiceOver):**

- Cmd+F5 to enable
- Ctrl+Option+A to start reading

**Linux (Orca):**

- Super+Alt+S to enable

### 5.2 Screen Reader Checks

- [ ] **Page Structure**

  - [ ] Page title is announced
  - [ ] Headings are properly announced (h1, h2, h3)
  - [ ] Landmarks are identified (header, main, footer)

- [ ] **Images**

  - [ ] All images have descriptive alt text
  - [ ] Decorative images are hidden from screen readers

- [ ] **Links and Buttons**

  - [ ] Link text is descriptive
  - [ ] Button labels are clear
  - [ ] Purpose of each element is clear

- [ ] **Forms (Chatbot)**

  - [ ] Input field has label
  - [ ] Button purpose is clear
  - [ ] Error messages are announced (if applicable)

- [ ] **Animations**
  - [ ] Animations don't interfere with screen reader
  - [ ] Content is accessible during animations
  - [ ] No content is hidden by animations

---

## 6. Performance Testing

### 6.1 Chrome DevTools Performance

1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Interact with page (scroll, hover, click)
5. Stop recording

**Check:**

- [ ] Frame rate stays at or near 60fps during animations
- [ ] No long tasks (>50ms) during animations
- [ ] No layout thrashing
- [ ] GPU acceleration is active (check Layers tab)

### 6.2 Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select "Performance" and "Accessibility"
4. Click "Generate report"

**Target Scores:**

- [ ] Performance: 90+ (green)
- [ ] Accessibility: 95+ (green)
- [ ] Best Practices: 90+ (green)

**Specific Metrics:**

- [ ] First Contentful Paint (FCP): < 1.8s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Time to Interactive (TTI): < 3.8s
- [ ] Total Blocking Time (TBT): < 200ms

### 6.3 Layout Shift Testing

- [ ] **Visual Stability**

  - [ ] No content jumps during page load
  - [ ] No content jumps during animations
  - [ ] Images load without causing shifts
  - [ ] Fonts load without causing shifts

- [ ] **CLS Measurement**
  - [ ] Use Lighthouse to measure CLS
  - [ ] CLS score is < 0.1 (good)
  - [ ] No unexpected layout shifts reported

### 6.4 Frame Rate Monitoring

1. Open Chrome DevTools
2. Press Cmd/Ctrl+Shift+P
3. Type "Show frames per second (FPS) meter"
4. Enable the FPS meter

**Check:**

- [ ] FPS stays at 60 during scroll animations
- [ ] FPS stays at 60 during hover interactions
- [ ] FPS stays at 60 during chatbot animations
- [ ] No significant FPS drops on any interaction

---

## 7. Cross-Browser Testing

### 7.1 Chrome/Chromium

- [ ] All animations work correctly
- [ ] Performance is optimal
- [ ] No console errors

### 7.2 Firefox

- [ ] All animations work correctly
- [ ] Performance is acceptable
- [ ] No console errors

### 7.3 Safari (macOS/iOS)

- [ ] All animations work correctly
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Reduced motion works correctly

### 7.4 Edge

- [ ] All animations work correctly
- [ ] Performance is acceptable
- [ ] No console errors

---

## 8. Loading Screen Specific Tests

### 8.1 Initial Load

- [ ] Loading screen appears immediately
- [ ] Loading animation is visible
- [ ] Loading screen fades out after content loads
- [ ] Transition is smooth

### 8.2 Page Reload

- [ ] Press Ctrl/Cmd+R to reload
- [ ] Loading screen appears again
- [ ] Loading screen behavior is consistent
- [ ] No flashing or jarring transitions

### 8.3 Hard Reload

- [ ] Press Ctrl/Cmd+Shift+R for hard reload
- [ ] Loading screen appears
- [ ] All animations reset correctly
- [ ] No cached animation states

---

## 9. Edge Cases and Error Scenarios

### 9.1 Slow Network

1. Open DevTools > Network tab
2. Set throttling to "Slow 3G"
3. Reload page

**Check:**

- [ ] Loading screen persists appropriately
- [ ] Animations don't start before content loads
- [ ] No broken animations due to delayed resources

### 9.2 JavaScript Disabled

1. Disable JavaScript in browser settings
2. Reload page

**Check:**

- [ ] Page content is still accessible
- [ ] No broken layout
- [ ] Graceful degradation

### 9.3 Large Viewport

- [ ] Test on 4K display (3840x2160)
- [ ] Animations scale appropriately
- [ ] No performance issues
- [ ] Layout remains intact

### 9.4 Small Viewport

- [ ] Test at 320px width (iPhone SE)
- [ ] Animations work correctly
- [ ] No horizontal scrolling
- [ ] Content is accessible

---

## 10. Final Checklist

### 10.1 All Requirements Met

- [ ] Requirement 1: Initial entrance animations (1.1-1.5)
- [ ] Requirement 2: Scroll-based animations (2.1-2.5)
- [ ] Requirement 3: Hover interactions (3.1-3.5)
- [ ] Requirement 4: Parallax and floating effects (4.1-4.5)
- [ ] Requirement 5: Chatbot animations (5.1-5.5)
- [ ] Requirement 6: Reduced motion support (6.1-6.5)
- [ ] Requirement 7: Performance optimization (7.1-7.5)
- [ ] Requirement 8: CTA animations (8.1-8.5)
- [ ] Requirement 9: Loading screen (9.1-9.5)

### 10.2 Quality Assurance

- [ ] No console errors or warnings
- [ ] No broken animations
- [ ] No layout shifts
- [ ] No accessibility violations
- [ ] Performance targets met
- [ ] All browsers tested
- [ ] Mobile devices tested
- [ ] Reduced motion tested
- [ ] Keyboard navigation tested
- [ ] Screen reader tested

### 10.3 Documentation

- [ ] All animations documented
- [ ] Performance optimizations documented
- [ ] Accessibility features documented
- [ ] Known issues documented (if any)

---

## Test Results

**Date:** ******\_\_\_******  
**Tester:** ******\_\_\_******  
**Browser:** ******\_\_\_******  
**Device:** ******\_\_\_******

**Overall Result:** ☐ Pass ☐ Fail ☐ Needs Review

**Notes:**

```
[Add any observations, issues, or recommendations here]
```

---

## Reporting Issues

When reporting issues, include:

1. **Description:** Clear description of the issue
2. **Steps to Reproduce:** Exact steps to reproduce the issue
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What actually happens
5. **Environment:** Browser, OS, device, viewport size
6. **Screenshots/Video:** Visual evidence if applicable
7. **Console Errors:** Any JavaScript errors in console

---

## Sign-Off

- [ ] All tests completed
- [ ] All critical issues resolved
- [ ] All requirements met
- [ ] Ready for production

**Signed:** ******\_\_\_******  
**Date:** ******\_\_\_******
