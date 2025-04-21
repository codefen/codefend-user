import { useFetcher } from '#commonHooks/useFetcher';
import { APP_MESSAGE_TOAST, AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation } from '@/app/constants/validations';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export const useSignupInvitation = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    invokeEmail: '',
    invokeHash: '',
    name: '',
    lastname: '',
    username: '',
    role: '',
    idiom: '',
    phone: '',
    password: '',
  });

  const sendSignUp = () => {
    fetcher('post', {
      body: {
        invoke_user_email: form.invokeEmail,
        invoke_user_hash: form.invokeHash,
        user_fname: form.name,
        user_lname: form.lastname,
        user_username: form.username,
        user_role: form.role,
        user_phone: form.phone,
        user_password: form.password,
        user_idiom: form.idiom,
      },
      path: 'users/invoke/finish',
    })
      .then(({ data }: any) => {
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        navigate('/auth/signin');
        setForm({
          invokeEmail: '',
          invokeHash: '',
          name: '',
          lastname: '',
          username: '',
          role: '',
          phone: '',
          password: '',
          idiom: '',
        });
        toast.success(AUTH_TEXT.FINISH_REGISTER);
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  return { form, setForm, sendSignUp, isLoading };
};
