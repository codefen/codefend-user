import { SimpleSection } from '@defaults/SimpleSection';
import { GlobeWebIcon } from '@icons';
import { ResellerAssetsStats } from './ResellerAssetsStats';

export const NewLeadsData = () => {
	const assets = [
		{
			value: '251',
			title: 'NEW LEADS',
		},
		{
			value: '95%',
			title: 'EMAIL VERIFIED',
		},
		{
			value: '5%',
			title: 'Failed to verify',
		},
	];

	return (
		<div className="card leads">
			<SimpleSection header="New lead data" icon={<GlobeWebIcon />}>
				<ResellerAssetsStats
					initialActive={0}
					assets={assets}
					assetsKey="right"
				/>
			</SimpleSection>
		</div>
	);
};
