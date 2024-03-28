import type { FC, PropsWithChildren, ReactNode } from 'react';
import './icontextpair.scss';

interface IconTextPairsProps extends PropsWithChildren {
	icon: ReactNode;
	className?: string;
}

export const IconTextPairs: FC<IconTextPairsProps> = ({
	icon,
	children,
	className,
}) => (
	<div className={`icon-text-pair ${className && className}`}>
		{icon}
		{children}
	</div>
);
