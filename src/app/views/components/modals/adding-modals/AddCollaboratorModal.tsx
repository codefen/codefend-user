import { useState } from 'react';
import { GlobeWebIcon } from '@icons';
import ModalWrapper from '../modalwrapper/ModalWrapper.tsx';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import Show from '@defaults/Show.tsx';
import { useAddCollaborator } from '@panelHooks/preference/useAddCollaborator.ts';
import { toast } from 'react-toastify';
import useModalStore from '@stores/modal.store.ts';
import { ModalTitleWrapper } from '../../index.ts';

export const AddCollaboratorModal = () => {
	const { isOpen, modalId, setIsOpen } = useModalStore();
	const [email, setEmail] = useState('');
	const { sendAddCollaborator, isLoading } = useAddCollaborator();
	const handleSend = (e: any) => {
		e.preventDefault();
		if (!email.trim()) {
			toast.error("You must enter the collaborator's email");
			return;
		}
		sendAddCollaborator(email).finally(() => setIsOpen(false));
	};
	return (
		<ModalTitleWrapper
			close={() => setIsOpen(false)}
			type="med-w"
			isActive={isOpen && modalId == 'add-collaborator'}
			headerTitle="Add collaborator">
			<div className="content">
				<form className="form" onSubmit={handleSend}>
					<div className="form-input">
						<span className="icon">
							<GlobeWebIcon />
						</span>

						<input
							type="text"
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Collaborator email"
							required
						/>
					</div>
					<ModalButtons
						close={() => setIsOpen(false)}
						isDisabled={isLoading}
						confirmText="Add collaborator"
					/>
				</form>
			</div>
		</ModalTitleWrapper>
	);
};
