import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { defaultConfig, genericFetcher } from '@services/swr';
import { useEffect } from 'react';
import useSWR from 'swr';

export const useGetCompany = () => {
  const { logout } = useUserData();
  const { company, user, companies, session } = useGlobalFastFields([
    'user',
    'company',
    'companies',
    'session',
  ]);
  const { data, isLoading, isValidating } = useSWR(
    'companies/index',
    () => genericFetcher(['companies/index', { logout }]),
    {
      ...defaultConfig,
      fallbackData: { companies: [] },
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshInterval: 0,
      dedupingInterval: 60000, // 1 minuto
    }
  );

  useEffect(() => {
    if (data?.companies && data?.companies?.length !== companies.get?.length) {
      companies.set(data?.companies);
    }
    if (data?.user) user.set(data?.user);
    if (data?.session) session.set(data?.session);
  }, [data]);



  return {
    data: data?.companies || [],
    isLoading: isLoading || isValidating,
    company,
  };
};
