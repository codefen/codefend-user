import { useCallback, useEffect, useRef } from 'react';

export const useTimedProgress = (
  launchedAt: string | null,
  finishedAt: string | null,
  estimatedDuration: number,
  setProgress: (val: number) => void,
  updateOverallProgress: (current: number) => void
) => {
  const intervalRef = useRef<any>(0);
  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearCurrentInterval();
    if (!launchedAt) return;

    const start = new Date(launchedAt).getTime();
    const end = finishedAt ? new Date(finishedAt).getTime() : null;

    // Si ya terminó, establecer progreso al 100%
    if (end) {
      setProgress(100);
      updateOverallProgress(100);
      return;
    }

    // Validar que la fecha de inicio sea válida
    if (isNaN(start)) {
      console.warn('Invalid launchedAt date:', launchedAt);
      return;
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSec = Math.floor((now - start) / 1000);
      const progressRaw = Math.min(elapsedSec / estimatedDuration, 1);
      const easedProgress = progressRaw < 1 ? progressRaw * 99 : 100;

      setProgress(easedProgress);
      updateOverallProgress(easedProgress);
    }, 1000);

    return clearCurrentInterval;
  }, [
    launchedAt,
    finishedAt,
    estimatedDuration,
    setProgress,
    updateOverallProgress,
    clearCurrentInterval,
  ]);
};
