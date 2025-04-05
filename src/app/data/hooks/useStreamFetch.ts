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
      // Datos base como sesion, base url, company id
      const customAPi = baseUrl;
      const companyID = getCompany();
      const sessionValue = getToken();
      formData.append('company_id', companyID);
      formData.append('session', sessionValue);
      setIsLoading(true);
      setError(null);

      // AbortController para cerrar la conexion
      const controller = new AbortController();
      // Cierre de conexion luego de 30s por defecto
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(customAPi, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        // Termina la ejecucion si no hay body
        if (!response.body) {
          throw new Error('No response body');
        }

        // Se crea un "reader" a partir del body para streamear la respuesta
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        // Variable para ir construyendo la respuesta del stream
        let receivedText = '';

        // Se ejecuta en bucle hasta que se verifique si:
        // 1-Valide que la respuesta es un JSON valido, 2-El timeout cierre la conexion y no pueda seguir
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          // Construye la respuesta segun va recibiendo texto
          receivedText += decoder.decode(value, { stream: true });

          try {
            // Intenta parsear el JSON si falla quiere decir que la respuesta todabian o es un texto valido
            const jsonData = JSON.parse(receivedText) as T;
            // Si pasa la linea cierra el JSON es valido y cierra la conexion
            clearTimeout(timeoutId);
            reader.cancel();
            setData(jsonData);
            setIsLoading(false);
            return jsonData;
          } catch (e) {
            // Si el JSON es invalido entra al catch y vuelve a intentarlo
          }
        }
        // Si llega a este punto quiere decir que la conexion se cerro, pero no encontro ningun JSON valido
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
