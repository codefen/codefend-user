import type { FC, ReactNode } from 'react';
import './resourcefigure.scss';

interface ResourceFigureProps {
	icon: ReactNode;
	title: string;
	count: number;
	click?: () => void;
	isActive?: boolean;
}

export const ResourceFigure: FC<ResourceFigureProps> = ({
	count,
	icon,
	title,
	click,
	isActive,
}) => {
	const handleClick = (e: any) => {
		if (click && isActive) click();
	};
	return (
		<figure
			className={`report-type-card ${!isActive && 'report-type-disable'}`}
			onClick={handleClick}>
			{icon}

			<figcaption className={'caption-card'}>
				<h4>{title}</h4>
				<h5>
					total issues <span>{count}</span>
				</h5>
			</figcaption>
		</figure>
	);
};
