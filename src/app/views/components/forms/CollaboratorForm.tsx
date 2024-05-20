import { useRef, type FC } from 'react';
import { useAddCollaborator } from '@panelHooks/preference/useAddCollaborator.ts';
import { toast } from 'react-toastify';
import { ModalInput } from '@defaults/ModalInput.tsx';
import { isNotEmpty } from '@/app/constants/validations.ts';
import type { ComponentEventWithChildren } from '@interfaces/util.ts';
import { PREFERENCE_PANEL_TEXT } from '@/app/constants/app-toast-texts';

const CollaboratorForm: FC<ComponentEventWithChildren> = ({
	onDone,
	close,
	children,
}) => {
	const email = useRef<HTMLInputElement>(null);
	const { sendAddCollaborator, isLoading } = useAddCollaborator();
	const handleSend = (e: any) => {
		e.preventDefault();
		if (!isNotEmpty(email.current?.value)) {
			toast.error(PREFERENCE_PANEL_TEXT.INVALID_COLABORATOR_EMAIL);
			return;
		}
		sendAddCollaborator(email.current?.value || '')
			.then(() => onDone?.())
			.finally(() => close?.());
	};
	return (
		<form className="form" onSubmit={handleSend}>
			<ModalInput ref={email} placeholder="Collaborator email" required />
			{children(isLoading)}
		</form>
	);
};

export default CollaboratorForm;
