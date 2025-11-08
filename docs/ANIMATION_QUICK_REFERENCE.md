# Animation Performance - Quick Reference

## Quick Start

### 1. Use GPU-Accelerated Properties Only

```tsx
// ✅ GOOD - GPU accelerated
<motion.div
  animate={{
    transform: 'translateX(100px)',
    opacity: 0.5
  }}
/>

// ❌ BAD - Triggers layout/paint
<motion.div
  animate={{
    width: '100px',
    left: '50px'
  }}
/>
```

### 2. Wrap Animations in Error Boundaries

```tsx
import { AnimationErrorBoundary } from "@/components/animated";

<AnimationErrorBoundary>
  <AnimatedSection>
    <YourContent />
  </AnimatedSection>
</AnimationErrorBoundary>;
```

### 3. Defer Non-Critical Animations

```tsx
import { DeferredAnimationWrapper } from "@/components/deferred-animation-wrapper";

<DeferredAnimationWrapper delay={100}>
  <DecorativeAnimation />
</DeferredAnimationWrapper>;
```

### 4. Monitor Performance (Development)

```tsx
import { useAnimationPerformance } from "@/hooks/use-animation-performance";

function MyComponent() {
  const { fps, devicePerformance } = useAnimationPerformance();
  console.log(`FPS: ${fps}, Device: ${devicePerformance}`);
}
```

## Available Components

### AnimatedSection

Scroll-triggered section animations with GPU acceleration.

```tsx
<AnimatedSection variant="fadeInUp" delay={0.1} once={true}>
  <YourContent />
</AnimatedSection>
```

### AnimatedCard

Card hover effects with GPU acceleration.

```tsx
<AnimatedCard hoverScale={1.02}>
  <Card>Content</Card>
</AnimatedCard>
```

### AnimatedButton

Button micro-interactions with GPU acceleration.

```tsx
<AnimatedButton hoverScale={1.05} tapScale={0.95}>
  Click Me
</AnimatedButton>
```

### FloatingElement

Continuous floating animation (disabled on low-end devices).

```tsx
<FloatingElement duration={3} yOffset={10}>
  <Image src="..." />
</FloatingElement>
```

### ParallaxBackground

Scroll-based parallax effect (disabled on medium/low-end devices).

```tsx
<ParallaxBackground speed={0.5}>
  <div className="bg-gradient-to-b..." />
</ParallaxBackground>
```

## Performance Utilities

### GPU Acceleration

```tsx
import { applyWillChange, removeWillChange } from "@/lib/animation-performance";

// Before animation
const style = applyWillChange(["transform", "opacity"]);
Object.assign(element.style, style);

// After animation
removeWillChange(element);
```

### Device Performance Detection

```tsx
import {
  detectDevicePerformance,
  getOptimizedAnimationConfig,
} from "@/lib/animation-performance";

const performance = detectDevicePerformance(); // "high" | "medium" | "low"
const config = getOptimizedAnimationConfig(performance);

if (config.enableParallax) {
  // Enable parallax
}
```

### Animation Throttling

```tsx
import { animationThrottle } from "@/lib/animation-performance";

const release = await animationThrottle.requestAnimation();
// Perform animation
release(); // Release slot when done
```

## Performance Checklist

- [ ] All animations use `transform` and `opacity` only
- [ ] Error boundaries wrap animation-heavy sections
- [ ] Non-critical animations are deferred
- [ ] `will-change` is applied before and removed after animations
- [ ] Concurrent animations limited to 10 or fewer
- [ ] Tested on low-end devices
- [ ] Reduced motion preferences respected
- [ ] 60fps maintained during animations

## Common Patterns

### Hero Section Animation

```tsx
<motion.div initial="initial" animate="animate" variants={staggerContainer}>
  <motion.h1 variants={fadeInUp}>Title</motion.h1>
  <motion.p variants={fadeInUp}>Description</motion.p>
  <motion.div variants={fadeInUp}>
    <Button>CTA</Button>
  </motion.div>
</motion.div>
```

### Scroll-Triggered Section

```tsx
<AnimatedSection variant="fadeInUp" once={true}>
  <h2>Section Title</h2>
  <p>Content</p>
</AnimatedSection>
```

### Interactive Card Grid

```tsx
<motion.div variants={staggerContainer}>
  {cards.map((card) => (
    <motion.div key={card.id} variants={scaleIn}>
      <AnimatedCard>
        <Card>{card.content}</Card>
      </AnimatedCard>
    </motion.div>
  ))}
</motion.div>
```

## Troubleshooting

### Animations Feel Janky

1. Check if using GPU-accelerated properties
2. Verify FPS with `useAnimationPerformance()`
3. Reduce concurrent animations
4. Test on target device

### Page Load is Slow

1. Defer non-critical animations
2. Check if too many animations on initial load
3. Use `DeferredAnimationWrapper`
4. Optimize image sizes

### Animations Break the Page

1. Add `AnimationErrorBoundary`
2. Check browser console for errors
3. Verify Framer Motion version compatibility
4. Test with reduced motion enabled

## Resources

- [Full Documentation](./ANIMATION_PERFORMANCE.md)
- [Implementation Summary](../PERFORMANCE_OPTIMIZATION_SUMMARY.md)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [GPU Acceleration Guide](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/)
