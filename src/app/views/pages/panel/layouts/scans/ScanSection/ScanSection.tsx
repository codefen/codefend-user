import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import { APP_MESSAGE_TOAST, SCAN_PAGE_TEXT, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { useVerifyScanList } from '@moduleHooks/neuroscan/useVerifyScanList';
import { BugIcon, ScanIcon, StatIcon, XCircleIcon } from '@icons';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import { verifyDomainName } from '@resourcesHooks/web/useAddWebResources';
import Tablev3 from '@table/v3/Tablev3';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import css from './scanSection.module.scss';
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
    weight: '16.75%',
    render: val => (val ? naturalTime(val) : ''),
  },
  {
    header: 'Finish',
    key: 'finalizacion',
    styles: 'item-cell-5',
    weight: '16.75%',
    render: val => (val ? naturalTime(val) : '--/--/--'),
  },
];
export const ScanSection = () => {
  const [domainScanned, setDomainScanned] = useState<string>('');
  const [fetcher] = useFetcher();
  const { autoScan } = useAutoScan();
  const { getCompany, company } = useUserData();
  const {
    data: { scans, companyUpdated },
  } = useVerifyScanList();
  const { setIsOpen, setModalId, isOpen, modalId } = useModalStore();
  const [selectScan, setSelectScan] = useState<any>(null);
  const { appEvent } = useGlobalFastFields(['appEvent']);
  const { updateState } = useOrderStore();
  const [idiom, setIdiom] = useState<string>('en');
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

  const scanActions = [
    {
      label: 'View issues',
      icon: <BugIcon />,
      disabled: (row: any) => !row?.finalizacion,
      onClick: (row: any) => {
        navigate(`/issues?scan_id=${row.id}`);
      },
    },
    {
      label: 'Stop Scan',
      icon: <XCircleIcon width="1.3rem" height="1.3rem" />,
      disabled: (row: any) =>
        row?.phase == ScanStepType.Killed || row?.phase == ScanStepType.Finished,
      onClick: (row: any) => startKillScan(row),
    },
    {
      label: 'Open Scan progress',
      icon: <ScanIcon />,
      disabled: (row: any) =>
        row?.phase != ScanStepType.Scanner && row?.phase != ScanStepType.Parser,
      onClick: (row: any) => {
        setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
        setIsOpen(true);
      },
    },
  ];

  const startAndAddedDomain = () => {
    if (verifyDomainName(domainScanned || '')) return;
    const companyID = company.get?.id;
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
    </div>
  );
};
