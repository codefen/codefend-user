import { useUserRole } from '#commonUserHooks/useUserRole';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState } from 'react';

interface OpenOrderButtonProps {
  resourceCount?: number;
  isLoading?: boolean;
  type: ResourcesTypes;
  className?: string;
  scope?: OrderSection;
}

const orderText: Record<ResourcesTypes, (obj: any) => string> = {
  [ResourcesTypes.WEB]: ({ total, plan }: any) =>
    `Su Scope web posee mas de ${total} recursos, por lo que recomandamos un ${plan}`,
  [ResourcesTypes.MOBILE]: ({ plan, name, downloads }) =>
    `Su aplicacion ${name} ${downloads ? 'posee mas de ' + downloads + ' descargas por lo que le recomendamos' : 'le recomendamos'} un plan ${plan}`,
  [ResourcesTypes.CLOUD]: () => '',
  [ResourcesTypes.CODE]: () => '',
  [ResourcesTypes.NETWORK]: ({ plan }) =>
    `Para sus recursos de red le recomendamos un plan ${plan}`,
  [ResourcesTypes.SOCIAL]: ({ plan }) => `Para los recursos sociales ${plan}`,
};

const OpenOrderButton = ({
  resourceCount = 0,
  isLoading,
  type,
  className = '',
  scope = OrderSection.SCOPE,
}: OpenOrderButtonProps) => {
  const { updateState } = useOrderStore(state => state);
  const { isAdmin, isNormalUser } = useUserRole();
  const [plan, setPlan] = useState<string>('');
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
    <div className="card new-design">
      <div className="table-title">
        <h2>Comenzar un pentest</h2>
      </div>
      <p>{plan}</p>
      <PrimaryButton
        text="REQUEST PENTEST ON DEMAND"
        click={onOpen}
        className={className}
        isDisabled={resourceCount === 0 || isLoading}
        disabledLoader
      />
    </div>
  );
};

export default OpenOrderButton;
