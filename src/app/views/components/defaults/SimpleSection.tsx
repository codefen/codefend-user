import { type FC } from 'react';

interface SimpleSectionProps {
	header: string;
	icon: JSX.Element;
	children: JSX.Element;
}

export const SimpleSection: FC<SimpleSectionProps> = ({
	header,
	icon,
	children,
}) => {
	return (
		<>
			<div className="header">
				<div className="title">
					<div className="icon">{icon}</div>
					<span>{header}</span>
				</div>
			</div>
			{children}
		</>
	);
};
