import { useScanDashboardView } from '@/app/views/components/DashboardScanStart/useScanDashboardView';
import Tablev3 from '@table/v3/Tablev3';
import type { ColumnTableV3 } from '@interfaces/table';
import { PrimaryButton } from '@buttons/index';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { naturalTime } from '@utils/helper';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import { BugIcon, ScanIcon, XCircleIcon } from '@icons';
import { ConfirmModal, ModalTitleWrapper } from '@modals/index';
import { useAutoScan } from '@moduleHooks/newscanner/useAutoScan';
import { useState } from 'react';
import useModalStore from '@stores/modal.store';
import { SCAN_PAGE_TEXT } from '@/app/constants/app-toast-texts';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher';
import { useNavigate } from 'react-router';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { useUserData } from '#commonUserHooks/useUserData';

const scanColumns: ColumnTableV3[] = [
  {
    header: 'domain',
    key: 'resource_address',
    render: (value: any) => value,
    styles: 'item-cell-2',
    weight: '40%',
  },
  {
    header: 'total issues',
    type: TABLE_KEYS.FULL_ROW,
    key: 'm_nllm_issues_parsed',
    render: (value: any) => getTotalIssues(value),
    styles: 'item-cell-3',
    weight: '25%',
  },
  {
    header: 'date',
    key: 'creacion',
    render: val => naturalTime(val),
    styles: 'item-cell-1',
    weight: '35%',
  },
];

const getTotalIssues = (scan: any) => {
  const webScanNumber = Number(scan?.m_nllm_issues_parsed);
  const leakScanNumber = Number(scan?.m_leaks_found);
  const notHaveWebScan = !webScanNumber || isNaN(webScanNumber);
  const notHaveLeakScan = !leakScanNumber || isNaN(leakScanNumber);
  if (notHaveWebScan && notHaveLeakScan) {
    return 0;
  }
  if (notHaveWebScan) {
    return leakScanNumber;
  }
  if (notHaveLeakScan) {
    return webScanNumber;
  }
  return webScanNumber + leakScanNumber;
};

export const DashboardScanStart = () => {
  const [fetcher] = useFetcher();
  const { setIsOpen, setModalId, isOpen, modalId } = useModalStore();
  const [selectScan, setSelectScan] = useState<any>(null);
  const { scanDashboardView, isLoading } = useScanDashboardView();
  const navigate = useNavigate();
  const { currentScan, lastScanId } = useGlobalFastFields(['currentScan', 'lastScanId']);
  const { company } = useUserData();

  const killScan = () => {
    const neuroscan_id = selectScan.id;
    const companyId = company.get?.id;
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
    {
      label: 'Stop Scan',
      icon: <XCircleIcon />,
      disabled: (row: any) => row?.phase !== ScanStepType.LAUNCHED,
      onClick: (row: any) => {
        startKillScan(row);
      },
    },
  ];

  return (
    <div className="card stats scan-start">
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
      <div className="over">
        <div className="header">
          <div className="table-title">
            <h2>Automatic scans</h2>
          </div>
        </div>
        <p>Currently there are no scans in progress</p>

        <Tablev3
          columns={scanColumns}
          rows={scanDashboardView}
          showSkeleton={isLoading}
          totalRowCount={5}
          showRows={true}
          contextMenuActions={scanActions}
          enableContextMenu={true}
        />
        <PrimaryButton
          text="View all scans"
          buttonStyle="gray"
          className="btn-mobile-small"
          click={() => navigate('/scans')}
        />
      </div>
    </div>
  );
};
