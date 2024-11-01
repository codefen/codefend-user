import {
  BugIcon,
  ConfirmModal,
  CredentialIcon,
  DocumentIcon,
  ModalTitleWrapper,
  PeopleGroupIcon,
  Show,
  TableV2,
  TrashIcon,
} from '../../../../../../views/components';

import {
  type MemberV2,
  type TableItem,
  memberColumnWithActions,
  roleMap,
  useModal,
  useReportStore,
} from '../../../../../../data';
import AddSocialResourceModal from '../../../../../components/modals/adding-modals/AddSocialResourceModal';
import { useNavigate } from 'react-router';
import { type FC } from 'react';
import { useAddSocial } from '@resourcesHooks/social/useDeleteSocial';
import { useUserRole } from '#commonUserHooks/useUserRole';
import useCredentialStore from '@stores/credential.store';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN, RESOURCE_CLASS } from '@/app/constants/app-texts';

interface SocialProps {
  refetch: () => void;
  isLoading: boolean;
  socials: MemberV2[];
}

const SocialEngineering: FC<SocialProps> = props => {
  const navigate = useNavigate();
  const { showModal, setShowModal, setShowModalStr, showModalStr } = useModal();
  const [handleDeleteResource, { setSelectedId, isLoading }] = useAddSocial(() => {
    setShowModal(false);
    props.refetch();
  });

  const { isAdmin, isNormalUser, isProvider } = useUserRole();
  const { setCrendentialType, setResourceId } = useCredentialStore();
  const { setIsOpen, setModalId } = useModalStore();
  const { openModal, setResourceID, setResourceType } = useReportStore((state: any) => state);
  const safelyPreviousSearches = () => props.socials.slice().reverse();

  const generateReport = (resourceID: string, count: any) => {
    if (Number(count) >= 1) {
      openModal();
      setResourceID(resourceID);
      setResourceType(RESOURCE_CLASS.SOCIAL);
    }
  };
  const dataTable = safelyPreviousSearches().map(
    (member: MemberV2) =>
      ({
        ID: { value: member.id, style: 'id' },
        fullName: {
          value: `${member.member_fname} ${member.member_lname}`,
          style: 'full-name',
        },
        email: { value: member.member_email, style: 'email' },
        phone: { value: member.member_phone, style: 'phone' },
        role: {
          value: roleMap[member.member_role as keyof typeof roleMap],
          style: 'role',
        },
        action: {
          value: (
            <>
              <span
                className={`issue-icon ${isProvider() || isAdmin() ? '' : 'disable'}`}
                title={`${isNormalUser() ? '' : 'Add Issue'}`}
                onClick={() =>
                  navigate(isProvider() || isAdmin() ? `/issues/create/social/${member.id}` : '', {
                    state: { redirect: '/social' },
                  })
                }>
                <BugIcon isButton />
                <span className="codefend-text-red-200 issue-count">{member.final_issues}</span>
              </span>
              <span
                title="View report"
                className={`issue-printer ${Number(member.final_issues) == 0 ? 'off' : ''}`}
                onClick={() => generateReport(member.id, member.final_issues)}>
                <DocumentIcon isButton width={1.27} height={1.27} />
              </span>
              <Show when={isNormalUser() || isAdmin()}>
                <span
                  title="Delete"
                  onClick={() => {
                    setShowModalStr(MODAL_KEY_OPEN.DELETE_MEMBER);
                    setShowModal(true);
                    setSelectedId(member.id);
                  }}>
                  <TrashIcon />
                </span>
              </Show>

              <span
                title="Add credentials"
                onClick={() => {
                  setResourceId(member.id);
                  setCrendentialType(RESOURCE_CLASS.SOCIAL);
                  setIsOpen(true);
                  setModalId(RESOURCE_CLASS.SOCIAL);
                }}>
                <CredentialIcon />
              </span>
            </>
          ),
          style: 'id action',
        },
      }) as Record<string, TableItem>
  );

  return (
    <>
      <AddSocialResourceModal
        isOpen={showModal && showModalStr === MODAL_KEY_OPEN.ADD_MEMBER}
        onDone={() => {
          setShowModal(false);
          props.refetch();
        }}
        close={() => setShowModal(false)}
      />
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

      <div className="card table">
        <div className="header">
          <div className="title">
            <div className="icon">
              <PeopleGroupIcon />
            </div>
            <span>Social Engineering</span>
          </div>
          <div className="actions">
            <div
              onClick={() => {
                setShowModal(!showModal);
                setShowModalStr(MODAL_KEY_OPEN.ADD_MEMBER);
              }}>
              Add profile
            </div>
          </div>
        </div>
        <TableV2
          columns={memberColumnWithActions}
          rowsData={dataTable}
          showRows={!props.isLoading}
          showEmpty={!props.isLoading && !Boolean(dataTable.length)}
        />
      </div>
    </>
  );
};

export default SocialEngineering;
