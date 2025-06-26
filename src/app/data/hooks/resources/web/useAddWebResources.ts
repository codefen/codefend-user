import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, isNotEmpty } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';

export const verifyDomainName = (domainName: string) => {
  if (!isNotEmpty(domainName)) {
    toast.error(WEB_PANEL_TEXT.INVALID_DOMAIN);
    return true;
  }
  return false;
};

export const useAddWebResource = () => {
  const { getCompany } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const domainName = useRef<HTMLInputElement>(null);
  const subdomain_scan = useRef<HTMLInputElement>(null);

  const handleAddResource = () => {
    if (verifyDomainName(domainName.current?.value || '')) return Promise.reject(false);
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.reject(false);

    const toastId = toast.loading(WEB_PANEL_TEXT.SAVING_DOMAIN, {
      closeOnClick: true,
    });

    return fetcher<any>('post', {
      body: {
        company_id: companyID,
        resource_address_domain: domainName.current?.value || '',
        subdomain_scan: subdomain_scan.current?.checked ? 'yes' : 'no',
      },
      path: 'resources/web/add',
      timeout: 180000,
    })
      .then(({ data }) => {
        toast.dismiss(toastId);
        if (apiErrorValidation(data)) {
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
        toast.success(WEB_PANEL_TEXT.ADD_DOMAIN);
        return true;
      })
      .catch((error: any) => {
        toast.error(error.message);
        return false;
      });
  };

  return { handleAddResource, isLoading, domainName, subdomain_scan };
};
