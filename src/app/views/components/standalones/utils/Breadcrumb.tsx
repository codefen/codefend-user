import { type FC, Fragment } from 'react';
import { useLocation } from 'react-router';
import { useAdminCompanyStore } from '../../../../data';
import { useUserRole } from '#commonUserHooks/useUserRole';

interface Props {
	customSegment?: string[];
	root: string;
	rootAction: () => void;
}

export const Breadcrumb: FC<Props> = (props) => {
	const { isProvider, isReseller } = useUserRole();
	const location = useLocation();
	const { companySelected } = useAdminCompanyStore((state) => state);

	const defaultSegment = location.pathname
		.split('/')
		.filter((segment) => segment !== '');

	const segments = !props.customSegment ? defaultSegment : props.customSegment;
	const rootFallback = isProvider() ? 'Hacker' : 'Reseller';
	return (
		<span className="breadcrumb">
			<span className="go-home" onClick={props.rootAction}>
				{companySelected?.name !== 'unknow'
					? companySelected?.name
					: rootFallback}
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
