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

// Fetcher function
const fetchCommuniques = async (
  path: string,
  company: string,
  user: string,
  logout: () => void
): Promise<Notification[]> => {
  if (companyIdIsNull(company)) {
    return Promise.reject([]);
  }
  const response = await AxiosHttpService.getInstance().post<any>({
    path,
    body: { company_id: company, user_id: user },
  });

  const data = response.data;
  if (verifySession(data, logout) || apiErrorValidation(data)) {
    return Promise.reject([]);
  }

  return Array.isArray(data.communiques) ? data.communiques : [];
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
      onError: (e, key) => console.error(`Error SWR ${key}:`, e),
    }
  );
  // ─────────────────────────────────────────────────────────────────────────────
  //  6) Lógica para procesar notificaciones UNA SOLA VEZ por cada nueva “firma” de data
  // ─────────────────────────────────────────────────────────────────────────────
  const processingNotificationsRef = useRef<boolean>(false);
  const lastProcessedSignatureRef = useRef<string | null>(null);

  const processNotifications = useCallback(async () => {
    // Si ya esta procesando o data es undefined: no hago nada
    if (processingNotificationsRef.current || !Array.isArray(data)) {
      return;
    }

    // Firma “constante” de data: JSON.stringify(data)
    const signature = JSON.stringify(data);
    if (signature === lastProcessedSignatureRef.current) {
      // Ya procesamos exactamente la misma lista de notificaciones
      return;
    }

    processingNotificationsRef.current = true;
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
          const handled = await handler.handle(notif, isAnyModalOpen);
          if (handled) {
            break;
          }
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
