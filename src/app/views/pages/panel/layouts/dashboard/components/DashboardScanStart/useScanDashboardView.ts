import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { useEffect, useState } from 'react';

export const useScanDashboardView = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const [scanDashboardView, setScanDashboardView] = useState<any>([]);

  useEffect(() => {
    fetcher<any>('post', {
      body: {
        company_id: getCompany(),
      },
      path: 'modules/neuroscan/index',
      requireSession: true,
    }).then(({ data }) => {
      const scans = data.neuroscans;
      const latestScans = scans.sort((a: any, b: any) => b.id - a.id).slice(0, 3);
      setScanDashboardView(latestScans || []);
    });
  }, []);

  return {
    scanDashboardView,
  };
};
