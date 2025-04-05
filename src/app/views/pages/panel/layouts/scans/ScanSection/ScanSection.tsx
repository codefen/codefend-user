import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import { APP_MESSAGE_TOAST, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { useAutoScan } from '@hooks/useAutoScan';
import { useVerifyScanList } from '@hooks/useVerifyScanList';
import { ScanSearchIcon, StatIcon, TrashIcon } from '@icons';
import type { ColumnTableV3 } from '@interfaces/table';
import { verifyDomainName } from '@resourcesHooks/web/useAddWebResources';
import type { useWelcomeStore } from '@stores/useWelcomeStore';
import Tablev3 from '@table/v3/Tablev3';
import { useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import css from './scanSection.module.scss';

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
    header: 'Created at',
    key: 'creacion',
    styles: 'item-cell-4',
    weight: '15.75%',
    render: val => (val ? val : ''),
  },
  {
    header: 'Finalize',
    key: 'finalizacion',
    styles: 'item-cell-5',
    weight: '15.75%',
    render: val => (val ? val : '--/--/--'),
  },
];

export const ScanSection = () => {
  const [domainScanned, setDomainScanned] = useState<string>('');
  const [fetcher] = useFetcher();
  const { autoScan } = useAutoScan();
  const { getCompany } = useUserData();
  const { scans } = useVerifyScanList();

  const dff = (id: any) => {
    fetcher('post', {
      body: {
        model: 'modules/neuroscan/kill',
        neuroscan_id: id,
        company_id: getCompany(),
      },
      requireSession: true,
    });
  };

  const scansColumnAction = [
    ...scansColumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-5 action',
      weight: '6%',
      render: (row: any) => (
        <div className="publish" key={`actr-${row.id}`}>
          <span title="Delete" onClick={() => dff(row.id)}>
            <TrashIcon />
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
        autoScan(resourceId, false).then(() => {
          toast.success(APP_MESSAGE_TOAST.START_SCAN);
        });
      })
      .catch((error: any) => {
        toast.error(error?.info || error?.message || '');
      });
  };

  return (
    <div className={css['scan-section-container']}>
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
