import { useEffect, useRef, useCallback } from 'react';
import { clearSWRCache } from '@services/swr';

interface MemoryOptimizationOptions {
  /** Limpiar SWR cache al desmontar */
  clearSWROnUnmount?: boolean;
  /** Keys específicas de SWR a limpiar */
  swrKeys?: string[];
  /** Intervalo de limpieza en ms (default: 5 minutos) */
  cleanupInterval?: number;
  /** Límite de memoria antes de forzar limpieza (en MB) */
  memoryThreshold?: number;
}

export const useMemoryOptimization = (options: MemoryOptimizationOptions = {}) => {
  const {
    clearSWROnUnmount = false,
    swrKeys = [],
    cleanupInterval = 300000, // 5 minutos
    memoryThreshold = 100, // 100MB
  } = options;

  const cleanupIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const memoryCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ Función para obtener uso de memoria (solo en desarrollo)
  const getMemoryUsage = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      };
    }
    return null;
  }, []);

  // ✅ Función de limpieza manual
  const forceCleanup = useCallback(() => {
    // Limpiar SWR cache
    clearSWRCache(swrKeys.length > 0 ? swrKeys : undefined);

    // Forzar garbage collection si está disponible (solo en desarrollo)
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
    }

    // Limpiar referencias DOM huérfanas
    const orphanedElements = document.querySelectorAll('[data-cleanup="true"]');
    orphanedElements.forEach(el => el.remove());

    console.info('🧹 Manual memory cleanup executed');
  }, [swrKeys]);

  // ✅ Monitoreo automático de memoria
  const startMemoryMonitoring = useCallback(() => {
    memoryCheckRef.current = setInterval(() => {
      const memory = getMemoryUsage();
      if (memory && memory.used > memoryThreshold) {
        console.warn(
          `⚠️ High memory usage detected: ${memory.used}MB (threshold: ${memoryThreshold}MB)`
        );
        forceCleanup();
      }
    }, 30000); // Check every 30 seconds
  }, [memoryThreshold, forceCleanup, getMemoryUsage]);

  // ✅ Cleanup periódico
  useEffect(() => {
    cleanupIntervalRef.current = setInterval(() => {
      // Limpieza suave cada intervalo
      if (swrKeys.length > 0) {
        clearSWRCache(swrKeys);
      }

      // Log de memoria en desarrollo
      if (process.env.NODE_ENV === 'development') {
        const memory = getMemoryUsage();
        if (memory) {
          console.info(`💾 Memory usage: ${memory.used}MB / ${memory.total}MB`);
        }
      }
    }, cleanupInterval);

    // Iniciar monitoreo si está habilitado
    if (process.env.NODE_ENV === 'development') {
      startMemoryMonitoring();
    }

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
      if (memoryCheckRef.current) {
        clearInterval(memoryCheckRef.current);
      }

      // Cleanup al desmontar
      if (clearSWROnUnmount) {
        if (swrKeys.length > 0) {
          clearSWRCache(swrKeys);
        } else {
          clearSWRCache([]);
        }
      }
    };
  }, [cleanupInterval, clearSWROnUnmount, swrKeys, startMemoryMonitoring, getMemoryUsage]);

  return {
    forceCleanup,
    getMemoryUsage,
    memoryInfo: getMemoryUsage(),
  };
};

/**
 * Hook específico para componentes de listas grandes
 */
export const useListMemoryOptimization = (itemCount: number) => {
  return useMemoryOptimization({
    clearSWROnUnmount: itemCount > 1000,
    cleanupInterval: itemCount > 500 ? 120000 : 300000, // Cleanup más frecuente para listas grandes
    memoryThreshold: itemCount > 1000 ? 150 : 100,
  });
};

/**
 * Hook para páginas con muchos modales
 */
export const useModalMemoryOptimization = () => {
  return useMemoryOptimization({
    clearSWROnUnmount: true,
    cleanupInterval: 180000, // 3 minutos
    memoryThreshold: 80,
  });
};
