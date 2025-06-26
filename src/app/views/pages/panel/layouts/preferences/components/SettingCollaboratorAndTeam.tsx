import { useRef, type FC } from 'react';
import type { Member } from '@interfaces/panel';
import { ExitIcon, PeopleGroupIcon } from '@icons';
import useModalStore from '@stores/modal.store';
import { UserRevokeModal } from '@modals/UserRevokeModal';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import type { ColumnTableV3 } from '@interfaces/table';
import Tablev3 from '@table/v3/Tablev3';
import { LocationItem } from '@/app/views/components/utils/LocationItem';

interface CollaboratorDataProps {
  isLoading: boolean;
  members: Member[];
  refetch: () => void;
}
const rawCollaboratorColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1 id',
    weight: '6%',
    render: value => value,
  },
  {
    header: 'Area',
    key: 'item-cell-1',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-2',
    weight: '14%',
    render: member => (
      <LocationItem country={member?.pais || 'unknown'} countryCode={member?.pais_code || ''} />
    ),
  },
  {
    header: 'Company',
    key: 'company_name',
    styles: 'item-cell-2',
    weight: '13%',
    render: value => value,
  },
  {
    header: 'Full Name',
    key: 'item-cell-3',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-3',
    weight: '15%',
    render: member => `${member.fname} ${member.lname}`,
  },
  {
    header: 'Email',
    key: 'email',
    styles: 'item-cell-4',
    weight: '24%',
    render: value => value,
  },
  {
    header: 'Phone',
    key: 'phone',
    styles: 'item-cell-5',
    weight: '16%',
    render: value => value,
  },
  {
    header: 'Role',
    key: 'role',
    styles: 'item-cell-6',
    weight: '7%',
    render: value => value,
  },
];

const SettingCollaboratorAndTeam: FC<CollaboratorDataProps> = ({ members, isLoading, refetch }) => {
  const { setModalId, setIsOpen } = useModalStore();
  const userRevokeData = useRef(['', '']);

  const openRevokeModal = (userId: string, name: string) => {
    userRevokeData.current = [userId, name];
    setModalId(MODAL_KEY_OPEN.REVOKE_USER);
    setIsOpen(true);
  };

  const collaboratorColumns = [
    ...rawCollaboratorColumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-7 action',
      weight: '5%',
      render: (member: any) => (
        <span
          title="Remove from the company"
          className={`${!member.company_access_ids ? 'off' : ''}`}
          onClick={() => openRevokeModal(member.id, `${member.fname} ${member.lname}`)}>
          <ExitIcon />
        </span>
      ),
    },
  ];

  const handleAddCollaborator = () => {
    setModalId(MODAL_KEY_OPEN.ADD_COLLABORATOR);
    setIsOpen(true);
  };
  return (
    <>
      <UserRevokeModal
        name={userRevokeData.current[1]}
        userID={userRevokeData.current[0]}
        onDone={refetch}
      />
      <div className="card member-tables">
        <div className="header">
          <div className="title">
            <div className="icon">
              <PeopleGroupIcon />
            </div>
            <span>COLLABORATORS AND TEAM MEMBERS</span>
          </div>
          <div className="actions">
            <div onClick={handleAddCollaborator}>Add collaborator</div>
          </div>
        </div>
        <Tablev3
          columns={collaboratorColumns}
          rows={members}
          showRows={!isLoading}
          initialOrder="id"
          limit={0}
          isNeedSort
        />
      </div>
    </>
  );
};

export default SettingCollaboratorAndTeam;
