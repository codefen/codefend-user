import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { StatAsset } from '@/app/views/pages/auth/newRegister/stat-asset/StatAsset';
import { GlobeWebIcon } from '@icons';
import type { Lead } from '@interfaces/lead';
import { useState, type FC } from 'react';

interface NewLeadsDataProps {
  leads: Lead[];
}

export const NewLeadsData: FC<NewLeadsDataProps> = ({ leads }) => {
  const [assetActive, setAssetActive] = useState<number>(0);
  const getConfirmedLeads = (leads: Lead[]) => {
    return leads.filter(lead => lead.condicion === 'confirmed').length;
  };
  const totalVerified = getConfirmedLeads(leads);
  const totalLeads = leads.length;
  return (
    <div className="card stats">
      <SimpleSection header="New lead data" icon={<GlobeWebIcon />}>
        <div className="content">
          <StatAsset
            value={totalLeads}
            valueTitle={'New Leads'}
            isActive={assetActive === 0}
            onClick={() => setAssetActive(0)}
          />
          <StatAsset
            value={`${Math.round((totalVerified / totalLeads) * 100)}%`}
            valueTitle={'Users Created'}
            isActive={assetActive === 1}
            onClick={() => setAssetActive(1)}
          />
          <StatAsset
            value={`${Math.round(((totalLeads - totalVerified) / totalLeads) * 100)}%`}
            valueTitle={'Fail to convert'}
            isActive={assetActive === 2}
            onClick={() => setAssetActive(2)}
          />
        </div>
      </SimpleSection>
    </div>
  );
};
