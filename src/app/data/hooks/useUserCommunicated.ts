import { useEffect, useRef } from 'react';
import { companyIdIsNull, verifySession } from '@/app/constants/validations';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { apiErrorValidation } from '@/app/constants/validations';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useSWR from 'swr';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { useQualitySurveyStart } from './quality-survey/useQualitySurveyStart';
import useModalStore from '@stores/modal.store';
import { COMUNIQUE_KEYS, MODAL_KEY_OPEN } from '@/app/constants/app-texts';

const fetcher = ([model, { company, user, logout }]: any) => {
  if (companyIdIsNull(company)) return Promise.reject(false);
  return AxiosHttpService.getInstance()
    .post<any>({
      body: { company_id: company, user_id: user, model },
    })
    .then(({ data }) => {
      if (verifySession(data, logout) || apiErrorValidation(data?.error, data?.response)) {
        throw new Error('');
      }
      return data.communiques ? data.communiques : [];
    });
};

const handleWelcomeNotification = (
  notifications: any[],
  isOpen: boolean,
  setOpenModal: Function
) => {
  const welcomeNotify = notifications.find((item: any) => item.model === 'user_welcome');
  if (!isOpen && welcomeNotify) {
    localStorage.setItem(COMUNIQUE_KEYS.ID, welcomeNotify.id);
    setOpenModal();
    return true;
  }
  return false;
};

const handleOrderFinishedNotification = (
  notifications: any[],
  isOpen: boolean,
  startPoll: Function,
  updateIsOpen: Function,
  updateOrderId: Function,
  updateReferenceNumber: Function
) => {
  const orderFinishedNotify = notifications.find((item: any) => item.model === 'order_finished');
  if (!isOpen && orderFinishedNotify) {
    localStorage.setItem(COMUNIQUE_KEYS.ID, orderFinishedNotify.id);
    startPoll(orderFinishedNotify.order_id, orderFinishedNotify.order_reference_number).finally(
      () => {
        updateIsOpen(true);
        updateOrderId(orderFinishedNotify.order_id);
        updateReferenceNumber(orderFinishedNotify.order_reference_number);
      }
    );
    return true;
  }
  return false;
};

export const useUserCommunicated = () => {
  const { getUserdata, getCompany, logout } = useUserData();
  const { isOpen, updateIsOpen, updateOrderId, updateReferenceNumber } = useQualitySurveyStore();

  const { setIsOpen, setModalId, isOpen: anyModalIsOpen } = useModalStore();
  const startPoll = useQualitySurveyStart();
  const swrKeYRef = useRef<any>([
    'users/communiques/index',
    { company: getCompany(), user: getUserdata().id, logout },
  ]);
  const { data, isLoading, isValidating } = useSWR(swrKeYRef.current, (key: any) => fetcher(key), {
    keepPreviousData: false,
    refreshInterval: 213000,
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    fallbackData: [],
  });

  useEffect(() => {
    const notifications =
      data.length > 0 ? data.filter((item: any) => item.solved === 'unsolved') : [];
    if (notifications.length > 0) {
      const open = handleWelcomeNotification(notifications, anyModalIsOpen, () => {
        setModalId(MODAL_KEY_OPEN.USER_WELCOME_DOMAIN);
        setIsOpen(true);
      });
      if (!open) {
        handleOrderFinishedNotification(
          notifications,
          isOpen || anyModalIsOpen,
          startPoll,
          updateIsOpen,
          updateOrderId,
          updateReferenceNumber
        );
      }
    }
  }, [data, isLoading, isValidating]);
};
