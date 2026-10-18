import { useEffect, useState } from 'react';
import { useStore } from '@/store';

/** Counts from 0 (or `from`) up to `target` for a satisfying number reveal. */
export function useCountUp(target: number, duration = 900, delay = 0, from = 0): number {
  const reduce = useStore((s) => s.settings.reduceMotion);
  const [val, setVal] = useState(from);
  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    const begin = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min(1, (Date.now() - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(from + (target - from) * eased));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      tick();
    }, delay);
    return () => {
      clearTimeout(begin);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration, delay, from, reduce]);
  return reduce ? target : val;
}
