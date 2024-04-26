import { SimpleSection } from '@defaults/SimpleSection';
import { GlobeWebIcon } from '@icons';
import {
	defaultListLeadsColumns,
	resellerUserActiveColumns,
} from '@mocks/defaultData';
import { LocationItem } from '@standalones/index';
import { TableV2 } from '@table/tablev2';
import type { Lead } from '@interfaces/lead';
import type { FC } from 'react';
import type { ResellerUser } from '@interfaces/user';

interface ResellerAllUserProps {
	users: ResellerUser[];
	isLoading: boolean;
}

export const ResellerAllUser: FC<ResellerAllUserProps> = ({
	users,
	isLoading,
}) => {
	const dataTable = users.map(
		(user: ResellerUser) =>
			({
				ID: { value: '', style: '' },
				area: {
					value: (
						<LocationItem country={''} countryCode={user.pais_code} />
					),
					style: 'area',
				},
				company: { value: user.company_name, style: 'company' },
				role: { value: user.role, style: 'role' },

				fullname: {
					value: `${user.fname} ${user.lname}`,
					style: 'full-name',
				},
				phone: { value: user.phone, style: 'phone' },
				email: { value: user.email, style: 'email' },
				published: { value: user.creacion, style: 'date' },
			}) as any,
	);

	return (
		<div className="card">
			<SimpleSection
				header="Listing all users created"
				icon={<GlobeWebIcon />}>
				<div className="">
					<TableV2
						columns={resellerUserActiveColumns}
						rowsData={dataTable}
						showEmpty={!isLoading && !Boolean(dataTable.length)}
						showRows={!isLoading}
					/>
				</div>
			</SimpleSection>
		</div>
	);
};
