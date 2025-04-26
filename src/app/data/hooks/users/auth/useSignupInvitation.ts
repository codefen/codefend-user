import { useFetcher } from '#commonHooks/useFetcher';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation } from '@/app/constants/validations';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export const useSignupInvitation = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const navigate = useNavigate();
  const country = useGlobalFastField('country');

  const sendSignUp = (formObject: Record<any, FormDataEntryValue>) => {
    fetcher('post', {
      body: {
        invoke_user_email: formObject['invoke_user_email'],
        invoke_user_hash: formObject['invoke_user_hash'],
        user_fname: formObject['user_fname'],
        user_lname: formObject['user_lname'],
        user_username: formObject['user_username'],
        user_phone: formObject['user_phone'],
        user_password: formObject['user_password'],
        user_idiom: formObject['user_idiom'],
      },
      path: 'users/invoke/finish',
    })
      .then(({ data }: any) => {
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        navigate('/auth/signin');
        toast.success(AUTH_TEXT.FINISH_REGISTER);
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  return { sendSignUp, isLoading, country };
};
