import { PrimaryButton } from '@buttons/index';
import { PeopleGroupIcon } from '@/app/views/components';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

export const TeamCollaborators = () => {
  const { setIsOpen, setModalId } = useModalStore();
  return (
    <div className="card rectangle">
      <div className="over">
        <PeopleGroupIcon />
        <div className="header-content">
          <h2>Collaborators and Members</h2>
          <p>
            Add collaborators and company members to help resolve detected vulnerabilities more
            easily.
            <strong>There is no limit to the number of collaborators!</strong>
          </p>

          <PrimaryButton
            text="Add a collaborator to the company"
            buttonStyle="red"
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
