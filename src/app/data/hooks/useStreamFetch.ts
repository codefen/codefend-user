import { useUserData } from '#commonUserHooks/useUserData';
import { baseUrl } from '@utils/config';
import { getToken } from '@utils/helper';
import { useState, useCallback } from 'react';

interface StreamResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  streamFetch: (formData: FormData, timeout?: number) => Promise<T | null>;
}

/**
 * Hook personalizado para realizar solicitudes fetch que manejan respuestas de stream
 * que no cierran la conexión correctamente.
 */
export const useStreamFetch = <T = any>(): StreamResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { getCompany } = useUserData();

  const streamFetch = useCallback(
    async (formData: FormData, timeout = 30000): Promise<T | null> => {
      const customAPi = baseUrl;
      const companyID = getCompany();
      const sessionValue = getToken();
      formData.append('company_id', companyID);
      formData.append('session', sessionValue);
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(customAPi, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let receivedText = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          receivedText += decoder.decode(value, { stream: true });

          try {
            const jsonData = JSON.parse(receivedText) as T;
            clearTimeout(timeoutId);
            reader.cancel();
            setData(jsonData);
            setIsLoading(false);
            return jsonData;
          } catch (e) {
            // Sigue intentando con más datos
          }
        }

        throw new Error('No se pudo obtener un JSON válido de la respuesta');
      } catch (error: any) {
        clearTimeout(timeoutId);
        setIsLoading(false);

        if (error.name === 'AbortError') {
          const abortError = new Error('La solicitud excedió el tiempo de espera');
          setError(abortError);
          return null;
        } else {
          setError(error);
          return null;
        }
      }
    },
    []
  );

  return { data, isLoading, error, streamFetch };
};
