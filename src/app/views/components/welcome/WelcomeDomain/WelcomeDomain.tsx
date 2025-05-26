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
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useInitialDomainStore } from '@stores/initialDomain.store';

const columns = [
  {
    header: 'domain',
    key: 'resource_domain',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-welcome-1',
    weight: '42%',
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
    styles: 'item-cell-welcome-2',
    weight: '26%',
    render: (ip: any) => (ip === 'unreachable' ? 'non available' : ip),
  },
  {
    header: 'area',
    key: 'main_server_area_name',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-welcome-3',
    weight: '32%',
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
  goToStartScanStep,
}: {
  close: () => void;
  goToStartScanStep: () => void;
}) => {
  const [initialDomain, setInitialDomain] = useState('');
  const [domains, setDomains] = useState<any[]>([]);
  const [fetcher, cancel, isLoading] = useFetcher();
  const { getCompany, logout } = useUserData();
  const domainCount = useGlobalFastField('domainCount');
  const { update, initialDomain: initialDomainStored } = useInitialDomainStore();

  useEffect(() => {
    setInitialDomain(prev => (!prev ? (!!initialDomainStored ? initialDomainStored : '') : prev));
  }, [initialDomain, initialDomainStored]);

  const changeInitialDomain = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const domain = form.get('initialScope') as string;
    setInitialDomain(domain);
    const companyID = getCompany();
    fetcher('post', {
      requireSession: true,
      body: {
        company_id: companyID,
        resource_address_domain: domain,
        subdomain_scan: 'yes',
      },
      path: 'resources/web/preview',
      timeout: 230000,
      requestId: 'welcome-domain-preview',
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (!apiErrorValidation(data)) {
        setDomains(data?.resource ? [data.resource] : []);
      } else if (data?.error_info === 'unrecheable_domain') {
        toast.error(data?.info);
      }
    });
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
      timeout: 230000,
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (data?.resource?.id) {
        if (domainCount.get === 0) {
          domainCount.set(1);
          update('isUniqueDomain', true);
        } else if (domainCount.get >= 1 && !data?.info.includes('is already')) {
          update('isUniqueDomain', false);
        }
        update('resourceId', data?.resource?.id);
        update('initialDomain', initialDomain);
        goToStartScanStep();
      }
    });
  };

  return (
    <ModalWrapper showCloseBtn={false} type={css['welcome-modal-container']} action={close}>
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
            defaultValue={initialDomain || initialDomainStored || ''}
          />
          <button type="submit" className={`btn ${css['btn-search']}`} disabled={isLoading}>
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
          <PrimaryButton text="Close assistant" buttonStyle="gray" click={close} />
          <button
            className={`btn ${css['btn-add']}`}
            type="button"
            onClick={nextStep}
            disabled={!Boolean(domains.length) || isLoading}>
            Continue
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
