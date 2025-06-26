import { useFetcher } from '#commonHooks/useFetcher';
import { useState } from 'react';

export const useFindResellerArea = () => {
  const [fetcher] = useFetcher(true);
  const [resellers, setResellers] = useState<{ id: string; name: string }[]>([]);

  const findResellers = (alpha2: string) => {
    fetcher('post', {
      body: {
        area: alpha2,
      },
      path: 'resellers/index',
    }).then(({ data }: any) => {
      setResellers(data.resellers ? data.resellers : []);
    });
  };

  return [resellers, findResellers, setResellers] as const;
};
