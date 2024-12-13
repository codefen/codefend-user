import { useFetcher } from '#commonHooks/useFetcher';

export const useGetCompany = () => {
  const [fetcher, _, isLoading] = useFetcher();

  const getCompany = () => {
    return fetcher('post', {
      body: {
        model: 'companies/index',
      },
    });
  };

  return { getCompany, loading: isLoading };
};
