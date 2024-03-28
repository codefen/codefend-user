import type { FC } from 'react';
import './providersidebar.scss';

export interface ProviderSidebarProps {
	activeOption: number;
	update: (updated: number) => void;
}

export const ProviderSidebar: FC<ProviderSidebarProps> = ({
	activeOption,
	update,
}) => {
	return (
		<div className="provider-sidebar">
			<ul>
				<li
					className={`${activeOption === 0 && 'current'}`}
					onClick={() => {
						update(0);
					}}>
					<span>About me</span>
				</li>
				<li
					className={`${activeOption === 1 && 'current'}`}
					onClick={() => {
						update(1);
					}}>
					<span>Orders review</span>
				</li>
				<li
					className={`${activeOption === 2 && 'current'}`}
					onClick={() => {
						update(2);
					}}>
					<span>Work experiences</span>
				</li>
				<li
					className={`${activeOption === 3 && 'current'}`}
					onClick={() => {
						update(3);
					}}>
					<span>Education</span>
				</li>
			</ul>
		</div>
	);
};
