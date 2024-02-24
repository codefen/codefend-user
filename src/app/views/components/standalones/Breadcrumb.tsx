import React, { Fragment } from 'react';
import { useLocation } from 'react-router';
import { FaAngleDoubleRight } from "react-icons/fa";

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
				<b>company:</b> {props.root}
			</span>
			{segments.map((segment: string, i: number) => (
				<Fragment key={i}>
					<span className="sep"><FaAngleDoubleRight /></span>
					{segment}
				</Fragment>
			))}
		</span>
	);
};