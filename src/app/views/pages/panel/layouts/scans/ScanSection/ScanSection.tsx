import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import { APP_MESSAGE_TOAST, SCAN_PAGE_TEXT, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { useVerifyScanList } from '@moduleHooks/neuroscan/useVerifyScanList';
import { StatIcon, XCircleIcon } from '@icons';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import { verifyDomainName } from '@resourcesHooks/web/useAddWebResources';
import Tablev3 from '@table/v3/Tablev3';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import css from './scanSection.module.scss';
import { ConfirmModal, ModalTitleWrapper } from '@modals/index';
import useModalStore from '@stores/modal.store';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useAutoScan } from '@moduleHooks/neuroscan/useAutoScan';
import { naturalTime } from '@utils/helper';
import { useOrderStore } from '@stores/orders.store';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { SearchBarContainer } from '@/app/views/pages/panel/layouts/sns/components/SearchBarContainer';
import { IDIOM_SEARCHBAR_OPTION, idiomOptions } from '@/app/constants/newSignupText';

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
    weight: '26%',
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
    key: 'issues_found',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-4',
    weight: '15.75%',
    render: val => `${val?.issues_found} / ${val?.issues_parsed}`,
  },
  {
    header: 'Start',
    key: 'creacion',
    styles: 'item-cell-4',
    weight: '15.75%',
    render: val => (val ? naturalTime(val) : ''),
  },
  {
    header: 'Finish',
    key: 'finalizacion',
    styles: 'item-cell-5',
    weight: '15.75%',
    render: val => (val ? naturalTime(val) : '--/--/--'),
  },
];
export const ScanSection = () => {
  const [domainScanned, setDomainScanned] = useState<string>('');
  const [fetcher] = useFetcher();
  const { autoScan } = useAutoScan();
  const { getCompany } = useUserData();
  const {
    data: { scans, companyUpdated },
  } = useVerifyScanList();
  const { setIsOpen, setModalId, isOpen, modalId } = useModalStore();
  const [selectScan, setSelectScan] = useState<any>(null);
  const company = useGlobalFastField('company');
  const { updateState } = useOrderStore();
  const [idiom, setIdiom] = useState<string>('en');

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
        company_id: getCompany(),
      },
      path: 'modules/neuroscan/kill',
      requireSession: true,
    }).then(() => {
      toast.success(SCAN_PAGE_TEXT.SCAN_KILLED_SUCCESS);
      setIsOpen(false);
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

  const scansColumnAction = [
    ...scansColumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: `item-cell-16 action ${css['disabled-btn']}`,
      weight: '4%',
      render: (row: any) => (
        <div className="publish" key={`actr-${row.id}`}>
          <span
            title="Kill process"
            aria-disabled={
              row?.phase === ScanStepType.Killed || row?.phase === ScanStepType.Finished
            }
            className={
              row?.phase === ScanStepType.Killed || row?.phase === ScanStepType.Finished
                ? 'disabled-this'
                : ''
            }
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
        company_id: companyID,
        resource_address_domain: domainScanned?.trim?.() || '',
        subdomain_scan: 'no',
      },
      path: 'resources/web/add',
      timeout: 180000,
    })
      .then(({ data }) => {
        toast.dismiss(toastId);
        const resourceId = data?.resource?.id;
        if (resourceId) {
          // if (data?.company) company.set(data.company);
          autoScan(resourceId, false, idiom).then(result => {
            if (apiErrorValidation(result)) {
              updateState('open', true);
              updateState('orderStepActive', OrderSection.PAYWALL);
              updateState('resourceType', ResourcesTypes.WEB);
              return;
            }

            if (result?.neuroscan?.id) {
              toast.success(APP_MESSAGE_TOAST.START_SCAN);
              setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
              setIsOpen(true);
            }
          });
        } else {
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
      })
      .catch((error: any) => {
        toast.error(error?.info || error?.message || '');
      });
  };

  const selectBarOptions = {
    options: IDIOM_SEARCHBAR_OPTION,
    placeHolder: '',
    value: idiom,
    change: (e: ChangeEvent<HTMLSelectElement>) => setIdiom(e.target.value),
    defaultSelectOption: 'en',
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
      <SearchBarContainer
        placeholder="Write a domain to scan"
        searchText="Start Scan"
        selectBarOptions={selectBarOptions}
        handleSubmit={startAndAddedDomain}
        searchData={domainScanned}
        setSearchData={setDomainScanned}
      />
      <div className="card">
        <SimpleSection header="Company Scanners" icon={<StatIcon />}>
          <div className="content">
            <Tablev3
              rows={scans}
              columns={scansColumnAction}
              showRows={true}
              initialSort={Sort.desc}
              initialOrder="creacion"
            />
          </div>
        </SimpleSection>
      </div>
    </div>
  );
};
