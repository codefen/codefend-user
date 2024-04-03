import { SimpleSection } from '@defaults/SimpleSection';
import { GlobeWebIcon } from '@icons';
import { defaultListLeadsColumns } from '@mocks/defaultData';
import { LocationItem } from '@standalones/index';
import { TableV2 } from '@table/tablev2';
import { generateIDArray } from '@utils/helper';
import '@styles/flag.scss';

export const ResellerAllLeads = () => {
	const dataTable = generateIDArray(20).map(
		(id: any) =>
			({
				ID: { value: '', style: '' },
				area: {
					value: <LocationItem country={''} countryCode={'sa'} />,
					style: 'area',
				},
				company: { value: 'Al-Sulaimani', style: 'company' },
				website: { value: 'Al-Sulaimani.com.sa', style: 'full-name' },
				size: { value: '1000-5000', style: 'size' },
				fullname: { value: 'Tarek Al-Amin Kamal', style: 'full-name' },
				phone: { value: '+973 93699133', style: 'phone' },
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
						sizeY={50}
					/>
				</div>
			</SimpleSection>
		</div>
	);
};
