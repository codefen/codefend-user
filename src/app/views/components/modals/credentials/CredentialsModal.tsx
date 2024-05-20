import { StatIcon } from '@icons';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper.tsx';
import useModalStore from '@stores/modal.store';
import useCredentialStore, { CredentialPage } from '@stores/credential.store';
import Show from '@defaults/Show';
import { AddCredentials } from './AddCredentials';
import { ViewCredentials } from './ViewCredentials';
import type { FC } from 'react';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';

interface CredentialsModalProps {
	onComplete?: () => void;
}

export const CredentialsModal: FC<CredentialsModalProps> = ({ onComplete }) => {
	const { isOpen, modalId, setIsOpen } = useModalStore();
	const { type, resourceId, activePage, setActivePage } = useCredentialStore();
	const handleClose = () => {
		setIsOpen(false);
		setActivePage(CredentialPage.ADD);
	};
	return (
		<Show when={isOpen && modalId == type}>
			<ModalWrapper action={handleClose} type="credential-modal med-w">
				<div className="card">
					<div className="header">
						<div className="title">
							<div className="icon">
								<StatIcon />
							</div>
							<span>Credentials</span>
						</div>
						<Show
							when={
								type !== RESOURCE_CLASS.CLOUD &&
								type !== RESOURCE_CLASS.MOBILE
							}>
							<div className="actions">
								<div onClick={() => setActivePage(CredentialPage.ADD)}>
									Add
								</div>
								<div onClick={() => setActivePage(CredentialPage.VIEW)}>
									View
								</div>
							</div>
						</Show>
					</div>
					<div className="content">
						<Show when={activePage == CredentialPage.ADD}>
							<AddCredentials
								close={handleClose}
								resourceId={resourceId}
								onComplete={onComplete}
								type={type}
							/>
						</Show>
						<Show when={activePage == CredentialPage.VIEW}>
							<ViewCredentials
								close={handleClose}
								resourceId={resourceId}
								type={type}
							/>
						</Show>
					</div>
				</div>
			</ModalWrapper>
		</Show>
	);
};
