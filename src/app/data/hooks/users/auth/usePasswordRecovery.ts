import { useFetcher } from '#commonHooks/useFetcher';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation } from '@/app/constants/validations';

export const usePasswordRecovery = () => {
  const [fetcher, _, isLoading] = useFetcher(true);

  const sendEmailForRecovery = (email: string) => {
    return fetcher('post', {
      body: {
        provided_email: email,
      },
      path: 'users/password/recover',
    }).then(({ data }: any) => {
      return data;
    });
  };
  const passwordRecover = (email: string, referenceNumber: string, newPassowrd: string) => {
    return fetcher('post', {
      body: {
        provided_email: email,
        password_recover_hash: referenceNumber,
        new_password: newPassowrd,
      },
      path: 'users/password/recover/hash',
    }).then(({ data }: any) => {
      if (data.isAnError || apiErrorValidation(data)) {
        throw new Error(data?.info || AUTH_TEXT.FAILURE_PASSWORD_UPDATED);
      }
      return data;
    });
  };

  return {
    sendEmailForRecovery,
    passwordRecover,
    isLoading,
  };
};
