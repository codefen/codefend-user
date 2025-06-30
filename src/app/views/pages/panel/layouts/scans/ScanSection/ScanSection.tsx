/**
 * Componente principal para la tabla de escaneos
 * Este componente maneja:
 * - Definición de columnas de la tabla de escaneos
 * - Renderizado de información de escaneos incluyendo:
 *   - ID del escaneo
 *   - Dominio (resource_address)
 *   - Fase del escaneo
 *   - Issues encontrados/parseados
 *   - Fechas de inicio/fin
 * - Integración con el sistema de filtros
 */

import { useFetcher } from '#commonHooks/useFetcher';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import { APP_MESSAGE_TOAST, SCAN_PAGE_TEXT, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { BugIcon, ScanIcon, StatIcon } from '@icons';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import { verifyDomainName } from '@resourcesHooks/web/useAddWebResources';
import Tablev3 from '@table/v3/Tablev3';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { ConfirmModal, ModalTitleWrapper } from '@modals/index';
import useModalStore from '@stores/modal.store';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useAutoScan } from '@moduleHooks/newscanner/useAutoScan';
import { naturalTime } from '@utils/helper';
import { useOrderStore } from '@stores/orders.store';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { SearchBarContainer } from '@/app/views/pages/panel/layouts/sns/components/SearchBarContainer';
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useNewVerifyScanList } from '@moduleHooks/newscanner/useNewVerifyScanList';
import { PrimaryButton } from '@buttons/index';
import { ScansTrendChart } from '@/app/views/components/charts/ScansTrendChart';

// Definir tipo para las pestañas
type TabType = 'scans' | 'surveillance';

const scansColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    weight: '7%',
    styles: 'item-cell-1',
    render: (val: number) => val,
  },
  {
    header: 'Domain',
    key: 'resource_address',
    weight: '25%',
    styles: 'item-cell-2',
    render: (val: string) => val,
  },
  {
    header: 'Phase',
    key: 'phase',
    weight: '15%',
    styles: 'item-cell-3',
    render: (val: string) => val,
  },
  {
    header: 'Found / Parsed',
    key: 'issues',
    weight: '18%',
    styles: 'item-cell-4',
    render: (row: any) => {
      // Diagnóstico mejorado para debugging
      const found = row?.m_nllm_issues_found;
      const parsed = row?.m_nllm_issues_parsed;
      
      // Logging para debugging (puedes remover esto después)
      if (found !== undefined || parsed !== undefined) {
        console.log('Scan Row Data:', {
          id: row?.id,
          found: found,
          parsed: parsed,
          foundType: typeof found,
          parsedType: typeof parsed,
          originalRow: row
        });
      }
      
      // Mejor manejo de valores null/undefined/string
      const foundValue = found !== null && found !== undefined ? 
        (typeof found === 'string' ? parseInt(found) : found) : 0;
      const parsedValue = parsed !== null && parsed !== undefined ? 
        (typeof parsed === 'string' ? parseInt(parsed) : parsed) : 0;
      
      return `${foundValue} / ${parsedValue}`;
    },
  },
  {
    header: 'Leaks',
    key: 'm_leaks_found',
    weight: '8%',
    styles: 'item-cell-5',
    render: (val: number) => val || 0,
  },
  {
    header: 'Start ↓',
    key: 'creacion',
    weight: '27%',
    styles: 'item-cell-6',
    render: (val: string) => naturalTime(val),
  },
];

const surveillanceColumns = (handleDomainClick: (domain: string) => void): ColumnTableV3[] => [
  {
    header: 'Domain',
    key: 'domain',
    weight: '25%',
    styles: 'item-cell-1',
    render: (val: string) => val,
  },
  {
    header: 'Last scan date',
    key: 'lastScanDate',
    weight: '20%',
    styles: 'item-cell-2',
    render: (val: string) => (val ? new Date(val).toLocaleString() : 'N/A'),
  },
  {
    header: 'Last issues found',
    key: 'lastIssues',
    weight: '15%',
    styles: 'item-cell-3',
    render: (val: number) => val,
  },
  {
    header: 'Last leaks found',
    key: 'lastLeaks',
    weight: '15%',
    styles: 'item-cell-4',
    render: (val: number) => val,
  },
  {
    header: 'Total Scans',
    key: 'totalScans',
    weight: '15%',
    styles: 'item-cell-5',
    render: (val: number) => val,
  },
  {
    header: 'Actions',
    key: 'actions',
    weight: '10%',
    styles: 'item-cell-5',
    type: TABLE_KEYS.FULL_ROW,
    render: (row: any) => <PrimaryButton text="View" click={() => handleDomainClick(row.domain)} />,
  },
];

