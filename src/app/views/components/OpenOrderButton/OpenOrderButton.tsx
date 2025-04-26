import { useUserRole } from '#commonUserHooks/useUserRole';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { OrderSection, type ResourcesTypes } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useEffect, useState } from 'react';

interface OpenOrderButtonProps {
  resourceCount?: number;
  isLoading?: boolean;
  type: ResourcesTypes;
  className?: string;
  scope?: OrderSection;
}

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
  ]);
  const onOpen = () => {
    updateState('open', true);
    updateState('resourceType', type);
    updateState('orderStepActive', scope);
  };
  if (!isAdmin() && !isNormalUser()) return null;
  useEffect(() => {
    const total = globalStore.domainCount.get + globalStore.subDomainCount.get;
    setPlan(
      `Su Scope web posee mas de ${total} recursos, por lo que recomandamos un ${globalStore.planPreference.get}`
    );
  }, [globalStore.domainCount.get, globalStore.subDomainCount.get]);

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
