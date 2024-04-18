import { type FC } from 'react';
import { type Device } from '../../../../data';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { GlobeWebIcon, PencilIcon } from '@icons';
import { useAddLanV2 } from '@resourcesHooks/netowrk/useAddLanV2';

interface NetworkDeviceModalProps {
	close: () => void;
	onDone: () => void;
	internalNetwork: Device[];
}

export const AddNetworkDeviceModal: FC<NetworkDeviceModalProps> = (props) => {
	const { mainDomainId, isLoading, validators, refetch, setFormData } =
		useAddLanV2(props.onDone, props.close);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();

		if (validators()) return;
		refetch();
	};

	const handleOnChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prevData: any) => ({ ...prevData, [name]: value }));
	};

	return (
		<div className="content">
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<select
						onChange={handleOnChange}
						className="log-inputs modal_info"
						name="mainDomainId"
						value={mainDomainId}
						required>
						<option value="0" disabled>
							main resource
						</option>
						{props.internalNetwork.map((resource: any) => (
							<option
								key={resource.id}
								value={
									resource.id
								}>{`${resource.device_ex_address}`}</option>
						))}
					</select>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={handleOnChange}
						name="externalIpAddress"
						placeholder="external IP"></input>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={handleOnChange}
						placeholder="internal IP"
						name="internalIpAddress"
						required
					/>
				</div>

				<div className="form-input">
					<span className="pencil-icon need-m">
						<PencilIcon />
					</span>
					<textarea
						onChange={handleOnChange}
						name="desc"
						placeholder="short description"
						className="text-area-input log-inputs2 text-area "
						maxLength={512}
						required></textarea>
				</div>
				<ModalButtons
					close={() => props.close?.()}
					confirmText="Add access point"
					isDisabled={isLoading}
				/>
			</form>
		</div>
	);
};
