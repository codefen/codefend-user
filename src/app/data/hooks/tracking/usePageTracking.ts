import { useCallback } from 'react';
import { AxiosHttpService } from '@/app/data/services/axiosHTTP.service';

type PageType = 'signup' | 'signin';

interface TrackingResponse {
  error: string;
  response: string;
  info: string;
  data?: {
    ip_hash: string;
    page_type: string;
    visit_date: string;
    new_visit: boolean;
  };
}

export const usePageTracking = () => {
  const trackPageVisit = useCallback(async (pageType: PageType): Promise<boolean> => {
    try {
      const response = await AxiosHttpService.getInstance().post<any>({
        path: 'flow/observer',
        body: { page_type: pageType },
        requireSession: false, // No requiere autenticación
      });

      const data = response.data as TrackingResponse;

      if (data?.error === '0') {
        // console.log(`✅ Página ${pageType} tracked successfully:`, data.data);
        return true;
      } else {
        console.warn(`⚠️ Error tracking ${pageType}:`, data?.info);
        return false;
      }
    } catch (error) {
      console.warn(`⚠️ Network error tracking ${pageType}:`, error);
      return false;
    }
  }, []);

  const trackSignupVisit = useCallback(() => trackPageVisit('signup'), [trackPageVisit]);
  const trackSigninVisit = useCallback(() => trackPageVisit('signin'), [trackPageVisit]);

  return {
    trackPageVisit,
    trackSignupVisit,
    trackSigninVisit,
  };
};
