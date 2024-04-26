import Show from '@defaults/Show';
import type { ResourceCredential } from '@interfaces/creds';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import type { FC } from 'react';

interface ViewMoreInfoModalProps {
	crendential?: ResourceCredential;
	close: () => void;
	isOpen: boolean;
}

export const ViewMoreInfoModal: FC<ViewMoreInfoModalProps> = ({
	crendential,
	close,
	isOpen,
}) => {
	return (
		<Show when={isOpen}>
			<ModalWrapper action={close} type="credential-extra-info" showCloseBtn>
				<div className="modal-content">
					<h3>Credential Info</h3>
					<p>{crendential?.info || 'Not found'}</p>
				</div>
			</ModalWrapper>
		</Show>
	);
};
