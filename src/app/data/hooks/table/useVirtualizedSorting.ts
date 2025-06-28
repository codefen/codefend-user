import { useMemo, useEffect, useCallback, useRef, useState } from 'react';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import { quickSort, flattenRows } from '@utils/sort.service';
import { useOptimisticSorting } from './useOptimisticSorting';

interface UseVirtualizedSortingProps {
  rows: any[];
  sortedColumn: string;
  sort: Sort;
  isNeedSort: boolean;
  limit: number;
  columns: ColumnTableV3[];
  term: string;
  enableOptimisticSorting?: boolean;
}

interface VirtualizedSortingResult {
  sortedRows: any[];
  flattenedRows: any[];
  totalRowCount: number;
  isSorting: boolean;
  sortProgress: number;
  shouldUseOptimisticSorting: boolean;
  showSkeleton: boolean;
  activateSkeleton: () => void;
}

// Función de filtrado reutilizable
const filterRows = (rows: any[], term: string, columns: ColumnTableV3[]): any[] => {
  if (!term.trim()) return rows;

  term = term.toLowerCase();
  const visibleKeys = new Set(columns.map(col => col.key));

  return rows
    .map(row => {
      const rowValues = Object.entries(row)
        .filter(([key]) => visibleKeys.has(key))
        .map(([, val]) => String(val || '').toLowerCase());

      const rowMatches = rowValues.some(value => value.includes(term));

      const matchingChildren =
        row.childs?.filter((child: any) =>
          Object.entries(child)
            .filter(([key]) => visibleKeys.has(key))
            .some(([, val]) =>
              String(val || '')
                .toLowerCase()
                .includes(term)
            )
        ) || [];

      if (rowMatches || matchingChildren.length > 0) {
        return {
          ...row,
          childs: matchingChildren.length > 0 ? matchingChildren : row.childs,
        };
      }

      return null;
    })
    .filter(Boolean);
};

