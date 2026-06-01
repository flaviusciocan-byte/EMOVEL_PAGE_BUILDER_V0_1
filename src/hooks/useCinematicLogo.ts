import { useEffect, type RefObject } from 'react';
import { createTimeline, stagger } from 'animejs';

export function useCinematicLogo(
  containerRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      container.style.opacity = '1';
      return;
    }

    const leftPaths = Array.from(
      container.querySelectorAll<SVGElement>('.wing-left path'),
    );
    const rightPaths = Array.from(
      container.querySelectorAll<SVGElement>('.wing-right path'),
    );
    if (!leftPaths.length || !rightPaths.length) return;

    // Set initial hidden states before animation starts
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    for (const el of leftPaths) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-16px)';
    }
    for (const el of rightPaths) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(16px)';
    }

    const tl = createTimeline({ defaults: { ease: 'outExpo' } });

    // Phase 1: container fade + rise (absolute 0ms)
    tl.add(container, { opacity: 1, translateY: 0, duration: 600 }, 0);

    // Phase 2: left wing paths fan in (staggered from 200ms, overlap with phase 1)
    tl.add(
      leftPaths,
      { opacity: 1, translateX: 0, duration: 440 },
      stagger(55, { start: 200 }),
    );

    // Phase 3: right wing paths fan in (staggered from 240ms, overlap with phase 2)
    tl.add(
      rightPaths,
      { opacity: 1, translateX: 0, duration: 440 },
      stagger(55, { start: 240 }),
    );

    return () => {
      tl.pause();
    };
  }, [enabled]);
}
