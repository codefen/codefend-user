import type { User } from '@interfaces/user';
import { type Fetcher } from '#commonHooks/useFetcher.ts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';

export const useAddSupportMessage = (
  message: string,
  setMessage: (updated: string) => void,
  fetcher: Fetcher,
  getCompany: () => any,
  getUserdata: () => User
) => {
  const fetchSend = (
    selectedID: string,
    onDone: (newCs?: any) => void,
    textAreaValue: string,
    companyID: string
  ) => {
    fetcher<any>('post', {
      body: {
        model: 'cs/index',
        ac: 'add',
        user_id: getUserdata().id,
        company_id: companyID,
        cs_body: !message.trim() ? textAreaValue : message,
        dad_id: selectedID,
      },
    }).then(({ data }) => {
      if (apiErrorValidation(data)) {
        return;
      }
      setMessage('');
      onDone(data?.cs);
    });
  };

  const handleSupportSubmit = (selectedID: string, onDone: () => void, textAreaValue: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetchSend(selectedID, onDone, textAreaValue, companyID);
  };

  return { handleSupportSubmit };
};
