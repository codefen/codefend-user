import { type FC } from 'react';
import { LocationItem, TableWithoutActions } from '../../..';
import {
	type ResourceScope,
	webResourcesWithoutActions,
} from '../../../../../data';

export const WebResourceScope: FC<ResourceScope<any[]>> = ({
	resources,
	isLoading,
}) => {
	const scopeDataTable = resources
		? resources.map((mainNetwork: any, i: number) => ({
				ID: { value: '', style: '' },
				Identifier: { value: mainNetwork.id, style: 'id' },
				domainName: {
					value: mainNetwork.resource_domain,
					style: 'domain-name',
				},
				mainServer: {
					value: mainNetwork.main_server,
					style: 'server-ip',
				},
				location: {
					value: (
						<LocationItem
							key={mainNetwork.id + i + '-l'}
							country={mainNetwork.server_pais}
							countryCode={mainNetwork.server_pais_code}
						/>
					),
					style: 'location',
				},
				childs: {
					value: (
						<>
							{mainNetwork.childs.map((subNetwork: any, i: number) => (
								<div key={'child-' + subNetwork.id} className="item">
									<div className="id">{subNetwork.id}</div>
									<div className="domain-name lined">
										<span className="sub-domain-icon-v"></span>
										<span className="sub-domain-icon-h"></span>
										<span className="sub-resource-domain">
											{subNetwork.resource_domain}
										</span>
									</div>

									<div className="server-ip">
										{subNetwork.main_server}
									</div>
									<div className="location">
										<LocationItem
											key={subNetwork.id + i + '-lc'}
											country={subNetwork.server_pais}
											countryCode={subNetwork.server_pais_code}
										/>
									</div>
								</div>
							))}
						</>
					),
					style: '',
				},
			}))
		: [];

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
