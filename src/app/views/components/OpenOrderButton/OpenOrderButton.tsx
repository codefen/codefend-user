import { useUserRole } from '#commonUserHooks/useUserRole';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState, type ReactNode } from 'react';
import { AimIcon } from '@icons';

interface OpenOrderButtonProps {
  resourceCount?: number;
  isLoading?: boolean;
  type: ResourcesTypes;
  className?: string;
  scope?: OrderSection;
}

const orderText: Record<ResourcesTypes, (obj: any) => ReactNode> = {
  [ResourcesTypes.WEB]: ({ total, plan }: any) => (
    <>
      Your web scope has more than <strong>{total}</strong> resources, so we recommend a{' '}
      <b>{plan} plan</b>.
    </>
  ),
  [ResourcesTypes.MOBILE]: ({ plan, name, downloads }: any) => (
    <>
      Your application <strong>{name}</strong>{' '}
      {downloads ? (
        <>
          has more than <strong>{downloads}</strong> downloads, so we recommend
        </>
      ) : (
        'we recommend'
      )}{' '}
      a <strong>{plan}</strong> plan
    </>
  ),
  [ResourcesTypes.CLOUD]: () => <></>,
  [ResourcesTypes.CODE]: () => <></>,
  [ResourcesTypes.NETWORK]: ({ plan }: any) => (
    <>
      For your network resources, we recommend a <strong>{plan}</strong> plan
    </>
  ),
  [ResourcesTypes.SOCIAL]: ({ plan }: any) => (
    <>
      For social resources, <strong>{plan}</strong>
    </>
  ),
};

// const orderText: Record<ResourcesTypes, (obj: any) => string> = {
//   [ResourcesTypes.WEB]: ({ total, plan }: any) =>
//     `Your web scope has more than ${total} resources, so we recommend a ${plan} plan`,
//   [ResourcesTypes.MOBILE]: ({ plan, name, downloads }) =>
//     `Your application ${name} ${downloads ? 'has more than ' + downloads + ' downloads, so we recommend' : 'we recommend'} a ${plan} plan`,
//   [ResourcesTypes.CLOUD]: () => '',
//   [ResourcesTypes.CODE]: () => '',
//   [ResourcesTypes.NETWORK]: ({ plan }) =>
//     `For your network resources, we recommend a ${plan} plan`,
//   [ResourcesTypes.SOCIAL]: ({ plan }) => `For social resources, ${plan}`,
// };

const OpenOrderButton = ({
  resourceCount = 0,
  isLoading,
  type,
  className = '',
  scope = OrderSection.SCOPE,
}: OpenOrderButtonProps) => {
  const { updateState } = useOrderStore(state => state);
  const { isAdmin, isNormalUser } = useUserRole();
  const [plan, setPlan] = useState<ReactNode | null>(null);
  const globalStore = useGlobalFastFields([
    'subDomainCount',
    'uniqueIpCount',
    'domainCount',
    'planPreference',
    'mobilePlanPreference',
    'selectedApp',
  ]);
  const onOpen = () => {
    updateState('open', true);
    updateState('resourceType', type);
    updateState('orderStepActive', scope);
  };
  if (!isAdmin() && !isNormalUser()) return null;
  useEffect(() => {
    const total = globalStore.domainCount.get + globalStore.subDomainCount.get;
    const name = globalStore.selectedApp.get?.app_name;
    const downloads = globalStore.selectedApp.get?.app_android_downloads;
    let plan = globalStore.planPreference.get;
    if (type === ResourcesTypes.MOBILE) {
      plan = globalStore.mobilePlanPreference.get;
    }
    setPlan(orderText[type]({ total, plan, name, downloads }));
  }, [globalStore.domainCount.get, globalStore.subDomainCount.get, globalStore.selectedApp.get]);

  return (
    <div className="card title">
      <div className="header">
        <AimIcon />
        <span>Analyze your web software</span>
      </div>
      <div className="content">
        <p>{plan}</p>
        <div className="actions">
          <PrimaryButton
            text="Request a pentest now"
            click={onOpen}
            className={className}
            isDisabled={resourceCount === 0 || isLoading}
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};

export default OpenOrderButton;
