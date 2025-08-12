import { useUserRole } from '#commonUserHooks/useUserRole';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState, type ReactNode } from 'react';
import { AimIcon } from '@icons';
import Show from '@/app/views/components/Show/Show';
import { PLAN_IMAGE } from '@/app/constants/app-contanst';

interface OpenOrderButtonProps {
  resourceCount?: number;
  isLoading?: boolean;
  type: ResourcesTypes;
  className?: string;
  scope?: OrderSection;
  plan?: 'medium' | 'small' | 'advanced' | null;
  hasActiveOrder?: boolean;
}

const orderText: Record<ResourcesTypes, (obj: any) => ReactNode> = {
  [ResourcesTypes.WEB]: ({ total, plan }: any) => (
    <>
      Let's start a new pentest now! Our systems have detected a total of
      <b>{total} web resources!</b> If you want to perform a pentest on all these resources, at
      Codefend we recommend an <b>{plan} plan</b>.
    </>
  ),
  [ResourcesTypes.MOBILE]: ({ plan, hasActiveOrder }: any) =>
    !hasActiveOrder ? (
      <>
        No tests are being conducted yet. Based on the information gathered, we recommend the{' '}
        <b>{plan} plan</b>.
      </>
    ) : (
      <>
        A dedicated penetration test is currently underway for this resource. You'll be notified as
        soon as the results are available. Sit back, we've got this covered.
      </>
    ),

  [ResourcesTypes.CLOUD]: () => <></>,
  [ResourcesTypes.CODE]: () => <></>,
  [ResourcesTypes.NETWORK]: ({ plan }: any) => (
    <>
      For your network resources, we recommend a <b>{plan} plan</b>.
    </>
  ),
  [ResourcesTypes.SOCIAL]: ({ plan }: any) => (
    <>
      For social resources, <b>{plan} plan</b>.
    </>
  ),
  [ResourcesTypes.LEAKS]: ({ plan }: any) => (
    <>
      For leaks resources, <b>{plan} plan</b>.
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

export const titleMap = {
  [ResourcesTypes.WEB]: 'Professional hackers on demand',
  [ResourcesTypes.MOBILE]: 'Professional hackers on demand',
  [ResourcesTypes.CLOUD]: 'Analyze your cloud software',
  [ResourcesTypes.CODE]: 'Analyze your code',
  [ResourcesTypes.NETWORK]: 'Professional hackers on demand',
  [ResourcesTypes.SOCIAL]: 'Professional hackers on demand',
  [ResourcesTypes.LEAKS]: 'For leaks resources',
};

const OpenOrderButton = ({
  resourceCount = 0,
  isLoading,
  type,
  className = '',
  scope = OrderSection.SCOPE,
  plan = null,
  hasActiveOrder = false,
}: OpenOrderButtonProps) => {
  const { updateState } = useOrderStore(state => state);
  const { isAdmin, isNormalUser } = useUserRole();
  const [planText, setPlanText] = useState<ReactNode | null>(null);
  const globalStore = useGlobalFastFields([
    'subDomainCount',
    'uniqueIpCount',
    'domainCount',
    'planPreference',
    'selectedApp',
  ]);
  const onOpen = () => {
    updateState('open', true);
    updateState('resourceType', type);
    updateState('orderStepActive', scope);
  };

  const onOpenPricing = () => {
    updateState('open', true);
    updateState('resourceType', type);
    updateState('orderStepActive', OrderSection.ALL_PLANS);
  };
  if (!isAdmin() && !isNormalUser()) return null;
  useEffect(() => {
    const total = globalStore.domainCount.get + globalStore.subDomainCount.get;
    const name = globalStore.selectedApp.get?.app_name;
    const downloads = globalStore.selectedApp.get?.app_android_downloads;
    let planStore = globalStore.planPreference.get;
    if (plan) {
      planStore = plan;
    }

    setPlanText(orderText[type]({ total, plan: planStore, name, downloads, hasActiveOrder }));
  }, [
    globalStore.domainCount.get,
    globalStore.subDomainCount.get,
    globalStore.selectedApp.get,
    globalStore.planPreference.get,
    hasActiveOrder,
  ]);
  return (
    <div className="card title">
      <div className="header">
        <img
          src={PLAN_IMAGE[globalStore.planPreference.get as keyof typeof PLAN_IMAGE]}
          width={28}
          height={28}
          style={{ width: '28px' }}
          alt="recommended-plan"
        />
        <span>{!hasActiveOrder ? titleMap[type] : 'Pentest in progress'}</span>
      </div>
      <div className="content">
        <p className="order-text">{planText}</p>
        <div className="actions">
          <Show when={!hasActiveOrder}>
            <PrimaryButton
              text={
                type === ResourcesTypes.MOBILE ? 'Start dedicated testing' : 'Request a pentest now'
              }
              click={onOpen}
              className={className}
              isDisabled={resourceCount === 0 || isLoading}
              disabledLoader
            />
            <PrimaryButton
              text="See our prices"
              click={onOpenPricing}
              className={className}
              buttonStyle="gray"
              disabledLoader
            />
          </Show>
        </div>
      </div>
    </div>
  );
};

export default OpenOrderButton;
