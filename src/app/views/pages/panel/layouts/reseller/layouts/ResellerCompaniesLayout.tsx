import { useShowScreen } from '#commonHooks/useShowScreen';
import { useEffect } from 'react';
import { ResellerHeader } from '../components/ResellerHeader';
import '../reseller.scss';
import { useResellerCompanies } from '@userHooks/resellers/useResellerCompanies';
import { ResourceByLocation } from '@/app/views/components/ResourceByLocation/ResourceByLocation';
import { SimpleSectionWithTable } from '@/app/views/components/SimpleSectionWithTable/SimpleSectionWithTable';
import type { Company } from '@interfaces/company';
import { resellerCompanyColumns } from '@mocks/defaultData';
import { LocationItem } from '@/app/views/components/utils/LocationItem';

const ResellerCompaniesLayout = () => {
  const [showScreen] = useShowScreen();

  const [companies, { getResellerCompanies, isLoading }] = useResellerCompanies();

  useEffect(() => {
    getResellerCompanies();
  }, []);

  const rows = companies.current.map(
    (company: Company) =>
      ({
        ID: { value: '', style: '' },
        area: {
          value: (
            <LocationItem country={company.pais || 'unknown'} countryCode={company.pais_code} />
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
      }) as any
  );

  return (
    <main className={`reseller ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <ResellerHeader />
        <div className="reseller-tables table-companies">
          {/* <SimpleSectionWithTable
            title="Listing all companies"
            columns={resellerCompanyColumns}
            rows={rows}
            isLoading={isLoading}
          /> */}
        </div>
      </section>
      <section className="right">
        <ResourceByLocation
          resource={companies.current}
          isLoading={isLoading}
          type="g"
          title="Companies by location"
        />
      </section>
    </main>
  );
};
export default ResellerCompaniesLayout;
