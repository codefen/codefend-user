import { useCallback, useRef, useState } from 'react';
import { Sort } from '@interfaces/table';

interface OptimisticSortingState {
  isSorting: boolean;
  sortProgress: number;
  currentSortColumn: string | null;
  currentSortDirection: Sort | null;
  optimisticData: any[] | null;
}

interface OptimisticSortingResult<T> {
  sortedData: T[];
  sortingState: OptimisticSortingState;
  startOptimisticSort: (data: T[], column: string, direction: Sort) => void;
  cancelSort: () => void;
}

// Función de sorting optimizada
const quickSort = <T>(arr: T[], column: keyof T, direction: Sort): T[] => {
  if (arr.length <= 1) return arr;

  const stack: [number, number][] = [[0, arr.length - 1]];

  while (stack.length) {
    const [left, right] = stack.pop()!;
    if (left >= right) continue;

    const pivotIndex = partition(arr, left, right, column, direction);

    const leftSize = pivotIndex - 1 - left;
    const rightSize = right - (pivotIndex + 1);

    if (leftSize > rightSize) {
      if (left < pivotIndex - 1) stack.push([left, pivotIndex - 1]);
      if (pivotIndex + 1 < right) stack.push([pivotIndex + 1, right]);
    } else {
      if (pivotIndex + 1 < right) stack.push([pivotIndex + 1, right]);
      if (left < pivotIndex - 1) stack.push([left, pivotIndex - 1]);
    }
  }

  // Sorting recursivo para childs
  for (const item of arr) {
    if (
      item &&
      typeof item === 'object' &&
      'childs' in item &&
      Array.isArray((item as any).childs)
    ) {
      (item as any).childs = quickSort((item as any).childs, column, direction);
    }
  }

  return arr;
};

const partition = <T>(
  arr: T[],
  left: number,
  right: number,
  column: keyof T,
  direction: Sort
): number => {
  const mult = direction === Sort.asc ? 1 : -1;
  const mid = Math.floor((left + right) / 2);
  const pivotValue = arr[mid][column];

  [arr[mid], arr[right]] = [arr[right], arr[mid]];

  let storeIndex = left;

  for (let i = left; i < right; i++) {
    const currentValue = arr[i][column];
    let comparison: number;

    if (typeof currentValue === 'string' && typeof pivotValue === 'string') {
      comparison = currentValue.localeCompare(pivotValue);
    } else if (typeof currentValue === 'number' && typeof pivotValue === 'number') {
      comparison = currentValue - pivotValue;
    } else {
      comparison = String(currentValue).localeCompare(String(pivotValue));
    }

    if (comparison * mult < 0) {
      [arr[i], arr[storeIndex]] = [arr[storeIndex], arr[i]];
      storeIndex++;
    }
  }

  [arr[storeIndex], arr[right]] = [arr[right], arr[storeIndex]];
  return storeIndex;
};

export const useOptimisticSorting = <T>(): OptimisticSortingResult<T> => {
  const [sortingState, setSortingState] = useState<OptimisticSortingState>({
    isSorting: false,
    sortProgress: 0,
    currentSortColumn: null,
    currentSortDirection: null,
    optimisticData: null,
  });

  const currentSortIdRef = useRef<string>('');
  const lastSortRequestRef = useRef<{ data: T[]; column: string; direction: Sort } | null>(null);

  const startOptimisticSort = useCallback((data: T[], column: string, direction: Sort) => {
    // Evitar sorting duplicado
    const currentRequest = { data, column, direction };
    const lastRequest = lastSortRequestRef.current;

    if (
      lastRequest &&
      lastRequest.column === currentRequest.column &&
      lastRequest.direction === currentRequest.direction &&
      lastRequest.data === currentRequest.data
    ) {
      // console.log('🔄 Skipping duplicate sort request');
      return;
    }

    const sortId = Math.random().toString(36).substr(2, 9);
    currentSortIdRef.current = sortId;
    lastSortRequestRef.current = currentRequest;

    // console.log(
    //   `🔄 [${sortId}] Starting optimistic sort for ${data.length} rows by ${column} (${direction})`
    // );

    // Inmediatamente mostrar estado de sorting (UI optimista)
    setSortingState(prev => ({
      ...prev,
      isSorting: true,
      sortProgress: 0,
      currentSortColumn: column,
      currentSortDirection: direction,
      optimisticData: data, // Mantener datos actuales mientras ordena
    }));

    // Usar setTimeout para no bloquear la UI
    setTimeout(() => {
      try {
        const sorted = quickSort(JSON.parse(JSON.stringify(data)), column as keyof T, direction);

        // Solo actualizar si este es el sorting más reciente
        if (currentSortIdRef.current === sortId) {
          setSortingState(prev => ({
            ...prev,
            isSorting: false,
            sortProgress: 100,
            optimisticData: sorted,
          }));
          // console.log(`✅ [${sortId}] Optimistic sort completed in main thread`);
        }
      } catch (error) {
        // console.error(`❌ [${sortId}] Error in optimistic sort:`, error);
        if (currentSortIdRef.current === sortId) {
          setSortingState(prev => ({
            ...prev,
            isSorting: false,
            sortProgress: 0,
          }));
        }
      }
    }, 0);
  }, []);

  const cancelSort = useCallback(() => {
    // Solo cancelar si hay un sorting activo
    if (!currentSortIdRef.current) {
      return; // No hay sorting activo, no hacer nada
    }

    // console.log('🛑 Cancelling optimistic sort');
    currentSortIdRef.current = '';
    lastSortRequestRef.current = null;
    setSortingState(prev => ({
      ...prev,
      isSorting: false,
      sortProgress: 0,
    }));
  }, []);

  return {
    sortedData: sortingState.optimisticData || [],
    sortingState,
    startOptimisticSort,
    cancelSort,
  };
};
