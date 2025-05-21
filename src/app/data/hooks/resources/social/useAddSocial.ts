import { useRef } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import {
  apiErrorValidation,
  companyIdIsNull,
  nameValidation,
  phoneNumberValidation,
  emailRegexVal,
} from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, SOCIAL_PANEL_TEXT } from '@/app/constants/app-toast-texts';

const validations = (fName: string, lName: string, mail: string, phone: string, role: string) => {
  if (nameValidation(fName)) {
    toast.error(SOCIAL_PANEL_TEXT.INVALID_NAME);
    return true;
  }

  if (nameValidation(lName)) {
    toast.error(SOCIAL_PANEL_TEXT.INVALID_FAMILY_NAME);
    return true;
  }

  if (mail.trim() !== '' && !emailRegexVal.test(mail)) {
    toast.error(SOCIAL_PANEL_TEXT.INVALID_EMAIL);
    return true;
  }

  if (phoneNumberValidation(phone)) {
    toast.error(SOCIAL_PANEL_TEXT.INVALID_PHONE);
    return true;
  }

  if (!role) {
    toast.error(SOCIAL_PANEL_TEXT.INVALID_ROLE);
    return true;
  }
  return false;
};

export const useAddSocial = (onDone: () => void, close: () => void) => {
  const { getCompany } = useUserData();

  const [fetcher, _, isLoading] = useFetcher();

  const fetchAdd = (companyID: string, form: FormData) => {
    fetcher<any>('post', {
      body: {
        company_id: companyID,
        member_fname: (form.get('member_fname') as string) || '',
        member_lname: (form.get('member_lname') as string) || '',
        member_email: (form.get('member_email') as string) || '',
        member_phone: (form.get('member_phone') as string) || '',
        member_role: (form.get('member_role') as string) || '',
      },
      path: 'resources/se/add',
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data)) {
          throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        onDone();
        toast.success(SOCIAL_PANEL_TEXT.ADD_SOCIAL_MEMBER);
      })
      .catch((e: Error) => toast.error(e.message));
  };

  const handleAddSocialResource = (form: FormData) => {
    const companyID = getCompany();
    if (
      companyIdIsNull(companyID) ||
      validations(
        (form.get('member_fname') as string) || '',
        (form.get('member_lname') as string) || '',
        (form.get('member_email') as string) || '',
        (form.get('member_phone') as string) || '',
        (form.get('member_role') as string) || ''
      )
    ) {
      return;
    }
    fetchAdd(companyID, form);
  };

  return {
    isAddingMember: isLoading,
    handleAddSocialResource,
  };
};
