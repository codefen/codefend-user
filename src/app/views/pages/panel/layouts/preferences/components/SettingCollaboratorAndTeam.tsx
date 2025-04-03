import { useRef, type FC } from 'react';
import type { Member } from '@interfaces/panel';
import { ExitIcon, PeopleGroupIcon } from '@icons';
import useModalStore from '@stores/modal.store';
import { LocationItem } from '@standalones/index';
import { UserRevokeModal } from '@modals/UserRevokeModal';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import type { ColumnTableV3 } from '@interfaces/table';
import Tablev3 from '@table/v3/Tablev3';

interface CollaboratorDataProps {
  isLoading: boolean;
  members: Member[];
  refetch: () => void;
}

const rawCollaboratorCollumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1 id',
    weight: '6%',
    render: value => value,
  },
  {
    header: 'Area',
    key: 'pais',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-2 area',
    weight: '19%',
    render: member => (
      <LocationItem country={member?.pais || 'unknown'} countryCode={member?.pais_code || ''} />
    ),
  },
  {
    header: 'Company',
    key: 'company_name',
    styles: 'item-cell-3 company',
    weight: '15%',
    render: value => value,
  },
  {
    header: 'Full Name',
    key: 'fullName',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-3 full-name',
    weight: '15%',
    render: member => `${member.fname} ${member.lname}`,
  },
  {
    header: 'Email',
    key: 'email',
    styles: 'item-cell-4 email',
    weight: '20%',
    render: value => value,
  },
  {
    header: 'Phone',
    key: 'phone',
    styles: 'item-cell-5 phone',
    weight: '10%',
    render: value => value,
  },
  {
    header: 'Role',
    key: 'role',
    styles: 'item-cell-6 role',
    weight: '10%',
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

  const collaboratorCollumns = [
    ...rawCollaboratorCollumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-7 action',
      weight: '10%',
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
          columns={collaboratorCollumns}
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
