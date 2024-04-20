import type { FC } from 'react';
import { TableV2 } from '../..';
import {
	cloudScopeColumns,
	mobileScopeColumns,
	networkScopeColumns,
	socialScopeColumns,
	sourceCodeScopeColumns,
	webScopeColumns,
} from '@mocks/scopeColumns';
import type {
	LanResourceResume,
	SocialDomain,
	SourceResourceResume,
	WebResourceResume,
} from '@interfaces/resources-resumes';

export interface OrderCloudScopeProps {
	title: string;
	resourceScope: any[];
	scopeALias: 'w' | 'm' | 'c' | 's' | 'sc' | 'n';
}

export const OrderScopeTable: FC<OrderCloudScopeProps> = ({
	title,
	scopeALias,
	resourceScope,
}) => {
	const getDataScopeResourceTable = (scopeALias: string, scope: any[]) => {
		let rows = [];
		if (scopeALias === 'w') {
			rows =
				scope.map((res: WebResourceResume) => ({
					ID: { value: '', style: '' },
					Identifier: { value: res.id, style: 'id' },
					domainName: {
						value: res.resource_domain,
						style: 'domain-name',
					},
					server: { value: res.server, style: 'server-ip' },
					childs: {
						value: (props: any) => (
							<>
								{res.childs.map((resChild, i) => (
									<a
										key={`child-${i}-${resChild.id}`}
										className={`item item-with-out-action ${
											props.selectedField === `child-${resChild.id}`
												? 'left-marked'
												: ''
										}`}
										href=""
										onClick={(e) =>
											props.handleClick(
												e,
												`child-${resChild.id}`,
												'',
											)
										}>
										<div className="id">
											<div className="publish">{resChild.id}</div>
										</div>
										<div className="domain-name lined">
											<div className="publish">
												<span
													className={`sub-domain-icon-v ${res.childs.length == i + 1 && 'sub-is-last'}`}></span>
												<span className="sub-domain-icon-h"></span>
												<span className="sub-resource-domain">
													{resChild.resource_domain}
												</span>
											</div>
										</div>
										<div className="server-ip">
											<div className="publish">
												{resChild.server}
											</div>
										</div>
									</a>
								))}
							</>
						),
						style: '',
					},
				})) || [];
			return { rows, columns: webScopeColumns };
		}
		if (scopeALias === 'm') {
			rows =
				scope.map((res: any) => ({
					ID: { value: '', style: '' },
					Identifier: { value: res.id, style: 'id' },
					name: {
						value: res.app_name,
						style: 'full-name',
					},
					link: { value: res.app_link, style: 'url' },
				})) || [];
			return { rows, columns: mobileScopeColumns };
		}
		if (scopeALias === 'c') {
			rows =
				scope.map((res: any) => ({
					ID: { value: '', style: '' },
					Identifier: { value: res.id, style: 'id' },
					name: {
						value: res.cloud_name,
						style: 'full-name',
					},
					provider: { value: res.cloud_provider, style: 'full-name' },
				})) || [];
			return { rows, columns: cloudScopeColumns };
		}
		if (scopeALias === 's') {
			rows =
				scope.map((res: SocialDomain, i: number) => ({
					ID: { value: '', style: '' },
					Identifier: { value: i + 1, style: 'id' },
					domain: {
						value: res.domain,
						style: 'domain-name',
					},
					quantity: { value: res.quantity, style: 'id' },
				})) || [];
			return { rows, columns: socialScopeColumns };
		}
		if (scopeALias === 'sc') {
			rows =
				scope.map((res: SourceResourceResume) => ({
					ID: { value: '', style: '' },
					Identifier: { value: res.id, style: 'id' },
					name: {
						value: res.name,
						style: 'full-name',
					},
					url: { value: res.access_link, style: 'url' },
				})) || [];
			return { rows, columns: sourceCodeScopeColumns };
		}
		if (scopeALias === 'n') {
			console.log({ scope });
			rows =
				scope.map((res: LanResourceResume) => ({
					ID: { value: '', style: '' },
					Identifier: { value: res.id, style: 'id' },
					externalIp: {
						value: res.device_ex_address,
						style: 'server-ip',
					},
					internalIp: { value: res.device_in_address, style: 'server-ip' },
					childs: {
						value: (props: any) => (
							<>
								{res.childs.map((resChild, i) => (
									<a
										key={`child-${i}-${resChild.id}`}
										className={`item item-with-out-action ${
											props.selectedField === `child-${resChild.id}`
												? 'left-marked'
												: ''
										}`}
										href=""
										onClick={(e) =>
											props.handleClick(
												e,
												`child-${resChild.id}`,
												'',
											)
										}>
										<div className="id">
											<div className="publish">{resChild.id}</div>
										</div>
										<div className="server-ip lined">
											<div className="publish">
												<span
													className={`sub-domain-icon-v ${res.childs.length == i + 1 && 'sub-is-last'}`}></span>
												<span className="sub-domain-icon-h"></span>
												<span className="sub-resource-domain">
													{resChild.device_ex_address}
												</span>
											</div>
										</div>
										<div className="server-ip">
											<div className="publish">
												{resChild.device_in_address}
											</div>
										</div>
									</a>
								))}
							</>
						),
						style: '',
					},
				})) || [];
			return { rows, columns: networkScopeColumns };
		}

		return { rows: [], columns: [] };
	};

	const dataTable = getDataScopeResourceTable(scopeALias, resourceScope);

	return (
		<>
			<h2>{title}</h2>
			<TableV2
				columns={dataTable.columns}
				rowsData={dataTable.rows}
				showRows={true}
				showEmpty={!Boolean(dataTable.rows.length)}
				sizeY={15}
			/>
		</>
	);
};
