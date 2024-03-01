import { useAddTicket } from '../../../data';
import React, { useRef } from 'react';
import { GlobeWebIcon, ModalButtons, PencilIcon } from '..';

interface AddTicketModalProps {
	close: () => void;
	onDone: () => void;
}

export const AddTicketModal: React.FC<AddTicketModalProps> = (props) => {
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
		<>
			<div className="content">
				<form
					className="form"
					onSubmit={handleSubmit}>
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
						<span className="icon top-[15%] left-0">
							<PencilIcon isButton />
						</span>

						<textarea
							ref={textAreaRef!}
							onChange={(e) => setShortDescription(e.target.value)}
							placeholder="short description"
							className="block w-full py-3 bg-white  px-11   focus:outline-none dark:text-gray-300 resize-none h-28  log-inputs text-area "
							required></textarea>
					</div>

					<ModalButtons
						close={props.close!}
						isDisabled={isAddingTicket}
						confirmText="Add ticket"
					/>
				</form>
			</div>
		</>
	);
};
