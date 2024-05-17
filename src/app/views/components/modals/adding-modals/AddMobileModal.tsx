import { type FC } from 'react';
import { ModalButtons, ModalTitleWrapper } from '../..';
import MobileResourceForm from '@modals/forms/MobileResourceForm';
import type { ComponentEventWithOpen } from '@interfaces/util';

const AddMobileModal: FC<ComponentEventWithOpen> = ({
	isOpen,
	close,
	onDone,
}) => (
	<ModalTitleWrapper
		headerTitle="Add mobile app"
		close={() => close?.()}
		isActive={isOpen}
		type="med-w">
		<div className="content">
			<MobileResourceForm close={close} onDone={onDone}>
				{(isLoading) => (
					<ModalButtons
						confirmText="Add mobile app"
						isDisabled={isLoading}
						close={() => close?.()}
					/>
				)}
			</MobileResourceForm>
		</div>
	</ModalTitleWrapper>
);

export default AddMobileModal;
