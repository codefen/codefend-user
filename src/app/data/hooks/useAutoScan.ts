import { useContext } from 'react';
import { useStreamFetch } from './useStreamFetch';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export const useAutoScan = () => {
  const { streamFetch, isLoading } = useStreamFetch();
  const company = useGlobalFastField('company');
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

  const autoScan = async (resourceId: string, openModel: boolean = true) => {
    setNeuroScanId('');
    saveInitialDomain('');
    setIssueFound(0);
    setIssuesParsed(0);
    setScanStep(ScanStepType.NonScan);
    setDomainId(resourceId);

    const formData = new FormData();
    formData.append('model', 'modules/neuroscan/launch');
    formData.append('resource_id', resourceId);

    const result = await streamFetch(formData);

    if (result) {
      if (result.neuroscan?.id) {
        setNeuroScanId(result.neuroscan.id);
        saveInitialDomain(result.neuroscan?.resource_address || '');
        setScanStep(ScanStepType.Scanner);
        setScanRunning(openModel);
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
