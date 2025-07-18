import { useEffect, useState, type FC } from 'react';
import { type ColumnTableV3 } from '@interfaces/table';
import type { CompanyMember } from '@interfaces/dashboard';
import Tablev3 from '@table/v3/Tablev3';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

interface DashboardCollaboratorsProps {
  members: CompanyMember[];
  isLoading: boolean;
}

// Icono de corona para el Founder
const CrownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: '8px', verticalAlign: 'middle' }}>
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="#FFD700"
      stroke="#FFD700"
      strokeWidth="1"
    />
  </svg>
);

export const membersColumns: ColumnTableV3[] = [
  {
    header: 'Email',
    key: 'email',
    styles: 'item-cell-3',
    weight: '100%', // Ocupar todo el ancho disponible
    render: (value, row) => {
      const isFounder = row?.is_owner || false;
      console.log('🔍 Debug Crown:', { 
        email: value, 
        is_owner: row?.is_owner, 
        isFounder,
        row: row 
      });
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isFounder && <CrownIcon />}
          <span>{value}</span>
        </div>
      );
    },
  },
];

const DashboardCollaborators: FC<DashboardCollaboratorsProps> = ({ members, isLoading }) => {
  const [membersMapped, setMembersMapped] = useState<any[]>([]);
  const company = useGlobalFastField('company');

  useEffect(() => {
    console.log('🏢 Company owner email:', company.get.owner_email);
    console.log('👥 Members original:', members);
    
    const mapped = members.map(member => ({
      ...member,
      is_owner: company.get.owner_email === member.email,
    }));
    
    console.log('👥 Members mapped:', mapped);
    setMembersMapped(mapped);
  }, [members, company.get.owner_email]);

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
