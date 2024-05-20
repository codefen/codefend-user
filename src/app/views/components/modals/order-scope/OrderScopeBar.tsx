import {
	RESOURCE_CLASS,
	RESOURCE_CLASS_ALIAS,
} from '@/app/constants/app-texts';
import type { ScopeAlias } from '@interfaces/util';
import type { FC } from 'react';

interface OrderScopeBarProps {
	scope: any;
	resourceActive: string;
	updateResourceA: (updated: ScopeAlias) => void;
}

export const OrderScopeBar: FC<OrderScopeBarProps> = ({
	scope,
	resourceActive,
	updateResourceA,
}) => {
	const handleActivate = (scopeAlias: ScopeAlias, verify: string) => {
		if (verify in scope && resourceActive !== scopeAlias) {
			updateResourceA(scopeAlias);
		}
	};
	return (
		<div className="order-scope-sidebar">
			<span
				className={`scope-sb-e ${resourceActive == RESOURCE_CLASS_ALIAS.WEB && 'scope-sb-active'} ${!(RESOURCE_CLASS.WEB in scope) && 'scope-sb-disable'}`}
				onClick={() =>
					handleActivate(RESOURCE_CLASS_ALIAS.WEB, RESOURCE_CLASS.WEB)
				}>
				Web
			</span>
			<span
				className={`scope-sb-e ${resourceActive == RESOURCE_CLASS_ALIAS.MOBILE && 'scope-sb-active'} ${!(RESOURCE_CLASS.MOBILE in scope) && 'scope-sb-disable'}`}
				onClick={() =>
					handleActivate(
						RESOURCE_CLASS_ALIAS.MOBILE,
						RESOURCE_CLASS.MOBILE,
					)
				}>
				Mobile
			</span>
			<span
				className={`scope-sb-e ${resourceActive == RESOURCE_CLASS_ALIAS.CLOUD && 'scope-sb-active'} ${!(RESOURCE_CLASS.CLOUD in scope) && 'scope-sb-disable'}`}
				onClick={() =>
					handleActivate(RESOURCE_CLASS_ALIAS.CLOUD, RESOURCE_CLASS.CLOUD)
				}>
				Cloud
			</span>
			<span
				className={`scope-sb-e ${resourceActive == RESOURCE_CLASS_ALIAS.SOCIAL && 'scope-sb-active'} ${!(RESOURCE_CLASS.SOCIAL in scope) && 'scope-sb-disable'}`}
				onClick={() =>
					handleActivate(
						RESOURCE_CLASS_ALIAS.SOCIAL,
						RESOURCE_CLASS.SOCIAL,
					)
				}>
				Social
			</span>
			<span
				className={`scope-sb-e ${resourceActive == RESOURCE_CLASS_ALIAS.SOURCE && 'scope-sb-active'} ${!(RESOURCE_CLASS.SOURCE in scope) && 'scope-sb-disable'}`}
				onClick={() =>
					handleActivate(
						RESOURCE_CLASS_ALIAS.SOURCE,
						RESOURCE_CLASS.SOURCE,
					)
				}>
				Source
			</span>
			<span
				className={`scope-sb-e ${resourceActive == RESOURCE_CLASS_ALIAS.NETWORK && 'scope-sb-active'} ${!('lan' in scope) && 'scope-sb-disable'}`}
				onClick={() => handleActivate(RESOURCE_CLASS_ALIAS.NETWORK, 'lan')}>
				Network
			</span>
		</div>
	);
};
