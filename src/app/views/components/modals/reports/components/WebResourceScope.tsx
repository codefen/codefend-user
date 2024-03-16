import { LocationItem, TableWithoutActions } from '../../..';
import {
	Resouce,
	ResourceScope,
	Webresources,
	webResourcesWithoutActions,
} from '../../../../../data';
import React from 'react';

export const WebResourceScope: React.FC<ResourceScope<Webresources[]>> = ({
	resources,
	isLoading,
}) => {
	const scopeDataTable = resources.map(
		(mainNetwork: Webresources, i: number) => ({
			ID: { value: mainNetwork.id, style: 'id' },
			domainName: {
				value: mainNetwork.resourceDomain,
				style: 'domain-name',
			},
			mainServer: {
				value: mainNetwork.mainServer,
				style: 'server-ip',
			},
			location: {
				value: (
					<LocationItem
						key={mainNetwork.id + i + '-l'}
						country={mainNetwork.serverCountry}
						countryCode={mainNetwork.serverCountryCode}
					/>
				),
				style: 'location',
			},
			childs: {
				value: (
					<>
						{mainNetwork.childs.map((subNetwork: Resouce, i: number) => (
							<div key={'child-' + subNetwork.id} className="item">
								<div className="id">{subNetwork.id}</div>
								<div className="domain-name lined">
									<span className="sub-domain-icon-v"></span>
									<span className="sub-domain-icon-h"></span>
									<span className="sub-resource-domain">
										{subNetwork.resourceDomain}
									</span>
								</div>

								<div className="server-ip">{subNetwork.mainServer}</div>
								<div className="location">
									<LocationItem
										key={subNetwork.id + i + '-lc'}
										country={subNetwork.serverCountry}
										countryCode={subNetwork.serverCountryCode}
									/>
								</div>
							</div>
						))}
					</>
				),
				style: '',
			},
		}),
	);

	return (
		<TableWithoutActions
			columns={webResourcesWithoutActions}
			resources={scopeDataTable}
			isLoading={isLoading}
			id={2}
			needMarker
		/>
	);
};
