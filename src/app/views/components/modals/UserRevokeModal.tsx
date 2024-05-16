import { type FC, useCallback } from 'react';
import {
	useRemoveAppStore,
	type RemoveAppStore,
} from '@stores/mobileCloudRemove.store';
import { ConfirmModal, ModalTitleWrapper } from '.';
import { useUserData } from '#commonUserHooks/useUserData';
import { userRevoke } from '#commonUserHooks/userRevoke';
import useModalStore from '@stores/modal.store';

interface UserRevokeModalProps {
	userID: string;
	name: string;
	onDone: () => void;
}

export const UserRevokeModal: FC<UserRevokeModalProps> = ({
	userID,
	name,
	onDone,
}) => {
	const { revokeAccessUser } = userRevoke();
	const { setIsOpen, isOpen, modalId } = useModalStore();

	const revoke = () => {
		revokeAccessUser(userID).then(() => {
			setIsOpen(false);
			onDone();
		});
	};
	const close = () => setIsOpen(false);

	return (
		<ModalTitleWrapper
			type="revoke-modal"
			isActive={modalId == 'revoke' && isOpen}
			close={close}
			headerTitle="Revoke access">
			<div
				className="web-modal-wrapper internal-tables disable-border"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}>
				<ConfirmModal
					header={`Are you sure you want to remove the user ${name} from your organization?`}
					cancelText="Cancel"
					confirmText="Revoke access"
					close={close}
					action={revoke}
				/>
			</div>
		</ModalTitleWrapper>
	);
};
