import Show from '@defaults/Show';
import { useEffect, useRef, useState, type FC } from 'react';
import { PrimaryButton } from '@buttons/index';
import './orderscope.scss';
import { EmptyCard, ModalTitleWrapper } from '../..';
import { OrderScopeTable } from './OrderTableScope';
import { OrderScopeBar } from './OrderScopeBar';
import useOrderScopeStore from '@stores/orderScope.store';
import { OrderProviderTransfer } from '../order-transfer/OrderProviderTransfer';
import { useForwardOrder } from '@userHooks/providers/useForwardOrder';
import type { ScopeAlias } from '@interfaces/util';
import { RESOURCE_CLASS_ALIAS } from '@/app/constants/app-texts';

const defineActiveAlias = (scopeV: any): ScopeAlias => {
  if (scopeV && typeof scopeV === 'object') {
    if ('web' in scopeV) return RESOURCE_CLASS_ALIAS.WEB;
    if ('mobile' in scopeV) return RESOURCE_CLASS_ALIAS.MOBILE;
    if ('cloud' in scopeV) return RESOURCE_CLASS_ALIAS.CLOUD;
    if ('social' in scopeV) return RESOURCE_CLASS_ALIAS.SOCIAL;
    if ('source' in scopeV) return RESOURCE_CLASS_ALIAS.SOURCE;
    if ('lan' in scopeV) return RESOURCE_CLASS_ALIAS.NETWORK;
  }
  return RESOURCE_CLASS_ALIAS.UNKNOWN;
};

export const ProviderScope: FC = () => {
  const { open, scope, viewConfirm, viewTransfer, orderId, onConfirm, updateOpen } =
    useOrderScopeStore();
  const [forwardOrder, isLoading] = useForwardOrder();
  const [resourceActive, setResourceActive] = useState<ScopeAlias>(defineActiveAlias(scope));
  const providers = useRef([]);
  const [transferOpen, setOpenTransfer] = useState<any>(false);

  useEffect(() => {
    setResourceActive(defineActiveAlias(scope));
  }, [scope]);

  const onTransfer = () => {
    if (providers.current.length <= 0) {
      forwardOrder(orderId).then(data => {
        updateOpen(false);
        providers.current = data.providers;
        setOpenTransfer(true);
      });
    } else {
      updateOpen(false);
      setOpenTransfer(true);
    }
  };

  const closeOnTransfer = (notOpen?: boolean) => {
    setOpenTransfer(false);
    if (!Boolean(notOpen)) {
      updateOpen(true);
    } else {
      onConfirm(true);
    }
  };

  return (
    <>
      <OrderProviderTransfer
        orderId={orderId}
        providers={providers.current}
        openModel={transferOpen && !open}
        close={closeOnTransfer}
      />
      <ModalTitleWrapper headerTitle="Order Scope" isActive={open} close={() => updateOpen(false)}>
        <div className="content order-scope-container">
          <OrderScopeBar
            scope={scope}
            resourceActive={resourceActive}
            updateResourceA={updated => setResourceActive(updated)}
          />

          <div className="scope-content">
            <Show when={resourceActive === RESOURCE_CLASS_ALIAS.UNKNOWN}>
              <EmptyCard
                title="No scope found in this order"
                info="This is possibly a bug, you can contact support to solve it."
              />
            </Show>
            <Show when={resourceActive === RESOURCE_CLASS_ALIAS.WEB}>
              <OrderScopeTable
                resourceScope={scope?.web || []}
                scopeALias={RESOURCE_CLASS_ALIAS.WEB}
                title="Scope"
              />
            </Show>
            <Show when={resourceActive === RESOURCE_CLASS_ALIAS.MOBILE}>
              <OrderScopeTable
                resourceScope={scope?.mobile || []}
                scopeALias={RESOURCE_CLASS_ALIAS.MOBILE}
                title="Scope"
              />
            </Show>
            <Show when={resourceActive === RESOURCE_CLASS_ALIAS.CLOUD}>
              <OrderScopeTable
                resourceScope={scope?.cloud || []}
                scopeALias={RESOURCE_CLASS_ALIAS.CLOUD}
                title="Scope"
              />
            </Show>
            <Show when={resourceActive === RESOURCE_CLASS_ALIAS.SOCIAL}>
              <OrderScopeTable
                resourceScope={scope?.social?.social_resources || []}
                scopeALias={RESOURCE_CLASS_ALIAS.SOCIAL}
                title="Scope"
              />
            </Show>
            <Show when={resourceActive === RESOURCE_CLASS_ALIAS.SOURCE}>
              <OrderScopeTable
                resourceScope={scope?.source || []}
                scopeALias={RESOURCE_CLASS_ALIAS.SOURCE}
                title="Scope"
              />
            </Show>
            <Show when={resourceActive === RESOURCE_CLASS_ALIAS.NETWORK}>
              <OrderScopeTable
                resourceScope={scope?.lan || []}
                scopeALias={RESOURCE_CLASS_ALIAS.NETWORK}
                title="Scope"
              />
            </Show>
          </div>
          <div className="scope-confirm-btn">
            <PrimaryButton
              text="Close"
              buttonStyle="black"
              click={() => updateOpen(false)}
              disabledLoader
              className="close-btn"
            />
            {viewTransfer && (
              <PrimaryButton
                text="Transfer order"
                buttonStyle="red"
                click={() => onTransfer()}
                className="scope-btn"
                isDisabled={isLoading}
              />
            )}
            {viewConfirm && (
              <PrimaryButton
                text="Confirm order"
                buttonStyle="dark-red"
                click={() => onConfirm()}
                disabledLoader
                className="scope-btn"
              />
            )}
          </div>
        </div>
      </ModalTitleWrapper>
    </>
  );
};
