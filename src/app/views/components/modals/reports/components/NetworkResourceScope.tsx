import { type FC, type ReactNode } from 'react';
import { TableWithoutActions } from '../../..';
import {
	type ResourceScope,
	lanResourcesTableWithoutAction,
} from '../../../../../data';

export const NetworkResourceScope: FC<ResourceScope<any[]>> = ({
	resources,
	isLoading,
}) => {
	const scopeDataTable = resources
		? resources.map((network: any, i: number) => ({
				ID: { value: '', style: '' },
				Identifier: { value: network.id, style: 'id' },
				internalIp: { value: network.device_in_address, style: 'ip' },
				externalIp: { value: network.device_ex_address, style: 'ip' },
				description: {
					value: `${network.device_desc}`,
					style: 'full-name',
				},
				childs: {
					value: (props: any) =>
						(
							<>
								{network.childs
									? network.childs.map((netChild: any, i: number) => (
											<a
												key={`child-${i}-${netChild.id}`}
												className={`item item-with-out-action ${
													props.selectedField ===
													`child-${netChild.id}`
														? 'left-marked'
														: ''
												}`}
												href={
													props.urlNav
														? `${props.urlNav}${netChild.id}`
														: ''
												}
												onClick={(e) =>
													props.handleClick(
														e,
														`child-${netChild.id}`,
														'',
													)
												}>
												<div className="id">
													<div className="publish">
														{netChild.id}
													</div>
												</div>
												<div className="ip">
													<div className="publish lined">
														<span
															className={`sub-domain-icon-v ${network.childs?.length === i + 1 && 'sub-is-last'}`}></span>
														<span className="sub-domain-icon-h"></span>
														{netChild.device_in_address}
													</div>
												</div>
												<div className="ip">
													<div className="publish">
														{netChild.device_ex_address}
													</div>
												</div>
												<div className="full-name">
													<div className="publish">
														{netChild.device_desc}
													</div>
												</div>
											</a>
										))
									: null}
							</>
						) as ReactNode,
					style: '',
				},
			}))
		: [];

	return (
		<TableWithoutActions
			columns={lanResourcesTableWithoutAction}
			resources={scopeDataTable}
			isLoading={isLoading}
			id={3}
			needMarker
		/>
	);
};
