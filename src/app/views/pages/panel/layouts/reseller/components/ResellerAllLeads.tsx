import { SimpleSection } from '@defaults/SimpleSection';
import { GlobeWebIcon } from '@icons';
import { defaultListLeadsColumns } from '@mocks/defaultData';
import { LocationItem } from '@standalones/index';
import { TableV2 } from '@table/tablev2';
import { generateIDArray } from '@utils/helper';
import '@styles/flag.scss';
import type { Lead } from '@interfaces/lead';
import type { FC } from 'react';

interface ResellerAllLeadsProps {
	leads: Lead[];
}

export const ResellerAllLeads: FC<ResellerAllLeadsProps> = ({ leads }) => {
	const dataTable = leads.map(
		(lead: Lead) =>
			({
				ID: { value: '', style: '' },
				area: {
					value: (
						<LocationItem
							country={''}
							countryCode={lead.lead_pais_code}
						/>
					),
					style: 'area',
				},
				company: { value: lead.company_name, style: 'company' },
				website: { value: lead.company_web, style: 'full-name' },
				size: { value: lead.company_size, style: 'size' },
				fullname: {
					value: `${lead.lead_fname} ${lead.lead_lname}`,
					style: 'full-name',
				},
				phone: { value: lead.lead_phone, style: 'phone' },
				postContact: { value: 'Okey', style: 'post' },
			}) as any,
	);

	return (
		<div className="card">
			<SimpleSection header="Listing all leads" icon={<GlobeWebIcon />}>
				<div className="">
					<TableV2
						columns={defaultListLeadsColumns}
						rowsData={dataTable}
						showEmpty={dataTable.length == 0}
						showRows={dataTable.length !== 0}
					/>
				</div>
			</SimpleSection>
		</div>
	);
};
