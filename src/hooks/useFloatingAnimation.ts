import { useRef, useEffect } from 'react';

export function useFloatingAnimation(count: number) {
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    floatingRefs.current = floatingRefs.current.slice(0, count);

    const animate = () => {
      floatingRefs.current.forEach((ref, index) => {
        if (!ref) return;

        // Create a unique floating animation for each card
        const time = performance.now() * 0.001 + index;
        const yOffset = Math.sin(time) * 3;

        ref.style.transform = `translateY(${yOffset}px)`;
      });

      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [count]);

  return { floatingRefs: floatingRefs.current };
}