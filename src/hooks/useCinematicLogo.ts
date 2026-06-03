import { useEffect, type RefObject } from 'react';
import { createTimeline, stagger } from 'animejs';
import { WINGS } from '../motion/patterns';

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

    const w = WINGS.anime;

    // Set initial hidden states
    container.style.opacity = '0';
    container.style.transform = `translateY(${w.containerInitY}px)`;
    for (const el of leftPaths) {
      el.style.opacity = '0';
      el.style.transform = `translateX(-${w.pathInitX}px)`;
    }
    for (const el of rightPaths) {
      el.style.opacity = '0';
      el.style.transform = `translateX(${w.pathInitX}px)`;
    }

    const tl = createTimeline({ defaults: { ease: 'outExpo' } });

    // Phase 1: container fade + rise (absolute 0ms)
    tl.add(container, { opacity: 1, translateY: 0, duration: w.containerDuration }, 0);

    // Phase 2: left wing paths fan in (staggered, overlap with phase 1)
    tl.add(
      leftPaths,
      { opacity: 1, translateX: 0, duration: w.pathDuration },
      stagger(w.staggerStep, { start: w.leftStaggerStart }),
    );

    // Phase 3: right wing paths fan in (staggered, overlap with phase 2)
    tl.add(
      rightPaths,
      { opacity: 1, translateX: 0, duration: w.pathDuration },
      stagger(w.staggerStep, { start: w.rightStaggerStart }),
    );

    return () => {
      tl.pause();
    };
  }, [enabled]);
}
