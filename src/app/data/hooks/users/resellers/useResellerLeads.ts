import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useRef } from 'react';
import type { Lead } from '@interfaces/lead';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { verifySession } from '@/app/constants/validations';

export const useResellerLeads = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const { getCompany, logout, company } = useUserData();
  const leads = useRef<Lead[]>([]);

  const getResellerLeads = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        company_id: getCompany(),
      },
      path: 'resellers/dashboard/leads',
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (apiErrorValidation(data)) {
        throw new Error('An error has occurred on the server');
      }
      leads.current = data.leads;
      company.set({
        id: data.company.id,
        name: data.company.name,
        sub_class: data.company.sub_class,
        web: data.company.web,
        size: data.company.size,
        pais_code: '',
        pais: '',
        pais_provincia: data.company.pais_provincia,
        pais_ciudad: data.company.pais_ciudad,
        owner_fname: '',
        owner_lname: '',
        owner_role: data.company.owner_role,
        owner_email: '',
        owner_phone: '',
        orders_size: '',
        profile_media: data.company.profile_media,
        mercado: '',
        isDisabled: false,
        createdAt: data.company.creacion,
      } as any);
    });
  };

  return [leads, { getResellerLeads, isLoading }] as const;
};
