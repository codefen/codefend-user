import React, { Fragment } from 'react';
import { useLocation } from 'react-router';

interface Props {
	customSegment?: string[];
	root: string;
	rootAction: () => void;
}

export const Breadcrumb: React.FC<Props> = (props) => {
	const location = useLocation();

	const defaultSegment = location.pathname
		.split('/')
		.filter((segment) => segment !== '');

	const segments = !props.customSegment ? defaultSegment : props.customSegment;

	return (
		<span className="breadcrumb">
			<span className="go-home" onClick={props.rootAction}>
				{props.root}
			</span>
			{segments.map((segment: string, i: number) => (
				<Fragment key={i}>
					<span className="sep">&gt;</span>
					{segment}
				</Fragment>
			))}
		</span>
	);
};
