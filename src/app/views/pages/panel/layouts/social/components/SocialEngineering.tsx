import { type FC } from 'react';
import { useNavigate } from 'react-router';

import ConfirmModal from '@modals/ConfirmModal';
import { LinkedinV2Icon } from '@/app/views/components/icons/LinkedinV2Icon';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';

import type { MemberV2 } from '@interfaces/panel';
import useModal from '@hooks/common/useModal';
import { useAddSocial } from '@resourcesHooks/social/useDeleteSocial';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

interface SocialProps {
  refetch: () => void;
  isLoading: boolean;
  socials: MemberV2[];
}

const SocialEngineering: FC<SocialProps> = props => {
  const { showModal, setShowModal, setShowModalStr, showModalStr } = useModal();
  const [handleDeleteResource, { setSelectedId }] = useAddSocial(() => {
    setShowModal(false);
    props.refetch();
  });

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
        <div className="social-grid">
          {props.socials.map(social => (
            <div key={social.id} className="social-card">
              <div className="social-card-info">
                <span>{social.id}</span>
                <span>|</span>
                <span>{social.email}</span>
                {social.name && (
                  <>
                    <span>|</span>
                    <span>{social.name}</span>
                  </>
                )}
                {social.linkedin_url && (
                  <>
                    <span>|</span>
                    <a href={social.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <LinkedinV2Icon />
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SocialEngineering;
