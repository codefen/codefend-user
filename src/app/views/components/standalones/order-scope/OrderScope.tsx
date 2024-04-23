import Show from '@defaults/Show';
import { useEffect, useState, type FC } from 'react';
import { PrimaryButton } from '@buttons/index';
import './orderscope.scss';
import { EmptyCard, ModalTitleWrapper } from '../..';
import { OrderScopeTable } from './OrderTableScope';
import { OrderScopeBar } from './OrderScopeBar';
import useOrderScopeStore from '@stores/orderScope.store';

export const ProviderScope: FC = () => {
	const { open, scope, viewConfirm, onConfirm, updateOpen } =
		useOrderScopeStore();
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
	const [resourceActive, setResourceActive] = useState<
		'w' | 'm' | 'c' | 's' | 'sc' | 'n' | 'u'
	>(defineActiveAlias(scope));
	useEffect(() => {
		setResourceActive(defineActiveAlias(scope));
	}, [scope]);

	return (
		<ModalTitleWrapper
			headerTitle="Order Scope"
			isActive={open}
			close={() => updateOpen(false)}>
			<div className="order-scope-container">
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
							title="This is order web scope"
						/>
					</Show>
					<Show when={resourceActive === 'm'}>
						<OrderScopeTable
							resourceScope={scope?.mobile || []}
							scopeALias="m"
							title="This is order mobile scope"
						/>
					</Show>
					<Show when={resourceActive === 'c'}>
						<OrderScopeTable
							resourceScope={scope?.cloud || []}
							scopeALias="c"
							title="This is order cloud scope"
						/>
					</Show>
					<Show when={resourceActive === 's'}>
						<OrderScopeTable
							resourceScope={scope?.social?.social_resources || []}
							scopeALias="s"
							title="This is order scoial scope"
						/>
					</Show>
					<Show when={resourceActive === 'sc'}>
						<OrderScopeTable
							resourceScope={scope?.source || []}
							scopeALias="sc"
							title="This is order scource code scope"
						/>
					</Show>
					<Show when={resourceActive === 'n'}>
						<OrderScopeTable
							resourceScope={scope?.lan || []}
							scopeALias="n"
							title="This is order network scope"
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
	);
};
