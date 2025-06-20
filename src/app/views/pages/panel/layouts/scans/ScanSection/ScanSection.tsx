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
import { useUserData } from '#commonUserHooks/useUserData';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import { APP_MESSAGE_TOAST, SCAN_PAGE_TEXT, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { useVerifyScanList } from '@moduleHooks/neuroscan/useVerifyScanList';
import { BugIcon, GlobeWebIcon, ScanIcon, StatIcon, XCircleIcon } from '@icons';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import { verifyDomainName } from '@resourcesHooks/web/useAddWebResources';
import Tablev3 from '@table/v3/Tablev3';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { ConfirmModal, ModalTitleWrapper } from '@modals/index';
import useModalStore from '@stores/modal.store';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useAutoScan } from '@moduleHooks/neuroscan/useAutoScan';
import { naturalTime } from '@utils/helper';
import { useOrderStore } from '@stores/orders.store';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { SearchBarContainer } from '@/app/views/pages/panel/layouts/sns/components/SearchBarContainer';
import { IDIOM_SEARCHBAR_OPTION } from '@/app/constants/newSignupText';
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { useNavigate } from 'react-router';
import { useNewVerifyScanList } from '@moduleHooks/newscanner/useNewVerifyScanList';

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
export const ScanSection = () => {
  const [domainScanned, setDomainScanned] = useState<string>('');
  const [fetcher] = useFetcher();
  const { autoScan } = useAutoScan();
  const { getCompany, company } = useUserData();
  const {
    data: { scans, companyUpdated },
  } = useNewVerifyScanList();
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

  useEffect(() => {
    if (companyUpdated) {
      company.set(companyUpdated);
    }
  }, [companyUpdated]);

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
        company_id: company.get?.id,
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
    // {
    //   label: 'Stop Scan',
    //   icon: <XCircleIcon width="1.3rem" height="1.3rem" />,
    //   disabled: (row: any) =>
    //     row?.phase == ScanStepType.Killed || row?.phase == ScanStepType.Finished,
    //   onClick: (row: any) => startKillScan(row),
    // },
    {
      label: 'View scan details',
      icon: <ScanIcon />,
      // disabled: (row: any) =>
      //   row?.phase != ScanStepType.LAUNCHED && row?.phase != ScanStepType.Parser,
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
    const companyID = company.get?.id;
    if (companyIdIsNull(companyID)) return;
    // const toastId = toast.loading(WEB_PANEL_TEXT.VERIFY_DOMAIN, {
    //   closeOnClick: true,
    // });
    setLoading(true);
    autoScan(domainScanned?.trim?.() || '', false, '')
      .then(result => {
        if (apiErrorValidation(result)) {
          updateState('open', true);
          updateState('orderStepActive', OrderSection.PAYWALL_MAX_SCAN);
          updateState('resourceType', ResourcesTypes.WEB);
          appEvent.set(APP_EVENT_TYPE.LIMIT_REACHED_NEUROSCAN);
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
  const ultimo = scans.at(0);

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
        <SimpleSection header="AI based web security" icon={<StatIcon />}>
          <div className="content">
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
          </div>
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
