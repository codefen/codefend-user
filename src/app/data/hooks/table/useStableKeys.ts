import { useMemo, useRef } from 'react';
import type { GetStableKeyFunction } from '@table/v3/types';

/**
 * Hook para generar keys estables para componentes virtualizados
 * Evita bucles infinitos causados por generateID() en renderRow
 */
export const useStableKeys = (rows: any[], prefix: string = 'row'): GetStableKeyFunction => {
  const keysRef = useRef<Map<string, string>>(new Map());

  const getStableKey = useMemo(() => {
    return (row: any, index: number) => {
      const rowId = row?.['id'] || row?.['ID'] || row?.['_id'];

      if (rowId) {
        // Si tiene ID, usar ID + índice
        return `${rowId}-${index}`;
      }

      // Si no tiene ID, generar una key estable basada en el contenido
      const contentHash = JSON.stringify({
        index,
        // Usar propiedades clave para generar hash
        key1: row?.['name'] || row?.['title'] || row?.['email'] || '',
        key2: row?.['created_at'] || row?.['updated_at'] || row?.['date'] || '',
        key3: Object.keys(row || {}).length,
      });

      // Usar hash simple para evitar bucles infinitos
      let hash = 0;
      for (let i = 0; i < contentHash.length; i++) {
        const char = contentHash.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }

      const stableKey = `${prefix}-${index}-${Math.abs(hash)}`;

      // Cachear la key para evitar regeneración
      if (!keysRef.current.has(contentHash)) {
        keysRef.current.set(contentHash, stableKey);
      }

      return keysRef.current.get(contentHash) || stableKey;
    };
  }, [prefix]);

  return getStableKey;
};
