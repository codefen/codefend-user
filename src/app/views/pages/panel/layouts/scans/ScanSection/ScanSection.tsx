import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import { APP_MESSAGE_TOAST, SCAN_PAGE_TEXT, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { useAutoScan } from '@hooks/useAutoScan';
import { useVerifyScanList } from '@hooks/useVerifyScanList';
import { KnifeIcon, ScanSearchIcon, StatIcon, TrashIcon, XCircleIcon } from '@icons';
import type { ColumnTableV3 } from '@interfaces/table';
import { verifyDomainName } from '@resourcesHooks/web/useAddWebResources';
import type { useWelcomeStore } from '@stores/useWelcomeStore';
import Tablev3 from '@table/v3/Tablev3';
import { useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import css from './scanSection.module.scss';
import { ConfirmModal, ModalTitleWrapper } from '@modals/index';
import useModalStore from '@stores/modal.store';
import { ScanStepType } from '@/app/constants/welcome-steps';

const scansColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1.1',
    weight: '4%',
    render: val => val,
  },
  {
    header: 'R-ID',
    key: 'resource_id',
    styles: 'item-cell-2',
    weight: '4%',
    render: val => val,
  },
  {
    header: 'USER-ID',
    key: 'user_id',
    styles: 'item-cell-2',
    weight: '3.5%',
    render: val => val,
  },
  {
    header: 'Domain',
    key: 'resource_address',
    styles: 'item-cell-2',
    weight: '8%',
    render: val => val,
  },
  {
    header: 'Phase',
    key: 'phase',
    styles: 'item-cell-3',
    weight: '5%',
    render: val => val,
  },
  {
    header: 'Found/Parsed',
    key: 'issues_found',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-4',
    weight: '7%',
    render: val => `${val?.issues_found} / ${val?.issues_parsed}`,
  },
  {
    header: 'PRC-UUID',
    key: 'process_uuid',
    styles: 'item-cell-5',
    weight: '16%',
    render: val => val,
  },
  {
    header: 'Scan PID',
    key: 'scanner_pid',
    styles: 'item-cell-6',
    weight: '5%',
    render: val => val,
  },
  {
    header: 'Version',
    key: 'scanner_version',
    styles: 'item-cell-7',
    weight: '6%',
    render: val => val,
  },
  {
    header: 'LLM',
    key: 'llm_provider',
    styles: 'item-cell-8',
    weight: '5%',
    render: val => val,
  },
  {
    header: 'LLM-BAI',
    key: 'llm_balance_inicial',
    styles: 'item-cell-9',
    weight: '5%',
    render: val => val,
  },
  {
    header: 'LLM-BAF',
    key: 'llm_balance_final',
    styles: 'item-cell-10',
    weight: '5%',
    render: val => val,
  },
  {
    header: 'Bog Down',
    key: 'demora',
    styles: 'item-cell-12',
    weight: '7%',
    render: val => (val ? val : '---'),
  },
  {
    header: 'Started',
    key: 'creacion',
    styles: 'item-cell-11',
    weight: '8.5%',
    render: val => (val ? val : ''),
  },
  {
    header: 'Finished',
    key: 'finalizacion',
    styles: 'item-cell-13',
    weight: '8.5%',
    render: val => (val ? val : '--/--/--'),
  },
];

export const ScanSection = () => {
  const [domainScanned, setDomainScanned] = useState<string>('');
  const [fetcher] = useFetcher();
  const { autoScan } = useAutoScan();
  const { getCompany } = useUserData();
  const { scans } = useVerifyScanList();
  const { setIsOpen, setModalId, isOpen, modalId } = useModalStore();
  const [selectScan, setSelectScan] = useState<any>(null);

  const killScan = () => {
    const neuroscan_id = selectScan.id;
    if (!neuroscan_id) {
      setIsOpen(false);
      toast.error(SCAN_PAGE_TEXT.SCAN_KILL_NO_SELECTED);
      return;
    }
    fetcher('post', {
      body: {
        model: 'modules/neuroscan/kill',
        neuroscan_id,
        company_id: getCompany(),
      },
      requireSession: true,
    }).then(() => {
      toast.success(SCAN_PAGE_TEXT.SCAN_KILLED_SUCCESS);
      setIsOpen(false);
    });
  };

  const startKillScan = (row: any) => {
    if (row?.phase === ScanStepType.Killed) {
      return;
    }
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.START_KILL_SCAN);
    setSelectScan(row);
  };

  const scansColumnAction = [
    ...scansColumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-14 action',
      weight: '2.5%',
      render: (row: any) => (
        <div className="publish" key={`actr-${row.id}`}>
          <span
            title="Kill process"
            aria-disabled={row?.phase === ScanStepType.Killed}
            className={row?.phase === ScanStepType.Killed ? 'disabled-btn' : ''}
            onClick={() => startKillScan(row)}>
            <XCircleIcon />
          </span>
        </div>
      ),
    },
  ];

  const startAndAddedDomain = () => {
    if (verifyDomainName(domainScanned || '')) return;
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    const toastId = toast.loading(WEB_PANEL_TEXT.VERIFY_DOMAIN, {
      closeOnClick: true,
    });
    fetcher<any>('post', {
      body: {
        model: 'resources/web/add',
        company_id: companyID,
        resource_address_domain: domainScanned || '',
        subdomain_scan: 'no',
      },
      timeout: 180000,
    })
      .then(({ data }) => {
        toast.dismiss(toastId);
        if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
          throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }

        const resourceId = data?.resource?.id;
        if (resourceId) {
          autoScan(resourceId, false).then(result => {
            if (result?.neuroscan?.id) {
              toast.success(APP_MESSAGE_TOAST.START_SCAN);
            }
          });
        }
      })
      .catch((error: any) => {
        toast.error(error?.info || error?.message || '');
      });
  };

  return (
    <div className={css['scan-section-container']}>
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
      <div>
        <SearchBar
          handleChange={(e: ChangeEvent<HTMLInputElement>) => setDomainScanned(e.target.value)}
          placeHolder="Search"
          inputValue={domainScanned}
          handleSubmit={startAndAddedDomain}
          searchIcon={<ScanSearchIcon isButton />}
        />
      </div>
      <div className="card">
        <SimpleSection header="Company Scanners" icon={<StatIcon />}>
          <div className="content">
            <Tablev3 rows={scans} columns={scansColumnAction} showRows={true} />
          </div>
        </SimpleSection>
      </div>
    </div>
  );
};