export const useVirtualizedSorting = ({
  rows,
  sortedColumn,
  sort,
  isNeedSort,
  limit,
  columns,
  term,
  enableOptimisticSorting = true,
}: UseVirtualizedSortingProps): VirtualizedSortingResult => {
  // Estado para controlar el skeleton
  const [showSkeleton, setShowSkeleton] = useState(false);
  const skeletonTimeoutRef = useRef<any>(null);

  // Validaciones tempranas para evitar procesamiento innecesario
  const shouldProcess = useMemo(() => {
    return rows && rows.length > 0 && columns && columns.length > 0;
  }, [rows, columns]);

  // Filtrar datos primero
  const filteredRows = useMemo(() => {
    if (!shouldProcess) return [];
    return filterRows(rows, term, columns);
  }, [rows, term, columns, shouldProcess]);

  // Memoizar cálculos costosos para evitar recalcular
  const memoizedData = useMemo(() => {
    if (!shouldProcess) {
      return {
        flattened: [],
        totalCount: 0,
        shouldUseOptimistic: false,
      };
    }

    const flattened = flattenRows(filteredRows, limit);
    const totalCount = flattened.length;

    // Determinar si usar sorting optimista basado en el tamaño y complejidad
    const shouldUseOptimistic =
      enableOptimisticSorting &&
      (totalCount > 500 || // Muchas filas
        (sortedColumn && columns.find(col => col.key === sortedColumn)?.type === 'string') || // Columnas de texto
        (totalCount > 100 && sortedColumn.includes('email'))); // Emails específicamente

    return {
      flattened,
      totalCount,
      shouldUseOptimistic,
    };
  }, [filteredRows, limit, enableOptimisticSorting, sortedColumn, columns, shouldProcess]);

  const optimisticSorting = useOptimisticSorting();
  const lastSortParams = useRef<{ column: string; direction: Sort } | null>(null);
  const cleanupExecutedRef = useRef(false);

  // Memoizar la verificación de parámetros de sorting para evitar recálculos
  const sortParamsChanged = useMemo(() => {
    if (!shouldProcess || !isNeedSort || !sortedColumn) return false;

    const currentParams = { column: sortedColumn, direction: sort };
    const lastParams = lastSortParams.current;

    if (!lastParams) return true;

    return (
      lastParams.column !== currentParams.column || lastParams.direction !== currentParams.direction
    );
  }, [sortedColumn, sort, shouldProcess, isNeedSort]);

  // Determinar qué datos usar basado en el estado de sorting y calcular flattened rows
  const { finalData, finalFlattenedRows } = useMemo(() => {
    if (!shouldProcess) {
      return { finalData: [], finalFlattenedRows: [] };
    }

    let dataToUse: any[];

    // Si el skeleton está activo, usar los datos filtrados originales para que el skeleton se pueda renderizar
    if (showSkeleton) {
      dataToUse = filteredRows;
    }
    // Si el sorting optimista está activo y hay datos optimistas, usarlos
    else if (optimisticSorting.sortingState.isSorting) {
      dataToUse = optimisticSorting.sortingState.optimisticData || filteredRows;
    }
    // Si hay datos optimistas ya procesados y coinciden con los parámetros actuales
    else if (
      optimisticSorting.sortingState.optimisticData &&
      optimisticSorting.sortingState.currentSortColumn === sortedColumn &&
      optimisticSorting.sortingState.currentSortDirection === sort
    ) {
      dataToUse = optimisticSorting.sortingState.optimisticData;
    }
    // Si no hay sorting optimista activo pero se necesita sorting, aplicar sorting normal
    else if (isNeedSort && sortedColumn && sortedColumn.trim() !== '') {
      try {
        dataToUse = quickSort(filteredRows, sortedColumn, sort);
      } catch (error) {
        console.error('Error during normal sorting:', error);
        dataToUse = filteredRows;
      }
    }
    // Si no se necesita sorting, usar los datos filtrados
    else {
      dataToUse = filteredRows;
    }

    // Calcular flattened rows basado en los datos finales
    const flattened = flattenRows(dataToUse, limit);

    return {
      finalData: dataToUse,
      finalFlattenedRows: flattened,
    };
  }, [
    filteredRows,
    optimisticSorting.sortingState.isSorting,
    optimisticSorting.sortingState.optimisticData,
    optimisticSorting.sortingState.currentSortColumn,
    optimisticSorting.sortingState.currentSortDirection,
    sortedColumn,
    sort,
    isNeedSort,
    limit,
    shouldProcess,
    showSkeleton,
  ]);

  // Función para activar el skeleton inmediatamente
  const activateSkeleton = useCallback(() => {
    // Solo activar skeleton si hay más de 500 filas (incluyendo childs)
    if (memoizedData.totalCount <= 500) {
      // console.log(
      //   `⏭️ Skipping skeleton activation - only ${memoizedData.totalCount} total rows (need > 500)`
      // );
      return;
    }

    // Limpiar timeout anterior si existe
    if (skeletonTimeoutRef.current) {
      clearTimeout(skeletonTimeoutRef.current);
    }
    // Activar skeleton inmediatamente
    setShowSkeleton(true);
    skeletonTimeoutRef.current = setTimeout(() => {
      setShowSkeleton(false);
      // console.log('✅ Skeleton deactivated after minimum time');
    }, 1000); // Mínimo 1 segundo
  }, [memoizedData.totalCount]);

  // Iniciar sorting optimista cuando cambian los parámetros (EVITAR BUCLE)
  useEffect(() => {
    if (
      !shouldProcess ||
      !isNeedSort ||
      !sortedColumn ||
      !memoizedData.shouldUseOptimistic ||
      !sortParamsChanged
    ) {
      return;
    }

    const currentData = filteredRows;
    if (!currentData || currentData.length === 0) {
      return;
    }

    // Activar skeleton inmediatamente cuando se inicia el sorting
    activateSkeleton();

    lastSortParams.current = { column: sortedColumn, direction: sort };
    optimisticSorting.startOptimisticSort(currentData, sortedColumn, sort);
  }, [
    sortedColumn,
    sort,
    isNeedSort,
    memoizedData.shouldUseOptimistic,
    sortParamsChanged,
    filteredRows,
    optimisticSorting.startOptimisticSort,
    shouldProcess,
    activateSkeleton,
  ]);

  // Efecto para desactivar skeleton cuando termina el sorting
  useEffect(() => {
    if (!optimisticSorting.sortingState.isSorting && showSkeleton) {
      // Si el sorting terminó pero el skeleton sigue activo,
      // NO desactivarlo inmediatamente para respetar el tiempo mínimo de 2 segundos
      // El timeout se encargará de desactivarlo después de 2 segundos
      // console.log('🔄 Sorting completed, waiting for minimum skeleton time...');
    }
  }, [optimisticSorting.sortingState.isSorting, showSkeleton]);

  // Efecto adicional para desactivar skeleton cuando hay datos optimistas disponibles
  useEffect(() => {
    if (
      showSkeleton &&
      optimisticSorting.sortingState.optimisticData &&
      !optimisticSorting.sortingState.isSorting &&
      optimisticSorting.sortingState.currentSortColumn === sortedColumn &&
      optimisticSorting.sortingState.currentSortDirection === sort
    ) {
      // Si hay datos optimistas disponibles y coinciden con los parámetros actuales,
      // NO desactivar el skeleton inmediatamente para respetar el tiempo mínimo
      // El timeout se encargará de desactivarlo después de 2 segundos
      // console.log('✅ Optimistic data available, waiting for minimum skeleton time...');
    }
  }, [
    showSkeleton,
    optimisticSorting.sortingState.optimisticData,
    optimisticSorting.sortingState.isSorting,
    optimisticSorting.sortingState.currentSortColumn,
    optimisticSorting.sortingState.currentSortDirection,
    sortedColumn,
    sort,
  ]);

  // Limpiar sorting cuando se desmonta
  useEffect(() => {
    return () => {
      if (!cleanupExecutedRef.current) {
        cleanupExecutedRef.current = true;
        optimisticSorting.cancelSort();
      }

      // Limpiar timeout del skeleton
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
    };
  }, [optimisticSorting.cancelSort]);

  return {
    sortedRows: finalData,
    flattenedRows: finalFlattenedRows,
    totalRowCount: memoizedData.totalCount,
    isSorting: optimisticSorting.sortingState.isSorting,
    sortProgress: optimisticSorting.sortingState.sortProgress,
    shouldUseOptimisticSorting: memoizedData.shouldUseOptimistic,
    showSkeleton,
    activateSkeleton,
  };
};

// Hook para debugging de performance
export const useSortingPerformance = (result: VirtualizedSortingResult) => {
  const prevResultRef = useRef(result);

  const logPerformance = useCallback(() => {
    const current = result;
    // const previous = prevResultRef.current;
    // if (current.isSorting !== previous.isSorting) {
    //   if (current.isSorting) {
    //     console.log(`🔄 Sorting started - ${current.totalRowCount} rows`);
    //   } else {
    //     console.log(`✅ Sorting completed - Progress: ${current.sortProgress.toFixed(1)}%`);
    //   }
    // }

    prevResultRef.current = current;
  }, [result]);

  return { logPerformance };
};
