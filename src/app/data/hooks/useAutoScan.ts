import { useContext } from 'react';
import { useStreamFetch } from './useStreamFetch';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { toast } from 'react-toastify';

export const useAutoScan = () => {
  const { streamFetch, isLoading } = useStreamFetch();
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
    setScanStep('nonScan');
    setDomainId(resourceId);

    const formData = new FormData();
    formData.append('model', 'modules/neuroscan/launch');
    formData.append('resource_id', resourceId);

    const result = await streamFetch(formData);

    if (result) {
      if (result.neuroscan?.id) {
        setNeuroScanId(result.neuroscan.id);
        saveInitialDomain(result.neuroscan?.resource_address || '');
        setScanStep('scanner');
        setScanRunning(openModel);
      }
      toast.info(
        result.info ||
          'The scan has started. Please wait a few minutes, and you will see the results.'
      );
    }

    return result;
  };

  return {
    autoScan,
    isLoading,
  };
};
