import { useFetcher } from '#commonHooks/useFetcher';
import { useState } from 'react';

export const useFindResellerArea = () => {
  const [fetcher, _, isLoading] = useFetcher(true);
  const [resellers, setResellers] = useState<{ id: string; name: string }[]>([]);

  const findResellers = (alpha2: string) => {
    fetcher('post', {
      body: {
        model: 'resellers/index',
        area: alpha2,
      },
    }).then(({ data }: any) => {
      setResellers(data.resellers ? data.resellers : []);
    });
  };

  return [resellers, findResellers, setResellers] as const;
};
