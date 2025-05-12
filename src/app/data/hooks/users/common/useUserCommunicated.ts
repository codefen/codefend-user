import { useEffect, useRef } from 'react';
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
  handle: (notification: Notification, isAnyModalOpen: boolean) => Promise<boolean>;
}

// Fetcher function
const fetcher = ([path, { company, user, logout }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject(false);
  return AxiosHttpService.getInstance()
    .post<any>({
      body: { company_id: company, user_id: user },
      path,
    })
    .then(({ data }) => {
      if (verifySession(data, logout) || apiErrorValidation(data)) {
        throw new Error('');
      }
      return data.communiques ? data.communiques : [];
    });
};

// Notification Handlers
const createNotificationHandlers = (
  setModalId: (id: string) => void,
  setIsOpen: (isOpen: boolean) => void,
  startPoll: (orderId: string, referenceNumber: string) => Promise<void>,
  updateIsOpen: (isOpen: boolean) => void,
  updateOrderId: (orderId: string) => void,
  updateReferenceNumber: (referenceNumber: string) => void
): NotificationHandler[] => [
  {
    model: 'user_welcome',
    handle: async (notification, isAnyModalOpen) => {
      if (isAnyModalOpen) return false;

      localStorage.setItem(COMUNIQUE_KEYS.ID, notification.id);
      setModalId(MODAL_KEY_OPEN.USER_WELCOME_DOMAIN);
      setIsOpen(true);
      return true;
    },
  },
  {
    model: 'order_finished',
    handle: async (notification, isAnyModalOpen) => {
      if (isAnyModalOpen) return false;

      localStorage.setItem(COMUNIQUE_KEYS.ID, notification.id);
      await startPoll(notification.order_id!, notification.order_reference_number!);
      updateIsOpen(true);
      updateOrderId(notification.order_id!);
      updateReferenceNumber(notification.order_reference_number!);
      return true;
    },
  },
];

export const useUserCommunicated = () => {
  const { getUserdata, getCompany, logout } = useUserData();
  const { isOpen, updateIsOpen, updateOrderId, updateReferenceNumber } = useQualitySurveyStore();
  const { setIsOpen, setModalId, isOpen: anyModalIsOpen } = useModalStore();
  const startPoll = useQualitySurveyStart();

  const swrKeYRef = useRef<any>([
    'users/communiques/index',
    { company: getCompany(), user: getUserdata()?.id, logout },
  ]);

  const { data, isLoading, isValidating } = useSWR(swrKeYRef.current, (key: any) => fetcher(key), {
    keepPreviousData: false,
    refreshInterval: 60000,
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    fallbackData: [],
  });

  useEffect(() => {
    const processNotifications = async () => {
      const notifications =
        data.length > 0 ? data.filter((item: Notification) => item.solved === 'unsolved') : [];

      if (notifications.length > 0) {
        const handlers = createNotificationHandlers(
          setModalId,
          setIsOpen,
          startPoll as (orderId: string, referenceNumber: string) => Promise<void>,
          updateIsOpen,
          updateOrderId,
          updateReferenceNumber
        );

        // Process notifications in order
        for (const notification of notifications) {
          const handler = handlers.find(h => h.model === notification.model);
          if (handler) {
            const handled = await handler.handle(notification, isOpen || anyModalIsOpen);
            if (handled) break; // Stop processing if a notification was handled
          }
        }
      }
    };

    processNotifications();
  }, [data, isLoading, isValidating]);
};
