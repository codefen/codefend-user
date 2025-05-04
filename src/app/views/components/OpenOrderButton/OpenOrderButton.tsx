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
  [ResourcesTypes.WEB]: () =>
    `En base a la información obtenida de esta aplicación recomendamos un plan intermedio`,
  [ResourcesTypes.MOBILE]: () =>
    `En base a la información obtenida de esta aplicación recomendamos un plan intermedio`,
  [ResourcesTypes.CLOUD]: () =>
    `En base a la información obtenida de esta aplicación recomendamos un plan intermedio`,
  [ResourcesTypes.CODE]: () =>
    `En base a la información obtenida de esta aplicación recomendamos un plan intermedio`,
  [ResourcesTypes.NETWORK]: () =>
    `En base a la información obtenida de esta aplicación recomendamos un plan intermedio`,
  [ResourcesTypes.SOCIAL]: () =>
    `En base a la información obtenida de esta aplicación recomendamos un plan intermedio`,
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
        text="COMENZAR PRUEBAS DEDICADAS"
        click={onOpen}
        className={className}
        isDisabled={resourceCount === 0 || isLoading}
        disabledLoader
      />
    </div>
  );
};

export default OpenOrderButton;
