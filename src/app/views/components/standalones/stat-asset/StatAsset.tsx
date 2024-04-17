import type { FC, ReactNode } from 'react';
import './statasset.scss';

export interface StatAssetProps {
	value: ReactNode;
	valueTitle: string;
	isRed?: boolean;
	isActive?: boolean;
	onClick?: () => void;
}

export const StatAsset: FC<StatAssetProps> = ({
	value,
	valueTitle,
	isRed,
	isActive,
	onClick,
}) => {
	return (
		<div
			className={`stat ${isActive && 'stat-active'} ${!onClick && 'default'}`}
			onClick={onClick}>
			<div className={`value`}>{value}</div>
			<p className={`${isRed && 'codefend-text-red-200'}`}>{valueTitle}</p>
		</div>
	);
};
