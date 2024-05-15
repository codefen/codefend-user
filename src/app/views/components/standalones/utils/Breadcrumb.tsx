import { type FC, Fragment } from 'react';
import { useLocation } from 'react-router';
import { useAdminCompanyStore } from '../../../../data';
import { useUserData } from '#commonUserHooks/useUserData';
import { Show } from '../..';

interface Props {
	customSegment?: string[];
	root: string;
	rootAction: () => void;
}

export const Breadcrumb: FC<Props> = (props) => {
	const { getUserdata } = useUserData();
	const location = useLocation();
	const { companySelected } = useAdminCompanyStore((state) => state);

	const defaultSegment = location.pathname
		.split('/')
		.filter((segment) => segment !== '');

	const segments = !props.customSegment ? defaultSegment : props.customSegment;
	return (
		<span className="breadcrumb">
			<Show
				when={
					getUserdata().access_role !== 'provider' ||
					(getUserdata().access_role === 'provider' &&
						companySelected?.id !== getUserdata().company_id)
				}>
				<span className="go-home" onClick={props.rootAction}>
					{companySelected &&
					companySelected?.name &&
					companySelected?.name !== 'unknow'
						? companySelected.name
						: getUserdata().company_name}
				</span>
				<span className="sep">//</span>
			</Show>
			{segments.map((segment: string, i: number) => (
				<Fragment key={i}>
					{segment}
					<span className="sep">
						{segments.length - 1 === i ? '' : '//'}
					</span>
				</Fragment>
			))}
		</span>
	);
};
