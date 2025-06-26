import { type FC, lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { LogoutIcon, NetworkIcon } from '@icons';
import Show from '@/app/views/components/Show/Show.tsx';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper.tsx';
import { NetworkSettingModal } from '@modals/network-modal/NetworkSettingModal.tsx';
import { NavbarSubMenu } from './NavbarSubMenu.tsx';
import useModal from '#commonHooks/useModal.ts';
import './navbar.scss';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import useModalStore from '@stores/modal.store.ts';
import { Breadcrumb } from '@/app/views/components/utils/Breadcrumb.tsx';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';
import { ThemeChangerButton } from '@buttons/index.ts';

const Logo = lazy(() => import('../Logo/Logo.tsx'));

const Navbar: FC = () => {
  const navigate = useNavigate();
  const { logout, getUserdata } = useUserData();
  const userData = getUserdata();
  const { isAdmin } = useUserRole();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const isOpenNetworkSetting = useGlobalFastField('isOpenNetworkSetting');
  const [baseApiName, setBaseApiName] = useState('');
  const { showModal, showModalStr, setShowModal, setShowModalStr } = useModal();
  const { setIsOpen, setModalId } = useModalStore();
  const isProgressStarted = useGlobalFastField('isProgressStarted');
  const progress = useGlobalFastField('scanProgress');
  useEffect(() => {
    const handleClickOutsideMenu = (event: any) => {
      if (
        dropdownRef.current &&
        userRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !userRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    // Detect if they clicked outside the dropdown
    document.addEventListener('mousedown', handleClickOutsideMenu);
    setBaseApiName('');
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, []);

  const rootAction = () => {
    navigate('/');
  };
  const openGuide = () => {
    setModalId(MODAL_KEY_OPEN.USER_WELCOME);
    setIsOpen(true);
  };

  const openOnBoard = () => {
    setModalId(MODAL_KEY_OPEN.USER_WELCOME_DOMAIN);
    setIsOpen(true);
    isProgressStarted.set(false);
    progress.set(0);
  };
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
              navigate('/auth/signin');
            }}
          />
        </ModalWrapper>
      </Show>
      {isAdmin() && (
        <NetworkSettingModal
          close={() => isOpenNetworkSetting.set(!isOpenNetworkSetting.get)}
          isOpen={isOpenNetworkSetting.get}
        />
      )}

      <nav className="navbar">
        <div className="left">
          <div className="navbar-logo" onClick={openGuide}>
            <span className="aim-logo">
              <Logo theme="aimColor" />
            </span>
          </div>
          <Breadcrumb root="Codefend" rootAction={rootAction} />
          <div className="actions"></div>
        </div>

        <div className="right">
          <div className="actions">
            {/*          <div className="navbar-logo" onClick={openGuide}>
            <span className={`${open && 'rotate-360'}`}>
              <Logo theme="aim" onClick={() => handleChange()} />
            </span>
          </div> */}
            {isAdmin() && (
              <>
                <div className="action" onClick={openOnBoard}>
                  OnBoard
                </div>
                <div
                  className="action"
                  title="Network settings"
                  onClick={() => isOpenNetworkSetting.set(true)}>
                  <NetworkIcon width={1.1} height={1.1} />
                </div>
              </>
            )}
            <div className="user action" ref={userRef}>
              <span className="email">{userData.email || 'not-found'}</span>
              <NavbarSubMenu
                isOpen={isMenuOpen}
                subMenuRef={dropdownRef}
                userFullname={userData.fname + ' ' + userData.lname}
                closeMenu={() => setMenuOpen(false)}
              />
            </div>
            <ThemeChangerButton />
            <div
              className="action logout"
              title="Logout"
              onClick={() => {
                setShowModalStr(MODAL_KEY_OPEN.LOGOUT);
                setShowModal(true);
              }}>
              <LogoutIcon width={1.1} height={1.1} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