export const ScanSection = () => {
  const [domainScanned, setDomainScanned] = useState<string>('');
  const [fetcher] = useFetcher();
  const { autoScan } = useAutoScan();
  const { scans, updateCompany, companyId } = useNewVerifyScanList();
  const { setIsOpen, setModalId, isOpen, modalId } = useModalStore();
  const [selectScan, setSelectScan] = useState<any>(null);
  const { appEvent, currentScan, lastScanId } = useGlobalFastFields([
    'appEvent',
    'currentScan',
    'lastScanId',
  ]);
  const { updateState } = useOrderStore();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { domain: selectedDomain } = useParams<{ domain: string }>();

  // Estado para pestañas - determinar pestaña activa basada en la ruta
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (location.pathname.startsWith('/ai-surveillance')) {
      const searchParams = new URLSearchParams(location.search);
      return (searchParams.get('tab') as TabType) || 'scans';
    }
    // Backward compatibility
    if (location.pathname.startsWith('/web-surveillance')) return 'surveillance';
    return 'scans';
  });

  // Determinar si estamos en la nueva ruta unificada
  const isUnifiedRoute = location.pathname.startsWith('/ai-surveillance');
  const isLegacyWebSurveillance = location.pathname.startsWith('/web-surveillance');

  const headerContent = useMemo(() => {
    if (isUnifiedRoute) {
      return 'AI Surveillance';
    }
    if (isLegacyWebSurveillance) {
      if (selectedDomain) {
        return (
          <div className="breadcrumb-container">
            <span className="breadcrumb-link" onClick={() => navigate('/ai-surveillance?tab=surveillance')}>
              Surveillance index
            </span>
            <span className="breadcrumb-separator"> / </span>
            <span className="breadcrumb-active">{selectedDomain} surveillance</span>
          </div>
        );
      }
      return 'Surveillance index';
    }
    return 'AI based web security';
  }, [isUnifiedRoute, isLegacyWebSurveillance, selectedDomain]);

  const groupedScans = useMemo(() => {
    if (activeTab !== 'surveillance' && !isLegacyWebSurveillance) return [];

    const groups: { [key: string]: any[] } = {};
    scans.forEach((scan: any) => {
      const domain = scan.resource_address;
      if (!groups[domain]) {
        groups[domain] = [];
      }
      groups[domain].push(scan);
    });

    return Object.entries(groups).map(([domain, domainScans]) => {
      const finishedScans = domainScans.filter(s => s.phase === 'finished');
      const latestFinishedScan = finishedScans.sort(
        (a, b) => new Date(b.creacion).getTime() - new Date(a.creacion).getTime()
      )[0];

      return {
        domain,
        lastScanDate: latestFinishedScan?.creacion,
        lastIssues: latestFinishedScan?.m_nllm_issues_parsed || 0,
        lastLeaks: latestFinishedScan?.m_leaks_found || 0,
        totalScans: domainScans.length,
      };
    });
  }, [scans, activeTab, isLegacyWebSurveillance]);

  useEffect(() => {
    updateCompany();
  }, [scans]);

  // Manejar cambio de pestañas
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (isUnifiedRoute) {
      navigate(`/ai-surveillance?tab=${tab}`, { replace: true });
    }
  };

  const killScan = () => {
    const neuroscan_id = selectScan.id;
    if (!neuroscan_id) {
      setIsOpen(false);
      toast.error(SCAN_PAGE_TEXT.SCAN_KILL_NO_SELECTED);
      return;
    }
    fetcher('post', {
      body: {
        neuroscan_id,
        company_id: companyId,
      },
      path: 'neuroscans/kill',
      requireSession: true,
    }).then(({ neuroscan }: any) => {
      toast.success(SCAN_PAGE_TEXT.SCAN_KILLED_SUCCESS);
      setIsOpen(false);
      if (neuroscan?.id === currentScan.get?.id) {
        currentScan.set(neuroscan);
      }
    });
  };

  const startKillScan = (row: any) => {
    if (row?.phase === ScanStepType.Killed || row?.phase === ScanStepType.Finished) {
      return;
    }
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.START_KILL_SCAN);
    setSelectScan(row);
  };

  const scanActions = [
    {
      label: 'View issues',
      icon: <BugIcon />,
      disabled: (row: any) => row?.m_nllm_issues_parsed <= 0 && row?.m_leaks_found <= 0,
      onClick: (row: any) => {
        navigate(`/issues?scan_id=${row.id}`);
      },
    },
    {
      label: 'View scan details',
      icon: <ScanIcon />,
      onClick: (row: any) => {
        lastScanId.set(row.id);
        currentScan.set(row?.phase === ScanStepType.Finished ? row : null);
        setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
        setIsOpen(true);
      },
    },
  ];

  const startAndAddedDomain = () => {
    if (verifyDomainName(domainScanned || '')) return;
    if (companyIdIsNull(companyId)) return;

    setLoading(true);
    autoScan(domainScanned?.trim?.() || '', false, '')
      .then(result => {
        if (apiErrorValidation(result)) {
          if (result?.error_info === 'neuroscan_unreachable_domain') {
            toast.error(result?.info);
          } else {
            updateState('open', true);
            updateState('orderStepActive', OrderSection.PAYWALL_MAX_SCAN);
            updateState('resourceType', ResourcesTypes.WEB);
            appEvent.set(APP_EVENT_TYPE.LIMIT_REACHED_NEUROSCAN);
          }
          return;
        }

        if (result?.neuroscan?.id) {
          toast.success(APP_MESSAGE_TOAST.START_SCAN);
          setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
          setIsOpen(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDomainClick = (domain: string) => {
    if (isUnifiedRoute) {
      navigate(`/ai-surveillance/${domain}?tab=surveillance`);
    } else {
      navigate(`/web-surveillance/${domain}`);
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'surveillance' || isLegacyWebSurveillance) {
      if (selectedDomain) {
        const filteredScans = scans.filter((s: any) => s.resource_address === selectedDomain);

        if (filteredScans.length === 0) {
          return <p>There are no such records in our databases.</p>;
        }

        return (
          <>
            <ScansTrendChart data={filteredScans} />
            <Tablev3
              rows={filteredScans}
              columns={scansColumns}
              showRows={true}
              initialSort={Sort.desc}
              initialOrder="creacion"
              isNeedSort
              enableContextMenu
              contextMenuActions={scanActions}
            />
          </>
        );
      } else {
        return (
          <Tablev3
            rows={groupedScans}
            columns={surveillanceColumns(handleDomainClick)}
            showRows={true}
            initialSort={Sort.desc}
            initialOrder="lastScanDate"
            isNeedSort
          />
        );
      }
    }

    // Vista de scans por defecto
    return (
      <Tablev3
        rows={scans}
        columns={scansColumns}
        showRows={true}
        initialSort={Sort.desc}
        initialOrder="creacion"
        isNeedSort
        enableContextMenu
        contextMenuActions={scanActions}
      />
    );
  };

  return (
    <div className="scan-section-container">
      <ModalTitleWrapper
        isActive={isOpen && modalId === MODAL_KEY_OPEN.START_KILL_SCAN}
        close={() => setIsOpen(false)}
        type="med-w"
        headerTitle="Confirm Kill Scan">
        <ConfirmModal
          confirmText="Confirm"
          cancelText="Cancel"
          header="Are you sure you want to kill this automatic analysis process?"
          action={killScan}
          close={() => setIsOpen(false)}
        />
      </ModalTitleWrapper>
      <SearchBarContainer
        placeholder="Write a domain to scan"
        searchText="Start Scan"
        handleSubmit={startAndAddedDomain}
        searchData={domainScanned}
        setSearchData={setDomainScanned}
        isDisabled={loading}
      />
      <div className="card">
        <SimpleSection header={headerContent} icon={<StatIcon />}>
          {/* Pestañas solo para la ruta unificada */}
          {isUnifiedRoute && (
            <div className="tabs-container">
              <div className="tabs-header">
                <button
                  className={`tab-button ${activeTab === 'scans' ? 'active' : ''}`}
                  onClick={() => handleTabChange('scans')}>
                  AI Scans
                </button>
                <button
                  className={`tab-button ${activeTab === 'surveillance' ? 'active' : ''}`}
                  onClick={() => handleTabChange('surveillance')}>
                  Web Surveillance
                </button>
              </div>
            </div>
          )}
          <div className="content">{renderTabContent()}</div>
        </SimpleSection>
      </div>
    </div>
  );
};
