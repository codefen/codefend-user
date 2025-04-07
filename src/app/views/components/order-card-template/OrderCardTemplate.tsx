import Show from '@/app/views/components/Show/Show';
import { IconTextPairs } from '@/app/views/components/utils/IconTextPairs';
import { BugIcon } from '@icons';
import { type OrderOffensive, type OrderTeamSize } from '@interfaces/order.ts';
import type { FC, PropsWithChildren, ReactNode } from 'react';

export interface OrderCardTemplateProps extends PropsWithChildren {
  isSelected: boolean;
  handleActivate: (id: string) => void;
  id: string;
  sizeOrder: OrderTeamSize | 'small' | 'medium' | 'full';
  offensive: OrderOffensive | 'careful' | 'offensive' | 'adversary';
  type: string;
  state: 'New' | 'Current' | 'Finished' | 'Order';
  provider: string;
  price: string;
  viewScope?: ReactNode;
  viewPrice?: boolean;
  companyName?: string;
}

export const OrderCardTemplate: FC<OrderCardTemplateProps> = ({
  isSelected,
  id,
  handleActivate,
  offensive,
  type,
  state,
  provider,
  price,
  sizeOrder,
  viewScope,
  viewPrice,
  children,
  companyName,
}) => {
  const onClick = () => handleActivate(id);
  const teamSize = sizeOrder.valueOf();
  const offensiveOrder = `${offensive.valueOf()}`;
  return (
    <div className={`confirm-order-card ${isSelected && 'active'}`} onClick={onClick}>
      <div className="provider-order-info flex-col">
        <h2>
          <span className="codefend-text-red">{state}</span>
          <span className="text-dark">{offensiveOrder}</span>,{' '}
          <span className="normal">{type} pentest</span>
        </h2>
        <div className="order-important-info flex-col">
          <IconTextPairs icon={<BugIcon className="codefend-text-red" />} className="icon-text">
            <span className="text-bold">Company:</span>{' '}
            <span className="text-light">{companyName}</span>
          </IconTextPairs>
          <IconTextPairs icon={<BugIcon className="codefend-text-red" />} className="icon-text">
            <span className="text-bold">Order size:</span>
            <span className="text-light">{teamSize} allocation</span>
          </IconTextPairs>
          <IconTextPairs icon={<BugIcon className="codefend-text-red" />} className="icon-text">
            <span className="text-bold">Customer email:</span>{' '}
            <span className="text-light">{provider}</span>
          </IconTextPairs>
          {viewScope}
          <Show when={Boolean(viewPrice)}>
            <IconTextPairs icon={<BugIcon className="codefend-text-red" />} className="icon-text">
              <span className="text-bold">Price:</span> <span className="text-light">${price}</span>
            </IconTextPairs>
          </Show>
        </div>
      </div>
      {children}
    </div>
  );
};
