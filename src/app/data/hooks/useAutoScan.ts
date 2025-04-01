import { useContext } from 'react';
import { useStreamFetch } from './useStreamFetch';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { toast } from 'react-toastify';

export const useAutoScan = () => {
  const { streamFetch, isLoading } = useStreamFetch();

  // Asumiendo que tienes un contexto global para estos estados
  const { setScanRunning, setScanStep, setNeuroScanId } = useWelcomeStore();

  const autoScan = async (resourceId: string) => {
    const formData = new FormData();
    formData.append('model', 'modules/neuroscan/launch');
    formData.append('resource_id', resourceId);

    const result = await streamFetch(formData);

    if (result) {
      setScanRunning(true);
      if (result.neuroscan?.id) {
        setNeuroScanId(result.neuroscan.id);
      }
      setScanStep('scanner');
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
