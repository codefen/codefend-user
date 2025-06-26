import { useState, useEffect, useCallback, useRef } from 'react';
import type { UseVirtualizationConfigProps, VirtualizationConfig } from '@table/v3/types';

export const useVirtualizationConfig = ({
  containerRef,
  rowHeight,
  minContainerHeight = 200,
  maxContainerHeight = 600,
}: UseVirtualizationConfigProps): VirtualizationConfig => {
  const [containerHeight, setContainerHeight] = useState(minContainerHeight);
  const [shouldUseVirtualization, setShouldUseVirtualization] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Función para calcular la altura del contenedor
  const calculateContainerHeight = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const parentHeight = container.parentElement?.clientHeight || 0;
    const availableHeight = parentHeight - 100; // Reservar espacio para otros elementos

    // Calcular altura basada en el espacio disponible
    let calculatedHeight = Math.max(minContainerHeight, availableHeight);
    calculatedHeight = Math.min(maxContainerHeight, calculatedHeight);

    setContainerHeight(calculatedHeight);
  }, [containerRef, minContainerHeight, maxContainerHeight]);

  // Función para determinar si usar virtualización
  const determineVirtualization = useCallback(
    (rowCount: number) => {
      // Usar virtualización si hay más de 50 filas o si la altura total excedería el contenedor
      const totalHeight = rowCount * rowHeight;
      const shouldVirtualize = rowCount > 50 || totalHeight > containerHeight;
      setShouldUseVirtualization(shouldVirtualize);
    },
    [rowHeight, containerHeight]
  );

  // Efecto para configurar el ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    calculateContainerHeight();

    // Configurar ResizeObserver para detectar cambios en el tamaño del contenedor
    resizeObserverRef.current = new ResizeObserver(() => {
      calculateContainerHeight();
    });

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [calculateContainerHeight, containerRef]);

  // Función para actualizar la configuración cuando cambia el número de filas
  const updateVirtualizationConfig = useCallback(
    (rowCount: number) => {
      determineVirtualization(rowCount);
    },
    [determineVirtualization]
  );

  // Calcular el número estimado de filas visibles
  const estimatedRowCount = Math.ceil(containerHeight / rowHeight);

  return {
    containerHeight,
    rowHeight,
    shouldUseVirtualization,
    estimatedRowCount,
    updateVirtualizationConfig,
  };
};
