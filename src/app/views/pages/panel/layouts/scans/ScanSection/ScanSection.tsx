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
import { PrimaryButton } from '@/app/views/components/buttons/primary/PrimaryButton';
import { ScansTrendChart } from '@/app/views/components/charts/ScansTrendChart';

const scansColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1',
    weight: '6%',
    render: val => val,
  },
  {
    header: 'Domain',
    key: 'resource_address',
    styles: 'item-cell-2',
    weight: '28%',
    render: val => val,
  },
  {
    header: 'Phase',
    key: 'phase',
    styles: 'item-cell-3',
    weight: '15.75%',
    render: val => val,
  },
  {
    header: 'Found / Parsed',
    key: 'found_issues',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-4',
    weight: '15.75%',
    render: val => `${val?.m_nllm_issues_found} / ${val?.m_nllm_issues_parsed}`,
  },
  {
    header: 'Leaks',
    key: 'm_leaks_found',
    styles: 'item-cell-5',
    weight: '16.75%',
    render: val => val,
  },
  {
    header: 'Start',
    key: 'creacion',
    styles: 'item-cell-4',
    weight: '16.75%',
    render: val => (val ? naturalTime(val) : ''),
  },
];

interface SurveillanceRow {
  domain: string;
  lastScanDate?: string;
  lastIssues: number;
  lastLeaks: number;
  totalScans: number;
}

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

  const isWebSurveillance = location.pathname.startsWith('/web-surveillance');

  const headerContent = useMemo(() => {
    if (!isWebSurveillance) {
      return 'AI based web security';
    }
    if (selectedDomain) {
      return (
        <div className="breadcrumb-container">
          <span className="breadcrumb-link" onClick={() => navigate('/web-surveillance')}>
            Surveillance index
          </span>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-active">{selectedDomain} surveillance</span>
        </div>
      );
    }
    return 'Surveillance index';
  }, [isWebSurveillance, selectedDomain]);

  const groupedScans = useMemo(() => {
    if (!isWebSurveillance) return [];

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
  }, [scans, isWebSurveillance]);

  useEffect(() => {
    updateCompany();
  }, [scans]);

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
      path: 'modules/neuroscan/kill',
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
    navigate(`/web-surveillance/${domain}`);
  };

  const renderContent = () => {
    if (isWebSurveillance) {
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

    // Default view for /scans
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
          <div className="content">{renderContent()}</div>
        </SimpleSection>
      </div>

      {/* <div className="card scan-cards">
        <div className="scan-header">
          <h3>
            <GlobeWebIcon />
            Scan Result #{ultimo?.id}
          </h3>
          <span>Type: {ultimo?.resource_class} - Total scans: 1</span>
        </div>

        <div className="content">
          <div className="scan-card-item">
            <h4>Total issues</h4>
            <span>10</span>
          </div>
          <div className="scan-card-item">
            <h4>Scan status</h4>
            <span>Completed</span>
          </div>
          <div className="scan-card-item">
            <h4>Total time scanned</h4>
            <span>50 min</span>
          </div>
          <div className="scan-card-item">
            <h4>Scan periods</h4>
            <span>10/2/1 - 10/2/1</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};
