import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { PrimaryButton } from '@buttons/index';
import { MessageIcon } from '@icons';
import useModalStore from '@stores/modal.store';

export const AddNewTicketBox = () => {
  const { setIsOpen, setModalId } = useModalStore();
  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <MessageIcon />
          <span>New question</span>
        </div>
        <div className="content">
          <p>
            Make a new inquiry to one of our professional hackers, we will do our best to respond
            within 24 hours.
          </p>
          <div className="actions">
            <PrimaryButton
              text="Ask a new question"
              click={() => {
                setIsOpen(true);
                setModalId(MODAL_KEY_OPEN.ADD_TICKET);
              }}
              className={'btn-black'}
              disabledLoader
            />
          </div>
        </div>
      </div>
    </div>
  );
};
