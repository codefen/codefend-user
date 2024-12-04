import { useState } from 'react';
import { useFetcher } from './useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';

export const useMessageState = () => {
  const [message, setMessage] = useState<string>('');
  const [fetcher, _, isLoading] = useFetcher();
  const { getUserdata, getCompany } = useUserData();
  return { message, isLoading, getCompany, getUserdata, setMessage, fetcher } as const;
};
