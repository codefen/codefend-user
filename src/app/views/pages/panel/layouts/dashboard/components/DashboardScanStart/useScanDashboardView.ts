import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useEffect, useState } from 'react';

export const useScanDashboardView = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const [scanDashboardView, setScanDashboardView] = useState<any>([]);
  const [isScanning, setIsScanRunning] = useState<boolean>(false);
  const {
    initialDomain,
    issueScanFound,
    issuesParsed,
    setIssueFound,
    setIssuesParsed,
    isScanRunning,
  } = useWelcomeStore();

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
      const currentScan = scans.find(
        (scan: any) => scan.phase === 'scanner' || scan.phase === 'parser'
      );
      setIsScanRunning(
        scans.some((scan: any) => scan.phase === 'scanner' || scan.phase === 'parser')
      );
      setScanDashboardView(latestScans || []);
      if (currentScan) {
        setIssueFound(currentScan.issues_parsed);
        setIssuesParsed(currentScan.issues_found);
      }
    });
  }, []);

  return {
    scanDashboardView,
    isScanRunning: isScanning || isScanRunning,
    initialDomain,
    issueScanFound,
    issuesParsed,
  };
};
