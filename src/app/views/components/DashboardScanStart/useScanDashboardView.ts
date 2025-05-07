import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useEffect, useState } from 'react';

const getInProgress = (scans: any[]) =>
  scans.filter(s => s.phase === 'scanner' || s.phase === 'parser');

const getLatestScan = (scans: any[]) => {
  const ips = getInProgress(scans);
  if (ips.length === 0) return null;
  return ips.reduce((a, b) =>
    new Date(a.creacion).getTime() > new Date(b.creacion).getTime() ? a : b
  );
};

export const useScanDashboardView = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const [scanDashboardView, setScanDashboardView] = useState<any>([]);
  const isScanning = useGlobalFastField('isScanning');

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
      const currentLastScan = getLatestScan(latestScans || []);
      setScanDashboardView(latestScans || []);
      if (currentLastScan && !isScanning.get) {
        isScanning.set(true);
      }
    });
  }, []);

  return {
    scanDashboardView,
  };
};
