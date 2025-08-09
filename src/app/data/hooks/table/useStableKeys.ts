import { useMemo, useRef, useCallback, useEffect } from 'react';
import type { GetStableKeyFunction } from '@table/v3/types';

/**
 * Hook para generar keys estables para componentes virtualizados
 * Evita bucles infinitos causados por generateID() en renderRow
 * ✅ Optimizado para evitar memory leaks
 */
export const useStableKeys = (rows: any[], prefix: string = 'row'): GetStableKeyFunction => {
  const keysRef = useRef<Map<string, string>>(new Map());
  const maxCacheSize = 1000; // ✅ Límite de cache para evitar memory leaks

  // ✅ Limpiar cache cuando se desmonta o cuando crece demasiado
  useEffect(() => {
    const cache = keysRef.current;

    // Limpiar cache si crece demasiado
    if (cache.size > maxCacheSize) {
      // Mantener solo las últimas 500 entradas
      const entries = Array.from(cache.entries());
      cache.clear();
      entries.slice(-500).forEach(([key, value]) => cache.set(key, value));
    }

    // Cleanup al desmontar
    return () => {
      cache.clear();
    };
  }, [rows.length]);

  const getStableKey = useMemo(() => {
    return (row: any, index: number) => {
      const rowId = row?.['id'] || row?.['ID'] || row?.['_id'];

      if (rowId) {
        // Si tiene ID, usar ID + índice (más eficiente)
        return `${rowId}-${index}`;
      }

      // ✅ Crear hash más eficiente y estable
      const contentStr = `${index}-${row?.['name'] || ''}-${row?.['email'] || ''}-${Object.keys(row || {}).length}`;

      // Verificar cache primero
      if (keysRef.current.has(contentStr)) {
        return keysRef.current.get(contentStr)!;
      }

      // ✅ Hash simple pero efectivo
      let hash = 0;
      for (let i = 0; i < contentStr.length; i++) {
        const char = contentStr.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }

      const stableKey = `${prefix}-${index}-${Math.abs(hash)}`;

      // ✅ Solo cachear si no excedemos el límite
      if (keysRef.current.size < maxCacheSize) {
        keysRef.current.set(contentStr, stableKey);
      }

      return stableKey;
    };
  }, [prefix, maxCacheSize]);

  return getStableKey;
};
