import { useRef, type FC } from 'react';
import type { Member } from '@interfaces/panel';
import { ExitIcon, PeopleGroupIcon } from '@icons';
import { TableV2 } from '@table/tablev2';
import { preferenceMemberColumns } from '@mocks/defaultData';
import useModalStore from '@stores/modal.store';
import { LocationItem } from '@standalones/index';
import { UserRevokeModal } from '@modals/UserRevokeModal';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

interface CollaboratorDataProps {
  isLoading: boolean;
  members: Member[];
  refetch: () => void;
}

const SettingCollaboratorAndTeam: FC<CollaboratorDataProps> = ({ members, isLoading, refetch }) => {
  const { setModalId, setIsOpen } = useModalStore();
  const userRevokeData = useRef(['', '']);

  const openRevokeModal = (userId: string, name: string) => {
    userRevokeData.current = [userId, name];
    setModalId(MODAL_KEY_OPEN.REVOKE_USER);
    setIsOpen(true);
  };

  const dataTable = members.map(member => ({
    ID: { value: '', style: '' },
    Identifier: { value: Number(member.id), style: 'id' },
    area: {
      value: <LocationItem country={member.pais || 'unknown'} countryCode={member.pais_code} />,
      style: 'area',
    },
    company: { value: member.company_name, style: 'company' },
    fullName: {
      value: `${member.fname} ${member.lname}`,
      style: 'full-name',
    },
    email: { value: member.email, style: 'email' },
    phone: { value: member.phone, style: 'phone' },
    role: { value: member.role, style: 'role' },
    action: {
      value: (
        <>
          <span
            title="Remove from the company"
            className={`${!member.company_access_ids ? 'off' : ''}`}
            onClick={() => openRevokeModal(member.id, `${member.fname} ${member.lname}`)}>
            <ExitIcon />
          </span>
        </>
      ),
      style: 'id action',
    },
  }));

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
        <TableV2
          columns={preferenceMemberColumns}
          rowsData={dataTable}
          showRows={!isLoading}
          showEmpty={!Boolean(dataTable.length) && !isLoading}
        />
      </div>
    </>
  );
};

export default SettingCollaboratorAndTeam;
