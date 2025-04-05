import { useUserRole } from '#commonUserHooks/useUserRole';
import { PrimaryButton } from '@buttons/index';
import type { ResourcesTypes } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';

interface OpenOrderButtonProps {
  resourceCount?: number;
  isLoading?: boolean;
  type: ResourcesTypes;
  className?: string;
}

const OpenOrderButton = ({
  resourceCount = 0,
  isLoading,
  type,
  className = '',
}: OpenOrderButtonProps) => {
  const { updateState, setScopeTotalResources } = useOrderStore(state => state);
  const { isAdmin, isNormalUser } = useUserRole();
  const onOpen = () => {
    updateState('open', true);
    updateState('resourceType', type);
    setScopeTotalResources(resourceCount);
  };
  if (!isAdmin() && !isNormalUser()) return null;

  return (
    <PrimaryButton
      text="REQUEST PENTEST ON DEMAND"
      click={onOpen}
      className={className}
      isDisabled={resourceCount === 0 || isLoading}
      disabledLoader
    />
  );
};

export default OpenOrderButton;
