import { useShowScreen } from '#commonHooks/useShowScreen';
import { useEffect } from 'react';
import { ResellerHeader } from '../components/ResellerHeader';
import { ResourceByLocation } from '@standalones/ResourceByLocation';
import { useResellerUsers } from '@userHooks/resellers/useResellerUsers';
import '../reseller.scss';
import type { ResellerUser } from '@interfaces/user';
import { LocationItem } from '@standalones/utils/LocationItem';
import { SimpleSectionWithTable } from '@defaults/SimpleSectionWithTable';
import { resellerUserActiveColumns } from '@mocks/defaultData';

const ResellerUsersLayout = () => {
  const [showScreen] = useShowScreen();

  const [users, { getResellerUsers, isLoading }] = useResellerUsers();

  useEffect(() => {
    getResellerUsers();
  }, []);
  const rows = users.current.map(
    (user: ResellerUser) =>
      ({
        ID: { value: '', style: '' },
        area: {
          value: <LocationItem country={user.pais || 'unknown'} countryCode={user.pais_code} />,
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
      }) as any
  );
  return (
    <main className={`reseller ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <ResellerHeader />
        <div className="reseller-tables table-users">
          <SimpleSectionWithTable
            title="Listing all users created"
            columns={resellerUserActiveColumns}
            rows={rows}
            isLoading={isLoading}
          />
        </div>
      </section>
      <section className="right">
        <ResourceByLocation
          resource={users.current}
          isLoading={isLoading}
          type="g"
          title="Users by location"
        />
      </section>
    </main>
  );
};
export default ResellerUsersLayout;
