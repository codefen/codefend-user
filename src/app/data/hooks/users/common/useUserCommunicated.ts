import { useEffect, useRef, useCallback, useMemo } from 'react';
import { companyIdIsNull, verifySession } from '@/app/constants/validations';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { apiErrorValidation } from '@/app/constants/validations';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useSWR from 'swr';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { useQualitySurveyStart } from '../../quality-survey/useQualitySurveyStart';
import useModalStore from '@stores/modal.store';
import { COMUNIQUE_KEYS, MODAL_KEY_OPEN } from '@/app/constants/app-texts';

// Types
interface Notification {
  id: string;
  model: string;
  solved: string;
  order_id?: string;
  order_reference_number?: string;
}

interface NotificationHandler {
  model: string;
  handle: (notification: Notification | any, isAnyModalOpen: boolean) => Promise<boolean>;
}

// Fetcher function with improved error handling and debugging
const fetchCommuniques = async (
  path: string,
  company: string,
  user: string,
  logout: () => void
): Promise<Notification[]> => {
  if (companyIdIsNull(company)) {
    console.warn('🚨 useUserCommunicated: Company ID is null, skipping communiques fetch');
    return Promise.reject([]);
  }

  // console.log('📡 useUserCommunicated: Fetching communiques', {
  //   path,
  //   company_id: company,
  //   user_id: user,
  //   timestamp: new Date().toISOString(),
  // });

  try {
    const response = await AxiosHttpService.getInstance().post<any>({
      path,
      body: { company_id: company, user_id: user },
    });

    const data = response.data;

    // console.log('📥 useUserCommunicated: API Response received', {
    //   hasData: !!data,
    //   hasError: !!data?.error,
    //   errorValue: data?.error,
    //   hasInfo: !!data?.info,
    //   infoMessage: data?.info,
    //   timestamp: new Date().toISOString(),
    // });

    // Improved session verification with more context
    if (data?.error == 1 && String(data.info).startsWith('invalid or expired')) {
      // console.error(
      //   '🚨 useUserCommunicated: Session expired detected, but checking if login just happened'
      // );

      // Check if this could be a timing issue after recent login
      const loginTimestamp = localStorage.getItem('last_login_timestamp');
      const now = Date.now();
      const timeSinceLogin = loginTimestamp ? now - parseInt(loginTimestamp) : Infinity;

      if (timeSinceLogin < 5000) {
        // Less than 5 seconds since login
        console.warn(
          '⚠️ useUserCommunicated: Session error within 5s of login - possible timing issue, retrying instead of logout'
        );
        return Promise.reject([]); // Reject but don't logout
      } else {
        // console.error('🚨 useUserCommunicated: Session truly expired, calling logout');
        if (verifySession(data, logout)) {
          return Promise.reject([]);
        }
      }
    }

    if (apiErrorValidation(data)) {
      // console.warn('⚠️ useUserCommunicated: API error validation failed', {
      //   error: data?.error,
      //   response: data?.response,
      //   isAnError: data?.isAnError,
      //   isNetworkError: data?.isNetworkError,
      //   error_info: data?.error_info,
      // });
      return Promise.reject([]);
    }

    const communiques = Array.isArray(data.communiques) ? data.communiques : [];
    // console.log('✅ useUserCommunicated: Communiques fetched successfully', {
    //   count: communiques.length,
    //   communiques: communiques.map((c: any) => ({ id: c.id, model: c.model, solved: c.solved })),
    // });

    return communiques;
  } catch (error) {
    console.error('❌ useUserCommunicated: Network error fetching communiques', error);
    return Promise.reject([]);
  }
};

