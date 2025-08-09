import { useEffect, useState, type FC } from 'react';
import { type ColumnTableV3 } from '@interfaces/table';
import type { CompanyMember } from '@interfaces/dashboard';
import Tablev3 from '@table/v3/Tablev3';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { TABLE_KEYS } from '@/app/constants/app-texts';

interface DashboardCollaboratorsProps {
  members: CompanyMember[];
  isLoading: boolean;
}

// Icono de corona para el Owner
const CrownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
    <path
      d="M3 17h18v2H3v-2zm0-3h18l-2-8h-2l-2 3-4-6-4 6-2-3H3l-2 8h18z"
      fill="#ff3939"
      stroke="#cc2929"
      strokeWidth="0.5"
    />
    <circle cx="7" cy="10" r="1" fill="#cc2929" />
    <circle cx="12" cy="8" r="1" fill="#cc2929" />
    <circle cx="17" cy="10" r="1" fill="#cc2929" />
  </svg>
);

export const membersColumns: ColumnTableV3[] = [
  {
    header: 'Email',
    key: 'email',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-3',
    weight: '100%', // Ocupar todo el ancho disponible
    render: (value, row) => {
      // Con TABLE_KEYS.FULL_ROW, 'value' es el objeto completo y 'row' es null
      const memberObj = value; // value es el objeto member completo
      const isFounder = memberObj?.is_owner || false;
      const emailText = memberObj?.email || '';

      // console.log('🔍 Debug Crown FIXED:', {
      //   email: emailText,
      //   is_owner: memberObj?.is_owner,
      //   isFounder,
      //   memberObj: memberObj,
      //   'value (should be member)': value,
      //   'row (should be null)': row
      // });

      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{emailText}</span>
          {isFounder && <CrownIcon />}
        </div>
      );
    },
  },
];

const DashboardCollaborators: FC<DashboardCollaboratorsProps> = ({ members, isLoading }) => {
  const [membersMapped, setMembersMapped] = useState<any[]>([]);
  const company = useGlobalFastField('company');

  useEffect(() => {
    // console.log('🔍 DETAILED COMPANY DEBUG:', {
    //   'company.get': company.get,
    //   'company.get.owner_email': company.get.owner_email,
    //   'company.get.admin_user_email': company.get.admin_user_email,
    //   allCompanyKeys: Object.keys(company.get || {}),
    //   companyStructure: JSON.stringify(company.get, null, 2),
    // });
    // console.log('👥 Members original:', members);

    // Intentar múltiples formas de encontrar el owner
    const ownerEmail = company.get.owner_email || company.get.admin_user_email || '';
    // console.log('🎯 Owner email determined:', ownerEmail);

    const mapped = members.map(member => ({
      ...member,
      is_owner: ownerEmail === member.email,
    }));

    // console.log('👥 Members mapped:', mapped);
    setMembersMapped(mapped);
  }, [members, company.get.owner_email, company.get.admin_user_email]);

  return (
    <div className="collaborators">
      <Tablev3
        rows={membersMapped}
        columns={membersColumns}
        showRows={true}
        showSkeleton={isLoading}
        totalRowCount={5}
      />
    </div>
  );
};

export default DashboardCollaborators;
