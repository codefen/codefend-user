import { useEffect } from 'react';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { ResellerHeader } from '../components/ResellerHeader';
import { NewLeadsData } from '../components/NewLeadsData';
import { ResourceByLocation } from '@/app/views/components/ResourceByLocation/ResourceByLocation';
import { useResellerLeads } from '@userHooks/resellers/useResellerLeads';
import '../reseller.scss';
import type { Lead } from '@interfaces/lead';
import { defaultListLeadsColumns } from '@mocks/defaultData';
import { SimpleSectionWithTable } from '@/app/views/components/SimpleSectionWithTable/SimpleSectionWithTable';
import { CheckCircleIcon, XCircleIcon } from '@icons';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import Navbar from '@/app/views/components/navbar/Navbar';

const ResellerLeadsLayout = () => {
  const [showScreen] = useShowScreen();
  const [leads, { getResellerLeads, isLoading }] = useResellerLeads();

  useEffect(() => {
    getResellerLeads();
  }, []);
  const rows = leads.current.map(
    (lead: Lead) =>
      ({
        ID: { value: '', style: '' },
        area: {
          value: (
            <LocationItem country={lead.lead_pais || 'unknown'} countryCode={lead.lead_pais_code} />
          ),
          style: 'area',
        },
        company: { value: lead.company_name, style: 'company' },
        website: { value: lead.company_web, style: 'web-site' },
        size: { value: lead.company_size, style: 'size' },
        fullname: {
          value: `${lead.lead_fname} ${lead.lead_lname}`,
          style: 'full-name',
        },
        phone: { value: lead.lead_phone, style: 'phone' },
        postContact: {
          value: true ? <CheckCircleIcon name="y" /> : <XCircleIcon name="n" />,
          style: `post ${true ? 'confirmed' : 'unconfirmed'}`,
        },
      }) as any
  );
  return (
    <main className={`reseller ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <ResellerHeader />
        <div className="reseller-tables">
          {/* <SimpleSectionWithTable
            title="Listing all leads"
            columns={defaultListLeadsColumns}
            rows={rows}
            isLoading={isLoading}
          /> */}
        </div>
      </section>
      <section className="right">
        <Navbar />
        <NewLeadsData leads={leads.current} />
        <ResourceByLocation
          resource={leads.current}
          isLoading={isLoading}
          type="lead"
          title="Leads by location"
        />
      </section>
    </main>
  );
};

export default ResellerLeadsLayout;
