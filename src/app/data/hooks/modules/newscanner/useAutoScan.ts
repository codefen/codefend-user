import { useWelcomeStore } from '@stores/useWelcomeStore';
import { toast } from '@/app/data/utils';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useStreamFetch } from '#commonHooks/useStreamFetch';
import { MAX_SCAN_RETRIES } from '@/app/constants/empty';
import { AUTO_SCAN_STATE } from '@interfaces/panel';
import { mapScanObjToScanStartedScanObj } from '@utils/mapper';

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
    'scaningProgress',
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

  const autoScan = async (resourceAddress: string, openModel: boolean = true, idiom: string, scopeType: 'email' | 'website' = 'website') => {
    console.log('🚀 autoScan iniciado con:', { resourceAddress, openModel, idiom, scopeType });
    
    setNeuroScanId('');
    saveInitialDomain('');
    setIssueFound(0);
    setIssuesParsed(0);
    setScanStep(ScanStepType.NonScan);
    setDomainId(resourceAddress);

    const formData = new FormData();
    formData.append('model', 'neuroscans/mainwire');
    formData.append('resource_domain', resourceAddress);
    
    // Agregar el scope type
    if (scopeType === 'email') {
      formData.append('scope', 'email');
    }
    
    // Log crítico para debug
    console.log('📡 Enviando request con FormData:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    console.log('📡 Llamando streamFetch...');

    const result = await streamFetch(formData);
    
    console.log('📡 streamFetch result:', result);
    
    if (result) {
      if (result?.neuroscan?.id) {
        console.log('✅ Neuroscan creado con ID:', result.neuroscan.id);
        const activeMap =
          globalStore.scaningProgress.get instanceof Map
            ? globalStore.scaningProgress.get
            : new Map();
        globalStore.lastScanId.set(result.neuroscan.id);
        globalStore.currentScan.set(null);
        activeMap.set(result.neuroscan.id, mapScanObjToScanStartedScanObj(result.neuroscan));
        globalStore.scaningProgress.set(activeMap);
        setNeuroScanId(result.neuroscan.id);
        saveInitialDomain(result.neuroscan?.resource_address || '');
        
        // CRÍTICO: Activar el estado de scanning para que useVerifyScanListv3 haga polling cada 2s
        globalStore.isScanning.set(true);
        globalStore.autoScanState.set(AUTO_SCAN_STATE.LAUNCH_SCAN);
        console.log('✅ Estado de scanning activado - polling cada 2s');
      } else {
        console.log('❌ No se obtuvo neuroscan ID del resultado');
      }
      if (result.company) {
        globalStore.company.set(result.company);
      }
    } else {
      console.log('❌ streamFetch devolvió null');
    }

    return result;
  };

  return {
    autoScan,
    isLoading,
  };
};
