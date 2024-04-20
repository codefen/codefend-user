import Show from '@defaults/Show';
import { useState, type FC } from 'react';
import { PrimaryButton } from '@buttons/index';
import './orderscope.scss';
import { EmptyCard, ModalTitleWrapper } from '../..';
import { OrderScopeTable } from './OrderTableScope';

export interface ProviderScopeProps {
	isOpen: boolean;
	scope: any;
	onClose: () => void;
	onConfirm: () => void;
	viewConfirm: boolean;
}

export const ProviderScope: FC<ProviderScopeProps> = ({
	isOpen,
	scope,
	onClose,
	onConfirm,
	viewConfirm,
}) => {
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

	const handleActivate = (
		scopeAlias: 'w' | 'm' | 'c' | 's' | 'sc' | 'n',
		verify: string,
	) => {
		if (verify in scope && resourceActive !== scopeAlias) {
			setResourceActive(scopeAlias);
		}
	};
	console.log({ scope });
	return (
		<ModalTitleWrapper
			headerTitle="Order Scope"
			isActive={isOpen}
			close={onClose}>
			<div className="order-scope-container">
				<div className="order-scope-sidebar">
					<span
						className={`scope-sb-e ${resourceActive == 'w' && 'scope-sb-active'} ${!('web' in scope) && 'scope-sb-disable'}`}
						onClick={() => handleActivate('w', 'web')}>
						Web
					</span>
					<span
						className={`scope-sb-e ${resourceActive == 'm' && 'scope-sb-active'} ${!('mobile' in scope) && 'scope-sb-disable'}`}
						onClick={() => handleActivate('m', 'mobile')}>
						Mobile
					</span>
					<span
						className={`scope-sb-e ${resourceActive == 'c' && 'scope-sb-active'} ${!('cloud' in scope) && 'scope-sb-disable'}`}
						onClick={() => handleActivate('c', 'cloud')}>
						Cloud
					</span>
					<span
						className={`scope-sb-e ${resourceActive == 's' && 'scope-sb-active'} ${!('social' in scope) && 'scope-sb-disable'}`}
						onClick={() => handleActivate('s', 'social')}>
						Social
					</span>
					<span
						className={`scope-sb-e ${resourceActive == 'sc' && 'scope-sb-active'} ${!('source' in scope) && 'scope-sb-disable'}`}
						onClick={() => handleActivate('sc', 'source')}>
						Source
					</span>
					<span
						className={`scope-sb-e ${resourceActive == 'n' && 'scope-sb-active'} ${!('lan' in scope) && 'scope-sb-disable'}`}
						onClick={() => handleActivate('n', 'lan')}>
						Network
					</span>
				</div>

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
							title="This is order scoial scope"
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
						click={() => onClose()}
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
