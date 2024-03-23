import { type FC, Fragment } from 'react';
import { useLocation } from 'react-router';
import { useAdminCompanyStore } from '../../../../data';

interface Props {
	customSegment?: string[];
	root: string;
	rootAction: () => void;
}

export const Breadcrumb: FC<Props> = (props) => {
	const location = useLocation();
	const { companySelected } = useAdminCompanyStore((state) => state);

	const defaultSegment = location.pathname
		.split('/')
		.filter((segment) => segment !== '');

	const segments = !props.customSegment ? defaultSegment : props.customSegment;

	return (
		<span className="breadcrumb">
			<span className="go-home" onClick={props.rootAction}>
				{companySelected?.name}
			</span>
			{segments.map((segment: string, i: number) => (
				<Fragment key={i}>
					<span className="sep">//</span>
					{segment}
				</Fragment>
			))}
		</span>
	);
};
