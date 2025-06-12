import { type FC } from 'react';
import { useNavigate } from 'react-router';

import ConfirmModal from '@modals/ConfirmModal';
import { TrashIcon, BugIcon, DocumentIcon, PeopleGroupIcon } from '@icons';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';

import type { MemberV2 } from '@interfaces/panel';
import type { ColumnTableV3, TableItem } from '@interfaces/table';
import { roleMap } from '@mocks/defaultData';
import useModal from '@hooks/common/useModal';
import AddSocialResourceModal from '@modals/adding-modals/AddSocialResourceModal';
import { useAddSocial } from '@resourcesHooks/social/useDeleteSocial';
import { useUserRole } from '#commonUserHooks/useUserRole';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, TABLE_KEYS } from '@/app/constants/app-texts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import Tablev3 from '@table/v3/Tablev3';

interface SocialProps {
  refetch: () => void;
  isLoading: boolean;
  socials: MemberV2[];
}

export const socialColumns: ColumnTableV3[] = [
  {
    header: 'id',
    key: 'id',
    styles: 'item-cell-social-1',
    weight: '9%',
    render: (id: any) => id,
  },
  {
    header: 'name',
    key: 'name',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-social-2 ',
    weight: '20%',
    render: (row: any) => `${row.member_fname} ${row.member_lname}`,
  },
  {
    header: 'email',
    key: 'member_email',
    styles: 'item-cell-social-3',
    weight: '27%',
    render: (email: any) => email,
  },
  {
    header: 'phone',
    key: 'member_phone',
    styles: 'item-cell-social-4',
    weight: '15%',
    render: (phone: any) => phone,
  },
  {
    header: 'role',
    key: 'member_role',
    styles: 'item-cell-social-5',
    weight: '18%',
    render: (role: any) => roleMap[role as keyof typeof roleMap],
  },
  {
    header: 'issues',
    key: 'final_issues',
    styles: 'item-cell-social-6',
    weight: '12%',
    render: (final_issues: any) => (
      <>
        <BugIcon />
        {final_issues || 0}
      </>
    ),
  },
];

const SocialEngineering: FC<SocialProps> = props => {
  const navigate = useNavigate();
  const { showModal, setShowModal, setShowModalStr, showModalStr } = useModal();
  const [handleDeleteResource, { setSelectedId, isLoading: __ }] = useAddSocial(() => {
    setShowModal(false);
    props.refetch();
  });
  const { isAdmin, isNormalUser, isProvider } = useUserRole();
  const { resourceType, openModal, resourceID } = useGlobalFastFields([
    'resourceType',
    'openModal',
    'resourceID',
  ]);

  const generateReport = (resourceUpID: string, count: any) => {
    if (Number(count) >= 1) {
      openModal.set(true);
      resourceID.set(resourceUpID);
      resourceType.set(RESOURCE_CLASS.SOCIAL);
    }
  };

  const createIssue = (id: string) => {
    navigate(isProvider() || isAdmin() ? `/issues/create/social/${id}` : '', {
      state: { redirect: '/social' },
    });
  };

  const deleteSocial = (id: string) => {
    setShowModalStr(MODAL_KEY_OPEN.DELETE_MEMBER);
    setShowModal(true);
    setSelectedId(id);
  };

  const contextMenuActions = [
    {
      label: 'View report',
      disabled: (row: any) => Number(row?.final_issues) < 1,
      icon: <DocumentIcon isButton width={1.27} height={1.27} />,
      onClick: (row: any) => {
        generateReport(row.id, row.final_issues);
      },
    },
    {
      label: 'Delete',
      disabled: isProvider(),
      icon: <TrashIcon />,
      onClick: (row: any) => {
        deleteSocial(row?.id);
      },
    },
    {
      label: 'Add issue',
      disabled: isNormalUser(),
      icon: <BugIcon isButton />,
      onClick: (row: any) => {
        createIssue(row.id);
      },
    },
  ];

  return (
    <>
      <ModalTitleWrapper
        isActive={showModal && showModalStr === MODAL_KEY_OPEN.DELETE_MEMBER}
        close={() => setShowModal(false)}
        headerTitle="Delete social engineering">
        <ConfirmModal
          action={() => {
            handleDeleteResource();
          }}
          header=""
          cancelText="Cancel"
          confirmText="Delete"
          close={() => setShowModal(false)}
        />
      </ModalTitleWrapper>

      <div className="card">
        <div className="over">
          {/* <div className="header">
            <div className="table-title">
              <h2>
                <div className="icon">
                  <PeopleGroupIcon />
                </div>
                Social Engineering
              </h2>
            </div>
          </div> */}
          <Tablev3
            columns={socialColumns}
            rows={props.socials}
            showRows={!props.isLoading}
            contextMenuActions={contextMenuActions}
            enableContextMenu={true}
          />
        </div>
      </div>
    </>
  );
};

export default SocialEngineering;
