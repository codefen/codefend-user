import { useCallback, useRef, useState } from 'react';
import { Sort } from '@interfaces/table';

interface AsyncSortingState {
  isSorting: boolean;
  sortProgress: number;
  currentSortColumn: string | null;
  currentSortDirection: Sort | null;
}

interface AsyncSortingResult<T> {
  sortedData: T[];
  sortingState: AsyncSortingState;
  startAsyncSort: (data: T[], column: string, direction: Sort) => Promise<T[]>;
  cancelSort: () => void;
}

// Optimización de comparación de strings
const optimizedStringCompare = (a: string, b: string): number => {
  // Si ambos son emails, optimizar la comparación
  if (a.includes('@') && b.includes('@')) {
    // Comparar primero por dominio, luego por usuario
    const [userA, domainA] = a.split('@');
    const [userB, domainB] = b.split('@');

    const domainCompare = domainA.localeCompare(domainB, 'en', { sensitivity: 'base' });
    if (domainCompare !== 0) return domainCompare;

    return userA.localeCompare(userB, 'en', { sensitivity: 'base' });
  }

  // Para strings normales, usar comparación optimizada
  const lenA = a.length;
  const lenB = b.length;
  const minLen = Math.min(lenA, lenB);

  // Comparación byte por byte para mayor velocidad
  for (let i = 0; i < minLen; i++) {
    const charA = a.charCodeAt(i);
    const charB = b.charCodeAt(i);
    if (charA !== charB) {
      return charA - charB;
    }
  }

  return lenA - lenB;
};

// Función de sorting optimizada para diferentes tipos de datos
const optimizedQuickSort = <T>(
  arr: T[],
  column: keyof T,
  direction: Sort,
  onProgress?: (progress: number) => void
): T[] => {
  if (arr.length <= 1) return arr;

  const stack: [number, number][] = [[0, arr.length - 1]];
  let processedItems = 0;
  const totalItems = arr.length;

  while (stack.length) {
    const [left, right] = stack.pop()!;
    if (left >= right) continue;

    const pivotIndex = optimizedPartition(arr, left, right, column, direction);

    // Reportar progreso
    processedItems += right - left + 1;
    if (onProgress) {
      onProgress((processedItems / totalItems) * 100);
    }

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

  // Sorting recursivo para childs si existen
  for (const item of arr) {
    if (
      item &&
      typeof item === 'object' &&
      'childs' in item &&
      Array.isArray((item as any).childs)
    ) {
      (item as any).childs = optimizedQuickSort(
        (item as any).childs,
        column,
        direction,
        onProgress
      );
    }
  }

  return arr;
};

const optimizedPartition = <T>(
  arr: T[],
  left: number,
  right: number,
  column: keyof T,
  direction: Sort
): number => {
  const mult = direction === Sort.asc ? 1 : -1;

  // Median-of-three pivot selection
  const mid = Math.floor((left + right) / 2);
  const pivotValue = arr[mid][column];

  // Mover el pivote al final
  [arr[mid], arr[right]] = [arr[right], arr[mid]];

  let storeIndex = left;

  for (let i = left; i < right; i++) {
    const currentValue = arr[i][column];
    let comparison: number;

    // Optimización de comparación según el tipo de dato
    if (typeof currentValue === 'string' && typeof pivotValue === 'string') {
      comparison = optimizedStringCompare(currentValue, pivotValue);
    } else if (typeof currentValue === 'number' && typeof pivotValue === 'number') {
      comparison = currentValue - pivotValue;
    } else {
      // Fallback para otros tipos
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

export const useAsyncSorting = <T>(): AsyncSortingResult<T> => {
  const [sortingState, setSortingState] = useState<AsyncSortingState>({
    isSorting: false,
    sortProgress: 0,
    currentSortColumn: null,
    currentSortDirection: null,
  });

  const currentSortIdRef = useRef<string>('');

  const startAsyncSort = useCallback(
    async (data: T[], column: string, direction: Sort): Promise<T[]> => {
      const sortId = Math.random().toString(36).substr(2, 9);
      currentSortIdRef.current = sortId;

      setSortingState({
        isSorting: true,
        sortProgress: 0,
        currentSortColumn: column,
        currentSortDirection: direction,
      });

      try {
        return new Promise(resolve => {
          // Usar setTimeout para no bloquear la UI
          setTimeout(() => {
            const sorted = optimizedQuickSort(
              JSON.parse(JSON.stringify(data)),
              column as keyof T,
              direction,
              progress => {
                setSortingState(prev => ({ ...prev, sortProgress: progress }));
              }
            );

            if (currentSortIdRef.current === sortId) {
              setSortingState({
                isSorting: false,
                sortProgress: 100,
                currentSortColumn: column,
                currentSortDirection: direction,
              });
              resolve(sorted);
            }
          }, 0);
        });
      } catch (error) {
        setSortingState(prev => ({ ...prev, isSorting: false }));
        throw error;
      }
    },
    []
  );

  const cancelSort = useCallback(() => {
    setSortingState({
      isSorting: false,
      sortProgress: 0,
      currentSortColumn: null,
      currentSortDirection: null,
    });

    currentSortIdRef.current = '';
  }, []);

  return {
    sortedData: [],
    sortingState,
    startAsyncSort,
    cancelSort,
  };
};
