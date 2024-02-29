import React, { Fragment } from 'react';
import { useLocation } from 'react-router';
import { FaAngleDoubleRight } from "react-icons/fa";
import {
	useAdminCompanyStore,
} from '../../../data';

interface Props {
	customSegment?: string[];
	root: string;
	rootAction: () => void;
}

export const Breadcrumb: React.FC<Props> = (props) => {
	const location = useLocation();
	const { companySelected } = useAdminCompanyStore((state) => state);

	const defaultSegment = location.pathname
		.split('/')
		.filter((segment) => segment !== '');

	const segments = !props.customSegment ? defaultSegment : props.customSegment;

	return (
		<span className="breadcrumb">
			<span className="go-home" onClick={props.rootAction}>
				<b>company:</b> {companySelected?.name}
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
