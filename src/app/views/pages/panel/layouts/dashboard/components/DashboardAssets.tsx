import React, { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CircleIcon, SimpleSection } from '../../../../../components';
import { CompanyResource, generateIDArray } from '../../../../../../data';

const DashboardAssets = ({ resources }: { resources: CompanyResource }) => {
	const resourceKeys = useMemo(
		() => generateIDArray(Object.keys(resources).length),
		[Object.keys(resources).length],
	);

	return (
		<div className="card stats">
			<SimpleSection header="Supervised assets" icon={<CircleIcon />}>
				<div className="content">
					{Object.keys(resources).map(
						(resource: string | number, i: number) => {
							return (
								<Fragment key={resourceKeys[i]}>
									<Link to={`/${resource}`} className="stat">
										<span className="value">
											{resources[resource as keyof typeof resources]}
										</span>
										<p>{resource}</p>
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
