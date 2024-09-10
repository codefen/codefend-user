import { type FC } from 'react';
import {
  ScopeOption,
  formatNumber,
  type OrderOffensive,
  type OrderTeamSize,
} from '../../../../../../../data';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { useProviderConfirm } from '@userHooks/providers/useProviderConfirm.ts';
import { useProviderRefuseOrder } from '@userHooks/providers/useProviderRefuseOrder';
import { useProviderRefuseStore } from '@stores/providerOrder.store';
import '../ordercards.scss';
import { OrderCardTemplate } from '../../../../../../components/standalones/order-card-template/OrderCardTemplate';
import useOrderScopeStore from '@stores/orderScope.store';

export interface ConfirmOrderCardProps {
  sizeOrder: OrderTeamSize | 'small' | 'medium' | 'full';
  offensive: OrderOffensive | 'careful' | 'offensive' | 'adversary';
  type: string;
  provider: string;
  scope: ScopeOption | 0 | 1;
  distributor: string;
  price: string;
  handleActivate: (id: string) => void;
  removeOrder: (id: string) => void;
  id: string;
  isSelected?: boolean;
  resourcesScope: any;
  companyName: string;
}

export const ConfirmOrderCard: FC<ConfirmOrderCardProps> = ({
  sizeOrder,
  offensive,
  type,
  provider,
  distributor,
  price,
  id,
  isSelected,
  handleActivate,
  removeOrder,
  resourcesScope,
  companyName,
}) => {
  const {
    updateOpen,
    updateScope,
    updateViewConfirm,
    updateOnConfirm,
    updateViewTransfer,
    updateOrderId,
  } = useOrderScopeStore();
  const { cancelConfirm } = useProviderRefuseOrder();
  const { confirmOrder, isLoading } = useProviderConfirm();
  const { setClickRefuse, setOrderId, isRefusing } = useProviderRefuseStore();

  const handleClickRefuse = () => {
    cancelConfirm();
    setClickRefuse(true);
    setOrderId(id);
  };

  const handleOpenScope = () => {
    const handleConfirm = (notConfirm?: boolean) => {
      removeOrder(id);
      if (!notConfirm) {
        confirmOrder(id);
      }
      updateOpen(false);
    };
    updateOrderId(id);
    updateOpen(true);
    updateViewTransfer(true);
    updateScope(resourcesScope);
    updateViewConfirm(true);
    updateOnConfirm(handleConfirm);
  };
  return (
    <>
      <OrderCardTemplate
        id={id}
        handleActivate={handleActivate}
        isSelected={Boolean(isSelected)}
        companyName={companyName}
        offensive={offensive}
        price={price}
        provider={provider}
        sizeOrder={sizeOrder}
        state="New"
        type={type}>
        <div className="provider-order-main-content flex-col">
          <div className="order-price-dist">
            <span className="price">${formatNumber(price)}</span>
            <span className="distributor">distributor: {distributor}</span>
          </div>
          <div className="flex-row buttons">
            <button className="btn-decline" disabled={isRefusing} onClick={handleClickRefuse}>
              refuse order
            </button>
            <PrimaryButton
              click={handleOpenScope}
              text="View order"
              buttonStyle="red"
              className="btn-order-card"
              isDisabled={isLoading}
            />
          </div>
        </div>
      </OrderCardTemplate>
    </>
  );
};
