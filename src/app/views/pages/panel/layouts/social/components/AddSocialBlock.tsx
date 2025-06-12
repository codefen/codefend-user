import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { PrimaryButton } from '@buttons/index';
import { PeopleGroupIcon } from '@icons';
import useModalStore from '@stores/modal.store';

export default function AddSocialBlock({ isLoading }: { isLoading: boolean }) {
  const { setIsOpen, setModalId } = useModalStore();
  return (
    <div className="card title">
      <div className="header">
        {/* <PeopleGroupIcon /> */}
        <span>Social Engineering</span>
      </div>
      <div className="content">
        <p>
          Add profiles of your team members and company personnel to perform social engineering
          assessments and advanced phishing simulations.
        </p>
        <div className="actions">
          <PrimaryButton
            text="Add person"
            click={() => {
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.ADD_MEMBER);
            }}
            className="btn-black"
            isDisabled={isLoading}
            disabledLoader={true}
          />
        </div>
      </div>
    </div>
  );
}
