import { useCallback, useEffect, useRef } from 'react';

const useTimeout = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = undefined;
  }, [timeoutRef]);

  const oneExecute = useCallback(() => {
    clear();
    if (timeoutRef.current === undefined) {
      timeoutRef.current = setTimeout(() => callback(), delay);
    }
  }, [timeoutRef, callback, delay]);

  useEffect(() => {
    return clear;
  }, []);

  return { clear, oneExecute };
};
export default useTimeout;
