import { useAuthState, useRemoveAppStore } from '../../../data';
import type { RemoveAppStore } from '../../../data';
import { ConfirmModal, ModalTitleWrapper } from '.';
import { useCallback } from 'react';

interface DeleteMobileCloudModalProps {
	onDone: (id: string) => void;
}

export const DeleteMobileCloudModal: React.FC<DeleteMobileCloudModalProps> = ({
	onDone,
}) => {
	const { isOpen, setIsOpen, isMobileType, appName, id, handleDelete } =
		useRemoveAppStore((state: RemoveAppStore) => state);
	const { getCompany } = useAuthState();

	const closeModal = () => setIsOpen(false);

	const action = useCallback(
		() =>
			handleDelete(getCompany()).finally(() => {
				setIsOpen(false);
				onDone?.(id);
			}),
		[getCompany(), id],
	);

	const headerTitle = `Are you sure to remove ${
		isMobileType ? 'mobile app' : 'cloud app'
	} \n  ${appName}, ID ${id}`;

	return (
		<ModalTitleWrapper
			isActive={isOpen}
			close={closeModal}
			headerTitle="Delete mobile app">
			<div
				className="web-modal-wrapper internal-tables disable-border"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}>
				<ConfirmModal
					header={headerTitle}
					cancelText="Cancel"
					confirmText="Delete"
					close={closeModal}
					action={action}
				/>
			</div>
		</ModalTitleWrapper>
	);
};
