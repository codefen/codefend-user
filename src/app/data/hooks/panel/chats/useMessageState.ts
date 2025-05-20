import { useState } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { useFetcher } from '#commonHooks/useFetcher';

export const useMessageState = () => {
  const [message, setMessage] = useState<string>('');
  const [fetcher, _, isLoading] = useFetcher();
  const { getUserdata, getCompany } = useUserData();
  return { message, isLoading, getCompany, getUserdata, setMessage, fetcher } as const;
};
