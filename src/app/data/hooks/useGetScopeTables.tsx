import {
	memberColumn,
	memberColumnWithoutContact,
	roleMap,
} from '@mocks/defaultData';
import {
	cloudScopeColumns,
	mobileScopeColumns,
	networkScopeColumns,
	socialScopeColumns,
	sourceCodeScopeColumns,
	webScopeColumns,
} from '@mocks/scopeColumns';

export const useGetScopeTables = (changeSocial?: boolean) => {
	const getDataScopeResourceTable = (scopeALias: string, scope: any[]) => {
		let rows = [];
		if (scopeALias === 'w') {
			rows =
				scope.map((res: any) => ({
					ID: { value: res.id, style: '' },
					Identifier: { value: res.id, style: 'id' },
					domainName: {
						value: res.resource_domain,
						style: 'domain-name',
					},
					server: {
						value: res.server || res.main_server,
						style: 'server-ip',
					},
					childs: {
						value: (props: any) => (
							<>
								{res.childs
									? res.childs.map((resChild: any, i: number) => (
											<a
												key={`child-${i}-${resChild.id}`}
												className={`item item-with-out-action ${
													props.selectedField ===
													`child-${resChild.id}`
														? 'left-marked'
														: ''
												}`}
												href=""
												onClick={(e) =>
													props.handleClick(
														e,
														`child-${resChild.id}`,
														resChild.id,
													)
												}>
												<div className="id">
													<div className="publish">
														{resChild.id}
													</div>
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
														{resChild.main_server}
													</div>
												</div>
											</a>
										))
									: null}
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
					ID: { value: res.id, style: '' },
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
		if (scopeALias === 's' && !changeSocial) {
			rows =
				scope.map((res: any, i: number) => ({
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
		if (scopeALias === 's' && changeSocial) {
			rows =
				scope.map((res: any, i: number) => ({
					ID: { value: res.id, style: 'id' },
					fullName: {
						value: `${res.member_fname} ${res.member_lname}`,
						style: 'full-name',
					},
					role: {
						value: roleMap[res.member_role as keyof typeof roleMap],
						style: 'role',
					},
				})) || [];
			return { rows, columns: memberColumnWithoutContact };
		}
		if (scopeALias === 'sc') {
			rows =
				scope.map((res: any) => ({
					ID: { value: res.id, style: '' },
					Identifier: { value: res.id, style: 'id' },
					name: {
						value: res.name,
						style: 'full-name',
					},
					link: { value: res.access_link, style: 'url' },
				})) || [];
			return { rows, columns: sourceCodeScopeColumns };
		}
		if (scopeALias === 'n') {
			rows =
				scope.map((res: any) => ({
					ID: { value: res.id, style: '' },
					Identifier: { value: res.id, style: 'id' },
					externalIp: {
						value: res.device_ex_address,
						style: 'server-ip',
					},
					internalIp: { value: res.device_in_address, style: 'server-ip' },
					childs: {
						value: (props: any) => (
							<>
								{res.childs
									? res.childs.map((resChild: any, i: number) => (
											<a
												key={`child-${i}-${resChild.id}`}
												className={`item item-with-out-action ${
													props.selectedField ===
													`child-${resChild.id}`
														? 'left-marked'
														: ''
												}`}
												href=""
												onClick={(e) =>
													props.handleClick(
														e,
														`child-${resChild.id}`,
														resChild.id,
													)
												}>
												<div className="id">
													<div className="publish">
														{resChild.id}
													</div>
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
										))
									: null}
							</>
						),
						style: '',
					},
				})) || [];
			return { rows, columns: networkScopeColumns };
		}
		return { rows: [], columns: [] };
	};
	return getDataScopeResourceTable;
};
