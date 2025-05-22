import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import {
  androidUriValidation,
  apiErrorValidation,
  companyIdIsNull,
  iosUriValidation,
} from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, MOBILE_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@interfaces/panel';

export const useAddMobileResource = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const androidAddress = useRef<HTMLInputElement>(null);
  const iosAddress = useRef<HTMLInputElement>(null);
  const { getCompany } = useUserData();
  const { selectedApp, appEvent } = useGlobalFastFields(['selectedApp', 'appEvent']);

  const isNotValidData = () => {
    if (androidUriValidation(androidAddress.current?.value || '')) {
      toast.error(MOBILE_PANEL_TEXT.INVALID_ANDROID);
      return true;
    }

    if (iosUriValidation(iosAddress.current?.value || '')) {
      toast.error(MOBILE_PANEL_TEXT.INVALID_IOS);
      return true;
    }

    if (
      (iosAddress.current?.value === undefined || iosAddress.current?.value?.trim() === '') &&
      (androidAddress.current?.value === undefined || androidAddress.current?.value?.trim() === '')
    ) {
      toast.error(MOBILE_PANEL_TEXT.EMPTY_MOBILE_APP);
      return true;
    }

    return false;
  };

  const handleAddMobileResource = (onDone: () => void, onClose: () => void) => {
    const companyID = getCompany();
    if (isNotValidData() || companyIdIsNull(companyID)) return;

    fetcher<any>('post', {
      body: {
        app_android_link: androidAddress.current?.value || '',
        app_apple_link: iosAddress.current?.value || '',
        company_id: companyID,
      },
      path: 'resources/mobile/add',
    })
      .then(({ data }: any) => {
        if (data.android_error || data.apple_error || apiErrorValidation(data)) {
          throw new Error(data?.android_info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        if (data?.android) {
          selectedApp.set(data?.android);
        } else if (data?.apple) {
          selectedApp.set(data?.apple);
        }
        appEvent.set(APP_EVENT_TYPE.MOBILE_RESOURCE_CREATED);
        toast.success(MOBILE_PANEL_TEXT.ADD_MOBILE);
        onClose();
        onDone();
      })
      .catch((error: Error) => {
        toast.error(error.message);
      });
  };

  return {
    handleAddMobileResource,
    isAddingMobile: isLoading,
    iosAddress,
    androidAddress,
  };
};
