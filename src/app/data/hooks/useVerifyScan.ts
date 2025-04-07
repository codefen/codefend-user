import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import useModalStore from '@stores/modal.store';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import useSWR from 'swr';

const fetcher = ([model, { company, resource_id, isScanRunning, neuroscan_id }]: any) => {
  if (!isScanRunning) return Promise.reject(false);
  if (companyIdIsNull(company)) return Promise.reject(false);
  return AxiosHttpService.getInstance()
    .post<any>({
      body: { company_id: company, resource_id: resource_id, model, neuroscan_id },
      requireSession: true,
      insecure: true,
    })
    .then(({ data }) => {
      return data;
    });
};

export const useVerifyScan = () => {
  // Recupera el company id del local storage
  const { getCompany } = useUserData();
  // Store para el scanner y welcome del usuario
  const {
    domainId,
    isScanRunning,
    scanStep,
    neuroScanId,
    issueScanFound,
    issuesParsed,
    setIssuesParsed,
    setScanRunning,
    setScanStep,
    setIssueFound,
  } = useWelcomeStore();
  const { setIsOpen } = useModalStore();
  const navigate = useNavigate();
  // Datos necesarios para el fetch del 'modules/neuroscan/view'
  const swrKeYRef = useRef<any>([
    'modules/neuroscan/view',
    { company: getCompany(), resource_id: domainId, isScanRunning, neuroscan_id: neuroScanId },
  ]);

  const { data } = useSWR(swrKeYRef.current, (key: any) => fetcher(key), {
    keepPreviousData: true,
    refreshInterval: 10000,
    revalidateOnReconnect: false,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    fallbackData: [],
  });

  useEffect(() => {
    // Actualiza los datos del endpoint / Necesario para evitar que SWR envie un dato en cache viejo
    swrKeYRef.current = [
      'modules/neuroscan/view',
      { company: getCompany(), resource_id: domainId, isScanRunning, neuroscan_id: neuroScanId },
    ];
    const currentPhase = data?.neuroscan?.phase as ScanStepType;
    const currentIssueFound = data?.neuroscan?.issues_found;
    const currentIssueParsed = data?.neuroscan?.issues_parsed;
    const hasError = data?.error === '1' || currentPhase === 'killed';
    // Verifica que datos actualizar del store
    if (currentIssueFound && issueScanFound !== currentIssueFound) {
      setIssueFound(currentIssueFound);
    }
    if (currentIssueParsed && issuesParsed !== currentIssueParsed) {
      setIssuesParsed(currentIssueParsed);
    }
    if (currentPhase !== scanStep) {
      setScanStep(currentPhase);
    }
    // Verifique si terminar el scan
    console.log('Entro al error primero', { isScanRunning, currentPhase, hasError });
    if ((isScanRunning && currentPhase === ScanStepType.Finished) || hasError) {
      console.log('Entro al error primero');
      setScanRunning(false);
      setScanStep(ScanStepType.NonScan);
      if (!hasError) {
        navigate('/issues');
      }
      setIsOpen(false);
    }
  }, [data, isScanRunning, neuroScanId]);
};