export const useUserCommunicated = () => {
  const { getUserdata, getCompany, logout } = useUserData();
  const qualitySurveyStore = useQualitySurveyStore();
  const modalStore = useModalStore();
  const startPoll = useQualitySurveyStart();

  const companyId = getCompany();
  const userId = getUserdata()?.id ?? null;
  const qualitySurveyIsOpenRef = useRef<boolean>(qualitySurveyStore.isOpen);
  const genericModalIsOpenRef = useRef<boolean>(modalStore.isOpen);
  const startPollRef = useRef<typeof startPoll>(startPoll);

  // Add mounting timestamp for debugging
  useEffect(() => {
    console.log('🔄 useUserCommunicated: Hook mounted/updated', {
      timestamp: new Date().toISOString(),
    });
  }, [companyId, userId]);

  useEffect(() => {
    qualitySurveyIsOpenRef.current = qualitySurveyStore.isOpen;
    genericModalIsOpenRef.current = modalStore.isOpen;
    startPollRef.current = startPoll;
  }, [qualitySurveyStore.isOpen, modalStore.isOpen, startPoll]);

  // Crear los handlers una sola vez con referencias estables
  const notificationHandlersRef = useRef<NotificationHandler[]>([
    {
      model: 'user_welcome',
      handle: async (n, isAnyModalOpen) => {
        if (isAnyModalOpen) return false;
        localStorage.setItem(COMUNIQUE_KEYS.ID, n.id);
        modalStore.setModalId(MODAL_KEY_OPEN.USER_WELCOME_DOMAIN);
        modalStore.setIsOpen(true);
        return true;
      },
    },
    {
      model: 'order_finished',
      handle: async (n, isAnyModalOpen) => {
        if (isAnyModalOpen) return false;
        localStorage.setItem(COMUNIQUE_KEYS.ID, n.id);
        await startPollRef.current(n.order_id!, n.order_reference_number!);
        qualitySurveyStore.updateIsOpen(true);
        qualitySurveyStore.updateOrderId(n.order_id!);
        qualitySurveyStore.updateReferenceNumber(n.order_reference_number!);
        return true;
      },
    },
  ]);

  const swrKey = companyId && userId ? ['users/communiques/index', companyId, userId] : null;

  // console.log('🔑 useUserCommunicated: SWR Key', {
  //   swrKey,
  //   timestamp: new Date().toISOString(),
  // });

  const {
    data = [],
    error,
    isValidating,
    isLoading,
  } = useSWR<Notification[] | any[]>(
    swrKey,
    ([path, comp, usr]) => fetchCommuniques(path, comp, usr, logout),
    {
      refreshInterval: 180_000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      fallbackData: [],
      dedupingInterval: 5_000,
      // Increase retry attempts and delay for initial load
      errorRetryCount: 3,
      errorRetryInterval: 2000,
      onError: (e, key) => {
        console.error(`❌ useUserCommunicated: Error SWR ${key}:`, e);
        // Don't log this as an error if it's within 10 seconds of login (timing issue)
        const loginTimestamp = localStorage.getItem('last_login_timestamp');
        const timeSinceLogin = loginTimestamp ? Date.now() - parseInt(loginTimestamp) : Infinity;
        if (timeSinceLogin < 10000) {
          console.warn(
            '⚠️ useUserCommunicated: SWR error within 10s of login - likely timing issue'
          );
        }
      },
      onSuccess: data => {
        console.log('✅ useUserCommunicated: SWR success', {
          timestamp: new Date().toISOString(),
        });
      },
    }
  );
  // ─────────────────────────────────────────────────────────────────────────────
  //  6) Lógica para procesar notificaciones UNA SOLA VEZ por cada nueva "firma" de data
  // ─────────────────────────────────────────────────────────────────────────────
  const processingNotificationsRef = useRef<boolean>(false);
  const lastProcessedSignatureRef = useRef<string | null>(null);

  const processNotifications = useCallback(async () => {
    // Si ya esta procesando o data es undefined: no hago nada
    if (processingNotificationsRef.current || !Array.isArray(data)) {
      return;
    }

    // Firma "constante" de data: JSON.stringify(data)
    const signature = JSON.stringify(data);
    if (signature === lastProcessedSignatureRef.current) {
      // Ya procesamos exactamente la misma lista de notificaciones
      return;
    }

    processingNotificationsRef.current = true;
    // console.log('🔔 useUserCommunicated: Processing notifications', {
    //   timestamp: new Date().toISOString(),
    // });

    try {
      // Filtrar solo las sin resolver
      const unsolved = data.filter(n => n.solved === 'unsolved');
      if (unsolved.length === 0) {
        lastProcessedSignatureRef.current = signature;
        return;
      }

      // Saber si hay un modal abierto
      const isQualitySurveyOpen = qualitySurveyIsOpenRef.current;
      const isGenericModalOpen = genericModalIsOpenRef.current;
      const isAnyModalOpen = isQualitySurveyOpen || isGenericModalOpen;

      for (const notif of unsolved) {
        const handler = notificationHandlersRef.current.find(h => h.model === notif.model);
        if (handler) {
          // console.log('🎯 useUserCommunicated: Processing notification', {
          //   id: notif.id,
          //   model: notif.model,
          //   isAnyModalOpen,
          // });
          const handled = await handler.handle(notif, isAnyModalOpen);
          if (handled) {
            // console.log('✅ useUserCommunicated: Notification handled successfully');
            break;
          }
        } else {
          console.log('⚠️ useUserCommunicated: No handler found for notification model');
        }
      }

      lastProcessedSignatureRef.current = signature;
    } finally {
      processingNotificationsRef.current = false;
    }
  }, [data]);

  useEffect(() => {
    if (error || isLoading || isValidating) return;
    processNotifications();
  }, [data, error, isLoading, isValidating, processNotifications]);
};
