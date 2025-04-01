import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, isNotEmpty } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';

const verifyDomainName = (domainName: string) => {
  if (!isNotEmpty(domainName)) {
    toast.error(WEB_PANEL_TEXT.INVALID_DOMAIN);
    return true;
  }
  return false;
};

export const useAddWebResource = (onDone: () => void, onClose: () => void) => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const domainName = useRef<HTMLInputElement>(null);
  const subdomain_scan = useRef<HTMLInputElement>(null);

  const handleAddResource = () => {
    if (verifyDomainName(domainName.current?.value || '')) return;

    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;

    const toastId = toast.loading(WEB_PANEL_TEXT.SAVING_DOMAIN, {
      closeOnClick: true,
    });

    onClose();
    fetcher<any>('post', {
      body: {
        model: 'resources/web/add',
        company_id: companyID,
        resource_address_domain: domainName.current?.value || '',
        subdomain_scan: subdomain_scan.current?.checked ? 'yes' : 'no',
      },
      timeout: 180000,
    })
      .then(({ data }) => {
        toast.dismiss(toastId);
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        toast.success(WEB_PANEL_TEXT.ADD_DOMAIN);
        onDone();
      })
      .catch((error: any) => toast.error(error.message));
  };

  return { handleAddResource, isLoading, domainName, subdomain_scan };
};
