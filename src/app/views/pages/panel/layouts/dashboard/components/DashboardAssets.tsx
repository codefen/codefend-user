import { type FC, Fragment, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CircleIcon, SimpleSection } from '../../../../../components';
import { type CompanyResource, generateIDArray } from '../../../../../../data';

export const DashboardAssets: FC<{ resources: CompanyResource }> = ({
	resources,
}) => {
	const location = useLocation();
	const resourceKeys = useMemo(
		() => generateIDArray(Object.keys(resources).length),
		[Object.keys(resources).length],
	);

	const isActivePath = (current: string) => {
		if (current === 'web') return location.pathname === '/dashboard';
		return current === location.pathname;
	};

	const mapAssetsNames = {
		['web']: 'WEB & EXTERNAL',
		['mobile']: 'MOBILE APPS',
		['lan']: 'NETWORK',
		['cloud']: 'CLOUD ASSETS',
		['source']: 'SOURCE CODE',
		['social']: 'SOCIAL ENGINEERING',
	};
	return (
		<div className="card stats">
			<SimpleSection
				header="Atack surface surveillance"
				icon={<CircleIcon />}>
				<div className="content">
					{Object.keys(resources).map(
						(resource: string | number, i: number) => {
							return (
								<Fragment key={resourceKeys[i]}>
									<Link
										to={`/${resource}`}
										className={`stat ${
											isActivePath(resource as string)
												? 'active'
												: ''
										}`}>
										<span className="value">
											{resources[resource as keyof typeof resources]}
										</span>
										<p>
											{
												mapAssetsNames[
													resource as keyof typeof mapAssetsNames
												]
											}
										</p>
									</Link>
								</Fragment>
							);
						},
					)}
				</div>
			</SimpleSection>
		</div>
	);
};

export default DashboardAssets;
