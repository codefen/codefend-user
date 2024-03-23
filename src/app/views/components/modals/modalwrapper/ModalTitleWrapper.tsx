import { type FC } from 'react';
import { ModalWrapper, Show, StatIcon } from '../..';

interface ModalTitleWrapperProps {
	children: JSX.Element;
	headerTitle: string;
	isActive: boolean;
	close: () => void;
}

const ModalTitleWrapper: FC<ModalTitleWrapperProps> = ({
	children,
	headerTitle,
	isActive,
	close,
}) => {
	return (
		<Show when={isActive}>
			<ModalWrapper action={close}>
				<>
					<div className="header">
						<div className="icon">
							<StatIcon />
						</div>
						{headerTitle}
					</div>
					{children}
					<div className="modal-helper-box text-format"></div>
				</>
			</ModalWrapper>
		</Show>
	);
};

export default ModalTitleWrapper;
