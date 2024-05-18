import { type FC } from 'react';
import { useAddTicket } from '@panelHooks/support/useSupport.ts';
import type { ComponentEventWithChildren } from '@interfaces/util';
import { ModalInput } from '@defaults/ModalInput';
import { ModalTextArea } from '@defaults/ModalTextArea';

const SupportTicketForm: FC<ComponentEventWithChildren> = ({
	onDone,
	close,
	children,
}) => {
	const { isAddingTicket, setShortDescription, setTitle, addTicket } =
		useAddTicket();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		addTicket()
			?.then(() => onDone?.())
			.finally(() => close?.());
	};

	return (
		<form className="form" onSubmit={handleSubmit}>
			<ModalInput
				setValue={(val: string) => setTitle(val)}
				placeholder="title"
				required
			/>
			<ModalTextArea
				setValue={(val: string) => setShortDescription(val)}
				placeholder="short description"
				required
			/>
			{children(isAddingTicket)}
		</form>
	);
};

export default SupportTicketForm;
