import { useFetcher } from '#commonHooks/useFetcher.ts';

export const useAddCompanyUser = () => {
  const [fetcher] = useFetcher();

  const fetchAdd = (body: any) => {
    fetcher('post', {
      path: '/v1/approval/addusercompany',
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return { fetchAdd };
};
