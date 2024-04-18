import type { FC } from 'react';
import { useProviderSidebar } from '@userHooks/providers/useProviderSidebar.ts';
import './providersidebar.scss';

export const ProviderSidebar: FC = () => {
	const { activeOption, activeSubOption, setActiveSubOption } =
		useProviderSidebar();

	if (activeOption === 'profile') {
		return (
			<div className="provider-sidebar">
				<ul>
					<li
						className={`${activeSubOption === 0 && 'current'}`}
						onClick={() => setActiveSubOption(0)}>
						<span>About me</span>
					</li>
					<li
						className={`${activeSubOption === 1 && 'current'}`}
						onClick={() => setActiveSubOption(1)}>
						<span>Customer reviews</span>
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
	}
	return (
		<div className="provider-sidebar">
			<ul>
				<li
					className={`${activeSubOption === 0 && 'current'}`}
					onClick={() => setActiveSubOption(0)}>
					<span>New orders</span>
				</li>
				<li
					className={`${activeSubOption === 1 && 'current'}`}
					onClick={() => setActiveSubOption(1)}>
					<span>Finished orders</span>
				</li>
				<li className={`disabled `}>
					<span>Profile stadistics</span>
				</li>
			</ul>
		</div>
	);
};
