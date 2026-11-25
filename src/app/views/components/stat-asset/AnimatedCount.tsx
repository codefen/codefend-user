import { useEffect, useRef } from 'react';

const COUNT_DURATION = 640;

// Reserve the final width and keep the real value available to assistive technology.
export const AnimatedCount = ({ value, delay }: { value: string | number; delay: number }) => {
  const visual = useRef<HTMLSpanElement>(null);
  const target = Number(value);
  const canCount = Number.isSafeInteger(target) && target > 0 && String(target) === String(value);

  useEffect(() => {
    const element = visual.current;
    if (!element) return;

    const start = performance.now() + delay;
    let frame = requestAnimationFrame(function count(now) {
      if (now >= start) {
        const progress = Math.min((now - start) / COUNT_DURATION, 1);
        element.textContent = String(Math.round(target * (1 - (1 - progress) ** 3)));
        if (progress === 1) return;
      }
      frame = requestAnimationFrame(count);
    });

    return () => cancelAnimationFrame(frame);
  }, [delay, target]);

  return canCount ? (
    <span className="dashboard-count">
      <span className="dashboard-count-target">{value}</span>
      <span aria-hidden="true" className="dashboard-count-visual" ref={visual}>
        0
      </span>
    </span>
  ) : (
    value
  );
};
