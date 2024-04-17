import { type FC } from 'react';

import { GlobeWebIcon, ModalButtons, PencilIcon } from '../..';
import { useAddLan } from '@resourcesHooks/netowrk/useAddLan.ts';

interface ComponentEvent {
	onDone: () => void;
	close: () => void;
}

export const AcessPointModal: FC<ComponentEvent> = (props) => {
	const {
		internalAddress,
		externalAddress,
		isLoading,
		refetch,
		setNetworkData,
	} = useAddLan(props.onDone, props.close);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setNetworkData((prevData: any) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		refetch();
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
						name="internalAddress"
						value={internalAddress}
						onChange={handleChange}
						placeholder="Internal IP Address"
						required
					/>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						name="externalAddress"
						value={externalAddress}
						onChange={handleChange}
						placeholder="External IP Address"
						required
					/>
				</div>
				<div className="form-input">
					<span className="pencil-icon need-m">
						<PencilIcon />
					</span>
					<textarea
						onChange={handleChange}
						name="desc"
						placeholder="short description"
						className="text-area-input log-inputs2 text-area "
						maxLength={512}
						required></textarea>
				</div>

				<ModalButtons
					confirmText="Add access point"
					isDisabled={isLoading}
					close={() => props.close()}
				/>
			</form>
		</div>
	);
};

export default AcessPointModal;
