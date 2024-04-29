import { SimpleSection } from '@defaults/SimpleSection';
import { GlobeWebIcon } from '@icons';
import {
	resellerCompanyColumns,
	resellerUserActiveColumns,
} from '@mocks/defaultData';
import { LocationItem } from '@standalones/index';
import { TableV2 } from '@table/tablev2';
import type { FC } from 'react';
import type { ResellerUser } from '@interfaces/user';
import type { Company } from '@interfaces/company';

interface ResellerAllCompaniesProps {
	companies: Company[];
	isLoading: boolean;
}

export const ResellerAllCompanies: FC<ResellerAllCompaniesProps> = ({
	companies,
	isLoading,
}) => {
	const dataTable = companies.map(
		(company: Company) =>
			({
				ID: { value: '', style: '' },
				area: {
					value: (
						<LocationItem
							country={company.pais || 'unknown'}
							countryCode={company.pais_code}
						/>
					),
					style: 'area',
				},
				company: { value: company.name, style: 'company' },
				website: { value: company.web, style: 'web-site' },
				size: { value: company.size, style: 'size' },
				fullname: {
					value: `${company.owner_fname} ${company.owner_lname}`,
					style: 'full-name',
				},
				published: { value: company.creacion, style: 'date' },
			}) as any,
	);

	return (
		<div className="card">
			<SimpleSection header="Listing all companies" icon={<GlobeWebIcon />}>
				<div className="">
					<TableV2
						columns={resellerCompanyColumns}
						rowsData={dataTable}
						showEmpty={!isLoading && !Boolean(dataTable.length)}
						showRows={!isLoading}
					/>
				</div>
			</SimpleSection>
		</div>
	);
};
