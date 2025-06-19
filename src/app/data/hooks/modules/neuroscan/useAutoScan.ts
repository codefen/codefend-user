import { useWelcomeStore } from '@stores/useWelcomeStore';
import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useStreamFetch } from '#commonHooks/useStreamFetch';
import { MAX_SCAN_RETRIES } from '@/app/constants/empty';
import { AUTO_SCAN_STATE } from '@interfaces/panel';

export const useAutoScan = () => {
  const { streamFetch, isLoading } = useStreamFetch();
  const globalStore = useGlobalFastFields([
    'company',
    'isScanning',
    'scanProgress',
    'scanRetries',
    'user',
    'autoScanState',
    'lastScanId',
    'currentScan',
  ]);
  // Setear datos para el scanner
  const {
    setScanStep,
    setNeuroScanId,
    saveInitialDomain,
    setIssueFound,
    setIssuesParsed,
    setDomainId,
  } = useWelcomeStore();

  const autoScan = async (resourceAddress: string, openModel: boolean = true, idiom: string) => {
    setNeuroScanId('');
    saveInitialDomain('');
    setIssueFound(0);
    setIssuesParsed(0);
    setScanStep(ScanStepType.NonScan);
    setDomainId(resourceAddress);

    const formData = new FormData();
    formData.append('model', 'modules/neuroscan/mainwire');
    formData.append('resource_domain', resourceAddress);
    // const userIdiom = idiom || globalStore.user.get?.idiom;
    // formData.append('idiom', userIdiom || 'en');

    const result = await streamFetch(formData);
    if (result) {
      if (result?.neuroscan?.id) {
        globalStore.lastScanId.set(result.neuroscan.id);
        globalStore.currentScan.set(null);
        setNeuroScanId(result.neuroscan.id);
        saveInitialDomain(result.neuroscan?.resource_address || '');
        // globalStore.isScanning.set(true);
        // globalStore.currentScan.set(null);
        // globalStore.scanProgress.set(0);
        // globalStore.scanRetries.set(MAX_SCAN_RETRIES);
        // globalStore.autoScanState.set(AUTO_SCAN_STATE.LAUNCH_SCAN);
      }
      if (result.company) {
        globalStore.company.set(result.company);
      }
    }

    return result;
  };

  return {
    autoScan,
    isLoading,
  };
};
