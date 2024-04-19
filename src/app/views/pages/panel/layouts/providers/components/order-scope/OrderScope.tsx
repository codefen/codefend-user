import Show from '@defaults/Show';
import type { FC } from 'react';
import './orderscope.scss';

export interface ProviderScopeProps {
	isOpen: boolean;
	scope: any;
}

export const ProviderScope: FC<ProviderScopeProps> = ({ isOpen, scope }) => {
	return (
		<Show when={isOpen}>
			<>
				<div className="order-scope-sidebar">
					<span>Web</span>
					<span>Mobile</span>
					<span>Cloud</span>
					<span>Social</span>
					<span>Source</span>
					<span>Network</span>
				</div>

				<div className="scope-content"></div>
				<div></div>
			</>
		</Show>
	);
};
