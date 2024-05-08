import { type FC, useRef } from 'react';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { GlobeWebIcon, PencilIcon } from '@icons';
import { useAddTicket } from '@panelHooks/support/useSupport.ts';

interface AddTicketModalProps {
	close: () => void;
	onDone: () => void;
}

export const AddTicketModal: FC<AddTicketModalProps> = (props) => {
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
	const { isAddingTicket, setShortDescription, setTitle, addTicket } =
		useAddTicket();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		addTicket()?.then(() => {
			props.onDone();
		});
	};

	return (
		<div className="content">
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						name="title"
						onChange={(e: any) => setTitle(e.target.value)}
						placeholder="title"
						required
					/>
				</div>

				<div className="form-input">
					<span className="pencil-icon need-m">
						<PencilIcon isButton />
					</span>

					<textarea
						ref={textAreaRef!}
						onChange={(e) => setShortDescription(e.target.value)}
						placeholder="short description"
						className="text-area-input log-inputs2 text-area "
						required></textarea>
				</div>

				<ModalButtons
					close={props.close!}
					isDisabled={isAddingTicket}
					confirmText="Add ticket"
				/>
			</form>
		</div>
	);
};
