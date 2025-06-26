import { PrimaryButton } from '@buttons/index';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

export const TeamMemberPageHeader = () => {
  const { setIsOpen, setModalId } = useModalStore();
  return (
    <div className="card rectangle">
      <div className="over">
        <div className="header-content">
          <h2>Collaborators and Members</h2>
          <p>
            Add collaborators and company members to help resolve detected vulnerabilities more
            easily. There is no limit to the number of collaborators!
          </p>

          <PrimaryButton
            text="Add collaborator"
            buttonStyle="red"
            className="btn-add"
            click={() => {
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.ADD_COLLABORATOR);
            }}
          />
        </div>
      </div>
    </div>
  );
};
