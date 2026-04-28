<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { gsap } from 'gsap';

const frameRef = useTemplateRef<HTMLDivElement>('frameRef');
let gsapContext: gsap.Context | undefined;

onMounted(() => {
  gsapContext = gsap.context(() => {
    gsap.to('.border-flow', {
      strokeDashoffset: -100,
      duration: 2.2,
      ease: 'none',
      repeat: -1,
    });

    gsap.to('.corner-dot', {
      opacity: 1,
      scale: 1.45,
      duration: 0.78,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.14,
    });
  }, frameRef.value ?? undefined);
});

onUnmounted(() => {
  gsapContext?.revert();
});
</script>

<template>
  <div
    ref="frameRef"
    class="cyber-border-frame"
    aria-hidden="true"
  >
    <svg
      class="border-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id="borderFlow"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stop-color="#26ffe1"
            stop-opacity="0"
          />
          <stop
            offset="36%"
            stop-color="#26ffe1"
          />
          <stop
            offset="62%"
            stop-color="#fff25c"
          />
          <stop
            offset="100%"
            stop-color="#ff2f78"
            stop-opacity="0"
          />
        </linearGradient>
        <filter
          id="borderGlow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur
            stdDeviation="1.2"
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        class="border-base"
        x="1"
        y="1"
        width="98"
        height="98"
        pathLength="100"
      />
      <rect
        class="border-flow"
        x="1"
        y="1"
        width="98"
        height="98"
        pathLength="100"
      />
    </svg>

    <span class="corner-dot is-top-left" />
    <span class="corner-dot is-top-right" />
    <span class="corner-dot is-bottom-right" />
    <span class="corner-dot is-bottom-left" />
  </div>
</template>

<style scoped>
.cyber-border-frame {
  position: absolute;
  inset: 2.4px;
  z-index: 1;
  pointer-events: none;
}

.border-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.border-base,
.border-flow {
  fill: none;
  vector-effect: non-scaling-stroke;
}

.border-base {
  stroke: rgba(38, 255, 225, 0.26);
  stroke-width: 1;
}

.border-flow {
  stroke: url('#borderFlow');
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 18 82;
  stroke-dashoffset: 0;
  filter: url('#borderGlow');
}

.corner-dot {
  position: absolute;
  width: 13.76px;
  height: 13.76px;
  opacity: 0.45;
  border: 1px solid rgba(38, 255, 225, 0.5);
  background: #26ffe1;
  box-shadow: 0 0 16px rgba(38, 255, 225, 0.85);
}

.corner-dot::before {
  position: absolute;
  inset: -5.12px;
  content: '';
  background: rgba(38, 255, 225, 0.08);
}

.corner-dot.is-top-left {
  top: 0;
  left: 0;
  transform-origin: top left;
}

.corner-dot.is-top-right {
  top: 0;
  right: 0;
  transform-origin: top right;
}

.corner-dot.is-bottom-right {
  right: 0;
  bottom: 0;
  transform-origin: bottom right;
}

.corner-dot.is-bottom-left {
  bottom: 0;
  left: 0;
  transform-origin: bottom left;
}
</style>
