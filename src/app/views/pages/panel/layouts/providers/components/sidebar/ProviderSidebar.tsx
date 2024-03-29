import type { FC } from 'react';
import './providersidebar.scss';

export interface ProviderSidebarProps {
	activeOption:
		| 'orders'
		| 'profile'
		| 'education'
		| 'work-experiences'
		| string;
}

export const ProviderSidebar: FC<ProviderSidebarProps> = ({ activeOption }) => {
	return (
		<div className="provider-sidebar">
			<ul>
				<li className={`${activeOption === 'profile' && 'current'}`}>
					<span>About me</span>
				</li>
				<li className={`${activeOption === 'orders' && 'current'}`}>
					<span>Orders review</span>
				</li>
				<li className={`disabled `}>
					<span>Work experiences</span>
				</li>
				<li className={`disabled `}>
					<span>Education</span>
				</li>
			</ul>
		</div>
	);
};
