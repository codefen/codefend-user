import { type FC, type FormEvent } from 'react';
import { useAddTicket } from '@panelHooks/support/useAddTicket.ts';
import type { ComponentEventWithChildren } from '@interfaces/util.ts';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import { ModalTextArea } from '@/app/views/components/ModalTextArea/ModalTextArea';

const SupportTicketForm: FC<ComponentEventWithChildren> = ({ onDone, close, children }) => {
  const { isAddingTicket, addTicket, title, shortDescription } = useAddTicket();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addTicket()
      ?.then(() => onDone?.())
      .finally(() => close?.());
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <ModalInput ref={title} placeholder="title" required />
      <ModalTextArea ref={shortDescription} placeholder="short description" required />
      {children(isAddingTicket)}
    </form>
  );
};

export default SupportTicketForm;
