import React from 'react';

interface Props {
	header: string;
	icon: JSX.Element;
	children: JSX.Element;
	actions: JSX.Element;
}

export const ActionSection: React.FC<Props> = ({
	header,
	icon,
	children,
	actions,
}) => {
	return (
		<>
			<div className="header">
				<div className="title">
					<div className="icon">{icon}</div>
					<span>{header}</span>
				</div>
				<div className="actions">{actions}</div>
			</div>
			{children}
		</>
	);
};
