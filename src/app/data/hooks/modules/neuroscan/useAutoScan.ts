import { useContext } from 'react';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useStreamFetch } from '#commonHooks/useStreamFetch';
import { MAX_SCAN_RETRIES } from '@/app/constants/empty';

export const useAutoScan = () => {
  const { streamFetch, isLoading } = useStreamFetch();
  const globalStore = useGlobalFastFields([
    'company',
    'isScanning',
    'currentScan',
    'scanProgress',
    'scanRetries',
    'user',
  ]);
  // Setear datos para el scanner
  const {
    setScanRunning,
    setScanStep,
    setNeuroScanId,
    saveInitialDomain,
    setIssueFound,
    setIssuesParsed,
    setDomainId,
  } = useWelcomeStore();

  const autoScan = async (resourceId: string, openModel: boolean = true, idiom: string) => {
    setNeuroScanId('');
    saveInitialDomain('');
    setIssueFound(0);
    setIssuesParsed(0);
    setScanStep(ScanStepType.NonScan);
    setDomainId(resourceId);

    const formData = new FormData();
    formData.append('model', 'modules/neuroscan/launch');
    formData.append('resource_id', resourceId);
    const userIdiom = idiom || globalStore.user.get?.idiom;
    formData.append('idiom', userIdiom || 'en');

    const result = await streamFetch(formData);
    if (result) {
      if (result?.neuroscan?.id) {
        setNeuroScanId(result.neuroscan.id);
        saveInitialDomain(result.neuroscan?.resource_address || '');
        setScanStep(ScanStepType.Scanner);
        setScanRunning(openModel);
        globalStore.isScanning.set(true);
        globalStore.currentScan.set(null);
        globalStore.scanProgress.set(0);
        globalStore.scanRetries.set(MAX_SCAN_RETRIES);
      }
      if (result.company) {
        globalStore.company.set(result.company);
      }
      toast.info(result.info || APP_MESSAGE_TOAST.SCAN_INFO);
    }

    return result;
  };

  return {
    autoScan,
    isLoading,
  };
};
