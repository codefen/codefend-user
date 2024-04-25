import { type FC, useCallback } from 'react';
import {
	useRemoveAppStore,
	type RemoveAppStore,
} from '@stores/mobileCloudRemove.store';
import { ConfirmModal, ModalTitleWrapper } from '.';
import { useUserData } from '#commonUserHooks/useUserData';

interface DeleteMobileCloudModalProps {
	onDone: (id: string) => void;
}

export const DeleteMobileCloudModal: FC<DeleteMobileCloudModalProps> = ({
	onDone,
}) => {
	const { isOpen, setIsOpen, isMobileType, appName, id, handleDelete } =
		useRemoveAppStore((state: RemoveAppStore) => state);
	const { getCompany } = useUserData();

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
	} \n  ${appName}`;

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
