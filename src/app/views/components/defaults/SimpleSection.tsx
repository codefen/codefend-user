import React from 'react';

interface Props {
	header: string;
	icon: JSX.Element;
	children: JSX.Element;
}

export const SimpleSection: React.FC<Props> = ({ header, icon, children }) => {
	return (
		<>
			<div className="header">
				<div className="title">
					<div className="icon">{icon}</div>
					<h2>{header}</h2>
				</div>
			</div>
			{children}
		</>
	);
};
