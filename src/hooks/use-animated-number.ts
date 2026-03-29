"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Smoothly animates a numeric value from its previous to its new target.
 * Safe against rapid target changes: each new call cancels the previous RAF.
 */
export function useAnimatedNumber(target: number, duration = 320) {
  const [value, setValue] = useState(target);
  // Track where the animation physically is between renders
  const currentRef = useRef(target);
  const rafRef = useRef<number | null>(null);
  const prevTargetRef = useRef(target);

  useEffect(() => {
    if (prevTargetRef.current === target) return;
    prevTargetRef.current = target;

    // Start from wherever the last animation stopped
    const from = currentRef.current;
    const startTime = performance.now();

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (target - from) * eased);
      currentRef.current = next;
      setValue(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}
