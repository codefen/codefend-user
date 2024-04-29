import type { FC } from 'react';

interface OrderScopeBarProps {
	scope: any;
	resourceActive: string;
	updateResourceA: (updated: 'w' | 'm' | 'c' | 's' | 'sc' | 'n') => void;
}

export const OrderScopeBar: FC<OrderScopeBarProps> = ({
	scope,
	resourceActive,
	updateResourceA,
}) => {
	const handleActivate = (
		scopeAlias: 'w' | 'm' | 'c' | 's' | 'sc' | 'n',
		verify: string,
	) => {
		if (verify in scope && resourceActive !== scopeAlias) {
			updateResourceA(scopeAlias);
		}
	};
	return (
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
	);
};
