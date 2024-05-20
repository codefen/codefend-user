import { type FC, Fragment, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleIcon, SimpleSection } from '../../../../../components';
import { generateIDArray } from '../../../../../../data';
import { StatAsset } from '@standalones/stat-asset/StatAsset';
import type { ResourceCount } from '@interfaces/dashboard';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';

export const DashboardAssets: FC<{ resources: ResourceCount }> = ({
	resources,
}) => {
	const location = useLocation();
	const navigate = useNavigate();
	const resourceKeys = useMemo(
		() => generateIDArray(Object.keys(resources).length),
		[Object.keys(resources).length],
	);

	const isActivePath = (current: string) => {
		if (current === RESOURCE_CLASS.WEB)
			return location.pathname === '/dashboard';
		return current === location.pathname;
	};

	const mapAssetsNames = {
		[RESOURCE_CLASS.WEB]: 'WEB & EXTERNAL',
		[RESOURCE_CLASS.MOBILE]: 'MOBILE APPS',
		['lan']: 'NETWORK',
		[RESOURCE_CLASS.CLOUD]: 'CLOUD ASSETS',
		[RESOURCE_CLASS.SOURCE]: 'SOURCE CODE',
		[RESOURCE_CLASS.SOCIAL]: 'SOCIAL ENGINEERING',
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
									<StatAsset
										valueTitle={
											mapAssetsNames[
												resource as keyof typeof mapAssetsNames
											]
										}
										value={
											resources[resource as keyof typeof resources]
										}
										isActive={isActivePath(resource as string)}
										onClick={() => navigate(`/${resource}`)}
									/>
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
