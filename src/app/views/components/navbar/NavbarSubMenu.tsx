import { type FC } from 'react';
import { useNavigate } from 'react-router';
import { LogoutIcon } from '@icons';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper.tsx';

import Show from '@/app/views/components/Show/Show';
import useModal from '#commonHooks/useModal.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

interface NavbarSubMenuProps {
  subMenuRef: any;
  isOpen: boolean;
  closeMenu: () => void;
  userFullname: string;
  userProfile?: string;
}

export const NavbarSubMenu: FC<NavbarSubMenuProps> = props => {
  const navigate = useNavigate();
  const { logout } = useUserData();
  const { showModal, showModalStr, setShowModal, setShowModalStr } = useModal();

  return (
    <>
      <Show when={showModal && showModalStr === MODAL_KEY_OPEN.LOGOUT}>
        <ModalWrapper action={() => setShowModal(!showModal)}>
          <ConfirmModal
            header="ARE YOU SURE YOU WANT TO LOGOUT?"
            cancelText="Cancel"
            confirmText="Logout"
            close={() => setShowModal(!showModal)}
            action={() => {
              logout();
            }}
          />
        </ModalWrapper>
      </Show>

      <div
        className={`menu ${props.isOpen ? 'active' : ''}`}
        ref={props.subMenuRef}
        id="menu-navbar"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        <div className="user">
          {/* <div className="profile"></div> */}
          <span className="username" title={props.userFullname} aria-label={props.userFullname}>
            {props.userFullname}
          </span>
        </div>
        <div className="options">
          <div
            className="option"
            onClick={() => {
              props.closeMenu();
              setShowModalStr(MODAL_KEY_OPEN.LOGOUT);
              setShowModal(true);
            }}>
            <LogoutIcon width={1.25} height={1.25} />
            <span className="text-options">Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};
