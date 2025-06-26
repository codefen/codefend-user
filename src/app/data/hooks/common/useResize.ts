import { useState, useEffect, type RefObject } from 'react';

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced;
}

export function useResize<T extends HTMLElement>(ref: RefObject<T>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const getDimensions = () => {
      if (ref.current) {
        return {
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        };
      }
      return { width: 0, height: 0 };
    };

    const handleResize = debounce(() => {
      setDimensions(getDimensions());
    }, 300);

    if (ref.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return dimensions;
}
