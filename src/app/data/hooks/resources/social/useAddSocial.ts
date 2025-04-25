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
  const fName = useRef<HTMLInputElement>(null);
  const lName = useRef<HTMLInputElement>(null);
  const mail = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const role = useRef<HTMLSelectElement>(null);

  const [fetcher, _, isLoading] = useFetcher();

  const fetchAdd = (companyID: string) => {
    fetcher<any>('post', {
      body: {
        company_id: companyID,
        member_fname: fName.current?.value || '',
        member_lname: lName.current?.value || '',
        member_email: mail.current?.value || '',
        member_phone: phone.current?.value || '',
        member_role: role.current?.value || '',
      },
      path: 'resources/se/add',
    })
      .then(({ data }: any) => {
        if (apiErrorValidation(data.error, data.response)) {
          throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        onDone();
        toast.success(SOCIAL_PANEL_TEXT.ADD_SOCIAL_MEMBER);
      })
      .catch((e: Error) => toast.error(e.message));
  };

  const handleAddSocialResource = () => {
    const companyID = getCompany();
    if (
      companyIdIsNull(companyID) ||
      validations(
        fName.current?.value || '',
        lName.current?.value || '',
        mail.current?.value || '',
        phone.current?.value || '',
        role.current?.value || ''
      )
    )
      return;
    fetchAdd(companyID);
  };

  return {
    isAddingMember: isLoading,
    handleAddSocialResource,
    fName,
    lName,
    mail,
    phone,
    role,
  };
};
