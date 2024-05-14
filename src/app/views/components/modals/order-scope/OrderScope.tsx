import Show from '@defaults/Show';
import { useEffect, useRef, useState, type FC } from 'react';
import { PrimaryButton } from '@buttons/index';
import './orderscope.scss';
import { EmptyCard, ModalTitleWrapper } from '../..';
import { OrderScopeTable } from './OrderTableScope';
import { OrderScopeBar } from './OrderScopeBar';
import useOrderScopeStore from '@stores/orderScope.store';
import { OrderProviderTransfer } from '../ordertransfer/OrderProviderTransfer';
import { useForwardOrder } from '@userHooks/providers/useForwardOrder';

const defineActiveAlias = (scopeV: any) => {
	if (scopeV && typeof scopeV === 'object') {
		if ('web' in scopeV) return 'w';
		if ('mobile' in scopeV) return 'm';
		if ('cloud' in scopeV) return 'c';
		if ('social' in scopeV) return 's';
		if ('source' in scopeV) return 'sc';
		if ('lan' in scopeV) return 'n';
	}
	return 'u';
};

export const ProviderScope: FC = () => {
	const {
		open,
		scope,
		viewConfirm,
		viewTransfer,
		orderId,
		onConfirm,
		updateOpen,
	} = useOrderScopeStore();
	const [forwardOrder, isLoading] = useForwardOrder();
	const [resourceActive, setResourceActive] = useState<
		'w' | 'm' | 'c' | 's' | 'sc' | 'n' | 'u'
	>(defineActiveAlias(scope));
	const providers = useRef([]);
	const [transferOpen, setOpenTransfer] = useState<any>(false);

	useEffect(() => {
		setResourceActive(defineActiveAlias(scope));
	}, [scope]);

	const onTransfer = () => {
		if (providers.current.length <= 0) {
			forwardOrder(orderId).then((data) => {
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
			<ModalTitleWrapper
				headerTitle="Order Scope"
				isActive={open}
				close={() => updateOpen(false)}>
				<div className="content order-scope-container">
					<OrderScopeBar
						scope={scope}
						resourceActive={resourceActive}
						updateResourceA={(updated) => setResourceActive(updated)}
					/>

					<div className="scope-content">
						<Show when={resourceActive === 'u'}>
							<EmptyCard
								title="No scope found in this order"
								info="This is possibly a bug, you can contact support to solve it."
							/>
						</Show>
						<Show when={resourceActive === 'w'}>
							<OrderScopeTable
								resourceScope={scope?.web || []}
								scopeALias="w"
								title="Scope"
							/>
						</Show>
						<Show when={resourceActive === 'm'}>
							<OrderScopeTable
								resourceScope={scope?.mobile || []}
								scopeALias="m"
								title="Scope"
							/>
						</Show>
						<Show when={resourceActive === 'c'}>
							<OrderScopeTable
								resourceScope={scope?.cloud || []}
								scopeALias="c"
								title="Scope"
							/>
						</Show>
						<Show when={resourceActive === 's'}>
							<OrderScopeTable
								resourceScope={scope?.social?.social_resources || []}
								scopeALias="s"
								title="Scope"
							/>
						</Show>
						<Show when={resourceActive === 'sc'}>
							<OrderScopeTable
								resourceScope={scope?.source || []}
								scopeALias="sc"
								title="Scope"
							/>
						</Show>
						<Show when={resourceActive === 'n'}>
							<OrderScopeTable
								resourceScope={scope?.lan || []}
								scopeALias="n"
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
