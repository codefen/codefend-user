import { useState, type FC } from 'react';
import { useAddCollaborator } from '@panelHooks/preference/useAddCollaborator.ts';
import { toast } from 'react-toastify';
import { ModalInput } from '@defaults/ModalInput.tsx';
import { isNotEmpty } from '@/app/constants/validations.ts';
import type { ComponentEventWithChildren } from '@interfaces/util.ts';

const CollaboratorForm: FC<ComponentEventWithChildren> = ({
	onDone,
	close,
	children,
}) => {
	const [email, setEmail] = useState('');
	const { sendAddCollaborator, isLoading } = useAddCollaborator();
	const handleSend = (e: any) => {
		e.preventDefault();
		if (!isNotEmpty(email)) {
			toast.error("You must enter the collaborator's email");
			return;
		}
		sendAddCollaborator(email)
			.then(() => onDone?.())
			.finally(() => close?.());
	};
	return (
		<form className="form" onSubmit={handleSend}>
			<ModalInput
				setValue={(val) => setEmail(val)}
				placeholder="Collaborator email"
				required
			/>
			{children(isLoading)}
		</form>
	);
};

export default CollaboratorForm;
