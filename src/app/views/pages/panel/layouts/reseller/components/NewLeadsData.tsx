import { SimpleSection } from '@defaults/SimpleSection';
import { GlobeWebIcon } from '@icons';
import type { Lead } from '@interfaces/lead';
import { useState, type FC } from 'react';
import { StatAsset } from '@standalones/stat-asset/StatAsset';

interface NewLeadsDataProps {
	leads: Lead[];
}

export const NewLeadsData: FC<NewLeadsDataProps> = ({ leads }) => {
	const [assetActive, setAssetActive] = useState<number>(0);
	const getConfirmedLeads = (leads: Lead[]) => {
		return leads.filter((lead) => lead.condicion === 'confirmed').length;
	};
	const totalVerified = getConfirmedLeads(leads);
	const totalLeads = leads.length;
	return (
		<div className="card leads">
			<SimpleSection header="New lead data" icon={<GlobeWebIcon />}>
				<div className="asset-content">
					<div className="stats">
						<StatAsset
							value={totalLeads}
							valueTitle={'New Leads'}
							isActive={assetActive === 0}
							onClick={() => setAssetActive(0)}
						/>
						<StatAsset
							value={`${Math.round((totalVerified / totalLeads) * 100)}%`}
							valueTitle={'Email verified'}
							isActive={assetActive === 1}
							onClick={() => setAssetActive(1)}
						/>
						<StatAsset
							value={`${Math.round(((totalLeads - totalVerified) / totalLeads) * 100)}%`}
							valueTitle={'Failed to verify'}
							isActive={assetActive === 2}
							onClick={() => setAssetActive(2)}
						/>
					</div>
				</div>
			</SimpleSection>
		</div>
	);
};
