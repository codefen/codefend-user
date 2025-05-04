import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { ModalWrapper } from '@modals/index';
import Tablev3 from '@table/v3/Tablev3';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import css from './welcomedomain.module.scss';
import { AimIcon } from '@icons';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import TextChild from '@/app/views/components/utils/TextChild';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import { toast } from 'react-toastify';
import { PrimaryButton } from '@buttons/index';

const columns = [
  {
    header: 'domain',
    key: 'resource_domain',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-2 item-domain-cell',
    weight: '43%',
    render: (row: any, next?: any) =>
      !row?.address_domain ? (
        row?.resource_domain
      ) : (
        <TextChild
          subNetwork={row?.address_domain}
          isLast={!next || (next && !next?.address_domain)}
        />
      ),
  },
  {
    header: 'server ip',
    key: 'main_server',
    styles: 'item-cell-3',
    weight: '28%',
    render: (ip: any) => (ip === 'unreachable' ? 'non available' : ip),
  },
  {
    header: 'area',
    key: 'main_server_area_name',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-4',
    weight: '29%',
    render: (row: any) => (
      <LocationItem
        country={row?.main_server_area_name || 'non available'}
        countryCode={row?.main_server_area_code || ''}
      />
    ),
  },
];

export const WelcomeDomain = ({
  close,
  startScan,
}: {
  close: () => void;
  startScan: () => void;
}) => {
  const [initialDomain, setInitialDomain] = useState('');
  const [domains, setDomains] = useState<any[]>([]);
  const [fetcher, _, isLoading] = useFetcher();
  const { getCompany, logout } = useUserData();
  const { saveInitialDomain, setDomainId, initialDomain: initDomain } = useWelcomeStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInitialDomain(prev => (!prev ? (!!initDomain ? initDomain : '') : prev));
    const companyID = getCompany();
    fetcher('post', {
      requireSession: true,
      body: {
        company_id: companyID,
        resource_address_domain: initialDomain || initDomain,
        subdomain_scan: 'yes',
      },
      path: 'resources/web/preview',
      timeout: 180000,
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (!apiErrorValidation(data?.error, data?.response)) {
        setDomains(data?.resource ? [data.resource] : []);
      }
    });
  }, [initialDomain]);

  const changeInitialDomain = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const domain = form.get('initialScope') as string;
    setInitialDomain(prev => (!!domain && prev !== domain ? domain : prev));
  };

  const nextStep = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    if (!initialDomain) {
      toast.warning('Please enter a domain before continuing');
      return;
    }
    fetcher('post', {
      body: {
        company_id: companyID,
        resource_address_domain: initialDomain,
        subdomain_scan: 'yes',
      },
      path: 'resources/web/add',
      timeout: 180000,
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (data?.resource?.id) {
        saveInitialDomain(initialDomain);
        setDomainId(data?.resource?.id);
        startScan();
      }
    });
  };

  return (
    <ModalWrapper showCloseBtn={false} type={css['welcome-modal-container']}>
      <div className="welcome-content">
        <img className="logose" src="/codefend/logo-color.png" width={220} />
        <p className={css['welcome-text']}>
          <b>Welcome! Please verify your domain and click 'Continue' to add your first resource.</b>{' '}
          We'll then run an automated analysis on your main domain.
        </p>
        <form className={css['input-container']} onSubmit={changeInitialDomain}>
          <label htmlFor="initialScope">
            <b>Confirm your initial scope</b>
          </label>
          <input
            type="text"
            id="initialScope"
            name="initialScope"
            autoComplete="off"
            placeholder="Wite domain..."
            defaultValue={initialDomain || ''}
            ref={inputRef}
          />
          <button type="submit" className={`btn ${css['btn-search']}`}>
            <AimIcon />
          </button>
        </form>
        <div className={css['limit-container']}>
          <Tablev3
            columns={columns}
            rows={domains}
            showRows={!!domains && !isLoading}
            limit={7}
            isNeedSort={false}
          />
        </div>
        <div className="btn-container">
          <PrimaryButton text="close assistant" buttonStyle="gray" click={close} />
          <button className={`btn ${css['btn-add']}`} type="button" onClick={nextStep}>
            Continue
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
