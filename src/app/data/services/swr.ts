import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { AxiosHttpService } from './axiosHTTP.service';

// ❌ Configuración anterior - consume mucha memoria
export const defaultConfig = {
  keepPreviousData: true,
  revalidateOnReconnect: true,
  revalidateOnFocus: false,
  revalidateOnMount: false,
  revalidateIfStale: true,
  fallbackData: [],
};

// ✅ Configuraciones optimizadas por caso de uso
export const optimizedConfigs = {
  // Para datos que cambian frecuentemente (scans, progress)
  realtime: {
    keepPreviousData: false, // No mantener datos viejos
    revalidateOnReconnect: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateIfStale: true,
    dedupingInterval: 1000, // Evitar requests duplicados
    focusThrottleInterval: 5000, // Throttle en focus
    errorRetryCount: 2,
    errorRetryInterval: 1000,
  },

  // Para datos estáticos (configuraciones, preferencias)
  static: {
    keepPreviousData: false,
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateIfStale: false,
    // dedupingInterval: 60000, // 1 minuto
  },

  // Para listas grandes (recursos, usuarios)
  lists: {
    keepPreviousData: false, // Importante: no mantener datos viejos
    revalidateOnReconnect: true,
    revalidateOnFocus: false, // Evitar revalidaciones innecesarias
    revalidateOnMount: true,
    revalidateIfStale: true,
    // dedupingInterval: 5000,
    focusThrottleInterval: 10000,
    refreshWhenHidden: false, // No refrescar en background
    refreshWhenOffline: false,
  },

  // Configuración específica para network resources
  networkResources: {
    keepPreviousData: false,
    revalidateOnReconnect: true,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: true,
    // dedupingInterval: 8000,
    focusThrottleInterval: 15000,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    errorRetryCount: 2,
    errorRetryInterval: 3000,
  },

  // Para dashboard y métricas
  dashboard: {
    keepPreviousData: false,
    revalidateOnReconnect: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateIfStale: true,
    // dedupingInterval: 5000,
    // refreshInterval: 30000, // 30 segundos
  },
};

// Función helper para limpiar cache de SWR
export const clearSWRCache = (keys?: string[]) => {
  if (typeof window !== 'undefined') {
    const swrCache = (window as any).__SWR_CACHE__;
    if (swrCache) {
      if (keys?.length) {
        keys.forEach(key => {
          swrCache.delete?.(key);
        });
      } else {
        swrCache.clear?.();
      }
    }
  }
};

export const disponibleFetcher = ([[model, ac], { company, logout }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject([]);
  return AxiosHttpService.getInstance()
    .post<any>({
      body: {
        ac: ac,
        company_id: company,
        ds: 91239912932193,
      },
      path: model,
    })
    .then(({ data }) => {
      if (verifySession(data, logout) || apiErrorValidation(data)) throw new Error('');
      return {
        disponibles: data?.disponibles || [],
        company: data?.company || null,
        orders: data?.orders || [],
      };
    })
    .catch(() => [] as any);
};

export const resourcesFetcher = ([[model, childs], { company, logout }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject([]);
  return AxiosHttpService.getInstance()
    .post<any>({
      body: { model: model, childs: childs, company_id: company },
    })
    .then(({ data }) => {
      if (verifySession(data, logout) || apiErrorValidation(data)) throw new Error('');
      return data?.resources || [];
    })
    .catch(() => [] as any);
};

export const genericFetcher = ([model, params]: any) => {
  const { logout, ...body } = params;
  if (body?.company_id && companyIdIsNull(body?.company_id)) return Promise.reject({});

  return AxiosHttpService.getInstance()
    .post<any>({
      body,
      path: model,
    })
    .then(({ data }) => {
      if (verifySession(data, params?.logout) || apiErrorValidation(data)) throw new Error('');
      return data;
    })
    .catch(() => {});
};
