import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import useModalStore from '@stores/modal.store.ts';
import { ModalTitleWrapper } from '../../index.ts';
import CollaboratorForm from '@modals/forms/CollaboratorForm.tsx';

export const AddCollaboratorModal = () => {
	const { isOpen, modalId, setIsOpen } = useModalStore();
	return (
		<ModalTitleWrapper
			close={() => setIsOpen(false)}
			type="med-w"
			isActive={isOpen && modalId == 'add-collaborator'}
			headerTitle="Add collaborator">
			<div className="content">
				<CollaboratorForm>
					{(isLoading) => (
						<ModalButtons
							close={() => setIsOpen(false)}
							isDisabled={isLoading}
							confirmText="Add collaborator"
						/>
					)}
				</CollaboratorForm>
			</div>
		</ModalTitleWrapper>
	);
};
